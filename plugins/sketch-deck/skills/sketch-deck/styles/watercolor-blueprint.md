# Watercolor Blueprint

An exploded technical drawing in ink and grey-blue watercolour on cream
paper, with ochre as the only accent: a hand-annotated engineering plate,
precise in the drawing and loose in the paint. Use it when the user asks for
"Watercolor Blueprint", a technical plate, or an exploded view. Example:
`examples/watercolor-blueprint-poster/` in the plugin.

## Kit

`scripts/watercolor_blueprint.py`; copy it next to `slide_kit.py` and the
deck script. Its docstring shows a minimal deck; the example shows a full
poster.

- `theme_page(deck_html, title)` once on the copied template: sets the
  title and adds Architects Daughter and Courier Prime to the page's fonts.
- Drawing: `paper`, `title_block`, `blob` (watercolour wash), `drips`,
  `splat`, `label` (numbered callout), `badge`, `chip`, `flow_arrow`,
  `person`, `book`, `t` (text; classes `wb-ttl`, `wb-hl`, `wb-sp`), `ln`,
  `poly`, and the isometric `Plate` (`slab`, `box`, `cyl`, `path`,
  `top_text`; pass `**OCH_FACES` to `box` for an ochre block).
- Wiring: `poster_group` (the poster as one slide, with the defs and the
  inner scale), `tour_frames`, `tour_groups`, `frame_docs` (the batch writes
  for the frames), `inject`.
- Ids start with `wb-` and classes with `wb-`, so the style can share a page
  with others without clashing.

## Look

- Composition: one big poster plus a tour. The main frame holds a single
  dense poster (author it on a larger 16:9 canvas such as 2400 x 1350).
  Smaller tour frames nested in it carry no drawing of their own;
  presenting flies the camera through the poster in their order. If the
  sketch has frames, they are the tour; if it has none, add the poster frame
  and tour frames yourself (`frame_docs` gives the batch).
- 3D exploded view: a system is isometric layers pulled apart vertically,
  joined by dash-dot guide lines at their corners. Things on a layer are
  small 3D blocks, never flat icons. Side groups (inputs, actors, outputs,
  libraries) sit around the core stack, joined by dashed curved arrows.
- Callouts: a numbered ochre badge, a hand-lettered uppercase title,
  underlined, a thin leader line ending in a dot, then 2-4 short lines of
  typewriter notes. Badge numbers give the reading order and match the tour:
  inputs left, the core stack in the centre, results and side panels right
  and bottom. Start a leader below the notes (`lead=`) when it would cross
  them.
- Colour: paper #efe6d1 with a faint grain; ink #2b2f33; notes #55606a;
  steel parts in grey gradients (#f6f7f8 to #c9d1d8 to #8b98a4); washes
  #8fa3b6 and #b9c7d3 at 30-45% opacity; ochre #d6a33a, dark ochre #94690f.
  Ochre carries meaning only: gates, the actor, the one active or selected
  item, badges, loops. Status lamps are the only other colours: sage
  #7fa36b pass, ochre pending, rust #c45a3a fail.
- Texture: large soft watercolour blobs behind each cluster with wobbly
  edges, paint drips under the lower edges, a few spatter dots, two or three
  faint light streaks top-left, a thin border around the plate.
- Type: Architects Daughter (titles and labels, uppercase, letter-spaced)
  and Courier Prime (notes, file names, commands). No other fonts.
- Content: real names, commands and counts from the source, never
  decoration. Show "this one is in use" by lifting one ochre item out of a
  steel group. The overview may be dense; the tour frames do the zooming.
- Draw lower layers first so upper ones sit in front, leave about 20px
  between layers so blocks at the back stay visible, and put the tallest
  block of a layer at the front so it hides no labels.

## Tour

Give every tour frame a title through `tour_groups`, so the Slides panel,
the downloads and the slide navigator name them. Keep each tour frame wide
enough for its callout text, which may not cross the frame edge. Check once:
render the poster, and the poster with the tour outlines on top, fix
overlaps between labels and layers, then stop.
