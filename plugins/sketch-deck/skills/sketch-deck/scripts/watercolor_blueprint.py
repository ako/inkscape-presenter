#!/usr/bin/env python3
"""Watercolor Blueprint: a Sketch Deck house style for poster slides.

An exploded technical drawing in ink and grey-blue watercolour on cream paper, with
ochre as the only accent. One dense poster on the overview frame, plus tour frames
nested inside it that fly the camera through the poster when presenting.

Usage (from a deck script, next to slide_kit.py):
    from watercolor_blueprint import *
    CW, CH = 2400, 1350                       # poster canvas, 16:9; bigger = denser
    FRAME = ("poster", 400, 400, 3358.4, 1889.0)
    def poster():
        s = [paper(CW, CH), blob(800, 450, 360, 300), drips(600, 800, [(0, 70, 14), (120, 40, 9)])]
        s.append(title_block(60, 84, "MY TOPIC", ["one-line subtitle", "second line"]))
        L = Plate(840, 300); s.append(L.slab() + L.box(-.5, -.5, .3, .3, 20, **OCH_FACES))
        s.append(label(1150, 280, "Layer", ["what it is", "what it does"], 1000, 300, n=1))
        return "".join(s)
    TOUR = [("tour-1", "1 · Layer", 545, 100, 900)]   # (id, title, x, y, w) in canvas units; h = w*9/16
    theme_page("deck.html", "My Topic")
    inject("deck.html", [poster_group(FRAME, CW, CH, poster(), "Title")] + tour_groups(tour_frames(FRAME, CW, CH, TOUR)))
    # then write FRAME and frame_docs(...) to the deck's `frames` collection (ArtifactData batch)

Call theme_page("deck.html", title) once on the copied template: it adds Architects
Daughter and Courier Prime to the page's Google Fonts link, so the page and its
downloads load them. Classes: .wb-ttl (title), .wb-hl (hand labels), .wb-sp (typewriter
notes). Ids start with wb-. See styles/watercolor-blueprint.md.
"""
import html, math
import slide_kit
from slide_kit import LOCAL_W

E = html.escape
INK = "#2b2f33"; SPEC = "#55606a"; OCH = "#d6a33a"; OCH_D = "#94690f"; WASH = "#8fa3b6"; WASH2 = "#b9c7d3"
PAPER = "#efe6d1"

DEFS = f"""
<style>
.wb-hl{{font-family:"Architects Daughter","Comic Sans MS",cursive;fill:{INK}}}
.wb-sp{{font-family:"Courier Prime","Courier New",monospace;fill:{SPEC}}}
.wb-ttl{{font-family:"Architects Daughter","Comic Sans MS",cursive;fill:{INK};letter-spacing:2px}}
</style>
<defs>
<linearGradient id="wb-steel" x1="0" y1="0" x2="0" y2="1">
 <stop offset="0" stop-color="#f6f7f8"/><stop offset=".4" stop-color="#c9d1d8"/><stop offset="1" stop-color="#8b98a4"/></linearGradient>
<linearGradient id="wb-face" x1="0" y1="0" x2="1" y2="1">
 <stop offset="0" stop-color="#fbfbf9"/><stop offset="1" stop-color="#d5dce2"/></linearGradient>
<linearGradient id="wb-glass" x1="0" y1="0" x2="1" y2="1">
 <stop offset="0" stop-color="#fdfbf5" stop-opacity=".92"/><stop offset="1" stop-color="#dfe6ec" stop-opacity=".85"/></linearGradient>
<linearGradient id="wb-och" x1="0" y1="0" x2="1" y2="1">
 <stop offset="0" stop-color="#f3d888"/><stop offset="1" stop-color="#cf9a2e"/></linearGradient>
<filter id="wb-wc" x="-30%" y="-30%" width="160%" height="160%">
 <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="7"/>
 <feDisplacementMap in="SourceGraphic" scale="70" xChannelSelector="R" yChannelSelector="G"/>
 <feGaussianBlur stdDeviation="5"/></filter>
<filter id="wb-drip" x="-50%" y="-10%" width="200%" height="130%">
 <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="3"/>
 <feDisplacementMap in="SourceGraphic" scale="8" xChannelSelector="R" yChannelSelector="G"/>
 <feGaussianBlur stdDeviation="1.6"/></filter>
<filter id="wb-grain" x="0" y="0" width="100%" height="100%">
 <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="11"/>
 <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.38  0 0 0 0 0.28  0 0 0 0.10 0"/></filter>
<marker id="wb-dot" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5"><circle cx="5" cy="5" r="3.2" fill="{INK}"/></marker>
<marker id="wb-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 1L9 5L0 9z" fill="{INK}"/></marker>
<marker id="wb-aho" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 1L9 5L0 9z" fill="{OCH_D}"/></marker>
</defs>"""


# ---------- 2D primitives ----------
def t(x, y, s, txt, cls="wb-hl", anchor="start", extra=""):
    return f'<text class="{cls}" x="{x:.1f}" y="{y:.1f}" font-size="{s}" text-anchor="{anchor}" {extra}>{E(txt)}</text>'

def ln(x1, y1, x2, y2, sw=1.4, c=INK, dash="", op=1, marker=""):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    m = f' marker-end="url(#{marker})"' if marker else ""
    return f'<path d="M{x1:.1f} {y1:.1f}L{x2:.1f} {y2:.1f}" stroke="{c}" stroke-width="{sw}" fill="none" stroke-linecap="round"{d}{m} opacity="{op}"/>'

def poly(pts, fill, sw=1.5, c=INK):
    return f'<path d="M{" L".join(f"{x:.1f} {y:.1f}" for x, y in pts)}Z" fill="{fill}" stroke="{c}" stroke-width="{sw}" stroke-linejoin="round"/>'

def badge(x, y, n):
    return (f'<circle cx="{x}" cy="{y}" r="15" fill="{OCH}" stroke="{INK}" stroke-width="1.4"/>'
            + t(x, y + 7, 20, str(n), "wb-hl", "middle", f'style="fill:{INK}"'))

def label(tx, ty, title, spec, px=None, py=None, n=None, size=22, spec_size=14.5, lead=None):
    """numbered, hand-lettered, underlined label with spec lines and an optional leader to (px,py)"""
    w = len(title) * size * 0.56
    s = []
    x0 = tx
    if n is not None:
        s.append(badge(tx + 15, ty - 8, n)); x0 = tx + 40
    s.append(t(x0, ty, size, title.upper()))
    s.append(ln(tx, ty + 7, x0 + w, ty + 7, 1.2))
    if px is not None:
        lx, ly = lead if lead else ((tx if px < tx else x0 + w), ty + 7)
        s.append(f'<path d="M{lx:.1f} {ly:.1f}L{px:.1f} {py:.1f}" stroke="{INK}" stroke-width="1.1" fill="none" marker-end="url(#wb-dot)"/>')
    for i, sl in enumerate(spec):
        s.append(t(tx, ty + 30 + i * (spec_size + 5), spec_size, sl, "wb-sp"))
    return "".join(s)

def blob(cx, cy, rx, ry, c=WASH, op=0.36):
    return f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="{c}" opacity="{op}" filter="url(#wb-wc)"/>'

def drips(x0, y0, specs, c=WASH, op=0.34):
    s = []
    for dx, L, w in specs:
        x = x0 + dx
        s.append(f'<path d="M{x} {y0}C{x + w * .15} {y0 + L * .4} {x - w * .1} {y0 + L * .7} {x} {y0 + L}" stroke="{c}" stroke-width="{w}" stroke-linecap="round" fill="none" opacity="{op}" filter="url(#wb-drip)"/>')
        s.append(f'<circle cx="{x}" cy="{y0 + L}" r="{w * .75}" fill="{c}" opacity="{op * .9}" filter="url(#wb-drip)"/>')
    return "".join(s)

def splat(pts, c=WASH, op=0.35):
    return "".join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{c}" opacity="{op}"/>' for x, y, r in pts)

def person(cx, cy, r=16, fill=INK):
    return (f'<circle cx="{cx}" cy="{cy - r * 0.9}" r="{r * 0.5}" fill="{fill}"/>'
            f'<path d="M{cx - r} {cy + r * 0.9}C{cx - r} {cy - r * 0.1} {cx + r} {cy - r * 0.1} {cx + r} {cy + r * 0.9}Z" fill="{fill}"/>')


# ---------- isometric layer kit ----------
A, B, T = 270, 60, 14   # plate half-width, half-depth, thickness
OCH_FACES = dict(top="url(#wb-och)", left="#d9ac4a", right="#b98a28")

class Plate:
    def __init__(self, cx, cy, a=None, b=None, t=None):
        self.cx, self.cy, self.a, self.b, self.t = cx, cy, a or A, b or B, t or T
    def P(self, u, v, z=0):
        return (self.cx + (u - v) * self.a / 2, self.cy + (u + v) * self.b / 2 - z)
    def slab(self, top="url(#wb-glass)"):
        L, Bo, R, To = self.P(-1, 1), self.P(1, 1), self.P(1, -1), self.P(-1, -1)
        d = lambda p: (p[0], p[1] + self.t)
        return (poly([L, Bo, d(Bo), d(L)], "#c6d0d9", 1.5) + poly([Bo, R, d(R), d(Bo)], "#9eacb8", 1.5)
                + poly([To, R, Bo, L], top, 1.7))
    def path(self, pts, z=0, c=INK, sw=1.2, fill="none"):
        q = [self.P(u, v, z) for u, v in pts]
        return f'<path d="M{" L".join(f"{x:.1f} {y:.1f}" for x, y in q)}" stroke="{c}" stroke-width="{sw}" fill="{fill}" stroke-linecap="round"/>'
    def box(self, u, v, du, dv, h, top="url(#wb-face)", left="#c9d2da", right="#a3b0bc", sw=1.3):
        p = self.P
        u1, v1 = u + du, v + dv
        tl, tr, tb, tt = p(u, v1, h), p(u1, v, h), p(u1, v1, h), p(u, v, h)
        bl, br, bb = p(u, v1), p(u1, v), p(u1, v1)
        return (poly([bl, bb, tb, tl], left, sw) + poly([bb, br, tr, tb], right, sw) + poly([tt, tr, tb, tl], top, sw))
    def top_text(self, u, v, z, txt, s=13, cls="wb-sp", fill=INK, bold=True):
        x, y = self.P(u, v, z)
        return t(x, y + s * .35, s, txt, cls, "middle", f'style="fill:{fill}"' + (' font-weight="700"' if bold else ""))
    def cyl(self, u, v, rx, h, fill="url(#wb-steel)", top="url(#wb-face)"):
        x, y = self.P(u, v)
        ry = rx * self.b / self.a
        return (f'<path d="M{x - rx:.1f} {y - h:.1f}L{x - rx:.1f} {y:.1f}A{rx} {ry:.1f} 0 0 0 {x + rx:.1f} {y:.1f}L{x + rx:.1f} {y - h:.1f}" fill="{fill}" stroke="{INK}" stroke-width="1.5"/>'
                f'<ellipse cx="{x:.1f}" cy="{y - h:.1f}" rx="{rx}" ry="{ry:.1f}" fill="{top}" stroke="{INK}" stroke-width="1.5"/>')


def book(x, base, w, h, d, fill, top="#fbfbf9", side="#9eacb8"):
    """upright book seen from the front-right: spine face w x h, depth d going back-right"""
    dx, dy = d * .7, -d * .4
    return (poly([(x, base - h), (x + dx, base - h + dy), (x + w + dx, base - h + dy), (x + w, base - h)], top, 1.1)
            + poly([(x + w, base - h), (x + w + dx, base - h + dy), (x + w + dx, base + dy), (x + w, base)], side, 1.1)
            + poly([(x, base - h), (x + w, base - h), (x + w, base), (x, base)], fill, 1.2)
            + ln(x + 3, base - h + 10, x + w - 3, base - h + 10, .8) + ln(x + 3, base - 12, x + w - 3, base - 12, .8))


# ---------- page furniture ----------
def paper(cw, ch, streaks=True):
    """cream paper, grain, light streaks top-left, thin border"""
    s = [f'<rect x="0" y="0" width="{cw}" height="{ch}" fill="{PAPER}"/>',
         f'<rect x="0" y="0" width="{cw}" height="{ch}" filter="url(#wb-grain)"/>']
    if streaks:
        s.append('<g opacity=".55">' + "".join(
            f'<path d="M{-40 + k * 34} {120 + k * 70}L{260 + k * 34} {-40 + k * 70}" stroke="#fffaf0" stroke-width="{18 - k * 4}" stroke-linecap="round" opacity="{.6 - k * .15}"/>'
            for k in range(3)) + '</g>')
    s.append(f'<rect x="22" y="22" width="{cw - 44}" height="{ch - 44}" fill="none" stroke="{INK}" stroke-width="1.2" opacity=".55"/>')
    return "".join(s)

def title_block(x, y, title, sub_lines, width=None):
    w = width or len(title) * 42 * 0.62
    s = [t(x, y, 42, title.upper(), "wb-ttl"), ln(x, y + 12, x + w, y + 12, 1.6)]
    for i, l in enumerate(sub_lines):
        s.append(t(x, y + 40 + i * 20, 16.5, l, "wb-sp"))
    return "".join(s)

def chip(cx, cy, txt, och=False):
    """rounded tag, e.g. a role or a step in a small flow"""
    w = len(txt) * 7.6 + 16
    return (f'<rect x="{cx - w / 2:.1f}" y="{cy - 13}" width="{w:.1f}" height="26" rx="13" fill="{"url(#wb-och)" if och else "#fffdf6"}" stroke="{INK}" stroke-width="1.2"/>'
            + t(cx, cy + 5, 12.5, txt, "wb-sp", "middle", f'style="fill:{INK}"'))

def flow_arrow(d, och=False):
    """dashed curved arrow along an SVG path d (e.g. 'M340 380C440 300 520 330 585 345')"""
    c, m = (OCH_D, "wb-aho") if och else (INK, "wb-ah")
    return f'<path d="{d}" stroke="{c}" stroke-width="1.5" fill="none" stroke-dasharray="6 5" marker-end="url(#{m})"/>'


# ---------- Sketch Deck wiring ----------
def poster_group(frame, cw, ch, inner, title):
    """the poster as one clean-layer slide; the page scales LOCAL_W onto the frame, so scale cw into LOCAL_W"""
    fid, x, y, w, h = frame
    return (f'<g data-frame="{fid}" data-title="{E(title)}" transform="translate({x} {y}) scale({w / LOCAL_W:.5f})">'
            f'<g transform="scale({LOCAL_W / cw:.6f})">{DEFS}{inner}</g></g>')

def tour_frames(frame, cw, ch, tour, t0=2):
    """world-space tour frames nested in the poster frame: (id, title, x, y, w, h, t)"""
    k = frame[3] / cw
    out = []
    for i, (fid, title, x, y, w) in enumerate(tour):
        h = w * 9 / 16
        assert x >= 0 and y >= 0 and x + w <= cw and y + h <= ch, (fid, "tour frame leaves the poster")
        out.append((fid, title, round(frame[1] + x * k, 1), round(frame[2] + y * k, 1), round(w * k, 1), round(h * k, 1), t0 + i))
    return out

def tour_groups(frames):
    """empty clean groups that give tour frames their titles (Slides panel, exports, organizer)"""
    return [f'<g data-frame="{f[0]}" data-title="{E(f[1])}" transform="translate({f[2]} {f[3]}) scale({f[4] / LOCAL_W:.5f})"></g>' for f in frames]

def frame_docs(frame, frames):
    """ArtifactData batch writes for the poster frame (t=1) and its tour frames"""
    fid, x, y, w, h = frame
    out = [{"op": "set", "collection": "frames", "doc_id": fid, "data": {"x": x, "y": y, "w": w, "h": h, "t": 1}}]
    out += [{"op": "set", "collection": "frames", "doc_id": f[0], "data": {"x": f[2], "y": f[3], "w": f[4], "h": f[5], "t": f[6]}} for f in frames]
    return out


# ---------- page ----------
FONTS = ("Architects Daughter", "Courier Prime:wght@400;700")

def theme_page(html_path, title):
    """Set the deck's title and add the style's fonts to the page."""
    slide_kit.theme_page(html_path, title, fonts=FONTS)

def inject(html_path, groups):
    """Replace the page's clean layer; the defs travel inside poster_group."""
    slide_kit.inject(html_path, groups, "")
