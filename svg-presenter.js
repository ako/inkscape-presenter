// Svg presenter - Andrej Koelewijn
//
// Small proof of concept script to test if it's possible to directly use
// inkscape svg drawings for presentations. This script can be used to specify
// the which layers should be displayed for each slide of a presentation. You
// can reuse layers on multiple slides, displayed multiple layers on one slide.
// Script expects slide layers to be named starting with slide. This allows you
// to use non-slide layers.
//
// You can navigate your presentation by pressing the mouse button (chromium,
// firefox), or pressing cursor left, right (firefox) or by using a remote
// control (firefox).
//
// Include this script in your svg file at the end as follows:
//
// script type="text/ecmascript" xmlns:xlink="http://www.w3.org/1999/xlink"
//         xlink:href="presentation-definition.js"
// script type="text/ecmascript" xmlns:xlink="http://www.w3.org/1999/xlink"
//         xlink:href="svg-presenter.js"

(function() {
	var svgPresenter = window.svgPresenter = function() {};
	var svgp = svgPresenter;

	svgp.globals = {
		// current slide
		slideIdx: 0,
		// number of slides
		slideCount: 4,
		// array of layers to display per slide
		slides: [], 
		// names of all the layers (groups) used in the slides
		groupNames: [],
		inkscapeNS: 'http://www.inkscape.org/namespaces/inkscape',
		sodipodiNS: 'http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd',
		touchStartX: 0,
		touchStartY: 0,
		touchEndX: 0,
		touchEndY: 0
	};

	svgp.showSlide = function showSlide(idx) {
		var i, groupname;
		console.log('showing slide: ' + idx);
		var groups = document.getElementsByTagName('g');
		for (i = 0; i < groups.length; i++) {
			groupName = groups[i].getAttributeNS(svgp.globals.inkscapeNS, 'label');

			if (svgp.globals.groupNames.indexOf(groupName) !== -1) {
				if (svgp.globals.slides[idx].indexOf(groupName) !== -1) {
					groups[i].setAttribute('style', 'display:inline;');
				} else {
					groups[i].setAttribute('style', 'display:none;');
				}
			}
		}
	};

	svgp.initGroupNames = function() {
		var i, j;
		console.log('init groupNames');
		svgp.globals.groupNames = [];
		for (i = 0; i < svgp.globals.slides.length; i++) {
			for (j = 0; j < svgp.globals.slides[i].length; j++) {
				if (svgp.globals.groupNames.indexOf(svgp.globals.slides[i][j]) === -1) {
					svgp.globals.groupNames.push(svgp.globals.slides[i][j]);
				}
			}
		}
		console.log('All group names: ' + svgp.globals.groupNames);
	};

	svgp.nextSlide = function() {
		console.log('nextSlide');
		svgp.globals.slideIdx = ((svgp.globals.slideIdx + 1) % svgp.globals.slideCount);
		svgp.showSlide(svgp.globals.slideIdx);
	};

	svgp.previousSlide = function() {
		console.log('previousSlide');
		svgp.globals.slideIdx = (svgp.globals.slideIdx - 1);
		// workaround for javascript modulo behaviour
		svgp.globals.slideIdx = ((svgp.globals.slideIdx % svgp.globals.slideCount) + svgp.globals.slideCount) % svgp.globals.slideCount;
		svgp.showSlide(svgp.globals.slideIdx);
	};

	svgp.keypressed = function(e) {
		console.log('keypressed: ' + e);
		var keyCode = e.keyCode ? e.keyCode : e.charCode;
		// 37 - cursor left
		// 33 - logitech remote presentor back button
		// 39 - cursor right
		// 34 - logitech remote presentor forward button
		if (keyCode === 37 || keyCode === 33) {
			svgp.previousSlide();
		} else if (keyCode === 39 || keyCode === 34) {
			svgp.nextSlide();
		}
	};

	svgp.mouseclicked = function(evt) {
		console.log('mouseclicked: ' + evt);
		var svgElem = document.getElementsByTagName('svg')[0];
		if (evt.clientX < (svgElem.width.baseVal.value / 2)) {
			svgp.previousSlide();
		} else {
			svgp.nextSlide();
		}
	};

	svgp.touchstart = function(evt) {
		console.log('touchstart: ' + evt);
	};

	svgp.ontouchstart = function(evt) {
		console.log('ontouchstart: ' + evt + ', ' + evt.touches.length + ', ' + evt.changedTouches.length);
		if (evt.touches.length === 1) {
			svgp.globals.touchStartX = evt.touches[0].pageX;
			svgp.globals.touchStartY = evt.touches[0].pageY;
		}
	};

	svgp.ontouchend = function(evt) {
		console.log('ontouchend: ' + evt + ', ' + evt.touches.length + ', ' + evt.changedTouches.length);
		if (evt.changedTouches.length === 1) {
			svgp.globals.touchEndX = evt.changedTouches[0].pageX;
			svgp.globals.touchEndY = evt.changedTouches[0].pageY;

			if ((svgp.globals.touchEndX - svgp.globals.touchStartX > 100) || (svgp.globals.touchStartX - svgp.globals.touchEndX > 100)) {
				if (svgp.globals.touchEndX < svgp.touchStartX) {
					svgp.previousSlide();
				} else {
					svgp.nextSlide();
				}
			} else {
				var svgElem = document.getElementsByTagName('svg')[0];
				if (svgp.globals.touchEndX < (svgElem.width.baseVal.value / 2)) {
					svgp.previousSlide();
				} else {
					svgp.nextSlide();
				}
			}
		}
	};

	svgp.ontouchmove = function(evt) {
		console.log('ontouchmove: ' + evt + ', ' + evt.touches.length + ', ' + evt.changedTouches.length);
	};

	// TODO: windowResized should resize the presentation to maximum
	svgp.windowResized = function(evt) {
		console.log('windowResized: ' + evt);
		var svgElem = document.getElementsByTagName('svg')[0];
		var originalWidth = svgElem.width.animVal.value;
		var originalHeight = svgElem.height.animVal.value;
		var currentWidth = svgElem.clientWidth;
		var currentHeight = svgElem.clientHeight;
		var scaleRatioX = currentWidth / originalWidth;
		var scaleRatioY = currentHeight / originalHeight;
		var scaleRatio = Math.min(scaleRatioX,scaleRatioY);
		var groups = document.getElementsByTagName('g');
		for (i = 0; i < groups.length; i++) {
			groups[i].setAttribute('transform','scale(' + scaleRatio + ' ' + scaleRatio + ')');
		}
	};

	svgp.init = function(_slides) {
		console.log('init');
		svgp.globals.slides = _slides;
		svgp.initGroupNames();
		svgp.globals.slideCount = svgp.globals.slides.length;
		document.addEventListener('keydown', function(evt) {svgPresenter.keypressed(evt);});
		document.addEventListener('click', function(evt) {svgPresenter.mouseclicked(evt);});
		document.addEventListener('touchend', function(evt) {svgPresenter.ontouchend(evt);});
		document.addEventListener('touchmove', function(evt) {svgPresenter.ontouchmove(evt);});
		document.addEventListener('touchstart', function(evt) {svgPresenter.ontouchstart(evt);});
		//window.addEventListener('resize', function(evt) {svgPresenter.windowResized(evt);});
		svgp.windowResized(null);
		svgp.showSlide(svgp.globals.slideIdx);
	};
})();

