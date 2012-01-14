/*******************************************************************************
 * Svg presenter - Andrej Koelewijn
 *
 * Definition of svg groups to be used in slides of presentation
 *
 ******************************************************************************/

var presentation = {
	slides: new Array(),
	initSlides: function(evt) {
		this.slides[0] = ['font 1'];
		this.slides[1] = ['font 1', 'font 2'];
		this.slides[2] = ['font 1', 'font 2', 'font 3'];
		this.slides[3] = ['font 1', 'font 2', 'font 3','font 4'];
		svgPresenter.init(this.slides);
	}
};

document.getElementsByTagName('svg')[0].setAttribute('onload', 'presentation.initSlides(evt)');

