/*******************************************************************************
 * Svg presenter - Andrej Koelewijn
 *
 * Definition of svg groups to be used in slides of presentation
 *
 ******************************************************************************/

var presentation = {
	slides: new Array(),
	title: 'Introduction to SVG presenter', 
	initSlides: function(evt) {
		// each slide layer holds "step N" sublayers that appear one at a time
		this.slides = [
			{ layers:["slide 1"]
			, display:"frame-titles"
			, notes:"Presentations should not contain long lists of bullet points"
			, title:"Beyond bullet points" 
			},
			{ layers:["slide 2"]
			, display:"frame-titles"
			, notes:""
			, title:"Het Rotterdams GegevensMagazijn" 
			},
			{ layers:["slide 3"]
			, display:"frame-titles"
			, notes:""
			, title:"Het Rotterdams GegevensMagazijn" 
			}];
		svgPresenter.init(this.slides,this.title);
	}
};

document.getElementsByTagName('svg')[0].setAttribute('onload', 'presentation.initSlides(evt)');

