/*******************************************************************************
 * Svg presenter - Andrej Koelewijn
 *
 * Definition of svg groups to be used in slides of presentation
 *
 ******************************************************************************/

var presentation = {
	slides: new Array(),
	initSlides: function(evt) {
		this.slides = [
			{ layers:["font 1"]
			, display:"frame-titles"
			, notes:"Presentations should not contain long lists of bullet points"
			, title:"Beyond bullet points" 
			},
			{ layers:["font 1","font 2"]
			, display:"frame-titles"
			, notes:"Presentations should not contain long lists of bullet points"
			, title:"Beyond bullet points" 
			},
			{ layers:["font 1","font 2","font 3"]
			, display:"frame-titles"
			, notes:"Presentations should not contain long lists of bullet points"
			, title:"Beyond bullet points" 
			},
			{ layers:["font 1","font 2","font 3","font 4"]
			, display:"frame-titles"
			, notes:"Presentations should not contain long lists of bullet points"
			, title:"Beyond bullet points" 
			}];
		svgPresenter.init(this.slides,this.title);
	}
};

document.getElementsByTagName('svg')[0].setAttribute('onload', 'presentation.initSlides(evt)');

