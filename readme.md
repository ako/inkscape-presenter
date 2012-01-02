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
	        xlink:href="slide-animation.js"></script>

!!Instructions

1. draw your presentation in inkspace using separate layers for different slides, all slides in one drawing
2. slide layers should be named starting 'slide...', eg. 'slide 1', 'slide 2'.
3. save your drawing as an svg image (normal inkscape fileformat)
4. edit the slide-animation.js file to define which layers to display for every slide.
5. add a script element at the end of your svg file to load the slide-animation.js file
6. open in a browser (tested using chromium and firefox)
7. press mousebutton to see next slide
