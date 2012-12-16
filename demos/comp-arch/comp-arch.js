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
	slides: new Array(),
	title: 'Compositional Architecture', 
	initSlides: function(evt) {
		this.slides = [
			{ layers:["slide 1 - iteration-1"]
			, display:"frame-titles"
			, notes:"Presentations should not contain long lists of bullet points"
			, title:"Beyond bullet points" 
			},
			{ layers:["slide 1 - iteration-1", 'slide 2 - iteration-2']
			, display:"frame-titles"
			, notes:"Presentations should not contain long lists of bullet points"
			, title:"Beyond bullet points" 
			},
			{ layers:['slide 1 - iteration-1', 'slide 2 - iteration-2', 'slide 3 - iteration-3']
			, display:"frame-titles"
			, notes:"Presentations should not contain long lists of bullet points"
			, title:"Beyond bullet points" 
			},
			{ layers:['slide 1 - iteration-1', 'slide 2 - iteration-2', 'slide 3 - iteration-3', 'slide 4 - iteration-4']
			, display:"frame-titles"
			, notes:"Presentations should not contain long lists of bullet points"
			, title:"Beyond bullet points" 
			},
			{ layers:['slide 1 - iteration-1', 'slide 2 - iteration-2', 'slide 3 - iteration-3', 'slide 4 - iteration-4', 'slide 5 - iteration-n']
			, display:"frame-titles"
			, notes:"Presentations should not contain long lists of bullet points"
			, title:"Beyond bullet points" 
			},
			{ layers:['slide 1 - iteration-1', 'slide 2 - iteration-2', 'slide 3 - iteration-3', 'slide 4 - iteration-4', 'slide 5 - iteration-n','slide 6 - iteration 1', 'slide 6 - start']
			, display:"frame-titles"
			, notes:"Presentations should not contain long lists of bullet points"
			, title:"Beyond bullet points" 
			},
			{ layers:['slide 1 - iteration-1', 'slide 2 - iteration-2', 'slide 3 - iteration-3', 'slide 4 - iteration-4', 'slide 5 - iteration-n','slide 6 - iteration 1', 'slide 6 - start','slide 7 - iteration 2']
			, display:"frame-titles"
			, notes:"Presentations should not contain long lists of bullet points"
			, title:"Beyond bullet points" 
			},
			{ layers:['slide 1 - iteration-1', 'slide 2 - iteration-2', 'slide 3 - iteration-3', 'slide 4 - iteration-4', 'slide 5 - iteration-n','slide 6 - iteration 1', 'slide 6 - start','slide 7 - iteration 2','slide 8 - iteration 3', 'slide 8 - end']
			, display:"frame-titles"
			, notes:"Presentations should not contain long lists of bullet points"
			, title:"Beyond bullet points" 
			},
			{ layers:['slide 1 - iteration-1', 'slide 2 - iteration-2', 'slide 3 - iteration-3', 'slide 4 - iteration-4', 'slide 5 - iteration-n','slide 6 - iteration 1', 'slide 6 - start','slide 7 - iteration 2','slide 8 - iteration 3', 'slide 8 - end','slide 9 - iteration 1', 'slide 9 - start']
			, display:"frame-titles"
			, notes:"Presentations should not contain long lists of bullet points"
			, title:"Beyond bullet points" 
			},
			{ layers:['slide 1 - iteration-1', 'slide 2 - iteration-2', 'slide 3 - iteration-3', 'slide 4 - iteration-4', 'slide 5 - iteration-n','slide 6 - iteration 1', 'slide 6 - start','slide 7 - iteration 2','slide 8 - iteration 3', 'slide 8 - end','slide 9 - iteration 1', 'slide 9 - start','slide 10 - iteration 2', 'slide 10 - end']
			, display:"frame-titles"
			, notes:"Presentations should not contain long lists of bullet points"
			, title:"Beyond bullet points" 
			}];
		svgPresenter.init(this.slides,this.title);
	}
};

document.getElementsByTagName('svg')[0].setAttribute('onload', 'presentation.initSlides(evt)');

