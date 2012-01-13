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

var svgPresenter = {
	slideIdx: 0,
	slideCount: 4,
	slides: new Array(),
	groupNames: new Array(),
	inkscapeNS: 'http://www.inkscape.org/namespaces/inkscape',
	touchStartX: 0,
	touchStartY: 0,
	touchEndX: 0,
	touchEndY: 0,

	showSlide: function showSlide(idx) {
		console.log('showing slide: ' + idx);
		var groups = document.getElementsByTagName('g');
		for (var i = 0; i < groups.length; i++) {
			var groupName = groups[i].getAttributeNS(this.inkscapeNS, 'label');

			if (this.groupNames.indexOf(groupName) !== -1) {
				if (this.slides[idx].indexOf(groupName) !== -1) {
					groups[i].setAttribute('style', 'display:inline;');
				} else {
					groups[i].setAttribute('style', 'display:none;');
				}
			}
		}
	},
	initGroupNames: function() {
		console.log('init groupNames');
		this.groupNames = new Array();
		for (var i = 0; i < this.slides.length; i++) {
			for (var j = 0; j < this.slides[i].length; j++) {
				if (this.groupNames.indexOf(this.slides[i][j]) === -1) {
					this.groupNames.push(this.slides[i][j]);
				}
			}
		}
		console.log('All group names: ' + this.groupNames);
	},
	nextSlide: function() {
		console.log('nextSlide');
		this.slideIdx = ((this.slideIdx + 1) % this.slideCount);
		this.showSlide(this.slideIdx);
	},
	previousSlide: function() {
		console.log('previousSlide');
		this.slideIdx = (this.slideIdx - 1);
		// workaround for javascript modulo behaviour
		this.slideIdx = ((this.slideIdx % this.slideCount) + this.slideCount) % this.slideCount;
		this.showSlide(this.slideIdx);
	},
	keypressed: function(e) {
		console.log('keypressed: ' + e);
		var keyCode = e.keyCode ? e.keyCode : e.charCode;
		// 37 - cursor left
		// 33 - logitech remote presentor back button
		// 39 - cursor right
		// 34 - logitech remote presentor forward button
		if (keyCode === 37 || keyCode === 33) {
			this.previousSlide();
		} else if (keyCode === 39 || keyCode === 34) {
			this.nextSlide();
		}
	},
	mouseclicked: function(evt) {
		console.log('mouseclicked: ' + evt);
		var svgElem = document.getElementsByTagName('svg')[0];
		if (evt.clientX < (svgElem.width.baseVal.value / 2)) {
			this.previousSlide();
		} else {
			this.nextSlide();
		}
	},
	touchstart: function(evt) {
		console.log('touchstart: ' + evt);
	},
	ontouchstart: function(evt){
		console.log('ontouchstart: ' + evt + ", " + evt.touches.length + ", " + evt.changedTouches.length);
		if ( evt.touches.length == 1 ){
			this.touchStartX = evt.touches[0].pageX;
			this.touchStartY = evt.touches[0].pageY;
		}
	},
	ontouchend: function(evt){
		console.log('ontouchend: ' + evt + ", " + evt.touches.length + ", " + evt.changedTouches.length );
		if ( evt.changedTouches.length == 1 ){
			this.touchEndX = evt.changedTouches[0].pageX;
			this.touchEndY = evt.changedTouches[0].pageY;
		
			if ( (this.touchEndX - this.touchStartX > 100) || (this.touchStartX - this.touchEndX > 100) ){
				if ( this.touchEndX < this.touchStartX ){
					this.previousSlide();			
				} else {
					this.nextSlide();
				}
			} else {
				var svgElem = document.getElementsByTagName('svg')[0];
				if ( this.touchEndX < (svgElem.width.baseVal.value / 2)) {
					this.previousSlide();
				} else {
					this.nextSlide();
				}
			}
		}
	},
	ontouchmove: function(evt){
		console.log('ontouchmove: ' + evt + ", " + evt.touches.length + ", " + evt.changedTouches.length);
	},
	// TODO: windowResized should resize the presentation to maximum
	windowResized: function(evt) {
		console.log('windowResized: ' + evt);
		var svgElem = document.getElementsByTagName('svg')[0];
		svgElem.setAttribute('width', window.innerWidth);
		svgElem.setAttribute('height', window.innerHeight);
		svgElem.setAttribute('viewBox', '0 0 ' + window.innerWidth + ' ' + window.innerHeight);
	},
	init: function(_slides) {
		console.log('init');
		//initSlides();
		this.slides = _slides;
		this.initGroupNames();
		this.slideCount = _slides.length;
		document.addEventListener('keydown', function(evt) {svgPresenter.keypressed(evt);});
		document.addEventListener('click', function(evt) {svgPresenter.mouseclicked(evt);});
		document.addEventListener('touchend', function(evt) {svgPresenter.ontouchend(evt);});
		document.addEventListener('touchmove', function(evt) {svgPresenter.ontouchmove(evt);});
		document.addEventListener('touchstart', function(evt) {svgPresenter.ontouchstart(evt);});
		window.addEventListener('resize', function(evt) {svgPresenter.windowResized(evt);});
		this.windowResized(null);
		this.showSlide(this.slideIdx);
	}
};

