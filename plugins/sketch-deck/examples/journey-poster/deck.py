"""Journey example: a product impression, from a sketched user journey to its screens.

A Pen & Marker poster of one user journey (Sam books a meeting room) with a
card per screen. Each card shows the screen as a hand-drawn wireframe with
the designer's notes; its build step lays the pixel-perfect screen over the
sketch. The screens are real HTML in screens/ (rendered by ui_kit), so they
double as the spec for building the product. The recap shows the whole
journey as product. Every beat is narrated, so deck_video.py turns it into
a narrated video. Built by ../build.py.
"""
import os
from pen_marker import *
from ui_kit import Screen, render_screens, device, device_height

HERE = os.path.dirname(os.path.abspath(__file__))
TITLE = "Sam books a room"
POSTER = (0, 0, 8000, 4500)
CW, CH = 2200, 1237.5                    # card frames, 16:9
XS, Y = (400, 2900, 5400), 1750
PX, PY, PW = 330, 150, 300               # where the phone sits on a card (slide units)

# narration, spoken as each beat arrives (slide, then its build step)
SAY = {
    "jp-poster": "Sam needs a meeting room, right now. Here is that journey, sketched on one page.",
    "jp-1": ("First, Sam looks for a room that is free right now.",
             "In the product, free rooms come first, and each one says how long it stays free."),
    "jp-2": ("Then Sam picks a time, and invites the team.",
             "Taken slots are struck through, so booking an hour is two taps."),
    "jp-3": ("And the room is booked.",
             "Priya and Tom have their invites, and it goes straight into Sam's calendar."),
    "jp-recap": "From a sketch on one page, to the screens of a real product.",
}


def note(x, y, text, to=None, bend=20):
    """An orange designer's note, with an arrow to what it is about."""
    s = T(x, y, 30, text, ORA, bold=True)
    if to:
        s += arrow(x + len(text) * 7, y + 12, to[0], to[1], ORA, 2.6, bend)
    return s


def phone_outline(h):
    return wbox(PX, PY, PW, h, 3.4) + wline(PX + 110, PY + 22, PX + 190, PY + 22, 6, INK)


def rooms_sketch(h):
    s = phone_outline(h)
    s += T(PX + 24, PY + 80, 30, "Find a room", INK, bold=True)
    s += wbox(PX + 22, PY + 104, PW - 44, 38, 2.2, inner=False)
    for i in range(3):
        s += wbox(PX + 22 + i * 86, PY + 156, 76, 26, 2, inner=False)
    for i in range(4):
        y = PY + 200 + i * 92
        s += wbox(PX + 22, y, PW - 44, 80, 2.4, inner=False) + mbox(PX + 34, y + 14, 50, 50, (BLU, YEL, GRN, GREY)[i], 2, sh=False, rx=6)
        s += wline(PX + 98, y + 30, PX + 170, y + 30, 4) + wline(PX + 98, y + 52, PX + 150, y + 52, 2.4, MUT)
        s += mbox(PX + 186, y + 26, 70, 26, GRN if i < 3 else GREY, 1.8, sh=False, rx=10)
    s += wline(PX, PY + h - 70, PX + PW, PY + h - 70, 2.4)
    return s, note(40, 360, "free rooms first!", (PX - 6, PY + 240), -30) + note(40, 610, "until when?", (PX + 180, PY + 246), 60)


def room_sketch(h):
    s = phone_outline(h)
    s += mbox(PX + 4, PY + 4, PW - 8, 150, BLU, 2.4, sh=False, rx=4)
    s += T(PX + 24, PY + 134, 34, "Harbour", INK, bold=True)
    for i in range(3):
        s += wbox(PX + 22 + i * 86, PY + 172, 76, 26, 2, inner=False)
    for r in range(2):
        for c in range(4):
            on = r == 1 and c < 2
            s += mbox(PX + 22 + c * 66, PY + 236 + r * 46, 56, 36, BLU if on else None, 2, sh=False, rx=6)
    for i in range(2):
        y = PY + 350 + i * 56
        s += wcircle(PX + 44, y + 22, 14, 2) + wline(PX + 70, y + 22, PX + 180, y + 22, 3)
    s += mbox(PX + 22, PY + h - 90, PW - 44, 50, BLU, 2.6, sh=False, rx=10)
    s += T(PX + PW / 2, PY + h - 56, 26, "Book", INK, "middle", True)
    return s, note(30, 300, "pick a slot", (PX + 14, PY + 270), -20) + note(30, 470, "invite team", (PX + 14, PY + 380), 20)


def booked_sketch(h):
    s = phone_outline(h)
    s += wcircle(PX + PW / 2, PY + 170, 46, 3, INK, "#e3f6ea")
    s += wline(PX + PW / 2 - 20, PY + 172, PX + PW / 2 - 4, PY + 188, 5) + wline(PX + PW / 2 - 4, PY + 188, PX + PW / 2 + 22, PY + 156, 5)
    s += T(PX + PW / 2, PY + 270, 30, "It's yours!", INK, "middle", True)
    s += wbox(PX + 22, PY + 310, PW - 44, 130, 2.4, inner=False)
    for i in range(3):
        s += wline(PX + 38, PY + 345 + i * 40, PX + 120, PY + 345 + i * 40, 2.4, MUT) + wline(PX + 170, PY + 345 + i * 40, PX + 255, PY + 345 + i * 40, 3)
    s += mbox(PX + 22, PY + h - 150, PW - 44, 50, BLU, 2.6, sh=False, rx=10)
    s += wbox(PX + 22, PY + h - 88, PW - 44, 50, 2.4, inner=False)
    return s, note(30, 330, "big & clear", (PX + PW / 2 - 56, PY + 170), -20) + note(30, 640, "add to calendar", (PX + 16, PY + h - 124), 30)


CARDS = [("jp-1", "Find a room", "rooms", rooms_sketch, "Find a free room",
          "Sam opens the app and sees which rooms are free right now, and until when."),
         ("jp-2", "Choose a time", "room", room_sketch, "Pick a time, invite",
          "One room, today's free slots, and the people Sam is meeting."),
         ("jp-3", "Booked", "booked", booked_sketch, "It's booked",
          "A clear confirmation, the invites sent, one tap to the calendar.")]


def card_slide(n, label, title, body, sketch, notes, shot):
    s = card(LOCAL_W, 944.5) + sketch + notes
    h = device_height(shot, PW + 24, "phone")
    cover = f'<rect x="{PX - 30}" y="{PY - 30}" width="{PW + 60}" height="{h + 50:.0f}" fill="{CARD}"/>'   # hides the sketch's corners
    s += step("ui", "Product", cover + device(shot, PX - 12, PY - 12, PW + 24, "phone"), say=SAY[f"jp-{n}"][1])
    tc, _ = textcol(n, label, title, body)
    return s + tc


def poster():
    s = f'<rect x="0" y="0" width="{POSTER[2]}" height="{POSTER[3]}" fill="{PAPER}"/>'
    s += depth(0.6, swipe(400, 640, 2900, 130) + MT(400, 640, 300, "Sam books a room"))
    p, _ = para(410, 860, 76, "One user journey, sketched screen by screen, then shown as the product would look.", 64)
    s += p
    s += depth(0.4, person(6600, 760, 230, ORA) + T(6600, 1240, 90, "Sam", INK, "middle", True)
               + T(6600, 1350, 60, "needs a room, now", MUT, "middle"))
    for i in range(2):
        x = XS[i] + CW
        s += arrow(x + 60, Y + CH / 2, XS[i + 1] - 60, Y + CH / 2, sw=9, bend=-60)
    for i, (_, label, *_r) in enumerate(CARDS):
        s += numdot(XS[i] + 70, Y + CH + 170, i + 1, YEL, 60, 64) + T(XS[i] + 170, Y + CH + 192, 80, label, INK, bold=True)
    return s


def build(html_path):
    theme_page(html_path, TITLE)
    shots = render_screens([Screen(key, os.path.join(HERE, "screens", key + ".html")) for _, _, key, *_ in CARDS])
    h = device_height(shots["rooms"], PW + 24, "phone") - 24
    groups = [narrate(group("jp-poster", "Sam books a room", poster(), POSTER, POSTER[2]), SAY["jp-poster"])]
    frames = [("jp-poster",) + POSTER + (10,)]
    for i, (fid, label, key, fn, title, body) in enumerate(CARDS):
        sk, notes = fn(h)
        inner = card_slide(i + 1, label, title, body, sk, notes, shots[key])
        groups.append(narrate(group(fid, title, inner, (XS[i], Y, CW, CH)), SAY[fid][0]))
        frames.append((fid, XS[i], Y, CW, CH, 20 + i * 10))
    groups.append(narrate(group("jp-recap", "Recap", "", POSTER, POSTER[2]), SAY["jp-recap"]))
    frames.append(("jp-recap",) + POSTER + (90,))
    inject(html_path, groups, motion="subtle")
    return frames
