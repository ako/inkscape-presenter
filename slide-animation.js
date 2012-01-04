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

var slideshow = new Array();
var slideIdx = 0;
var slideCount = 4;
var inkscapeNS = "http://www.inkscape.org/namespaces/inkscape";

function initSlides(){
	slideshow[0] = ["slide 1"];
	slideshow[1] = ["slide 1","slide 2"];
	slideshow[2] = ["slide 1","slide 2","slide 3"];
	slideshow[3] = ["slide 4"];
	slideshow[4] = ["slide 4","slide 5"];
	slideshow[5] = ["slide 4","slide 5","slide 6"];
	slideshow[6] = ["slide 4","slide 5","slide 6","slide 7"];
	slideshow[7] = ["slide 8"];
	slideshow[8] = ["slide 8","slide 9"];
	slideshow[9] = ["slide 8","slide 9","slide 10"];
}

function showSlide(idx){
	console.log("showing slide: " + idx);
	var slides = document.getElementsByTagName("g");
	for ( var i =0; i<slides.length; i++){
		var groupName = slides[i].getAttributeNS(inkscapeNS,"label");

		if ( groupName.indexOf("slide") == 0 ){
			if ( slideshow[idx].indexOf(groupName) !== -1 ){
				slides[i].setAttribute("style","display:inline;");
			} else {
				slides[i].setAttribute("style","display:none;");
			}
		}
	}
}
function nextSlide(){
	console.log("nextSlide");
	slideIdx = ((slideIdx + 1 ) % slideCount) ;
	showSlide(slideIdx);
}
function previousSlide(){
	console.log("previousSlide");
	slideIdx = (slideIdx - 1 ) ;
	// workaround for javascript modulo behaviour
	slideIdx = ((slideIdx % slideCount)+slideCount) % slideCount
	showSlide(slideIdx);
}
function keypressed(e){
	console.log("keypressed: " + e);
	var keyCode = e.keyCode ? e.keyCode : e.charCode;
        // 37 - cursor left
	// 33 - logitech remote presentor back button
        // 39 - cursor right
	// 34 - logitech remote presentor forward button
	if(keyCode === 37 || keyCode === 33  ){
		previousSlide();
	} else if (keyCode === 39 || keyCode === 34 ){
		nextSlide();
	}
}
function mouseclicked(evt){
	console.log("mouseclicked: " + evt);
	var svgElem = document.getElementsByTagName("svg")[0];
	if ( evt.clientX < (svgElem.width.baseVal.value/2)){
		previousSlide();
	} else {
		nextSlide();
	}
}
function touchstart(evt){
	console.log("touchstart: " + evt);
	if(evt.touches.length == 1){
		var svgElem = document.getElementsByTagName("svg")[0];
		if ( evt.touches[0].pageX < (svgElem.width.baseVal.value/2)){
			previousSlide();
		} else {
			nextSlide();
		}
	}
}
// TODO: windowResized should resize the presentation to maximum
function windowResized(evt){
	console.log("windowResized: " + evt);
	var svgElem = document.getElementsByTagName("svg")[0];
	svgElem.setAttribute("width",window.innerWidth);
	svgElem.setAttribute("height",window.innerHeight);
	svgElem.setAttribute("viewBox","0 0 " + window.innerWidth + " " + window.innerHeight);
}
function init(evt){
	console.log("init: " + evt);
	initSlides();
	slideCount = slideshow.length;
	document.addEventListener('keydown',function(evt){keypressed(evt);});
	document.addEventListener('click',function(evt){mouseclicked(evt);});
	document.addEventListener('touchstart',function(evt){touchstart(evt);});
	window.addEventListener('resize',function(evt){windowResized(evt);});
	windowResized(null);
	showSlide(slideIdx)
}

document.getElementsByTagName("svg")[0].setAttribute("onload","init(evt)");

