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

var presentation = {
	slides : new Array(),
	initSlides : function (evt){
		this.slides[0] = ["slide 1"];
		this.slides[1] = ["slide 1","slide 2"];
		this.slides[2] = ["slide 1","slide 2","slide 3"];
		this.slides[3] = ["slide 4"];
		this.slides[4] = ["slide 4","slide 5"];
		this.slides[5] = ["slide 4","slide 5","slide 6"];
		this.slides[6] = ["slide 4","slide 5","slide 6","slide 7"];
		this.slides[7] = ["slide 8"];
		this.slides[8] = ["slide 8","slide 9"];
		this.slides[9] = ["slide 8","slide 9","slide 10"];
		inkscapePresenter.init(this.slides);
	}
}

document.getElementsByTagName("svg")[0].setAttribute("onload","presentation.initSlides(evt)");

