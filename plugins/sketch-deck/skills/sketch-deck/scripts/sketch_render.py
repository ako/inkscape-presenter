#!/usr/bin/env python3
"""Render a Sketch Deck database export so Claude can see the sketch.

Usage:
  python3 sketch_render.py EXPORT_DIR OUT_DIR [--assets ASSET_DIR]

EXPORT_DIR is the out_dir used with ArtifactData list (one call per
collection: frames, strokes, texts, images), so it contains
EXPORT_DIR/<collection>/<doc_id>.json. ASSET_DIR holds image files
fetched with Artifact read (path = asset id); files are matched by the
asset id at the start of their name.

Writes OUT_DIR/overview.png and OUT_DIR/frame-NN.png (NN = slide number,
in presentation order), plus OUT_DIR/manifest.json, which lists every
frame with the texts, images and stroke counts that fall inside it, and
the items outside any frame. Prints the manifest too.
"""
import base64, glob, html, json, mimetypes, os, sys


def load(export, col):
    out = {}
    for f in glob.glob(os.path.join(export, col, '*.json')):
        d = json.load(open(f))
        d = d.get('data', d)
        out[os.path.splitext(os.path.basename(f))[0]] = d
    return out


def wrap(text, n):
    lines = []
    for para in str(text).split('\n'):
        line = ''
        for w in para.split(' '):
            if line and len(line) + len(w) + 1 > n:
                lines.append(line)
                line = w
            else:
                line = (line + ' ' + w).strip()
        lines.append(line)
    return lines


def main():
    args = sys.argv[1:]
    assets = None
    if '--assets' in args:
        k = args.index('--assets'); assets = args[k + 1]; del args[k:k + 2]
    export, out = args[0], args[1]
    os.makedirs(out, exist_ok=True)
    frames = load(export, 'frames'); strokes = load(export, 'strokes')
    texts = load(export, 'texts'); images = load(export, 'images')
    order = sorted(frames, key=lambda k: (frames[k].get('t', 0), k))

    def data_uri(asset):
        if not assets: return None
        hits = [f for f in glob.glob(os.path.join(assets, '**', asset + '*'), recursive=True) if os.path.isfile(f)]
        if not hits: return None
        mt = mimetypes.guess_type(hits[0])[0] or 'image/png'
        return f'data:{mt};base64,' + base64.b64encode(open(hits[0], 'rb').read()).decode()

    def svg(vb, width=1600):
        x, y, w, h = vb
        u = w / 1600
        s = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x} {y} {w} {h}" width="{width}" height="{int(width * h / w)}">',
             f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="#f4f5f2"/>']
        for m in images.values():
            uri = data_uri(m.get('a', ''))
            if uri:
                s.append(f'<image href="{uri}" x="{m["x"]}" y="{m["y"]}" width="{m["w"]}" height="{m["h"]}" preserveAspectRatio="none"/>')
            s.append(f'<rect x="{m["x"]}" y="{m["y"]}" width="{m["w"]}" height="{m["h"]}" fill="{"none" if uri else "#fde6dc"}" stroke="#e2541b" stroke-width="{2*u}" stroke-dasharray="{8*u}"/>')
            s.append(f'<text x="{m["x"]}" y="{m["y"] - 4*u}" font-size="{14*u}" font-family="monospace" fill="#b8431a">image {html.escape(m.get("a", "")[:8])}</text>')
        for n, k in enumerate(order, 1):
            f = frames[k]
            s.append(f'<rect x="{f["x"]}" y="{f["y"]}" width="{f["w"]}" height="{f["h"]}" fill="none" stroke="#e0a106" stroke-width="{2*u}" stroke-dasharray="{10*u}"/>')
            s.append(f'<text x="{f["x"]}" y="{f["y"] - 6*u}" font-size="{max(f["w"] * 0.035, 16*u)}" font-family="monospace" fill="#9a6f00">{n}</text>')
        for d in strokes.values():
            p = d['p']; pts = list(zip(p[::2], p[1::2]))
            c = '#e2541b' if d.get('c') == 'note' else '#1b2a33'
            path = 'M' + ' L'.join(f'{a} {b}' for a, b in pts) + ('l0.01 0' if len(pts) == 1 else '')
            s.append(f'<path d="{path}" fill="none" stroke="{c}" stroke-width="{max(d.get("w", 3), 1.2*u)}" stroke-linecap="round" stroke-linejoin="round"/>')
        for d in texts.values():
            fs = d['fs']; pad = fs * 0.6; lh = fs * 1.35
            lines = wrap(d.get('text', ''), max(8, int((d['w'] - 2 * pad) / (fs * 0.5))))
            hh = len(lines) * lh + pad * 2
            note = d.get('c') != 'ink'
            s.append(f'<rect x="{d["x"]}" y="{d["y"]}" width="{d["w"]}" height="{hh}" fill="{"#fff3e8" if note else "none"}" stroke="{"#e2541b" if note else "#2a62c9"}" stroke-width="{1.5*u}"/>')
            for i, ln in enumerate(lines):
                s.append(f'<text x="{d["x"] + pad}" y="{d["y"] + pad + fs * 0.92 + i * lh}" font-size="{fs}" font-family="Arial" fill="{"#8a2d0c" if note else "#1b2a33"}">{html.escape(ln)}</text>')
        s.append('</svg>')
        return '\n'.join(s)

    def bbox_items():
        xs, ys = [], []
        for f in frames.values(): xs += [f['x'], f['x'] + f['w']]; ys += [f['y'], f['y'] + f['h']]
        for d in strokes.values(): xs += d['p'][::2]; ys += d['p'][1::2]
        for d in list(texts.values()) + list(images.values()): xs += [d['x'], d['x'] + d['w']]; ys += [d['y'], d['y'] + d.get('h', d.get('fs', 20) * 3)]
        return (min(xs), min(ys), max(xs), max(ys)) if xs else (0, 0, 1600, 900)

    def inside(f, x, y): return f['x'] <= x <= f['x'] + f['w'] and f['y'] <= y <= f['y'] + f['h']

    manifest = {'frames': [], 'outside': {'texts': [], 'images': [], 'strokes': 0}}
    used_t, used_i, used_s = set(), set(), set()
    for n, k in enumerate(order, 1):
        f = frames[k]
        # the innermost frame wins for items inside nested frames
        def owner(x, y):
            cands = [kk for kk in order if inside(frames[kk], x, y)]
            return min(cands, key=lambda kk: frames[kk]['w']) if cands else None
        ts = [{'id': tid, 'kind': t.get('c', 'note'), 'text': t.get('text', '')} for tid, t in texts.items() if owner(t['x'], t['y']) == k]
        ims = [{'id': iid, 'asset': m.get('a')} for iid, m in images.items() if owner(m['x'] + m['w'] / 2, m['y'] + m['h'] / 2) == k]
        sts = [sid for sid, d in strokes.items() if owner(d['p'][0], d['p'][1]) == k]
        used_t |= {t['id'] for t in ts}; used_i |= {i['id'] for i in ims}; used_s |= set(sts)
        manifest['frames'].append({'slide': n, 'id': k, 'x': f['x'], 'y': f['y'], 'w': f['w'], 'h': f['h'],
                                   'texts': ts, 'images': ims, 'strokes': len(sts),
                                   'note_strokes': sum(1 for s_ in sts if strokes[s_].get('c') == 'note')})
    manifest['outside']['texts'] = [{'id': k, 'text': t.get('text', '')} for k, t in texts.items() if k not in used_t]
    manifest['outside']['images'] = [{'id': k, 'asset': m.get('a')} for k, m in images.items() if k not in used_i]
    manifest['outside']['strokes'] = len([k for k in strokes if k not in used_s])

    x0, y0, x1, y1 = bbox_items(); pad = max(x1 - x0, y1 - y0) * 0.03
    views = {'overview': (x0 - pad, y0 - pad, x1 - x0 + 2 * pad, y1 - y0 + 2 * pad)}
    for n, k in enumerate(order, 1):
        f = frames[k]; m = f['w'] * 0.06
        views[f'frame-{n:02d}'] = (f['x'] - m, f['y'] - m, f['w'] + 2 * m, f['h'] + 2 * m)

    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1600, 'height': 900})
        for name, vb in views.items():
            doc = svg(vb)
            hgt = int(1600 * vb[3] / vb[2])
            pg.set_viewport_size({'width': 1600, 'height': max(200, hgt)})
            pg.set_content('<body style="margin:0">' + doc + '</body>')
            pg.screenshot(path=os.path.join(out, name + '.png'), timeout=20000)
        b.close()
    json.dump(manifest, open(os.path.join(out, 'manifest.json'), 'w'), indent=2)
    print(json.dumps(manifest, indent=2))


if __name__ == '__main__':
    main()
