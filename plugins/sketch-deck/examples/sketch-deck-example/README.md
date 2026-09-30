# Sketch Deck example

A small hand-drawn deck made with the Sketch Deck skill: two slides,
sketched with the pen and never redrawn by Claude, so it shows the sketch
itself as a presentation.

1. Documents and a person: a text document and a form, with arrows showing
   information moving between them and on to a person.
2. A house, a tree, a car and a tower. This slide has four build steps, one
   drawing per step, so it fills in left to right as you present.

## Files

- `presentation.html`: the deck as a standalone presentation, as the page's
  Download menu saves it. Open it in a browser: arrow keys, space or a tap
  go forward, F is fullscreen, and S opens the slide navigator to hide or
  reorder slides.
- `drawing.svg`: the same deck as a drawing for Inkscape. Each slide is a
  layer (`slide 1`, `slide 2`), slide 2's build steps are sublayers
  (`step 1 · House` to `step 4 · Tower`), and the slide frames are in a
  hidden `frames` layer.
- `sketch.json`: the sketch data from the deck's database, one document per
  line: `frames`, `strokes` (pen strokes; `L` is the build step a stroke
  belongs to), `texts`, `images` and `steps` (per slide: step order, names,
  and steps merged into the base).

## Load it into a deck

To continue from this sketch, ask Claude for a new sketch deck, then to
load `sketch.json` into it: each document goes into the collection of the
same name, with its key as the document id (for example with one
`ArtifactData` `batch` per 50 documents). Then say "done" and Claude draws
the finished slides.
