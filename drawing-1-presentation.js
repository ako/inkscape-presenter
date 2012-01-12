/*******************************************************************************
 * Svg presenter - Andrej Koelewijn
 *
 * Definition of svg groups to be used in slides of presentation
 *
 ******************************************************************************/

var presentation = {
	slides: new Array(),
	initSlides: function(evt) {
		this.slides[0] = ['slide 1'];
		this.slides[1] = ['slide 1', 'slide 2'];
		this.slides[2] = ['slide 1', 'slide 2', 'slide 3'];
		this.slides[3] = ['slide 4'];
		this.slides[4] = ['slide 4', 'slide 5'];
		this.slides[5] = ['slide 4', 'slide 5', 'slide 6'];
		this.slides[6] = ['slide 4', 'slide 5', 'slide 6', 'slide 7'];
		this.slides[7] = ['slide 8'];
		this.slides[8] = ['slide 8', 'slide 9'];
		this.slides[9] = ['slide 8', 'slide 9', 'slide 10'];
		svgPresenter.init(this.slides);
	}
};

document.getElementsByTagName('svg')[0].setAttribute('onload', 'presentation.initSlides(evt)');

