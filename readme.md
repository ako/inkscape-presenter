# Inkscape presenter

Small proof of concept script to test if it is possible to directly use 
inkscape svg drawings for presentations. This script can be used to specify
the which layers should be displayed for each slide of a presentation. You
can reuse layers on multiple slides, displayed multiple layers on one slide.
Script expects slide layers to be named starting with slide. This allows you
to use non-slide layers.

You can navigate your presentation by pressing the mouse button (chromium,
firefox), or pressing cursor left, right (firefox) or by using a remote
control (firefox).

Include this script in your svg file at the end as follows:

	<script type="text/ecmascript" xmlns:xlink="http://www.w3.org/1999/xlink" 
	        xlink:href="svg-presenter.js"></script>

## Instructions

1. draw your presentation in inkspace using separate layers for different slides, all slides in one drawing
2. save your drawing as an svg image (normal inkscape fileformat)
3. create a javascript file to define the structure of your presentation. You need to create a nested array containing the names of the layers you want to display for each slide. See the example.
4. add a script elements at the end of your svg file to load your presentation structure and the svg-presenter.js file
5. open in a browser (tested using chromium and firefox and safari on iPad)
6. press mousebutton to see next slide (or arrow keys, or page-up/page-down, or you can use touch on an iPad)

## Resources

1. A todo list is available on Trello https://trello.com/board/inkscape-presenter/4f11dfe8e8a775991e2dd427
