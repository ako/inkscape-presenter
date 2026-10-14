"""Pen & Marker kit for Sketch Deck: a designer's marker rendering. Black
fineliner outlines that wobble and overshoot, cool-grey marker shadows,
streaky marker fills, a highlighter swipe under titles. Everything is plain
SVG strings in the caller's coordinate space; the random seed is fixed, so
redraws come out the same. See styles/pen-and-marker.md.

Usage (from a deck script, next to slide_kit.py):
    from pen_marker import *
    theme_page("deck.html", "My Topic")      # fonts: Permanent Marker, Kalam
    s = card(1679.2, 944.5)
    h, y = header(80, 110, 1, "Intro", "A title")
    s += h + mbox(80, y + 40, 600, 300, BLU)
    inject("deck.html", [group("f1", "A title", s, (0, 0, 1679.2, 944.5))])
"""
import html, math, random
import slide_kit
from slide_kit import LOCAL_W

R = random.Random(11)
E = html.escape
INK = "#26262a"; PAPER = "#f6f2e8"; CARD = "#fffdf8"; SHADOW = "#b7bdc1"; GREY = "#d9dcdd"
YEL = "#f6c94a"; ORA = "#ef8b6a"; GRN = "#9ccb87"; BLU = "#7fb0dc"; LIL = "#c3b6e6"
BRN = "#9a6a00"; MUT = "#5d6166"; RED = "#d2452b"; TAPE = "#efe3b8"
HAND = "font-family:Kalam,'Comic Neue','Segoe Print','Bradley Hand',cursive"
MARK = "font-family:'Permanent Marker','Marker Felt',Kalam,cursive"
MONO = "font-family:'IBM Plex Mono',ui-monospace,Menlo,monospace"
_n = [0]


def uid(p="sbk"):
    _n[0] += 1
    return f"{p}{_n[0]}"


def j(a=1.0):
    return R.uniform(-a, a)


def wline(x1, y1, x2, y2, sw=3, c=INK, op=1, over=None, dash=""):
    L = math.hypot(x2 - x1, y2 - y1) or 1
    o = min(9, L * 0.025) if over is None else over
    ux, uy = (x2 - x1) / L, (y2 - y1) / L
    ax, ay = x1 - ux * o * R.uniform(.2, 1) + j(1.2), y1 - uy * o * R.uniform(.2, 1) + j(1.2)
    bx, by = x2 + ux * o * R.uniform(.2, 1) + j(1.2), y2 + uy * o * R.uniform(.2, 1) + j(1.2)
    b = j(min(5, L * 0.008))
    mx, my = (ax + bx) / 2 - uy * b, (ay + by) / 2 + ux * b
    d = f' stroke-dasharray="{dash}"' if dash else ""
    return (f'<path d="M{ax:.1f} {ay:.1f}Q{mx:.1f} {my:.1f} {bx:.1f} {by:.1f}" fill="none" stroke="{c}" '
            f'stroke-width="{sw}" stroke-linecap="round" opacity="{op}"{d}/>')


def wbox(x, y, w, h, sw=3, c=INK, inner=True, dash=""):
    s = (wline(x, y, x + w, y, sw, c, dash=dash) + wline(x + w, y, x + w, y + h, sw, c, dash=dash)
         + wline(x + w, y + h, x, y + h, sw, c, dash=dash) + wline(x, y + h, x, y, sw, c, dash=dash))
    if inner and not dash:
        s += wline(x + 4, y + 5, x + w - 4, y + 4, max(1, sw * 0.4), c, 0.45, over=0)
    return s


def wcircle(cx, cy, r, sw=2.4, c=INK, fill="none"):
    pts = []
    a0 = R.uniform(0, 6.28)
    for k in range(13):
        a = a0 + k * 6.6 / 12
        rr = r * (1 + j(0.05))
        pts.append(f"{cx + rr * math.cos(a):.1f} {cy + rr * math.sin(a):.1f}")
    return f'<path d="M{" L".join(pts)}" fill="{fill}" stroke="{c}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"/>'


def hatch(x, y, w, h, col, rx=12, op=0.42):
    cid = uid()
    base = max(8, min(36, h * 0.22))
    dx = h * 0.5
    s = [f'<clipPath id="{cid}"><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}"/></clipPath>',
         f'<g clip-path="url(#{cid})"><rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{col}" opacity="{op}"/>']
    xx = x - dx - base
    while xx < x + w + base:
        sw = base * R.uniform(.7, 1.15)
        s.append(f'<path d="M{xx:.1f} {y + h + 6:.1f}L{xx + dx:.1f} {y - 6:.1f}" stroke="{col}" stroke-width="{sw:.1f}" '
                 f'opacity="{R.uniform(.26, .44):.2f}" stroke-linecap="round"/>')
        xx += sw * 0.85
    s.append(f'<rect x="{x}" y="{y + h - 10}" width="{w}" height="10" fill="{col}" opacity="{op}"/></g>')
    return "".join(s)


def shadow(x, y, w, h, rx=12, d=10):
    return f'<rect x="{x + d}" y="{y + d * 1.1}" width="{w}" height="{h}" rx="{rx}" fill="{SHADOW}" opacity=".55"/>'


def mbox(x, y, w, h, fill=None, sw=3, sh=True, rx=12, d=10, dash=""):
    s = shadow(x, y, w, h, rx, d) if sh else ""
    s += f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{CARD}"/>'
    if fill:
        s += hatch(x, y, w, h, fill, rx)
    return s + wbox(x, y, w, h, sw, dash=dash)


def swipe(x, y, w, th=28, col=YEL, op=0.55):
    return (f'<path d="M{x:.1f} {y + j(3):.1f}C{x + w * .3:.1f} {y + j(5):.1f} {x + w * .6:.1f} {y + j(5):.1f} {x + w:.1f} {y + j(3):.1f}" '
            f'stroke="{col}" stroke-width="{th}" opacity="{op}" stroke-linecap="round" fill="none"/>')


def T(x, y, size, t, fill=INK, a="start", bold=False, font=HAND):
    w = ";font-weight:700" if bold else ";font-weight:400"
    return f'<text x="{x:.1f}" y="{y:.1f}" font-size="{size}" text-anchor="{a}" style="{font};fill:{fill}{w}">{E(t)}</text>'


def MT(x, y, size, t, fill=INK, a="start"):
    return T(x, y, size, t, fill, a, False, MARK)


def MO(x, y, size, t, fill=INK, a="start", bold=False):
    return f'<text x="{x:.1f}" y="{y:.1f}" font-size="{size}" text-anchor="{a}" xml:space="preserve" style="{MONO};fill:{fill};font-weight:{500 if bold else 400}">{E(t)}</text>'


def wrap(t, n):
    out, line = [], ""
    for w in t.split():
        if line and len(line) + len(w) + 1 > n:
            out.append(line); line = w
        else:
            line = (line + " " + w).strip()
    out.append(line)
    return out


def para(x, y, size, t, n, fill=INK, lh=1.38, font=HAND, bold=False, a="start"):
    s, yy = "", y
    for ln in wrap(t, n):
        s += T(x, yy, size, ln, fill, a, bold, font)
        yy += size * lh
    return s, yy


def arrow(x1, y1, x2, y2, c=INK, sw=3, bend=0, dash="", head=None):
    dx, dy = x2 - x1, y2 - y1
    L = math.hypot(dx, dy) or 1
    nx, ny = -dy / L, dx / L
    c1 = (x1 + dx * .3 + nx * bend, y1 + dy * .3 + ny * bend)
    c2 = (x1 + dx * .7 + nx * bend, y1 + dy * .7 + ny * bend)
    d = f' stroke-dasharray="{dash}"' if dash else ""
    s = (f'<path d="M{x1:.1f} {y1:.1f}C{c1[0]:.1f} {c1[1]:.1f} {c2[0]:.1f} {c2[1]:.1f} {x2:.1f} {y2:.1f}" fill="none" '
         f'stroke="{c}" stroke-width="{sw}" stroke-linecap="round"{d}/>')
    tx, ty = x2 - c2[0], y2 - c2[1]
    tl = math.hypot(tx, ty) or 1
    tx, ty = tx / tl, ty / tl
    hl = head or (12 + sw * 3.2)
    for sgn in (1, -1):
        a = math.atan2(ty, tx) + math.pi + sgn * 0.45
        s += wline(x2, y2, x2 + hl * math.cos(a), y2 + hl * math.sin(a), sw, c, over=0)
    return s


def numdot(cx, cy, n, col=YEL, r=22, size=None):
    return (f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{col}" opacity=".75"/>' + wcircle(cx, cy, r * 1.02, 2.2)
            + T(cx, cy + r * 0.42, size or r * 1.15, str(n), INK, "middle", True))


def tape(cx, cy, w=180, h=46, rot=-2):
    return f'<rect x="{cx - w / 2}" y="{cy - h / 2}" width="{w}" height="{h}" fill="{TAPE}" opacity=".85" transform="rotate({rot} {cx} {cy})"/>'


def chip(x, y, t, col, size=28, mono=False, sh=False):
    w = len(t) * size * (0.62 if mono else 0.5) + size * 1.3
    h = size * 1.75
    s = (shadow(x, y, w, h, 12, 6) if sh else "") + f'<rect x="{x}" y="{y}" width="{w:.1f}" height="{h:.1f}" rx="12" fill="{CARD}"/>'
    s += hatch(x, y, w, h, col, 12) + wbox(x, y, w, h, 2.2, inner=False)
    s += (MO if mono else T)(x + w / 2, y + h * 0.66, size, t, INK, "middle", True)
    return s, w


def chips(x, y, items, size=28, gap=14, maxw=None, mono=False):
    s, cx, cy = "", x, y
    cols = [BLU, GRN, YEL, LIL, ORA]
    for i, t in enumerate(items):
        w = len(t) * size * (0.62 if mono else 0.5) + size * 1.3
        if maxw and cx + w > x + maxw:
            cx = x; cy += size * 1.75 + gap
        c, w = chip(cx, cy, t, cols[i % len(cols)], size, mono)
        s += c; cx += w + gap
    return s, cy + size * 1.75


def code(x, y, w, lines, size=22, label=None, col=GREY, lh=1.5):
    h = len(lines) * size * lh + size * 1.2
    s = mbox(x, y, w, h, col, 2.4, d=8)
    if label:
        lw = len(label) * size * 0.62 + 24
        s += f'<rect x="{x + w - lw - 14}" y="{y + 10}" width="{lw}" height="{size * 1.25}" rx="4" fill="#ffffff" opacity=".9"/>'
        s += MO(x + w - lw / 2 - 14, y + 10 + size * 0.92, size * 0.8, label, MUT, "middle")
    for i, ln in enumerate(lines):
        fill = MUT if ln.startswith("#") else INK
        s += MO(x + 20, y + size * 1.45 + i * size * lh, size, ln, fill)
    return s, y + h


def person(cx, cy, r=34, col=ORA):
    s = f'<circle cx="{cx}" cy="{cy - r * .55}" r="{r * .48}" fill="{col}" opacity=".7"/>' + wcircle(cx, cy - r * .55, r * .5, 2.6)
    s += (f'<path d="M{cx - r} {cy + r * 1.05}C{cx - r} {cy + r * .05} {cx + r} {cy + r * .05} {cx + r} {cy + r * 1.05}Z" '
          f'fill="{col}" opacity=".55" stroke="{INK}" stroke-width="2.6" stroke-linejoin="round"/>')
    return s


def bot(cx, cy, s=70, col=BLU):
    x, y = cx - s / 2, cy - s / 2
    o = hatch(x, y, s, s * .8, col, s * .2) + wbox(x, y, s, s * .8, 2.6, inner=False)
    o += wline(cx, y, cx, y - s * .22, 2.6) + f'<circle cx="{cx}" cy="{y - s * .26}" r="{s * .07}" fill="{INK}"/>'
    o += f'<circle cx="{cx - s * .18}" cy="{y + s * .34}" r="{s * .07}" fill="{INK}"/><circle cx="{cx + s * .18}" cy="{y + s * .34}" r="{s * .07}" fill="{INK}"/>'
    o += wline(cx - s * .16, y + s * .58, cx + s * .16, y + s * .58, 2.6, over=0)
    return o


def check(cx, cy, r=16, col=GRN):
    return (f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{col}" opacity=".85"/>' + wcircle(cx, cy, r, 2)
            + f'<path d="M{cx - r * .45} {cy}L{cx - r * .1} {cy + r * .4}L{cx + r * .5} {cy - r * .4}" stroke="{INK}" stroke-width="{r * .22}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>')


def cross(cx, cy, r=16, col=ORA):
    return (f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{col}" opacity=".85"/>' + wcircle(cx, cy, r, 2)
            + wline(cx - r * .4, cy - r * .4, cx + r * .4, cy + r * .4, r * .22, over=0) + wline(cx + r * .4, cy - r * .4, cx - r * .4, cy + r * .4, r * .22, over=0))


def bullets(x, y, items, size=28, n=40, gap=12, dot=YEL, lh=1.36):
    s, yy = "", y
    for it in items:
        s += f'<circle cx="{x + 8}" cy="{yy - size * .32}" r="{size * .2}" fill="{dot}"/>' + wcircle(x + 8, yy - size * .32, size * .2, 1.6)
        p, yy = para(x + 30, yy, size, it, n, lh=lh)
        s += p; yy += gap
    return s, yy


def card(W, H):
    return (f'<rect x="14" y="16" width="{W}" height="{H}" rx="14" fill="{SHADOW}" opacity=".6"/>'
            f'<rect x="0" y="0" width="{W}" height="{H}" rx="14" fill="{CARD}"/>' + wbox(0, 0, W, H, 3.2)
            + tape(W / 2, 0, 180 * W / 1679, 46 * W / 1679, R.uniform(-3, 3)))


def header(x, y, n, label, title, size=56, chars=16, eyebrow=27):
    s = T(x, y, eyebrow, f"{n:02d} · {label.upper()}", BRN, bold=True)
    yy = y + size * 1.35
    lines = wrap(title, chars)
    for i, ln in enumerate(lines):
        if i == len(lines) - 1:
            s += swipe(x - 8, yy - size * .28, len(ln) * size * .6 + 16, size * .55)
        s += MT(x, yy, size, ln)
        yy += size * 1.18
    return s, yy


def textcol(n, label, title, body, x=1010, y=150, chars=15, bsize=30, bchars=34):
    s, yy = header(x, y, n, label, title, 56, chars)
    p, yy = para(x, yy + 26, bsize, body, bchars, MUT)
    return s + p, yy


# ---------- Sketch Deck wiring ----------
FONTS = ("Kalam:wght@400;700", "Permanent Marker")

def theme_page(html_path, title):
    """Set the deck's title and add the style's fonts to the page."""
    slide_kit.theme_page(html_path, title, fonts=FONTS)

def group(fid, title, inner, frame, aw=LOCAL_W):
    """One clean-layer slide on frame (x, y, w, h), drawn in a local space aw units wide
    (1679.2 for a slide card, larger for a poster). The page scales every slide group from
    LOCAL_W onto its frame, so other widths get an inner scale."""
    x, y, w, h = frame
    if aw != LOCAL_W:
        inner = f'<g transform="scale({LOCAL_W / aw:.6f})">{inner}</g>'
    return f'<g data-frame="{fid}" data-title="{E(title)}" transform="translate({x} {y}) scale({w / LOCAL_W:.5f})">{inner}</g>'

def inject(html_path, groups):
    """Replace the page's clean layer with the given slide groups."""
    slide_kit.inject(html_path, groups, "")
