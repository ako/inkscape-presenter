#!/usr/bin/env python3
"""Slide kit for Sketch Deck: draws finished slides into the page's clean layer.

House style: white 16:9 card with a cobalt spine, a numbered amber eyebrow,
an Unbounded title and IBM Plex body copy in a right-hand column
(x 1010..1620), and a diagram on the left (x 70..960, y 110..860).
All slide content is authored in a local 1679.2 x 944.5 coordinate space;
slide() scales it onto each frame, so frames of any size work.

Usage (from a deck-specific script):
    from slide_kit import *
    visual = rect(90,200,300,200) + text(120,260,28,"Hello","d5")
    groups = [slide(frame, 1, "Intro", "A title", "Body copy.", visual)]
    inject("deck.html", groups)

Build steps: wrap parts of a visual in step("key", "Name", svg). The page
reveals steps one at a time when presenting (order editable in its Steps
panel); everything outside a step, including the text column, is the base.
Keys must be unique within a slide; keep them stable across redraws so the
user's ordering and names survive.

frame is (frame_id, x, y, w, h) from the manifest written by sketch_render.py.
CSS classes available on the page: d (Unbounded 700), d5 (Unbounded 500),
b (IBM Plex Sans), m (IBM Plex Mono).
"""
import html, re
INK="#1b2a33"; COB="#2a62c9"; CT="#e8eefa"; AMB="#e0a106"; AT="#fbf1d6"; MUT="#6f7d86"; HAIR="#d3d8d1"; RED="#e2541b"; W="#ffffff"; PAPER="#f6f7f4"
E=html.escape
def rect(x,y,w,h,fill=W,stroke=INK,sw=3,rx=12,extra=""): return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" {extra}/>'
def text(x,y,s,t,cls="b",fill=INK,anchor="start",weight=None):
    w=f' font-weight="{weight}"' if weight else ''
    return f'<text class="{cls}" x="{x}" y="{y}" font-size="{s}" text-anchor="{anchor}" style="fill:{fill}"{w}>{E(t)}</text>'
def line(x1,y1,x2,y2,c=INK,sw=3,dash="",arrow=False,op=1):
    d=f' stroke-dasharray="{dash}"' if dash else ''
    m=' marker-end="url(#ah-%s)"'%("c" if c==COB else "i") if arrow else ''
    return f'<path d="M{x1} {y1}L{x2} {y2}" stroke="{c}" stroke-width="{sw}" fill="none" stroke-linecap="round"{d}{m} opacity="{op}"/>'
def curve(x1,y1,x2,y2,c=INK,sw=3,arrow=False,dash=""):
    mx=(x1+x2)/2; d=f' stroke-dasharray="{dash}"' if dash else ''
    m=' marker-end="url(#ah-%s)"'%("c" if c==COB else "i") if arrow else ''
    return f'<path d="M{x1} {y1}C{mx} {y1} {mx} {y2} {x2} {y2}" stroke="{c}" stroke-width="{sw}" fill="none"{d}{m}/>'
def bars(x,y,widths,h=10,gap=20,fill=HAIR):
    return "".join(f'<rect x="{x}" y="{y+i*gap}" width="{w}" height="{h}" rx="{h/2}" fill="{fill}"/>' for i,w in enumerate(widths))
def person(cx,cy,r=26,fill=INK):
    return f'<circle cx="{cx}" cy="{cy-r*0.55}" r="{r*0.5}" fill="{fill}"/><path d="M{cx-r} {cy+r*0.95}C{cx-r} {cy+r*0.1} {cx+r} {cy+r*0.1} {cx+r} {cy+r*0.95}Z" fill="{fill}"/>'
def ai(cx,cy,s=64,label="AI"):
    return rect(cx-s/2,cy-s/2,s,s,COB,COB,0,s*0.28)+f'<path d="M{cx} {cy-s*0.28}L{cx+s*0.08} {cy-s*0.08}L{cx+s*0.28} {cy}L{cx+s*0.08} {cy+s*0.08}L{cx} {cy+s*0.28}L{cx-s*0.08} {cy+s*0.08}L{cx-s*0.28} {cy}L{cx-s*0.08} {cy-s*0.08}Z" fill="#fff"/>'+(text(cx,cy+s/2+26,20,label,"m",COB,"middle") if label else "")
def check(cx,cy,r=13,fill=COB):
    return f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{fill}"/><path d="M{cx-r*0.45} {cy}L{cx-r*0.1} {cy+r*0.38}L{cx+r*0.5} {cy-r*0.35}" stroke="#fff" stroke-width="{r*0.28}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
def dot(cx,cy,r,fill): return f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{fill}"/>'
def wrap(t,n):
    out=[];line_=""
    for w in t.split():
        if len(line_)+len(w)+1>n and line_: out.append(line_); line_=w
        else: line_=(line_+" "+w).strip()
    out.append(line_); return out


LOCAL_W, LOCAL_H = 1679.2, 944.5

def textcol(n, label, title, body, x=1010, title_size=50, title_chars=15, body_size=28, body_chars=38):
    s = [text(x, 190, 21, f"{n:02d} · {label.upper()}", "m", AMB, weight=500)]
    y = 270
    for l in wrap(title, title_chars): s.append(text(x, y, title_size, l, "d")); y += title_size * 1.24
    y += 28
    for l in wrap(body, body_chars): s.append(text(x, y, body_size, l, "b", MUT)); y += body_size * 1.5
    return "".join(s)

def step(key, name, svg):
    """A build step: revealed after the base when presenting."""
    return f'<g data-step="{E(key)}" data-name="{E(name)}">{svg}</g>'

def card():
    return rect(0, 0, LOCAL_W, LOCAL_H, W, HAIR, 2, 22) + f'<rect x="0" y="0" width="12" height="{LOCAL_H}" rx="6" fill="{COB}"/>'

def slide(frame, n, label, title, body, visual, full_width=False):
    """One finished slide. full_width=True skips the text column so the
    visual can use the whole card (put your own title in the visual)."""
    fid, x, y, w, h = frame[:5]
    k = w / LOCAL_W
    inner = card() + visual + ("" if full_width else textcol(n, label, title, body))
    return f'<g data-frame="{fid}" data-title="{E(title)}" transform="translate({x} {y}) scale({k:.5f})">{inner}</g>'

DEFS = f'''<defs>
<marker id="ah-c" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="{COB}"/></marker>
<marker id="ah-i" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="{INK}"/></marker>
<marker id="ah-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="{AMB}"/></marker></defs>'''

def inject(html_path, groups):
    """Replace the page's clean layer with DEFS + the given slide groups."""
    s = open(html_path).read()
    i = s.index('<g id="clean">'); j = s.index('<g id="images">')
    s = s[:i] + '<g id="clean">\n' + DEFS + "\n".join(groups) + '\n    </g>\n    ' + s[j:]
    open(html_path, 'w').write(s)

def frames_from_manifest(path):
    import json
    m = json.load(open(path))
    return [(f["id"], f["x"], f["y"], f["w"], f["h"]) for f in m["frames"]]
