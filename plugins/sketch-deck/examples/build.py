#!/usr/bin/env python3
"""Build an example deck: python3 build.py EXAMPLE_DIR [...]

EXAMPLE_DIR holds a deck.py with a build(html_path) function. build() themes
and draws into a fresh copy of the Sketch Deck template (its kit's
theme_page and inject) and returns the deck's frames as
[(frame_id, x, y, w, h, t), ...], where t sets the slide order.

The builder then loads the page in headless Chromium with those frames and
writes, next to deck.py:
  presentation.html  the standalone presentation (the page's Download menu)
  drawing.svg        the drawing for Inkscape (the page's Download menu)
  frames.json        ArtifactData batch writes that load the frames into a
                     real deck's database (with the grid turned off)

Both downloads embed their fonts, so the build needs a connection to Google
Fonts; it fetches them from Python, which follows the system's proxy and CA
settings.

Needs Python 3 with Playwright and Chromium. Set CHROMIUM to a Chromium
binary if Playwright's own download is missing.
"""
import importlib.util, json, os, shutil, ssl, sys, tempfile, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
SKILL = os.path.join(HERE, '..', 'skills', 'sketch-deck')
TEMPLATE = os.path.join(SKILL, 'template', 'sketch-deck.html')
sys.path.insert(0, os.path.join(SKILL, 'scripts'))

# expose the export functions to this builder only, in the temporary copy
HOOK = ('resize();\nsyncClean();',
        'window.__build = { frames, drawFrames, setView, buildDownload };\nresize();\nsyncClean();')


def fetch_font(route):
    """Fetch Google Fonts from Python, so the build honours the system's proxy and CA settings."""
    try:
        ctx = ssl.create_default_context(cafile=os.environ.get('SSL_CERT_FILE') or None)
        with urllib.request.urlopen(urllib.request.Request(route.request.url, headers={'User-Agent': route.request.headers.get('user-agent', '')}),
                                    timeout=30, context=ctx) as r:
            route.fulfill(status=r.status, body=r.read(), headers={'content-type': r.headers.get('content-type', ''), 'access-control-allow-origin': '*'})
    except Exception:
        route.abort()


def build(example):
    example = os.path.abspath(example)
    spec = importlib.util.spec_from_file_location('deck', os.path.join(example, 'deck.py'))
    deck = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(deck)
    work = tempfile.mkdtemp(prefix='sketch-deck-build-')
    page = os.path.join(work, 'deck.html')
    shutil.copy(TEMPLATE, page)
    frames = deck.build(page)
    s = open(page).read()
    assert s.count(HOOK[0]) == 1, 'template changed: update HOOK in build.py'
    open(page, 'w').write(s.replace(HOOK[0], HOOK[1]))

    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        exe = os.environ.get('CHROMIUM')
        b = p.chromium.launch(executable_path=exe) if exe else p.chromium.launch()
        pg = b.new_page()
        pg.route('https://fonts.googleapis.com/**', fetch_font)
        pg.route('https://fonts.gstatic.com/**', fetch_font)
        errors = []
        pg.on('pageerror', lambda e: errors.append(str(e)))
        pg.goto('file://' + page)
        pg.wait_for_timeout(300)
        out = pg.evaluate('''async fr => {
            const t = window.__build;
            fr.forEach(([id, x, y, w, h, n]) => t.frames.set(id, { x, y, w, h, t: n }));
            t.drawFrames(); t.setView('clean');
            const html = await t.buildDownload('html'), svg = await t.buildDownload('svg');
            return { html: html.text, svg: svg.text, missing: html.failedImages + html.failedFonts + svg.failedImages + svg.failedFonts };
        }''', [list(f) for f in frames])
        b.close()
    if out['missing']:
        raise SystemExit(f'{out["missing"]} images or fonts could not be embedded (needs a connection to Google Fonts)')
    if errors:
        raise SystemExit('page errors: ' + '; '.join(errors))
    open(os.path.join(example, 'presentation.html'), 'w').write(out['html'])
    open(os.path.join(example, 'drawing.svg'), 'w').write(out['svg'])
    writes = [{'op': 'set', 'collection': 'frames', 'doc_id': fid, 'data': {'x': x, 'y': y, 'w': w, 'h': h, 't': n}}
              for fid, x, y, w, h, n in frames]
    writes.append({'op': 'set', 'collection': 'meta', 'doc_id': 'settings', 'data': {'cols': 4, 'grid': False}})
    with open(os.path.join(example, 'frames.json'), 'w') as f:
        f.write('[\n' + ',\n'.join(json.dumps(w) for w in writes) + '\n]\n')
    shutil.rmtree(work)
    print(f'{os.path.basename(example)}: {len(frames)} frames, '
          f'presentation.html {len(out["html"]) // 1024} KB, drawing.svg {len(out["svg"]) // 1024} KB')


if __name__ == '__main__':
    for d in sys.argv[1:] or [os.path.join(HERE, n) for n in sorted(os.listdir(HERE)) if os.path.isfile(os.path.join(HERE, n, 'deck.py'))]:
        build(d)
