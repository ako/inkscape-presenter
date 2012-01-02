# Inkscape presenter

Show inkscape layers as separate slides.

1. draw your presentation in inkspace using separate layers for different slides, all slides in one drawing
2. slide layers should be named starting 'slide...', eg. 'slide 1', 'slide 2'.
3. save your drawing as an svg image (normal inkscape fileformat)
4. edit the slide-animation.js file to define which layers to display for every slide.
5. add a script element at the end of your svg file to load the slide-animation.js file
6. open in a browser (tested using chromium and firefox)
7. press mousebutton to see next slide
