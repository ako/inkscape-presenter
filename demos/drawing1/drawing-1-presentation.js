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
		this.slides = [
			{ layers:["slide 1"]
			, display:"frame-titles"
			, notes:"Presentations should not contain long lists of bullet points"
			, title:"Beyond bullet points" 
			},
			{ layers:["slide 1","slide 2"]
			, display:"frame-titles"
			, notes:""
			, title:"Het Rotterdams GegevensMagazijn" 
			},
			{ layers:["slide 1","slide 2","slide 3"]
			, display:"frame-titles"
			, notes:""
			, title:"Het Rotterdams GegevensMagazijn" 
			},
			{ layers:["slide 4"]
			, display:"frame-titles"
			, notes:""
			, title:"Het Rotterdams GegevensMagazijn" 
			},
			{ layers:["slide 4","slide 5"]
			, display:"frame-titles"
			, notes:""
			, title:"Het Rotterdams GegevensMagazijn" 
			},
			{ layers:["slide 4","slide 5","slide 6"]
			, display:"frame-titles"
			, notes:""
			, title:"Het Rotterdams GegevensMagazijn" 
			},		
			{ layers:["slide 4","slide 5","slide 6","slide 7"]
			, display:"frame-titles"
			, notes:""
			, title:"Het Rotterdams GegevensMagazijn" 
			},
			{ layers:["slide 8"]
			, display:"frame-titles"
			, notes:""
			, title:"Het Rotterdams GegevensMagazijn" 
			},
			{ layers:["slide 8","slide 9"]
			, display:"frame-titles"
			, notes:""
			, title:"Het Rotterdams GegevensMagazijn" 
			},
			{ layers:["slide 8","slide 9","slide 10"]
			, display:"frame-titles"
			, notes:""
			, title:"Het Rotterdams GegevensMagazijn" 
			}];
		svgPresenter.init(this.slides,this.title);
	}
};

document.getElementsByTagName('svg')[0].setAttribute('onload', 'presentation.initSlides(evt)');

