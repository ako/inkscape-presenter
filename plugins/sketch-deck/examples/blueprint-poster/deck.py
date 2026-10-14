"""Blueprint example: a poster that explains the Sketch Deck skill.

One 7200 x 4050 overview sheet with six panels joined by amber chevrons;
each panel is its own slide, two of them with a zoom frame on a detail, and
a recap frame returns to the whole poster. Built by ../build.py.
"""
from blueprint_kit import *

TITLE = "Sketch Deck Blueprint"
PW, PH = 2240, 1260                      # panel frames, 16:9
POSTER = (0, 0, 7200, 4050)
COLS, ROWS = (120, 2480, 4840), (1230, 2640)
K = POSTER[2] / LW                       # world units per poster-local unit


def at(i):
    return COLS[i % 3], ROWS[i // 3]


# ---------- the six panels (each authored in the 1679.2 x 944.5 slide space) ----------

def sketch():
    s = ""
    tools = [("Pen", "slide content"), ("Note pen", "brief for Claude"), ("Text", "typed notes"),
             ("Frame", "one per slide"), ("Image", "look and feel")]
    for i, (t, sub) in enumerate(tools):
        s += node(70, 240 + i * 128, 340, 104, t, sub, ts=28, ss=20)
        s += arrow(420, 292 + i * 128, 520, 292 + i * 128 + (3 - i) * 18, LINE, 2.5)
    s += box(540, 240, 1070, 620, LINE, 2, 6, dash="10 8", op=.7)
    s += T(560, 230, 18, "CANVAS", DIM, 500, mono=True, ls=2)
    for fx in (590, 1090):
        s += box(fx, 300, 470, 264, AMB, 2.5, 2, dash="12 8")
    s += path("M640 500C690 440 760 540 820 470S930 450 980 510", LINE, 4, False)
    s += box(640 + 12, 330, 120, 60, LINE, 3, 4) + box(840, 330, 120, 60, LINE, 3, 4)
    s += path("M1140 520L1180 420L1250 470L1320 360L1400 450L1500 380", LINE, 4, False)
    s += T(1100, 640, 24, "“bar chart here”", RED, 400, mono=True)
    s += T(590, 640, 22, "frame 1", AMB, 500, mono=True) + T(1090, 600, 22, "frame 2", AMB, 500, mono=True)
    s += lines(590, 720, 24, ["Draw each slide, frame it, and leave", "notes: the sketch is the brief."], DIM)
    return panel("01", "Sketch", "Draw it by hand", s)


def done():
    s = node(70, 420, 380, 150, "Sketch Deck page", "claude.ai artifact", ts=30)
    s += arrow(460, 495, 560, 495)
    s += T(470, 470, 22, "“done”", AMB, 500, mono=True)
    s += box(580, 240, 560, 640, LINE, 2, 8, dash="10 8", op=.7)
    s += T(600, 230, 18, "DATABASE", DIM, 500, mono=True, ls=2)
    rows = [("frames", "x, y, w, h, t"), ("strokes", "ink | note, points"), ("texts", "typed notes"),
            ("images", "asset id"), ("steps", "order, names")]
    for i, (t, sub) in enumerate(rows):
        s += node(610, 270 + i * 120, 500, 100, t, sub, ts=26, ss=20)
    s += arrow(1150, 555, 1250, 555)
    s += node(1260, 470, 350, 170, "Claude", "ArtifactData list", ts=34)
    s += lines(1260, 720, 22, ["Every collection is", "exported as JSON."], DIM)
    return panel("02", "Say done", "Claude reads the database", s)


ZOOM3 = (900, 560, 700, 300)             # panel-local zoom regions (x, y, w, h)
ZOOM6 = (980, 520, 640, 340)


def see():
    s = code(70, 250, 760, ["$ python3 sketch_render.py \\", "    export render --assets assets", "",
                             "# writes", "render/overview.png", "render/frame-NN.png", "render/manifest.json"],
             24, "RENDER THE SKETCH", hl=(6,))
    outs = [("overview.png", "the whole canvas"), ("frame-NN.png", "one image per slide")]
    for i, (t, sub) in enumerate(outs):
        s += node(940, 260 + i * 140, 600, 110, t, sub, ts=28, ss=20)
        s += arrow(840, 330 + i * 90, 930, 315 + i * 140, LINE, 2.5)
    s += code(940, 590, 640, ['{ "slide": 2, "strokes": 9,', '  "texts": ["bar chart here"],', '  "images": [] }'],
              22, "manifest.json", hl=(1,))
    s += arrow(840, 560, 930, 660)
    s += corners(*ZOOM3)
    s += lines(70, 700, 24, ["Claude looks at every frame", "image, then reads the notes", "as the brief for that slide."], DIM)
    return panel("03", "See", "Render the sketch", s)


def draw():
    s = node(70, 430, 320, 150, "deck script", "one per deck", ts=30)
    kits = [("slide_kit.py", "house style"), ("blueprint_kit.py", "Blueprint"),
            ("watercolor_blueprint.py", "Watercolor Blueprint"), ("pen_marker.py", "Pen & Marker")]
    for i, (t, sub) in enumerate(kits):
        on = i == 1
        s += node(520, 240 + i * 150, 520, 120, t, sub, AMB if on else LINE, ts=26, ss=20, tc=AMB if on else HEAD)
        s += arrow(400, 505, 510, 300 + i * 150, AMB if on else LINE, 3 if on else 2.5)
        s += arrow(1050, 300 + i * 150, 1170, 505, AMB if on else LINE, 3 if on else 2.5, "" if on else "8 8")
    s += node(1180, 430, 430, 150, "clean layer", '<g data-frame="…">', ts=30)
    s += code(1180, 640, 430, ['step("key", "Name", svg)'], 22, "BUILD STEP")
    return panel("04", "Draw", "Draw in a style", s)


def present():
    s = ""
    xs = (90, 620, 1150)
    for i, x in enumerate(xs):
        s += box(x, 270, 440, 248, AMB if i == 1 else LINE, 3, 4)
        s += T(x + 20, 310, 22, f"slide {i + 1}", DIM, 500, mono=True)
    for j in range(3):
        s += box(660 + j * 130, 360, 110, 120, AMB, 2.5, 6, "#1d3f66" if j < 2 else "none", "" if j < 2 else "8 6")
        s += T(715 + j * 130, 432, 30, str(j + 1), HEAD if j < 2 else DIM, 600, "middle")
    s += path("M310 540C380 640 560 640 640 540", AMB, 3)
    s += path("M840 540C910 640 1090 640 1170 540", AMB, 3)
    s += T(620, 680, 22, "the camera flies between frames", AMB, 500, "middle", mono=True)
    s += T(840, 250, 22, "steps reveal one at a time", DIM, 400, "middle", mono=True)
    pan = [("Slides panel", "insert · reorder"), ("Steps panel", "reveal order"), ("Sketch · Both · Clean", "view")]
    for i, (t, sub) in enumerate(pan):
        s += node(90 + i * 510, 730, 480, 120, t, sub, ts=26, ss=20)
    return panel("05", "Present", "Fly through the frames", s)


def share():
    s = node(70, 450, 300, 130, "Download", "toolbar ↓", ts=30)
    s += arrow(380, 500, 470, 330) + arrow(380, 530, 470, 690)
    s += node(480, 250, 460, 150, "presentation.html", "one file, no claude.ai", ts=28, ss=20)
    s += lines(480, 450, 22, ["S · navigator: hide, reorder", "save a copy per audience"], DIM)
    s += node(480, 610, 460, 150, "drawing.svg", "layers for Inkscape", ts=28, ss=20)
    s += arrow(950, 690, 970, 690, LINE, 2.5)
    s += code(980, 520, 640, ["slide 1", "slide 2", "  step 1 · House", "  step 2 · Tree", "frames  (hidden)"],
              24, "LAYERS", hl=(2, 3))
    s += lines(980, 820, 22, ["presents with svg-presenter.js"], DIM)
    s += corners(*ZOOM6)
    return panel("06", "Share", "Download the deck", s)


PANELS = [("bp-1", "Sketch", sketch), ("bp-2", "Say done", done), ("bp-3", "See", see),
          ("bp-4", "Draw", draw), ("bp-5", "Present", present), ("bp-6", "Share", share)]
ZOOMS = {2: ("bp-3z", "manifest.json", ZOOM3), 5: ("bp-6z", "Layers for Inkscape", ZOOM6)}


def overview():
    s = grid_bg()
    s += T(28, 60, 14, "00 · OVERVIEW", AMB, 500, mono=True, ls=2)
    s += H(28, 128, 64, "Sketch Deck")
    s += lines(30, 176, 17, ["You sketch slides by hand; Claude draws them in a style;",
                             "you present them, or download them for anyone."], DIM)
    s += f'<path d="M28 205H{LW - 28}" stroke="{FAINT}" stroke-width="2"/>'
    lx = 1060
    s += arrow(lx, 120, lx + 60, 120) + T(lx + 74, 126, 16, "main flow", DIM, mono=True)
    s += arrow(lx, 160, lx + 60, 160, LINE, 2) + T(lx + 74, 166, 16, "secondary", DIM, mono=True)
    s += corners(lx + 300, 104, 50, 30, 10) + T(lx + 364, 126, 16, "zoom", DIM, mono=True)
    for i in range(6):                     # chevrons between the panels, in reading order
        x, y = at(i)
        if i % 3 < 2:
            cx, cy = (x + PW + 60) / K, (y + PH / 2) / K
            s += path(f"M{cx - 6} {cy - 12}L{cx + 6} {cy}L{cx - 6} {cy + 12}", AMB, 4, False)
    x2, y2 = at(2); x3, y3 = at(3)
    s += path(f"M{(x2 + PW / 2) / K} {(y2 + PH + 20) / K}C{(x2 + PW / 2) / K} {(y2 + PH + 70) / K} "
              f"{(x3 + PW / 2) / K} {(y2 + PH + 50) / K} {(x3 + PW / 2) / K} {(y3 - 20) / K}", AMB, 3)
    return s


def build(html_path):
    theme_page(html_path, TITLE)
    groups = [group("bp-poster", "Sketch Deck", overview(), POSTER)]
    frames = [("bp-poster",) + POSTER + (10,)]
    t = 20
    for i, (fid, title, fn) in enumerate(PANELS):
        x, y = at(i)
        groups.append(group(fid, title, fn(), (x, y, PW, PH)))
        frames.append((fid, x, y, PW, PH, t)); t += 10
        if i in ZOOMS:
            zid, ztitle, (zx, zy, zw, zh) = ZOOMS[i]
            k = PW / LW
            w = round(zw * k, 1); h = round(w * 9 / 16, 1)
            zf = (round(x + zx * k, 1), round(y + (zy + zh / 2) * k - h / 2, 1), w, h)
            groups.append(f'<g data-frame="{zid}" data-title="{E(ztitle)}" '
                          f'transform="translate({zf[0]} {zf[1]}) scale({zf[2] / LW:.5f})"></g>')
            frames.append((zid,) + zf + (t,)); t += 10
    groups.append(f'<g data-frame="bp-recap" data-title="Recap" transform="scale({POSTER[2] / LW:.5f})"></g>')
    frames.append(("bp-recap",) + POSTER + (t,))
    inject(html_path, groups)
    return frames
