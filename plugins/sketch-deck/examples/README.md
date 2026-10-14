# Sketch Deck examples

* `blueprint-poster/`, `watercolor-blueprint-poster/`, `pen-and-marker-poster/`:
  the same poster, explaining the Sketch Deck skill itself, in each of the
  three named styles. Each is a poster deck: an overview to zoom into, with
  its parts as their own slides.
* `sketch-deck-example/`: a hand-drawn deck, presented as the sketch itself,
  with build steps.

Each poster folder holds:

* `deck.py`: the deck script, a worked example of the style's kit;
* `presentation.html`: the standalone presentation (open it in a browser;
  S opens the slide navigator, O the overview);
* `drawing.svg`: the drawing for Inkscape, a layer per slide;
* `frames.json`: `ArtifactData` batch writes that put the deck's frames into
  a real Sketch Deck's database.

## Rebuild

    python3 build.py                    # every example with a deck.py
    python3 build.py blueprint-poster   # one example

`build.py` copies the template, runs the example's `deck.py` (which themes
the page and draws the slides with its kit), then saves the presentation,
the SVG and the frames from the page in headless Chromium. It needs Python 3
with Playwright and Chromium; set `CHROMIUM` to a Chromium binary when
Playwright's own download is missing. Rebuilding after a change to the
template or a kit checks that they still work together.

## Turn one into a live deck

Copy the template to a deck file, call the example's `build(path)` on it
(from `deck.py`: it themes the page and draws the slides), publish the file
as a new artifact with the `db`, `assets` and `downloads` capabilities, and
write `frames.json` to its database with `ArtifactData` `batch`. Or ask
Claude to do this for you.
