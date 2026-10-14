# Blueprint

An engineering drawing: light outlines and amber annotations on a dark navy
grid. Flat (no shadows, gradients or icons), with the real mechanism drawn
large. Use it when the user asks for "Blueprint" or an engineering-drawing
look. Example: `examples/blueprint-poster/` in the plugin.

## Kit

`scripts/blueprint_kit.py`; copy it next to `slide_kit.py` and the deck
script.

- `theme_page(deck_html, title)` once on the copied template, before the
  first publish: sets the title and turns the page itself navy (stage,
  sheet, sheet grid, download paper, player and thumbnails), and adds IBM
  Plex Sans 600/700. If the template changed so a swap no longer matches,
  it stops; update `PAGE_SWAPS`.
- `panel(n, label, title, body)` draws a whole slide: grid sheet, inset
  card, eyebrow, heading and rule, then `body` (your diagram).
- `group(fid, title, inner, (x, y, w, h))` places a slide on its frame;
  `inject(deck_html, groups)` writes the clean layer and the arrow markers
  `bp-ah` (amber) and `bp-ahl` (light).
- Helpers: `T` text, `H` heading, `lines`, `box`, `node` (box + centred
  title + mono subtitle), `code` (code card), `path`, `arrow`, `dot`,
  `corners` (zoom brackets), `grid_bg`, `step`.

## Look

- Colours: BG #0f2b4b slide; PANEL #12335a node fill; #0c2440 code-card
  fill; LINE #c6dcf1 outlines and secondary arrows; HEAD #e2eefa headings and
  main text; AMB #f2c35b the one accent (eyebrows, main-flow arrows,
  highlighted code, zoom brackets); DIM #86a5c4 subtitles, captions,
  comments; FAINT #2c5580 rules; per-slide grid #1d4269 (40 minor at 55%,
  200 major); RED #ff8f6e only for failures; GREEN #8fd6a8 only for pass or
  done.
- Type: eyebrow mono 24 amber 500, tracking 2, `NN · LABEL` in caps at
  (70, 92); title Plex Sans 54/700 uppercase, tracking .05em, at (70, 158),
  FAINT 2px rule at y 192; node title Sans 600 26-30, subtitle mono 20-22
  DIM; body 22-26; code mono 22-24, line height 1.45.
- Components: node (rx 10, LINE 3px, PANEL fill, centred title, mono
  subtitle below; leave room so the subtitle clears the border); code card
  (amber mono title bar, `#` lines dim, highlighted lines amber); amber 3px
  arrows for the main flow, LINE for secondary, dashed for side branches;
  container = dashed LINE outline at lower opacity with a small caps label;
  slide card = LINE 2px at 55% inset 14px.
- No text column: diagrams use the whole slide below the rule (y 220-900,
  x 70-1610), with captions inside the diagram.

## Poster

See "Poster decks" in SKILL.md. Blueprint posters:

- One 7200 x 4050 overview frame: title, a legend (main flow, secondary,
  zoom), and the panels in a grid, e.g. 3 x 2 panels of 2240 x 1260,
  joined by amber chevrons. Draw the overview in the 1679.2-wide slide space
  (the page scales it by 7200 / 1679.2).
- Each panel is its own frame with one large diagram (`panel()`).
- A panel may have one nested zoom frame, about a third of its width,
  placed where `corners()` brackets mark the detail on the panel; give it an
  empty titled group.
- Present order: poster, panel, its zoom, next panel, ..., then a recap
  frame equal to the poster.
