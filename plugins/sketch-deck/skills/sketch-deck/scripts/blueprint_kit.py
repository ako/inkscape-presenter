"""Blueprint style kit for Sketch Deck (the named style "Blueprint").

Dark navy grid sheet, light-blue outlines, amber accents, uppercase tracked
headings, IBM Plex Sans + Mono. See styles/blueprint.md.

Everything is authored in a slide's local 1679.2 x 944.5 space; the page scales
each <g data-frame> onto its frame. Call theme_page() once on the copied
template, then build groups with panel()/group() and inject() them.
"""
import html
import slide_kit
E = html.escape
LW, LH = 1679.2, 944.5

BG = "#0f2b4b"; PANEL = "#12335a"; LINE = "#c6dcf1"; HEAD = "#e2eefa"; AMB = "#f2c35b"
DIM = "#86a5c4"; FAINT = "#2c5580"; GRIDC = "#1d4269"; RED = "#ff8f6e"; GREEN = "#8fd6a8"
SANS = "'IBM Plex Sans','Helvetica Neue',Arial,sans-serif"
MONO = "'IBM Plex Mono',Menlo,Consolas,monospace"


def T(x, y, s, t, c=HEAD, w=400, a="start", mono=False, caps=False, ls=0, op=1):
    fam = MONO if mono else SANS
    t = t.upper() if caps else t
    sp = f' letter-spacing="{ls}"' if ls else ''
    o = f' opacity="{op}"' if op != 1 else ''
    return (f'<text x="{x}" y="{y}" font-size="{s}" text-anchor="{a}" font-weight="{w}"{sp}{o} '
            f'style="fill:{c};font-family:{fam};white-space:pre">{E(t)}</text>')


def H(x, y, s, t, c=HEAD, a="start"):
    """Blueprint heading: bold, uppercase, tracked."""
    return T(x, y, s, t, c, 700, a, caps=True, ls=round(s * 0.05, 1))


def lines(x, y, s, items, c=HEAD, lh=1.4, mono=False, w=400):
    return "".join(T(x, y + i * s * lh, s, it, c, w, mono=mono) for i, it in enumerate(items))


def box(x, y, w, h, c=LINE, sw=3, rx=10, fill="none", dash="", op=1):
    d = f' stroke-dasharray="{dash}"' if dash else ''
    o = f' opacity="{op}"' if op != 1 else ''
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{c}" stroke-width="{sw}"{d}{o}/>'


def path(d, c=AMB, sw=3, arrow=True, dash=""):
    m = ' marker-end="url(#bp-ah)"' if arrow and c == AMB else (' marker-end="url(#bp-ahl)"' if arrow else '')
    da = f' stroke-dasharray="{dash}"' if dash else ''
    return f'<path d="{d}" fill="none" stroke="{c}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"{da}{m}/>'


def arrow(x1, y1, x2, y2, c=AMB, sw=3, dash=""):
    return path(f"M{x1} {y1}L{x2} {y2}", c, sw, True, dash)


def dot(cx, cy, r=7, c=AMB):
    return f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{c}"/>'


def node(x, y, w, h, title, sub=None, c=LINE, ts=30, ss=22, fill=PANEL, tc=HEAD, mono_sub=True):
    s = box(x, y, w, h, c, 3, 10, fill)
    if sub:
        s += T(x + w / 2, y + h * 0.5 - 2, ts, title, tc, 600, "middle")
        s += T(x + w / 2, y + h - 12, ss, sub, DIM, 400, "middle", mono=mono_sub)
    else:
        s += T(x + w / 2, y + h / 2 + ts * 0.35, ts, title, tc, 600, "middle")
    return s


def code(x, y, w, rows, s=24, title=None, hl=()):
    """A code card: mono lines, amber for highlighted line indexes, # comments dim."""
    lh = s * 1.45
    h = len(rows) * lh + 40 + (44 if title else 0)
    out = box(x, y, w, h, LINE, 2.5, 8, "#0c2440")
    yy = y + 20
    if title:
        out += T(x + 22, yy + 24, 20, title, AMB, 500, mono=True, ls=1)
        out += f'<path d="M{x} {yy + 40}H{x + w}" stroke="{FAINT}" stroke-width="2"/>'
        yy += 44
    for i, r in enumerate(rows):
        c = AMB if i in hl else (DIM if r.strip().startswith("#") else HEAD)
        out += T(x + 24, yy + s + i * lh, s, r, c, 400, mono=True)
    return out


def corners(x, y, w, h, l=28, c=AMB, sw=4):
    """Zoom marker: amber corner brackets around a detail region."""
    p = (f"M{x} {y + l}V{y}H{x + l} M{x + w - l} {y}H{x + w}V{y + l} "
         f"M{x + w} {y + h - l}V{y + h}H{x + w - l} M{x + l} {y + h}H{x}V{y + h - l}")
    return f'<path d="{p}" fill="none" stroke="{c}" stroke-width="{sw}" stroke-linecap="square"/>'


def grid_bg(w=LW, h=LH, minor=40, major=200):
    s = [f'<rect x="0" y="0" width="{w}" height="{h}" fill="{BG}"/>']
    d = "".join(f"M{x} 0V{h}" for x in range(0, int(w) + 1, minor)) + "".join(f"M0 {y}H{w}" for y in range(0, int(h) + 1, minor))
    s.append(f'<path d="{d}" stroke="{GRIDC}" stroke-width="1" opacity=".55"/>')
    d = "".join(f"M{x} 0V{h}" for x in range(0, int(w) + 1, major)) + "".join(f"M0 {y}H{w}" for y in range(0, int(h) + 1, major))
    s.append(f'<path d="{d}" stroke="{GRIDC}" stroke-width="2"/>')
    return "".join(s)


def panel(n, label, title, body, card=True):
    """A detail frame: blueprint sheet, eyebrow, heading, rule."""
    s = grid_bg()
    if card:
        s += box(14, 14, LW - 28, LH - 28, LINE, 2, 4, "none", op=.55)
    s += T(70, 92, 24, f"{n} · {label.upper()}", AMB, 500, mono=True, ls=2)
    s += H(70, 158, 54, title)
    s += f'<path d="M70 192H{LW - 70}" stroke="{FAINT}" stroke-width="2"/>'
    return s + body


def step(key, name, svg):
    return f'<g data-step="{E(key)}" data-name="{E(name)}">{svg}</g>'


def group(fid, title, inner, frame):
    x, y, w, h = frame
    k = w / LW
    return f'<g data-frame="{fid}" data-title="{E(title)}" transform="translate({x} {y}) scale({k:.5f})">{inner}</g>'


DEFS = f'''<defs>
<marker id="bp-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="{AMB}"/></marker>
<marker id="bp-ahl" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="{LINE}"/></marker></defs>'''


# Template edits that make the page itself blueprint (stage, sheet, grid, export, player, thumbs).
PAGE_SWAPS = [
    ("family=IBM+Plex+Sans:wght@400;500&", "family=IBM+Plex+Sans:wght@400;500;600;700&"),
    ("--stage:#181c20;", "--stage:#0b213b;"),
    ('<path d="M50 0H0V50" fill="none" stroke="#dde1da"', '<path d="M50 0H0V50" fill="none" stroke="#17375b"'),
    ('<path d="M250 0H0V250" fill="none" stroke="#d0d5ce"', '<path d="M250 0H0V250" fill="none" stroke="#1d4269"'),
    ('id="sheetBg" x="0" y="0" width="8000" height="4500" fill="#eceee9"', 'id="sheetBg" x="0" y="0" width="8000" height="4500" fill="#0f2b4b"'),
    ("paper.setAttribute('fill', '#eceee9')", "paper.setAttribute('fill', '#0f2b4b')"),
    ("overflow:hidden;background:#181c20}", "overflow:hidden;background:#0f2b4b}"),
    (".thumb{display:block;width:76px;aspect-ratio:16/9;background:#eceee9;", ".thumb{display:block;width:76px;aspect-ratio:16/9;background:#0f2b4b;"),
]


def theme_page(html_path, title):
    """Turn a fresh copy of the Sketch Deck template into a blueprint page and set its title."""
    slide_kit.theme_page(html_path, title, swaps=PAGE_SWAPS)


def inject(html_path, groups):
    """Replace the page's clean layer with the blueprint arrow markers + the given slide groups."""
    slide_kit.inject(html_path, groups, DEFS)
