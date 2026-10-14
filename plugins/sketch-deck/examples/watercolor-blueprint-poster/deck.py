"""Watercolor Blueprint example: a poster that explains the Sketch Deck skill.

One dense poster drawn as an exploded technical plate: the skill is a stack
of isometric layers, from the sketch at the bottom to the finished slides on
top, with you on the left and what you get on the right. Tour frames nested
in the poster fly the camera through it in callout order. Built by
../build.py.
"""
from watercolor_blueprint import *

TITLE = "Sketch Deck Watercolor"
CW, CH = 2400, 1350
FRAME = ("wb-poster", 0, 0, 4800, 2700)
STACK_X = 1150
LAYERS = [1170, 970, 770, 570, 370]      # plate centres, bottom to top
PA, PB = 300, 70                         # plate half-width and half-depth


def plates():
    P = [Plate(STACK_X, y, PA, PB) for y in LAYERS]
    s = []
    # dash-dot guides between the corners of neighbouring plates
    for lo, up in zip(P, P[1:]):
        for u, v in ((-1, 1), (1, -1), (1, 1)):
            x1, y1 = lo.P(u, v); x2, y2 = up.P(u, v)
            s.append(ln(x1, y1, x2, y2 + up.t, 1, INK, "14 5 2 5", .55))
    sk, db, rn, kit, cl = P
    # 1 sketch: two frames with pen strokes on them
    s.append(sk.slab())
    for u0 in (-.85, .1):
        s.append(sk.box(u0, -.55, .7, .9, 4))
        s.append(sk.path([(u0 + .1, -.2), (u0 + .25, .1), (u0 + .4, -.15), (u0 + .6, .15)], 4, INK, 1.6))
    s.append(sk.top_text(-.5, -.75, 6, "FRAME 1", 11) + sk.top_text(.45, -.75, 6, "FRAME 2", 11))
    # 2 database: one drum per collection
    s.append(db.slab())
    for i, name in enumerate(("frames", "strokes", "texts", "images", "steps")):
        u = -.72 + i * .36
        s.append(db.cyl(u, -u * .25, 26, 34))
        x, y = db.P(u, -u * .25)
        s.append(t(x, y - 44, 11.5, name, "wb-sp", "middle"))
    # 3 render: the overview, frame images and the manifest
    s.append(rn.slab())
    s.append(rn.box(-.85, -.5, .65, .8, 22) + rn.top_text(-.52, -.1, 22, "overview", 11))
    s.append(rn.box(-.05, -.6, .35, .5, 18) + rn.box(-.05, .05, .35, .5, 18))
    s.append(rn.top_text(.12, -.35, 18, "frame-01", 9.5) + rn.top_text(.12, .3, 18, "frame-02", 9.5))
    s.append(rn.box(.5, -.4, .4, .8, 28) + rn.top_text(.7, 0, 28, "manifest", 10))
    # 4 style kits: four blocks, the one in use lifted out in ochre
    s.append(kit.slab())
    names = ("house", "blueprint", "marker", "watercolor")
    for i, name in enumerate(names):
        u = -.8 + i * .42
        h = 52 if i == 3 else 26
        s.append(kit.box(u, -.3, .3, .55, h, **(OCH_FACES if i == 3 else {})))
        s.append(kit.top_text(u + .15, -.03, h, name, 10))
    # 5 clean layer: the finished slides
    s.append(cl.slab())
    for i in range(3):
        u = -.8 + i * .55
        s.append(cl.box(u, -.45, .45, .8, 8, **(OCH_FACES if i == 1 else {})))
    s.append(cl.top_text(-.15, -.05, 8, "slide 2 · in view", 10))
    return P, "".join(s)


def poster():
    s = [paper(CW, CH)]
    s.append(blob(STACK_X, 760, 520, 560))
    s.append(blob(330, 1060, 260, 200, WASH2, .4))
    s.append(blob(2110, 640, 300, 420, WASH2, .38))
    s.append(drips(STACK_X - 260, 1280, [(0, 50, 12), (140, 30, 8), (330, 46, 10), (470, 26, 7)]))
    s.append(splat([(560, 300, 5), (590, 330, 3), (1900, 1240, 6), (1930, 1210, 3), (1640, 210, 4)]))
    s.append(title_block(60, 84, "Sketch Deck", ["You sketch slides by hand; Claude draws them in a style;",
                                                "you present them, or download them for anyone."], 520))
    P, stack = plates()
    s.append(stack)

    # you, the pen and the other tools, feeding the sketch layer
    s.append(person(300, 1080, 30, INK))
    for i, (c, och) in enumerate((("pen", True), ("note pen", False), ("text", False), ("frame", False), ("image", False))):
        s.append(chip(190 + (i % 3) * 110, 1170 + (i // 3) * 40, c, och))
    s.append(flow_arrow("M360 1060C520 1000 700 1060 860 1120", True))
    s.append(label(150, 930, "You sketch", ["pen strokes = slide content", "orange notes = the brief",
                                            "a frame around each slide"], 292, 1040, n=1, lead=(250, 1016)))

    # layer callouts, right of the stack, in reading order
    calls = [(1, "Say “done”", ["Claude exports every collection", "with ArtifactData list"]),
             (2, "Render", ["sketch_render.py draws the sketch:", "overview, one image per frame,", "and a manifest of each slide"]),
             (3, "Draw in a style", ["a deck script and a style kit", "write each finished slide"]),
             (4, "Clean layer", ['one <g data-frame> per slide;', 'step() marks a build step'])]
    for k, (n, title, spec) in enumerate(calls):
        pl = P[k + 1]
        px, py = pl.P(1, -.2)
        s.append(label(1560, LAYERS[k + 1] - 30, title, spec, px + 6, py, n=n + 1))

    # what you get: present it, or download it
    s.append(flow_arrow("M1460 330C1620 230 1760 230 1900 290", True))
    for i, (x, y, w, h) in enumerate(((1910, 300, 150, 84), (2100, 300, 150, 84))):
        s.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="#fffdf6" stroke="{INK}" stroke-width="1.4"/>')
    s.append(flow_arrow("M2062 342C2075 320 2088 320 2098 342"))
    s.append(label(1910, 470, "Present", ["the camera flies frame to frame;", "steps reveal one at a time"], 2060, 400, n=6))
    for c, x in (("Slides", 1960), ("Steps", 2050), ("Sketch · Both · Clean", 2210)):
        s.append(chip(x, 580, c))
    s.append(flow_arrow("M1880 340C1870 500 1880 800 1945 905"))
    s.append(book(1960, 1080, 70, 150, 40, "#c9d2da") + book(2050, 1080, 70, 120, 40, "url(#wb-och)"))
    s.append(t(1995, 1110, 12.5, "presentation", "wb-sp", "middle") + t(2085, 1110, 12.5, "drawing.svg", "wb-sp", "middle"))
    s.append(label(1910, 760, "Download", ["presentation.html: one file;", "S hides and reorders slides",
                                          "drawing.svg: a layer per slide", "for Inkscape"], 1995, 925, n=7, lead=(1960, 870)))
    return "".join(s)


# tour frames in canvas units: (id, title, x, y, w); h = w * 9 / 16
TOUR = [("wb-1", "1 · You sketch", 100, 770, 960),
        ("wb-2", "2 · Say done", 800, 690, 1080),
        ("wb-3", "3 · Render", 800, 480, 1080),
        ("wb-4", "4 · Draw in a style", 800, 280, 1080),
        ("wb-5", "5 · Clean layer", 800, 90, 1080),
        ("wb-6", "6 · Present", 1840, 200, 540),
        ("wb-7", "7 · Download", 1840, 700, 540)]


def build(html_path):
    theme_page(html_path, TITLE)
    tours = tour_frames(FRAME, CW, CH, TOUR)
    inject(html_path, [poster_group(FRAME, CW, CH, poster(), "Sketch Deck")] + tour_groups(tours))
    return [FRAME + (1,)] + [(f[0], f[2], f[3], f[4], f[5], f[6]) for f in tours]
