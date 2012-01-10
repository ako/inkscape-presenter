/*******************************************************************************
 * Inkscape presenter - Andrej Koelewijn
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
 *         xlink:href="slide-animation.js"></script>
 *
 ******************************************************************************/

var inkscapePresenter = {
	slideIdx   : 0,
	slideCount : 4,
	slides	   : new Array(),
	groupNames : new Array(),
	inkscapeNS : "http://www.inkscape.org/namespaces/inkscape",

	showSlide : function showSlide(idx){
		console.log("showing slide: " + idx);
		var groups = document.getElementsByTagName("g");
		for ( var i =0; i<groups.length; i++){
			var groupName = groups[i].getAttributeNS(this.inkscapeNS,"label");

			if ( this.groupNames.indexOf(groupName) !== -1 ){
				if ( this.slides[idx].indexOf(groupName) !== -1 ){
					groups[i].setAttribute("style","display:inline;");
				} else {
					groups[i].setAttribute("style","display:none;");
				}
			}
		}
	},
	initGroupNames : function (){
		console.log("init groupNames");
		this.groupNames = new Array();
		for ( var i=0; i<this.slides.length; i++){
			for ( var j=0; j<this.slides[i].length; j++){
				if(this.groupNames.indexOf(this.slides[i][j]) === -1){
					this.groupNames.push(this.slides[i][j]);
				} 
			}
		}
		console.log("All group names: " + this.groupNames);
	},
	nextSlide : function (){
		console.log("nextSlide");
		this.slideIdx = ((this.slideIdx + 1 ) % this.slideCount) ;
		this.showSlide(this.slideIdx);
	},
	previousSlide : function (){
		console.log("previousSlide");
		this.slideIdx = (this.slideIdx - 1 ) ;
		// workaround for javascript modulo behaviour
		this.slideIdx = ((this.slideIdx % this.slideCount)+this.slideCount) % this.slideCount
		this.showSlide(this.slideIdx);
	},
	keypressed : function (e){
		console.log("keypressed: " + e);
		var keyCode = e.keyCode ? e.keyCode : e.charCode;
		// 37 - cursor left
		// 33 - logitech remote presentor back button
		// 39 - cursor right
		// 34 - logitech remote presentor forward button
		if(keyCode === 37 || keyCode === 33  ){
			this.previousSlide();
		} else if (keyCode === 39 || keyCode === 34 ){
			this.nextSlide();
		}
	},
	mouseclicked : function (evt){
		console.log("mouseclicked: " + evt);
		var svgElem = document.getElementsByTagName("svg")[0];
		if ( evt.clientX < (svgElem.width.baseVal.value/2)){
			this.previousSlide();
		} else {
			this.nextSlide();
		}
	},
	touchstart : function (evt){
		console.log("touchstart: " + evt);
		if(evt.touches.length == 1){
			var svgElem = document.getElementsByTagName("svg")[0];
			if ( evt.touches[0].pageX < (svgElem.width.baseVal.value/2)){
				this.previousSlide();
			} else {
				this.nextSlide();
			}
		}
	},
	// TODO: windowResized should resize the presentation to maximum
	windowResized : function (evt){
		console.log("windowResized: " + evt);
		var svgElem = document.getElementsByTagName("svg")[0];
		svgElem.setAttribute("width",window.innerWidth);
		svgElem.setAttribute("height",window.innerHeight);
		svgElem.setAttribute("viewBox","0 0 " + window.innerWidth + " " + window.innerHeight);
	},
	init : function (_slides){
		console.log("init");
		//initSlides();
		this.slides = _slides;
		this.initGroupNames();
		this.slideCount = _slides.length;
		document.addEventListener('keydown',function(evt){inkscapePresenter.keypressed(evt);});
		document.addEventListener('click',function(evt){inkscapePresenter.mouseclicked(evt);});
		document.addEventListener('touchstart',function(evt){inkscapePresenter.touchstart(evt);});
		window.addEventListener('resize',function(evt){inkscapePresenter.windowResized(evt);});
		this.windowResized(null);
		this.showSlide(this.slideIdx)
	}
}

