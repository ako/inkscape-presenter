#!/usr/bin/env python3
"""Render a downloaded Sketch Deck presentation (.html) as a narrated video.

    python3 deck_video.py presentation.html [-o deck.mp4] [--no-voice]

The presentation plays on a virtual clock and every frame is captured, so the
video is exact: camera flights, build steps and their fades land on the frame
they were meant for, however slow the machine is. Each beat (a slide arriving,
or one of its build steps) is held for its narration line plus a pause, so the
picture is timed from the voice, never the other way round.

Narration comes from the deck: data-say on a slide group (slide_kit.narrate)
and on its build steps (step(..., say=...)). Beats without a line are held for
--hold seconds. The voice is Kokoro (kokoro-onnx), British English, bm_george,
mastered to -18.6 LUFS / -1.5 dBTP. Every line is checked on its own: one that
is missing or too short stops the render.

Writes next to the video:
  <name>.timeline.json  every beat: its line, when it starts, how long it is
  <name>.sheet.png      one frame from the middle of every beat, to look at

Needs Python 3 with Playwright (and Chromium), ffmpeg and ffprobe, and for the
voice kokoro-onnx and soundfile (pip install kokoro-onnx soundfile). The voice
model (about 350 MB) is downloaded once into ~/.cache/sketch-deck/kokoro, or
pass --models DIR holding kokoro-v1.0.onnx and voices-v1.0.bin. Set CHROMIUM
to a Chromium binary if Playwright's own download is missing.
"""
import argparse, hashlib, json, os, shutil, subprocess, sys, tempfile, urllib.request

MODEL_URL = 'https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/'
MODEL_FILES = ('kokoro-v1.0.onnx', 'voices-v1.0.bin')

# A virtual clock: performance.now and requestAnimationFrame only move when the
# renderer says so, and CSS transitions (step fades) are held and seeked to it.
CLOCK = r'''(() => {
  let t = 1000, q = [];
  performance.now = () => t;
  window.requestAnimationFrame = cb => { q.push(cb); return q.length; };
  window.cancelAnimationFrame = () => { q = []; };
  const seek = () => document.getAnimations().forEach(a => {
    if (a.__sd0 == null){ a.__sd0 = t; a.pause(); }
    a.currentTime = t - a.__sd0;
  });
  window.__sdAdvance = ms => {
    const end = t + ms;
    while (t < end - 1e-6){ t += Math.min(16, end - t); const r = q; q = []; r.forEach(cb => cb(t)); }
    seek();
  };
})();'''
HIDE = '#hud,#nav{display:none!important}'


def die(msg):
    raise SystemExit('deck_video: ' + msg)


def models_dir(path):
    d = path or os.path.join(os.path.expanduser('~'), '.cache', 'sketch-deck', 'kokoro')
    os.makedirs(d, exist_ok=True)
    for f in MODEL_FILES:
        p = os.path.join(d, f)
        if not os.path.exists(p):
            print(f'downloading {f} into {d} (once)', file=sys.stderr)
            tmp = p + '.part'
            with urllib.request.urlopen(MODEL_URL + f, timeout=60) as r, open(tmp, 'wb') as o:
                shutil.copyfileobj(r, o)
            os.replace(tmp, p)
    return d


def duration(path):
    out = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path],
                         capture_output=True, text=True, check=True).stdout.strip()
    return float(out)


def synthesize(lines, work, a):
    """One wav per line, each measured back with ffprobe and checked on its own."""
    import soundfile as sf
    from kokoro_onnx import Kokoro
    d = models_dir(a.models)
    k = Kokoro(os.path.join(d, MODEL_FILES[0]), os.path.join(d, MODEL_FILES[1]))
    out = {}
    for i, text in enumerate(lines):
        if not text or text in out:
            continue
        p = os.path.join(work, 'voice-' + hashlib.sha1(text.encode()).hexdigest()[:12] + '.wav')
        audio, sr = k.create(text, voice=a.voice, speed=a.speed, lang=a.lang)
        sf.write(p, audio, sr)
        dur = duration(p)
        words = len(text.split())
        if dur < 0.5 or dur < words * 0.15:
            die(f'line {i + 1} came out {dur:.2f}s for {words} words: "{text}"')
        out[text] = (p, dur)
    return out


def master(voices, starts, total, path):
    """Place every line at its start, then two-pass loudnorm to -18.6 LUFS / -1.5 dBTP, 48 kHz stereo."""
    inputs, filt = [], []
    for i, ((p, _), s) in enumerate(zip(voices, starts)):
        inputs += ['-i', p]
        filt.append(f'[{i}:a]adelay={int(round(s * 1000))}:all=1[a{i}]')
    mix = ''.join(f'[a{i}]' for i in range(len(voices))) + f'amix=inputs={len(voices)}:normalize=0,apad=whole_dur={total:.3f}'
    base = ['ffmpeg', '-y', '-hide_banner', '-nostats', *inputs, '-filter_complex']
    norm = 'loudnorm=I=-18.6:TP=-1.5:LRA=11'
    r = subprocess.run(base + [';'.join(filt) + ';' + mix + f',{norm}:print_format=json[a]', '-map', '[a]', '-t', f'{total:.3f}', '-f', 'null', '-'],
                       capture_output=True, text=True)
    err = r.stderr
    m = json.loads(err[err.rindex('{'):err.rindex('}') + 1])
    second = (f'{norm}:measured_I={m["input_i"]}:measured_TP={m["input_tp"]}:measured_LRA={m["input_lra"]}'
              f':measured_thresh={m["input_thresh"]}:offset={m["target_offset"]}:linear=true')
    subprocess.run(base + [';'.join(filt) + ';' + mix + f',{second},aresample=48000,aformat=channel_layouts=stereo[a]',
                           '-map', '[a]', '-t', f'{total:.3f}', '-loglevel', 'error', path], check=True)


def main():
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[1])
    ap.add_argument('html', help='a presentation downloaded from a Sketch Deck (.html)')
    ap.add_argument('-o', '--out', help='video file (default: next to the presentation, .mp4)')
    ap.add_argument('--size', default='1920x1080')
    ap.add_argument('--fps', type=int, default=30)
    ap.add_argument('--no-voice', action='store_true', help='a silent video, timed by --hold')
    ap.add_argument('--voice', default='bm_george')
    ap.add_argument('--lang', default='en-gb')
    ap.add_argument('--speed', type=float, default=1.0)
    ap.add_argument('--hold', type=float, default=2.5, help='shortest hold of a beat, in seconds')
    ap.add_argument('--tail', type=float, default=0.8, help='pause after a line, before the next beat')
    ap.add_argument('--lead', type=float, default=0.25, help='pause after the camera lands, before the line')
    ap.add_argument('--open', type=float, default=1.0, help='extra hold on the first slide before its line')
    ap.add_argument('--models', help='directory holding the Kokoro model files')
    ap.add_argument('--crf', type=int, default=20)
    a = ap.parse_args()

    for tool in ('ffmpeg', 'ffprobe'):
        if not shutil.which(tool):
            die(f'{tool} is not on PATH')
    src = os.path.abspath(a.html)
    out = os.path.abspath(a.out or os.path.splitext(src)[0] + '.mp4')
    stem = os.path.splitext(out)[0]
    W, H = (int(v) for v in a.size.lower().split('x'))
    work = tempfile.mkdtemp(prefix='deck-video-')
    from playwright.sync_api import sync_playwright

    with sync_playwright() as p:
        exe = os.environ.get('CHROMIUM')
        b = p.chromium.launch(executable_path=exe) if exe else p.chromium.launch()
        pg = b.new_page(viewport={'width': W, 'height': H})
        errors = []
        pg.on('pageerror', lambda e: errors.append(str(e)))
        pg.add_init_script(CLOCK)
        pg.goto('file://' + src)
        if not pg.evaluate('!!window.sketchDeck'):
            die('not a Sketch Deck presentation, or one downloaded before video support (download it again)')
        pg.evaluate('document.fonts.ready')
        pg.add_style_tag(content=HIDE)
        pg.evaluate('window.sketchDeck.go(0, 0); __sdAdvance(3000)')
        beats = pg.evaluate('window.sketchDeck.beats()')
        if not beats:
            die('the presentation shows no slides')
        said = [bt['say'] for bt in beats]
        if a.no_voice:
            voices = {}
        elif not any(said):
            die('no beat has narration (data-say); add lines or pass --no-voice')
        else:
            try:
                voices = synthesize(said, work, a)
            except ImportError:
                die('the voice needs kokoro-onnx and soundfile (pip install kokoro-onnx soundfile), or pass --no-voice')

        enc = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'image2pipe', '-c:v', 'png', '-framerate', str(a.fps), '-i', '-',
                                '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', str(a.crf), os.path.join(work, 'picture.mp4')],
                               stdin=subprocess.PIPE)
        n, step_ms, timeline, tiles = 0, 1000 / a.fps, [], []

        def frame(keep=False):
            nonlocal n
            png = pg.screenshot(type='png')
            enc.stdin.write(png)
            if keep:
                path = os.path.join(work, f'tile-{len(tiles):03d}.png')
                open(path, 'wb').write(png); tiles.append(path)
            n += 1
            pg.evaluate(f'__sdAdvance({step_ms})')

        for i, bt in enumerate(beats):
            t_beat = n / a.fps
            if i:
                pg.evaluate('window.sketchDeck.next()')
                pg.evaluate('__sdAdvance(0)')
                guard = 0
                while pg.evaluate('window.sketchDeck.state().flying'):
                    frame(); guard += 1
                    if guard > 20 * a.fps:
                        die(f'beat {i + 1}: the camera is still flying after 20s')
            v = voices.get(bt['say'])
            lead = a.lead + (a.open if i == 0 else 0)
            hold = lead + max((v[1] + a.tail) if v else 0, a.hold)
            t_line = n / a.fps + lead
            frames = int(round(hold * a.fps))
            for f in range(frames):
                frame(keep=(f == frames // 2))
            st = pg.evaluate('window.sketchDeck.state()')
            if (st['slide'], st['step']) != (bt['slide'], bt['step']):
                die(f'beat {i + 1} should show slide {bt["slide"] + 1} step {bt["step"]}, the player is at {st}')
            timeline.append({'beat': i + 1, 'slide': bt['slide'] + 1, 'step': bt['step'], 'title': bt['title'],
                             'start_s': round(t_beat, 3), 'say': bt['say'], 'line_start_s': round(t_line, 3) if v else None,
                             'line_s': round(v[1], 3) if v else None})
        enc.stdin.close()
        if enc.wait():
            die('ffmpeg could not encode the frames')
        b.close()
    if errors:
        die('page errors: ' + '; '.join(errors))

    total = n / a.fps
    picture = os.path.join(work, 'picture.mp4')
    spoken = [(voices[t['say']], t['line_start_s']) for t in timeline if t['line_s']]
    if spoken:
        if len(spoken) != sum(1 for s in said if s):
            die('a line was lost between synthesis and timing')
        audio = os.path.join(work, 'voice.wav')
        master([v for v, _ in spoken], [s for _, s in spoken], total, audio)
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', picture, '-i', audio, '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k',
                        '-t', f'{total:.3f}', out], check=True)
    else:
        shutil.copy(picture, out)
    got = duration(out)
    if abs(got - total) > 0.2:
        die(f'the video is {got:.2f}s, expected {total:.2f}s')

    cols = min(5, len(tiles))
    rows = (len(tiles) + cols - 1) // cols
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', '1', '-i', os.path.join(work, 'tile-%03d.png'),
                    '-vf', f'scale=384:-1,tile={cols}x{rows}', '-frames:v', '1', stem + '.sheet.png'], check=True)
    json.dump({'video': os.path.basename(out), 'seconds': round(total, 3), 'fps': a.fps, 'size': [W, H],
               'voice': None if not spoken else a.voice, 'beats': timeline}, open(stem + '.timeline.json', 'w'), indent=1)
    shutil.rmtree(work, ignore_errors=True)
    print(f'{os.path.basename(out)}: {len(beats)} beats, {total:.1f}s, {len(spoken)} spoken lines; '
          f'look at {os.path.basename(stem)}.sheet.png')


if __name__ == '__main__':
    main()
