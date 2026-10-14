# Pen & Marker

A designer's marker rendering on warm paper, like an artist's impression:
black fineliner outlines that wobble a little and overshoot their corners, a
flat cool-grey offset shadow under each card, streaky diagonal marker fills
clipped to the shape, and a yellow highlighter swipe under the last line of
each title. Use it when the user asks for "Pen & Marker", marker
renderings, or a hand-drawn artist's impression. Example:
`examples/pen-and-marker-poster/` in the plugin.

## Kit

`scripts/pen_marker.py`; copy it next to `slide_kit.py` and the deck script
(`from pen_marker import *`). Its random seed is fixed, so redraws come out
the same.

- `theme_page(deck_html, title)` once on the copied template: sets the
  title and adds Permanent Marker and Kalam to the page's fonts.
- Lines and shapes: `wline`, `wbox`, `wcircle`, `hatch`, `shadow`, `mbox`
  (card + hatch + outline + shadow), `swipe`, `arrow` (bezier with an open
  two-stroke head; `bend` curves it), `numdot`, `tape`.
- Text: `T` (hand), `MT` (marker), `MO` (mono), `para`, `bullets`.
- Pieces: `chip` / `chips`, `code` (grey hatched code card), `person`,
  `bot`, `check`, `cross`.
- Slides: `card(W, H)` (card, shadow and tape), `header` (eyebrow, marker
  title and swipe), `textcol(n, label, title, body)` (the right-hand text
  column at x 1010).
- Wiring: `group(fid, title, inner, frame, aw)` places a slide drawn in a
  space `aw` wide (1679.2 for a card, the poster's width for a poster) on
  its frame; `inject(deck_html, groups)` writes the clean layer.

## Look

- Palette: paper #f6f2e8, card #fffdf8, ink #26262a, muted #5d6166, shadow
  #b7bdc1 at 55% opacity offset about 10px down-right. Marker fills at about
  40%, with streaks: yellow #f6c94a, orange #ef8b6a, green #9ccb87, blue
  #7fb0dc, lilac #c3b6e6. Brown #9a6a00 for eyebrows, red #d2452b only for
  failures, tape #efe3b8.
- Type: Permanent Marker for titles, Kalam 400/700 for body and labels, IBM
  Plex Mono for code and paths.
- Vocabulary: people are orange blobs and AI agents are blue boxy robots.
  Green checks mean pass and red crosses mean fail. Chips cycle blue, green,
  yellow, lilac and orange. Masking-tape strips pin callouts at a slight
  angle. Each card has the eyebrow `NN · LABEL` above its title.
- A slide is a card: the visual on the left (x 70-960) and `textcol` on the
  right. Titles wrap at about 15 characters, so keep them short.
- Use large visuals and little text: a title, 1-2 handwritten sentences,
  and let the drawing explain.

## Poster

See "Poster decks" in SKILL.md. Pen & Marker posters:

- One large poster frame (e.g. 8000 x 4500) drawn in its own space with
  `group(..., aw=8000)`: paper, a big marker title with a swipe, a line of
  handwriting, and hand-drawn arrows between the cards in reading order.
- The cards are their own frames, nested in the poster (e.g. 3 x 2 cards of
  2100 x 1181), each drawn with `card` and `textcol` in the slide space.
- A big card may hold zoom frames for its details ("01a ...", "01b ...");
  give each an empty titled group.
- End with a recap frame equal to the poster.
