/*******************************************************************************
  
<script type="text/ecmascript" xmlns:xlink="http://www.w3.org/1999/xlink" 
  xlink:href="slide-animation.js"></script>

*******************************************************************************/

var slideshow = new Array();
var slideIdx = 0;
var slideCount = 4;
var inkscapeNS = "http://www.inkscape.org/namespaces/inkscape";

function initSlides(){
	slideshow[0] = ["slide 1"];
	slideshow[1] = ["slide 2"];
	slideshow[2] = ["slide 3","slide 2"];
	slideshow[3] = ["slide 4"];
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
function keypressed(evt){
	console.log("keypressed: " + evt);
	nextSlide();
}
function mouseclicked(evt){
	console.log("mouseclicked: " + evt);
	nextSlide();
}

function init(evt){
	console.log("init: " + evt);
	initSlides();
	slideCount = slideshow.length;
	document.getElementsByTagName("svg")[0].setAttribute("onkeypress","keypressed(evt)");
	document.getElementsByTagName("svg")[0].setAttribute("onclick","mouseclicked(evt)");
	showSlide(slideIdx)
}

document.getElementsByTagName("svg")[0].setAttribute("onload","init(evt)");



