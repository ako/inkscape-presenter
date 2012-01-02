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
	slideshow[1] = ["slide 1","slide 2"];
	slideshow[2] = ["slide 1","slide 2","slide 3"];
	slideshow[3] = ["slide 1","slide 2","slide 3","slide 4"];
	slideshow[4] = ["slide 1"];
	slideshow[5] = ["slide 2"];
	slideshow[6] = ["slide 3"];
	slideshow[7] = ["slide 4"];
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
	// fix for javascript modulo behaviour
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
        // These keycodes do not work in chromium
	if(keyCode === 37 || keyCode === 33  ){
		previousSlide();
	} else if (keyCode === 39 || keyCode === 34 ){
		nextSlide();
	}
}
function mouseclicked(evt){
	console.log("mouseclicked: " + evt);
	nextSlide();
}

function init(evt){
	console.log("init: " + evt);
	initSlides();
	slideCount = slideshow.length;
	document.addEventListener('keypress',function(evt){keypressed(evt);});
	document.addEventListener('click',function(evt){mouseclicked(evt);});
	showSlide(slideIdx)
}

document.getElementsByTagName("svg")[0].setAttribute("onload","init(evt)");

