"""Pen & Marker example: a poster that explains the Sketch Deck skill.

An 8000 x 4500 poster sheet with a marker title and six cards joined by
hand-drawn arrows; each card is its own slide, drawn in the 1679.2 x 944.5
slide space, and a recap returns to the whole sheet. Built by ../build.py.
"""
from pen_marker import *

TITLE = "Sketch Deck Pen and Marker"
POSTER = (0, 0, 8000, 4500)
CW, CH = 2100, 1181                      # card frames, 16:9
COLS, ROWS = (400, 2950, 5500), (1300, 2950)


def at(i):
    return COLS[i % 3], ROWS[i // 3]


def card_slide(n, label, title, body, visual):
    s = card(LOCAL_W, 944.5)
    tc, _ = textcol(n, label, title, body)
    return s + visual + tc


def sketch():
    v = wbox(80, 150, 820, 470, 3, dash="18 12")
    v += wline(140, 420, 300, 330, 4) + wline(300, 330, 420, 450, 4) + wline(420, 450, 600, 300, 4)
    v += mbox(640, 220, 200, 130, YEL)
    v += MT(120, 210, 34, "frame 1", BRN)
    v += T(470, 590, 34, "bar chart here!", ORA, bold=True)
    c, _ = chips(80, 690, ["pen", "note pen", "text", "frame", "image"], 30, 16, 880)
    return card_slide(1, "Sketch", "Draw it by hand",
                      "Pen strokes are the slide, orange notes are the brief, and a frame marks each slide.", v + c)


def done():
    v = person(170, 330, 60)
    v += T(110, 210, 40, "“done!”", INK, bold=True)
    v += arrow(260, 360, 400, 360, sw=3.4)
    c, _ = code(420, 170, 520, ["frames   x y w h t", "strokes  ink | note", "texts    typed notes",
                                "images   asset id", "steps    order, names"], 24, "database")
    v += c + bot(680, 680, 110) + arrow(660, 600, 640, 395, sw=3, bend=12)
    v += T(760, 700, 30, "Claude", INK, bold=True)
    return card_slide(2, "Say done", "Claude reads it",
                      "Say “done”: Claude exports every frame, stroke, note and image from the page’s database.", v)


def see():
    v = ""
    for i, (name, col) in enumerate((("overview", BLU), ("frame 1", GRN), ("frame 2", LIL))):
        x = 80 + i * 290
        v += mbox(x, 170, 250, 160, col) + T(x + 125, 360, 28, name, INK, "middle", True)
        v += wline(x + 30, 260, x + 110, 220, 3) + wline(x + 110, 220, x + 200, 280, 3)
    c, _ = code(80, 440, 840, ['{ "slide": 2, "strokes": 9,', '  "texts": ["bar chart here!"] }'], 26, "manifest.json")
    v += c + check(900, 470, 22)
    return card_slide(3, "See", "Look at every frame",
                      "A render script draws the sketch as images, plus a manifest of what each slide holds.", v)


def draw():
    v = bot(170, 330, 130)
    v += T(100, 470, 30, "deck script", INK, bold=True)
    styles = [("house", GREY), ("blueprint", BLU), ("watercolor", LIL), ("pen & marker", YEL)]
    for i, (name, col) in enumerate(styles):
        y = 170 + i * 120
        c, w = chip(330, y, name, col, 30)
        v += c + arrow(250, 330, 322, y + 26, sw=2.4, bend=-6)
        if i == 3:
            v += swipe(330, y + 70, w, 18, ORA, .5)
    v += mbox(720, 240, 220, 300, CARD) + MT(745, 300, 34, "slide") + bars_(745, 340)
    v += arrow(640, 400, 712, 400, sw=3.4)
    return card_slide(4, "Draw", "Draw in a style",
                      "A short deck script and a style kit draw each finished slide into the page.", v)


def bars_(x, y):
    return "".join(wline(x, y + i * 40, x + (150 if i % 2 else 120), y + i * 40, 6, GREY, over=0) for i in range(4))


def present():
    v = ""
    for i, x in enumerate((80, 380, 680)):
        v += mbox(x, 220, 250, 160, None if i != 1 else YEL, sh=True)
    for j in range(3):
        v += numdot(430 + j * 75, 300, j + 1, (GRN, GRN, CARD)[j], 24)
    v += arrow(220, 400, 470, 410, sw=3.2, bend=-60) + arrow(520, 410, 790, 400, sw=3.2, bend=-60)
    v += T(500, 560, 32, "the camera flies frame to frame", INK, "middle", True)
    c, _ = chips(80, 640, ["Slides", "Steps", "Sketch · Both · Clean"], 30, 18, 880)
    return card_slide(5, "Present", "Fly from frame to frame",
                      "The camera glides between frames, and build steps reveal a slide one part at a time.", v + c)


def share():
    v = mbox(80, 170, 400, 330, BLU) + T(110, 230, 32, "presentation.html", INK, bold=True)
    b, _ = bullets(110, 290, ["one file", "hide & reorder", "save a copy"], 28, 20, 6)
    v += b
    v += mbox(540, 170, 400, 330, GRN) + T(570, 230, 32, "drawing.svg", INK, bold=True)
    for i, l in enumerate(["slide 1", "slide 2", "  step 1 · House", "  step 2 · Tree"]):
        v += MO(570, 290 + i * 44, 26, l)
    v += check(470, 520, 22) + check(930, 520, 22)
    v += T(80, 610, 30, "present anywhere · edit in Inkscape", INK, bold=True)
    return card_slide(6, "Share", "Take it anywhere",
                      "Download one HTML file to present anywhere, or an SVG with a layer per slide for Inkscape.", v)


CARDS = [("pm-1", "Sketch", sketch), ("pm-2", "Say done", done), ("pm-3", "See", see),
         ("pm-4", "Draw", draw), ("pm-5", "Present", present), ("pm-6", "Share", share)]


def poster():
    s = f'<rect x="0" y="0" width="{POSTER[2]}" height="{POSTER[3]}" fill="{PAPER}"/>'
    s += swipe(400, 560, 1900, 120)
    s += MT(400, 560, 300, "Sketch Deck")
    p, _ = para(410, 780, 76, "You sketch slides by hand; Claude draws them in a style; "
                               "you present them, or download them for anyone.", 62)
    s += p
    s += person(5600, 640, 110) + bot(6800, 620, 230)
    s += arrow(5770, 620, 6620, 620, sw=6, bend=-120)
    s += T(6200, 470, 80, "“done!”", INK, "middle", True)
    s += tape(6200, 1000, 520, 90, -3) + T(6200, 1022, 52, "sketch → slides", INK, "middle", True)
    for i in range(6):                     # hand-drawn arrows between the cards, in reading order
        x, y = at(i)
        if i % 3 < 2:
            s += arrow(x + CW + 70, y + CH / 2, x + CW + 380, y + CH / 2, sw=9, bend=-40)
    x2, y2 = at(2); x3, y3 = at(3)
    s += arrow(x2 + CW / 2, y2 + CH + 80, x3 + CW / 2, y3 - 70, sw=9, bend=-200)
    return s


def build(html_path):
    theme_page(html_path, TITLE)
    groups = [group("pm-poster", "Sketch Deck", poster(), POSTER, POSTER[2])]
    frames = [("pm-poster",) + POSTER + (10,)]
    for i, (fid, title, fn) in enumerate(CARDS):
        x, y = at(i)
        groups.append(group(fid, title, fn(), (x, y, CW, CH)))
        frames.append((fid, x, y, CW, CH, 20 + i * 10))
    groups.append(group("pm-recap", "Recap", "", POSTER, POSTER[2]))
    frames.append(("pm-recap",) + POSTER + (90,))
    inject(html_path, groups)
    return frames
