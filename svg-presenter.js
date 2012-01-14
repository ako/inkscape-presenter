/*******************************************************************************
 * Svg presenter - Andrej Koelewijn
 *
 * Small proof of concept script to test if it's possible to directly use
 * inkscape svg drawings for presentations. This script can be used to specify
 * the which layers should be displayed for each slide of a presentation. You
 * can reuse layers on multiple slides, displayed multiple layers on one slide.
 * Script expects slide layers to be named starting with slide. This allows you
 * to use non-slide layers.
 *
 * You can navigate your presentation by pressing the mouse button (chromium,
 * firefox), or pressing cursor left, right (firefox) or by using a remote
 * control (firefox).
 *
 * Include this script in your svg file at the end as follows:
 *
 * <script type="text/ecmascript" xmlns:xlink="http://www.w3.org/1999/xlink"
 *         xlink:href="presentation-definition.js"></script>
 * <script type="text/ecmascript" xmlns:xlink="http://www.w3.org/1999/xlink"
 *         xlink:href="svg-presenter.js"></script>
 *
 ******************************************************************************/

(function(){
	var svgPresenter = window.svgPresenter = function(){};
	var svgp = svgPresenter;
	var slideIdx = 0;
    var slideCount = 4;
	var slides = new Array();
	var groupNames = new Array();
	var inkscapeNS = 'http://www.inkscape.org/namespaces/inkscape';
	var touchStartX = 0;
	var touchStartY = 0;
	var touchEndX = 0;
	var touchEndY = 0;

	svgp.showSlide = function showSlide(idx) {
		console.log('showing slide: ' + idx);
		var groups = document.getElementsByTagName('g');
		for (var i = 0; i < groups.length; i++) {
			var groupName = groups[i].getAttributeNS(inkscapeNS, 'label');

			if (groupNames.indexOf(groupName) !== -1) {
				if (slides[idx].indexOf(groupName) !== -1) {
					groups[i].setAttribute('style', 'display:inline;');
				} else {
					groups[i].setAttribute('style', 'display:none;');
				}
			}
		}
	};

	svgp.initGroupNames = function() {
		console.log('init groupNames');
		groupNames = new Array();
		for (var i = 0; i < slides.length; i++) {
			for (var j = 0; j < slides[i].length; j++) {
				if (groupNames.indexOf(slides[i][j]) === -1) {
					groupNames.push(slides[i][j]);
				}
			}
		}
		console.log('All group names: ' + groupNames);
	};

	svgp.nextSlide = function() {
		console.log('nextSlide');
		slideIdx = ((slideIdx + 1) % slideCount);
		svgp.showSlide(slideIdx);
	};

	svgp.previousSlide = function() {
		console.log('previousSlide');
		slideIdx = (slideIdx - 1);
		// workaround for javascript modulo behaviour
		slideIdx = ((slideIdx % slideCount) + slideCount) % slideCount;
		svgp.showSlide(slideIdx);
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

	svgp.ontouchstart = function(evt){
		console.log('ontouchstart: ' + evt + ", " + evt.touches.length + ", " + evt.changedTouches.length);
		if ( evt.touches.length == 1 ){
			touchStartX = evt.touches[0].pageX;
			touchStartY = evt.touches[0].pageY;
		}
	};

	svgp.ontouchend = function(evt){
		console.log('ontouchend: ' + evt + ", " + evt.touches.length + ", " + evt.changedTouches.length );
		if ( evt.changedTouches.length == 1 ){
			touchEndX = evt.changedTouches[0].pageX;
			touchEndY = evt.changedTouches[0].pageY;
		
			if ( (touchEndX - touchStartX > 100) || (touchStartX - touchEndX > 100) ){
				if ( touchEndX < touchStartX ){
					svgp.previousSlide();			
				} else {
					svgp.nextSlide();
				}
			} else {
				var svgElem = document.getElementsByTagName('svg')[0];
				if ( touchEndX < (svgElem.width.baseVal.value / 2)) {
					svgp.previousSlide();
				} else {
					svgp.nextSlide();
				}
			}
		}
	};

	svgp.ontouchmove = function(evt){
		console.log('ontouchmove: ' + evt + ", " + evt.touches.length + ", " + evt.changedTouches.length);
	};

	// TODO: windowResized should resize the presentation to maximum
	svgp.windowResized = function(evt) {
		console.log('windowResized: ' + evt);
		var svgElem = document.getElementsByTagName('svg')[0];
		svgElem.setAttribute('width', window.innerWidth);
		svgElem.setAttribute('height', window.innerHeight);
		svgElem.setAttribute('viewBox', '0 0 ' + window.innerWidth + ' ' + window.innerHeight);
	};

	svgp.init = function(_slides) {
		console.log('init');
		//initSlides();
		slides = _slides;
		svgp.initGroupNames();
		slideCount = slides.length;
		document.addEventListener('keydown', function(evt) {svgPresenter.keypressed(evt);});
		document.addEventListener('click', function(evt) {svgPresenter.mouseclicked(evt);});
		document.addEventListener('touchend', function(evt) {svgPresenter.ontouchend(evt);});
		document.addEventListener('touchmove', function(evt) {svgPresenter.ontouchmove(evt);});
		document.addEventListener('touchstart', function(evt) {svgPresenter.ontouchstart(evt);});
		window.addEventListener('resize', function(evt) {svgPresenter.windowResized(evt);});
		svgp.windowResized(null);
		svgp.showSlide(slideIdx);
	}
})();

