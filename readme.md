# Inkscape presenter and Sketch Deck

Two ways to present from a drawing instead of from a slide tool:

* **Sketch Deck**, a Claude skill: you sketch slides by hand, Claude draws
  the finished slides.
* **Inkscape presenter**, the script it grew out of: present an Inkscape
  drawing in the browser, one layer per slide.

## Sketch Deck

You sketch a presentation by hand on a zoomable canvas: pen strokes for the
content, orange notes for instructions to Claude, typed text, and pasted
images as references for the look you want. Draw a frame around each slide.
When you say "done", Claude reads the sketch and draws the finished slides
into the same page, following the composition you sketched. You can then:

* present from the page, with build steps that reveal a slide one part at a
  time;
* reorder, insert and delete slides, and order each slide's build steps;
* switch between your sketch, Claude's slides, or both;
* download the deck as a standalone HTML presentation, or as an SVG for
  Inkscape.

The downloaded presentation is one file that works without claude.ai. Its
slide navigator (S) lets you hide and reorder slides for an audience, and
save that version as its own file.

### Install

Sketch Deck runs on claude.ai artifacts: the canvas saves to the artifact's
database, so it needs Claude with the Artifact tools. The helper scripts need
Python 3 with Playwright and Chromium.

Install it in Claude Code from this repository's plugin marketplace:

	/plugin marketplace add ako/inkscape-presenter
	/plugin install sketch-deck@inkscape-presenter

Then ask Claude for a new sketch deck. To use it in the Claude apps instead,
zip the `plugins/sketch-deck/skills/sketch-deck` folder and upload it as a
skill in the settings.

### What's where

* `plugins/sketch-deck/skills/sketch-deck/`: the skill. `SKILL.md` tells
  Claude how to run it, `template/sketch-deck.html` is the canvas page every
  deck starts from, and `scripts/` holds the helpers that render a sketch for
  Claude and draw the finished slides.
* `plugins/sketch-deck/examples/sketch-deck-example/`: an example deck, as a
  standalone presentation, an Inkscape SVG and its sketch data.

## How Inkscape presenter fits in

Inkscape presenter came first. It started from one question: can a single
Inkscape drawing be the presentation? Each slide is a set of layers, a
rectangle in the drawing marks the view for a slide, and the camera moves
over the drawing from slide to slide.

Sketch Deck keeps that idea and replaces Inkscape with a canvas you sketch on
and Claude draws in: slides are frames on one large drawing, build steps
reveal parts of a slide, and presenting moves the camera between frames.

The two meet in Sketch Deck's SVG download. It uses the presenter's
conventions: each slide is a layer `slide N`, its build steps are sublayers
`step N`, and the frames are rectangles `frame-1`, `frame-2` and so on. You
can open the download in Inkscape to edit it, and present it with
`svg-presenter.js` after adding a slide definition file and the script tags
(see [Use it](#use-it) below).

## Inkscape presenter

This script presents an Inkscape SVG drawing in the browser. For each slide
you list which layers to show; layers can be reused on several slides, and a
slide can show several layers. Slide layers are named starting with `slide`,
so layers with other names (backgrounds, helpers) are left alone.

Navigate by clicking or tapping (the right half goes forward, the left half
back), with the keyboard, or with a presenter remote. Dragging with the
mouse, a pen or a finger draws on the slide. The camera glides between the
frames of the slides, and the drawing scales to fit the window.

Keys:

* next (step or slide): right, down, page down, space, enter
* previous (step or slide): left, up, page up, backspace
* first / last: home or 0 / end
* f: fullscreen
* n or .: show or hide the notes

### Build steps

To let parts of a slide appear one at a time, put them in sublayers (or
groups) inside the slide layer and label them `step 1`, `step 2`, and so on.
Next and previous then go through the steps before moving to another slide;
going back shows the previous slide complete. Steps with the same number
appear together, and steps without a number come last. Steps play on the
slide where their layer first appears; a slide that repeats the layers of
the slide before it shows them complete. See the drawing1 demo.

### Use it

1. Draw your presentation in Inkscape, with separate layers for the slides,
   all in one drawing.
2. Save the drawing as an SVG (Inkscape's normal format).
3. Write a JavaScript file that defines the presentation: for each slide, the
   layers to show and, optionally, the id of a rectangle to zoom to
   (`display`), a title and notes. See the files in `demos/`.
4. Add script elements at the end of the SVG file that load `libs/dollar.js`
   (for the drawn navigation gestures), your presentation file and
   `svg-presenter.js`:

		<script type="text/ecmascript" xmlns:xlink="http://www.w3.org/1999/xlink"
		        xlink:href="svg-presenter.js"></script>

5. Open it in a browser, on its own or inside a page like the ones in
   `demos/` (tested in Chromium, Firefox, and Safari on iPad).

## Contributing

Report bugs and ideas as issues in this repository's GitHub project:
https://github.com/ako/inkscape-presenter/issues

## License

MIT, see [LICENSE](LICENSE). This covers the presenter and the Sketch Deck
skill.
