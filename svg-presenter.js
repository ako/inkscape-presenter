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
		title: '',
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
		touchEndY: 0,
		lastViewbox: 0
	};

	svgp.showSlide = function showSlide(idx) {
		var i, groupname;
		console.log('showing slide: ' + idx);
		svgp.globals.slideIdx = idx;
		var groups = document.getElementsByTagName('g');
		for (i = 0; i < groups.length; i++) {
			groupName = groups[i].getAttributeNS(svgp.globals.inkscapeNS, 'label');

			if (svgp.globals.groupNames.indexOf(groupName) !== -1) {
				if (svgp.globals.slides[idx].layers.indexOf(groupName) !== -1) {
					groups[i].setAttribute('style', 'display:inline;');
				} else {
					groups[i].setAttribute('style', 'display:none;');
				}
			}
		}
		var viewportFrame = svgp.globals.slides[idx].display;
		var notes = svgp.globals.slides[idx].notes;

		// animate viewbox
		var viewportRect = document.getElementById(viewportFrame);
		console.log("changing viewbox to " + viewportFrame);
		var viewbox = viewportRect.getAttribute('x') + " " +
			 viewportRect.getAttribute('y') + " " +
			 viewportRect.getAttribute('width') + " " +
			 viewportRect.getAttribute('height') + " ";
		console.log("animating viewbox: " + svgp.globals.lastViewbox + ";" + viewbox);

		svgp.animateViewbox(svgp.globals.lastViewbox, viewbox );
		svgp.globals.lastViewbox = viewbox;

		// set title and notes
		if(top.setTitleAndNotes){
			top.setTitleAndNotes(svgp.globals.slides[idx].title,svgp.globals.slides[idx].notes,idx + 1,svgp.globals.slideCount);
		}

	};

	svgp.animateViewbox = function(startViewbox,endViewbox){
		if ( startViewbox == endViewbox ){
			return;
		}
		// build animate element
		var anim = document.getElementsByTagName("animate")[0];
		if ( document.getElementsByTagName("animate").length == 0){
			anim = document.createElementNS("http://www.w3.org/2000/svg", "animate");
		} else {
			anim = document.getElementById("anim");
		}
		anim.setAttribute("id","anim");
		anim.setAttribute("attributeName","viewBox");
		anim.setAttribute("dur","1s");
		anim.setAttribute("values",startViewbox  + ";" + endViewbox);
		anim.setAttribute("repeatCount","1");
		anim.setAttribute("begin","indefinite");
		anim.setAttribute("keyTimes","0;1");
		anim.setAttribute("keySplines","0 .75 0.25 1");
		anim.setAttribute("calcMode","spline");
		anim.setAttribute("fill","freeze");

		if(document.getElementsByTagName("animate").length == 0){
			document.getElementsByTagName("svg")[0].appendChild(anim);
		}
		anim.beginElement();
//		document.getElementsByTagName('svg')[0].setAttribute('viewBox',endViewbox);
	};

	// determine all unique groupnames
	svgp.initGroupNames = function() {
		var i, j;
		console.log('init groupNames');
		svgp.globals.groupNames = [];
		for (i = 0; i < svgp.globals.slides.length; i++) {
			for (j = 0; j < svgp.globals.slides[i].layers.length; j++) {
				if (svgp.globals.groupNames.indexOf(svgp.globals.slides[i].layers[j]) === -1) {
					svgp.globals.groupNames.push(svgp.globals.slides[i].layers[j]);
				}
			}
		}
		console.log('All group names: ' + svgp.globals.groupNames);
	};

	// show next slide
	svgp.nextSlide = function() {
		console.log('nextSlide');
		svgp.globals.slideIdx = ((svgp.globals.slideIdx + 1) % svgp.globals.slideCount);
		svgp.showSlide(svgp.globals.slideIdx);
		svgp.updateHistory();
	};

	// show previous slide
	svgp.previousSlide = function() {
		console.log('previousSlide');
		svgp.globals.slideIdx = (svgp.globals.slideIdx - 1);
		// workaround for javascript modulo behaviour
		svgp.globals.slideIdx = ((svgp.globals.slideIdx % svgp.globals.slideCount) + svgp.globals.slideCount) % svgp.globals.slideCount;
		svgp.showSlide(svgp.globals.slideIdx);
		svgp.updateHistory();
	};

	svgp.keypressed = function(e) {
		console.log('keypressed: ' + e);
		var keyCode = e.keyCode ? e.keyCode : e.charCode;
		console.log('keycode: ' + keyCode);
		//
		// 37 - cursor left
		// 33 - logitech remote presentor back button
		// 39 - cursor right
		// 34 - logitech remote presentor forward button
		// 70 - f - fullscreen
		// 78 - n - show/hide notes
		// 190 - logitech remote presentor black screen
		// 48 - 0 - reset to first slide
		//
		if (keyCode === 37 || keyCode === 33) {
			svgp.previousSlide();
		} else if (keyCode === 39 || keyCode === 34) {
			svgp.nextSlide();
		} else if (keyCode === 70 ) {
			svgp.toggleFullscreenMode();
		} else if (keyCode === 78 || keyCode === 190 ) {
			svgp.toggleNotes();
		} else if (keyCode === 48 ){
			svgp.globals.slideIdx = 0;
			svgp.showSlide(svgp.globals.slideIdx);
			svgp.updateHistory();
		}
	};
	
	svgp.updateHistory = function(){
		// modify history
		if(top.setUrlState){
			top.setUrlState(
				  svgp.globals.slideIdx
				, svgp.globals.title + " - " + svgp.globals.slideIdx 
				+ " - " + svgp.globals.slides[svgp.globals.slideIdx].title
			);
		}
	}
	// Toggle display of notes
	svgp.toggleNotes = function(){
		console.log("toggleNotes");
		top.toggleNotesMode();
	};

	// Toggle fullscreen mode for presentation, this is currently only
	// supported in chrome
	svgp.toggleFullscreenMode = function(){
		console.log('toggleFullScreenMode');
		var svgElem = document.getElementsByTagName('svg')[0];
		if ( svgElem.webkitRequestFullScreen ) {
			// TODO: this crashes chrome
			svgElem.webkitRequestFullScreen();
		}
	};

	svgp.mouseclicked = function(evt) {
		console.log('mouseclicked: ' + evt);
		if (evt.touches){
			return;
		}
		var svgElem = document.getElementsByTagName('svg')[0];
		if (evt.clientX < (svgElem.width.baseVal.value / 2)) {
			svgp.previousSlide();
		} else {
			svgp.nextSlide();
		}
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
		var distX;
		evt.stopPropagation();
		if (evt.changedTouches.length === 1) {

			svgp.globals.touchEndX = evt.changedTouches[0].pageX;
			svgp.globals.touchEndY = evt.changedTouches[0].pageY;

			distX = Math.abs(svgp.globals.touchEndX - svgp.globals.touchStartX);
			console.log('distX: ' + distX);

			if (distX > 100) {
				// finger moved for more than 100px
				if (svgp.globals.touchEndX < svgp.touchStartX) {
					// swipe from right to left
					svgp.nextSlide();
				} else {
					// swipe from left to right
					svgp.previousSlide();
				}
			} else {
				// finger moved for less than 100px,
				// test if left or right side of image was touchd
				var svgElem = document.getElementsByTagName('svg')[0];
				if (svgp.globals.touchEndX < (svgElem.width.baseVal.value / 2)) {
					svgp.previousSlide();
				} else {
					svgp.nextSlide();
				}
			}
		}
	};

	svgp.mousemove = function(evt){
		console.log("mousemove: " + evt.pageX + ", " + evt.pageY);
	};

	svgp.init = function(_slides,_title) {
		console.log('init:' + _title	);

		svgp.globals.slides = _slides;
		svgp.globals.title = _title;
		svgp.initGroupNames();
		svgp.globals.slideCount = svgp.globals.slides.length;
		console.log("Number of slides in deck: " + svgp.globals.slideCount);
		// entire svg drawing should fit inside viewport
		// gets the width and height of the original image, used to specify
        // that all of the image should be inside the viewport
		var svgElem = document.getElementsByTagName('svg')[0];
		console.log('setting viewbox, using width: ' 
			+ svgElem.width.animVal.value + ' and height: ' + svgElem.height.animVal.value );
		svgElem.setAttribute("preserveAspectRatio","xMinYMin meet");
		//svgElem.setAttribute('viewBox','0 0 ' + svgElem.width.animVal.value + ' ' + svgElem.height.animVal.value );
		svgp.globals.lastViewbox = '0 0 ' + svgElem.width.animVal.value + ' ' + svgElem.height.animVal.value;
		svgElem.setAttribute("width","1500px");

		svgElem.addEventListener('keydown', function(evt) {svgPresenter.keypressed(evt);});
		if ('ontouchstart' in window ){
			svgElem.addEventListener('touchend', function(evt) {svgPresenter.ontouchend(evt);});
			svgElem.addEventListener('touchstart', function(evt) {svgPresenter.ontouchstart(evt);});
			svgElem.addEventListener('touchmove', function(evt) {evt.stopPropagation();});
		} else {
			svgElem.addEventListener('click', function(evt) {svgPresenter.mouseclicked(evt);});
		}
		//svgElem.addEventListener('mousemove',function(evt) {svgPresenter.mousemove(evt);});
		if(top.getUrlSlideIdx){
			svgp.globals.slideIdx = top.getUrlSlideIdx();
		}
		svgp.showSlide(svgp.globals.slideIdx);
		if (svgElem.focus){
			svgElem.focus();
		}
		if(top){
			top.presentation = svgp;
		}
	};
})();

