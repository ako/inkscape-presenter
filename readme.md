# Inkscape presenter

Small proof of concept script to test if it is possible to directly use 
inkscape svg drawings for presentations. This script can be used to specify
the which layers should be displayed for each slide of a presentation. You
can reuse layers on multiple slides, displayed multiple layers on one slide.
Script expects slide layers to be named starting with slide. This allows you
to use non-slide layers.

You can navigate your presentation by clicking or tapping (right half goes
forward, left half goes back), with the keyboard, or with a presenter remote.
Dragging with the mouse, pen or a finger draws on the slide. The camera
glides between the frames of the slides, and the drawing scales to fit the
window.

Keys:

* next (step or slide): right, down, page down, space, enter
* previous (step or slide): left, up, page up, backspace
* first / last: home or 0 / end
* f: fullscreen
* n or .: show or hide the notes

## Build steps

To let parts of a slide appear one at a time, put them in sublayers (or
groups) inside the slide layer and label them `step 1`, `step 2`, and so on.
Next and previous then go through the steps before moving to another slide;
going back shows the previous slide complete. Steps with the same number
appear together, and steps without a number come last. Steps play on the
slide where their layer first appears; a slide that repeats the layers of the
slide before it shows them complete. See the drawing1 demo.

Include this script in your svg file at the end as follows:

	<script type="text/ecmascript" xmlns:xlink="http://www.w3.org/1999/xlink" 
	        xlink:href="svg-presenter.js"></script>

## Instructions

1. draw your presentation in inkspace using separate layers for different slides, all slides in one drawing
2. save your drawing as an svg image (normal inkscape fileformat)
3. create a javascript file to define the structure of your presentation. You need to create a nested array containing the names of the layers you want to display for each slide. See the example.
4. add a script elements at the end of your svg file to load your presentation structure and the svg-presenter.js file
5. open in a browser (tested using chromium and firefox and safari on iPad)
6. click or tap to see the next slide (or use the keys above, or a presenter remote)

## Sketch Deck skill

This repository also distributes Sketch Deck, a Claude skill that grew out of
this presenter. You sketch slides by hand on a zoomable canvas (pen, typed
notes and reference images), and Claude reads the sketch and draws the
finished slides into the same page, with build steps and a presenting mode.
The finished deck downloads as a standalone HTML presentation, whose slide
navigator lets you hide and reorder slides for an audience and save that
version as its own file, or as an SVG
with one Inkscape layer per slide and sublayers for its build steps.

It runs on claude.ai artifacts: the canvas saves to the artifact's database,
so it needs Claude with the Artifact tools. The helper scripts need Python 3
with Playwright and Chromium.

Install it in Claude Code from this repository's plugin marketplace:

	/plugin marketplace add ako/inkscape-presenter
	/plugin install sketch-deck@inkscape-presenter

Then ask Claude for a new sketch deck. To use it in the Claude apps instead,
zip the `plugins/sketch-deck/skills/sketch-deck` folder and upload it as a
skill in the settings.

The skill lives in `plugins/sketch-deck/skills/sketch-deck/`: `SKILL.md`, the
page in `template/sketch-deck.html` and the scripts in `scripts/`.

## License

MIT, see [LICENSE](LICENSE). This covers the presenter and the Sketch Deck
skill.

## Resources

1. A todo list is available on Trello https://trello.com/board/inkscape-presenter/4f11dfe8e8a775991e2dd427
