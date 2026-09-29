// Svg presenter - Andrej Koelewijn
//
// Small proof of concept script to test if it's possible to directly use
// inkscape svg drawings for presentations. This script can be used to specify
// the which layers should be displayed for each slide of a presentation. You
// can reuse layers on multiple slides, displayed multiple layers on one slide.
// Script expects slide layers to be named starting with slide. This allows you
// to use non-slide layers.
//
// You can navigate your presentation by pressing the mouse button (chromium,
// firefox), or pressing cursor left, right (firefox) or by using a remote
// control (firefox).
//
// Include this script in your svg file at the end as follows:
//
// script type="text/ecmascript" xmlns:xlink="http://www.w3.org/1999/xlink"
//         xlink:href="presentation-definition.js"
// script type="text/ecmascript" xmlns:xlink="http://www.w3.org/1999/xlink"
//         xlink:href="svg-presenter.js"

(function() {
	var svgPresenter = window.svgPresenter = function() {};
	var svgp = svgPresenter;

	svgp.globals = {
		title: '',
		// current slide
		slideIdx: 0,
		// number of slides
		slideCount: 4,
		// array of layers to display per slide
		slides: [],
		// names of all the layers (groups) used in the slides
		groupNames: [],
		inkscapeNS: 'http://www.inkscape.org/namespaces/inkscape',
		sodipodiNS: 'http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd',
		// current view of the drawing {x, y, w, h}; the svg viewBox follows it
		camera: null,
		drawingPoints: [],
		pathId: 0
	};

	svgp.recognizer =  new DollarRecognizer();
	svgp.recognizer.AddGesture("arrowleft",eval('[{"X":-168.7868918470627,"Y":0},{"X":-159.79404420561264,"Y":0.7514015454115679},{"X":-150.8743241201572,"Y":3.4770196219081413},{"X":-141.98366750979733,"Y":6.266049026866483},{"X":-133.21528065625375,"Y":9.28082189557199},{"X":-125.05953249577314,"Y":13.30130801542174},{"X":-116.62939664069185,"Y":16.91915636437966},{"X":-108.18782520088658,"Y":20.52132220764196},{"X":-99.92716708289169,"Y":24.395880637620905},{"X":-91.5428099069029,"Y":28.084191277530067},{"X":-83.07252771132124,"Y":31.643128700937723},{"X":-74.36848453123068,"Y":34.796898678767604},{"X":-65.62470172491146,"Y":37.88178974217516},{"X":-57.37018263505115,"Y":41.73027966359439},{"X":-49.29284761350374,"Y":45.85530256236336},{"X":-41.22681928334305,"Y":49.9950748094775},{"X":-33.16835919917915,"Y":54.144719679160914},{"X":-25.102958064818836,"Y":58.28350949186586},{"X":-16.338915540443935,"Y":61.32969921070941},{"X":-7.579132628456705,"Y":64.38402589998219},{"X":1.1646501778625122,"Y":67.46891696338974},{"X":9.897827117578686,"Y":70.57310844476342},{"X":18.52335555707836,"Y":73.87319726535247},{"X":27.148883996578007,"Y":77.17328608594141},{"X":35.77441243607771,"Y":80.4733749065303},{"X":44.691679595230795,"Y":83.13807079634506},{"X":53.812041215525966,"Y":85.37470979072492},{"X":62.87142322232225,"Y":87.77427517676261},{"X":72.03074238610785,"Y":89.79861640793962},{"X":81.21310815293734,"Y":89.22941031669791},{"X":80.48221846713031,"Y":82.1622113456649},{"X":76.5822164476946,"Y":75.08477339004713},{"X":73.40710904707808,"Y":67.74440106170721},{"X":70.91566141046874,"Y":60.227199826308436},{"X":68.42421377385935,"Y":52.709998590909606},{"X":66.04404192637432,"Y":45.168776087255935},{"X":63.61495881574561,"Y":37.63811212991237},{"X":61.47307581696353,"Y":30.057729751867953},{"X":59.85956829809024,"Y":22.381847535012525},{"X":57.10740961708311,"Y":14.967932464514774},{"X":53.74708174277336,"Y":7.691476153706446},{"X":51.79964088954742,"Y":0.06758611048866214},{"X":49.85220003632159,"Y":-7.556303932729179},{"X":47.904759183095706,"Y":-15.18019397594702},{"X":46.03923614901393,"Y":-22.816838317819162},{"X":44.425728630140696,"Y":-30.49272053467456},{"X":42.321343969610865,"Y":-38.07473205840947},{"X":39.60653573269005,"Y":-45.54001196164239},{"X":36.91974350575319,"Y":-53.01180433197251},{"X":34.42829586914385,"Y":-60.529005567371314},{"X":31.93684823253446,"Y":-68.04620680277014},{"X":29.51027327913411,"Y":-75.57757731154027},{"X":27.087998524294306,"Y":-83.1098870552232},{"X":24.722070840543523,"Y":-90.6539688933018},{"X":22.430966409922092,"Y":-98.21368289081303},{"X":20.000789262726613,"Y":-105.74388570382024},{"X":17.509341626117276,"Y":-113.26108693921907},{"X":15.080079192220609,"Y":-120.79171218578506},{"X":12.661321753231363,"Y":-128.323588719521},{"X":9.748779792463466,"Y":-135.7388463340439},{"X":6.547725750918971,"Y":-143.0734492397167},{"X":3.3016225466023457,"Y":-150.3954584713307},{"X":-0.5892385436535221,"Y":-157.48824481351767},{"X":-2.8858732546437977,"Y":-160.201383592060}]'));
	svgp.recognizer.AddGesture("arrowright",eval('[{"X":-180.77654235966554,"Y":0},{"X":-172.8919462402619,"Y":-2.6814572703660815},{"X":-165.42195648365518,"Y":-6.248416705562477},{"X":-157.9796369132929,"Y":-9.85163386137566},{"X":-150.24072244888924,"Y":-12.913591922695332},{"X":-142.5523078089413,"Y":-16.07335601062988},{"X":-135.18740107477458,"Y":-19.858286804991735},{"X":-127.34850628728475,"Y":-22.686663838236427},{"X":-119.52112167924173,"Y":-25.542480512502607},{"X":-111.73771103645134,"Y":-28.503128725356078},{"X":-104.04417732533798,"Y":-31.66274658014791},{"X":-96.37195262646506,"Y":-34.86953834771606},{"X":-88.740772654132,"Y":-38.16150314568344},{"X":-81.06518234510091,"Y":-41.34360507528342},{"X":-73.0631050321777,"Y":-43.73445392209561},{"X":-65.06102771925441,"Y":-46.1253027689078},{"X":-56.92493533292867,"Y":-48.07546970374261},{"X":-48.832482116777015,"Y":-50.155592854252745},{"X":-40.97516137777154,"Y":-52.93843711123853},{"X":-33.10053275841153,"Y":-55.674412272920335},{"X":-25.098455445488298,"Y":-58.065261119732554},{"X":-17.096378132565064,"Y":-60.45610996654477},{"X":-9.09430081964183,"Y":-62.846958813356935},{"X":-1.0344430195407313,"Y":-65.05000354767517},{"X":7.090270394218464,"Y":-67.04224786202079},{"X":15.082020500905799,"Y":-69.4183079592321},{"X":22.897166988750143,"Y":-72.30415724351974},{"X":30.864914033342075,"Y":-74.78591403895663},{"X":38.86699134626531,"Y":-77.1767628857688},{"X":46.86906865918854,"Y":-79.56761173258104},{"X":54.87114597211172,"Y":-81.9584605793932},{"X":62.612425701280245,"Y":-83.88002588042076},{"X":65.25950869807343,"Y":-76.61834974826093},{"X":64.74538720981434,"Y":-68.9369609085077},{"X":64.05191420669689,"Y":-61.126011474017986},{"X":63.432450732429686,"Y":-53.261062629773846},{"X":62.55453139590793,"Y":-45.414836883232596},{"X":61.000443062105376,"Y":-37.65922917602816},{"X":60.03588628385859,"Y":-29.8392350249552},{"X":59.6564321081446,"Y":-21.955338143790414},{"X":59.2610235409299,"Y":-14.072163048280572},{"X":58.833090497560136,"Y":-6.1904593783857536},{"X":58.31490881923321,"Y":1.6859908308991294},{"X":57.70482106238819,"Y":9.557091098176102},{"X":57.240566122955954,"Y":17.431686652360327},{"X":57.42303182985745,"Y":25.321782655948937},{"X":57.52081256151081,"Y":33.212187720116845},{"X":57.403543160236495,"Y":41.10337761675896},{"X":57.28627375896241,"Y":48.99456751340108},{"X":57.16900435768815,"Y":56.885757410043084},{"X":57.11484358987792,"Y":64.77671698966896},{"X":57.29730929677959,"Y":72.66681299325757},{"X":57.306098503851786,"Y":80.55499299081424},{"X":56.92664432813774,"Y":88.43888987197897},{"X":56.632643308648255,"Y":96.32341814625119},{"X":56.880176589512075,"Y":104.21194768905167},{"X":57.864603738910716,"Y":112.02646547142109},{"X":59.396171382373325,"Y":119.78602984340392},{"X":60.642621909713284,"Y":127.589674710358},{"X":61.83622439888126,"Y":135.40149014143873},{"X":63.13477738115529,"Y":143.19638505242114},{"X":65.01403635098285,"Y":150.87858739286145},{"X":66.84351761447863,"Y":158.56171856792923},{"X":69.22345764033446,"Y":166.11997411957924}]'));
	svgp.recognizer.AddGesture("lineleft",eval('[{"X":-125.00000000000011,"Y":null},{"X":-121.03174603174615,"Y":null},{"X":-117.06349206349218,"Y":null},{"X":-113.09523809523819,"Y":null},{"X":-109.12698412698424,"Y":null},{"X":-105.15873015873028,"Y":null},{"X":-101.1904761904763,"Y":null},{"X":-97.22222222222233,"Y":null},{"X":-93.25396825396837,"Y":null},{"X":-89.28571428571439,"Y":null},{"X":-85.31746031746043,"Y":null},{"X":-81.34920634920647,"Y":null},{"X":-77.3809523809525,"Y":null},{"X":-73.41269841269853,"Y":null},{"X":-69.44444444444456,"Y":null},{"X":-65.47619047619058,"Y":null},{"X":-61.507936507936606,"Y":null},{"X":-57.539682539682616,"Y":null},{"X":-53.57142857142864,"Y":null},{"X":-49.603174603174665,"Y":null},{"X":-45.63492063492069,"Y":null},{"X":-41.6666666666667,"Y":null},{"X":-37.69841269841274,"Y":null},{"X":-33.730158730158735,"Y":null},{"X":-29.76190476190476,"Y":null},{"X":-25.793650793650784,"Y":null},{"X":-21.82539682539681,"Y":null},{"X":-17.857142857142833,"Y":null},{"X":-13.888888888888857,"Y":null},{"X":-9.920634920634882,"Y":null},{"X":-5.952380952380878,"Y":null},{"X":-1.9841269841269025,"Y":null},{"X":1.984126984127073,"Y":null},{"X":5.9523809523810485,"Y":null},{"X":9.920634920635024,"Y":null},{"X":13.888888888889,"Y":null},{"X":17.857142857142975,"Y":null},{"X":21.82539682539695,"Y":null},{"X":25.793650793650954,"Y":null},{"X":29.76190476190493,"Y":null},{"X":33.73015873015888,"Y":null},{"X":37.698412698412824,"Y":null},{"X":41.6666666666668,"Y":null},{"X":45.634920634920746,"Y":null},{"X":49.60317460317469,"Y":null},{"X":53.57142857142867,"Y":null},{"X":57.539682539682616,"Y":null},{"X":61.50793650793659,"Y":null},{"X":65.47619047619054,"Y":null},{"X":69.44444444444449,"Y":null},{"X":73.41269841269846,"Y":null},{"X":77.38095238095241,"Y":null},{"X":81.34920634920636,"Y":null},{"X":85.31746031746033,"Y":null},{"X":89.28571428571425,"Y":null},{"X":93.25396825396822,"Y":null},{"X":97.2222222222222,"Y":null},{"X":101.19047619047612,"Y":null},{"X":105.1587301587301,"Y":null},{"X":109.12698412698407,"Y":null},{"X":113.09523809523805,"Y":null},{"X":117.06349206349196,"Y":null},{"X":121.03174603174594,"Y":null},{"X":124.99999999999991,"Y":null}]'));
    svgp.recognizer.AddGesture("lineright",eval('[{"X":-125.01708912397322,"Y":-1.4551915228366852e-11},{"X":-121.04819332481974,"Y":0.6186191252927529},{"X":-117.07929752566623,"Y":1.2372382506000577},{"X":-113.11040172651273,"Y":1.8558573759219144},{"X":-109.14150592735925,"Y":2.474476501243771},{"X":-105.17261012820576,"Y":3.093095626551076},{"X":-101.20371432905226,"Y":3.7117147518583806},{"X":-97.23481852989877,"Y":4.330333877165685},{"X":-93.26592273074527,"Y":4.948953002502094},{"X":-89.2970269315918,"Y":5.567572127809399},{"X":-85.3281311324383,"Y":6.186191253116704},{"X":-81.3592353332848,"Y":6.804810378424008},{"X":-77.39033953413133,"Y":7.423429503745865},{"X":-73.42144373497783,"Y":8.042048629067722},{"X":-69.45254793582436,"Y":8.660667754375027},{"X":-65.48365213667086,"Y":9.279286879682331},{"X":-61.514756337517355,"Y":9.897906004989636},{"X":-57.54586053836388,"Y":10.516525130326045},{"X":-53.57696473921038,"Y":11.13514425563335},{"X":-49.60806894005691,"Y":11.753763380940654},{"X":-45.63917314090341,"Y":12.372382506247959},{"X":-41.67027734174991,"Y":12.991001631569816},{"X":-37.70138154259641,"Y":13.609620756891672},{"X":-33.732485743442936,"Y":14.228239882198977},{"X":-29.763589944289464,"Y":14.846859007506282},{"X":-25.794694145135963,"Y":15.465478132828139},{"X":-21.825798345982463,"Y":16.084097258135444},{"X":-17.856902546828962,"Y":16.7027163834573},{"X":-13.88800674767549,"Y":17.321335508764605},{"X":-9.919110948522018,"Y":17.93995463407191},{"X":-5.950215149368518,"Y":18.558573759393767},{"X":-1.981319350215017,"Y":19.177192884715623},{"X":1.9875764489384835,"Y":19.795812010022928},{"X":5.956472248091956,"Y":20.414431135330233},{"X":9.925368047245428,"Y":21.03305026065209},{"X":13.894263846398928,"Y":21.651669385959394},{"X":17.86315964555243,"Y":22.27028851128125},{"X":21.8320554447059,"Y":22.888907636588556},{"X":25.80095124385943,"Y":23.507526761910412},{"X":29.769847043012874,"Y":24.126145887217717},{"X":33.7387428421664,"Y":24.744765012525022},{"X":37.707638641319875,"Y":25.36338413784688},{"X":41.67653444047335,"Y":25.982003263154184},{"X":45.645430239626876,"Y":26.60062238847604},{"X":49.61432603878035,"Y":27.219241513783345},{"X":53.58322183793388,"Y":27.8378606391052},{"X":57.55211763708735,"Y":28.456479764412506},{"X":61.52101343624082,"Y":29.075098889734363},{"X":65.4899092353943,"Y":29.693718015041668},{"X":69.45880503454777,"Y":30.312337140348973},{"X":73.4277008337013,"Y":30.93095626567083},{"X":77.39659663285477,"Y":31.549575390992686},{"X":81.36549243200824,"Y":32.16819451629999},{"X":85.33438823116177,"Y":32.786813641607296},{"X":89.30328403031524,"Y":33.4054327669146},{"X":93.27217982946871,"Y":34.02405189223646},{"X":97.24107562862224,"Y":34.642671017558314},{"X":101.20997142777577,"Y":35.26129014286562},{"X":105.16767370517289,"Y":-33.84013151707768},{"X":109.12047077536738,"Y":-133.49415794949164},{"X":113.07622347856625,"Y":-214.73870985713438},{"X":117.04511927771978,"Y":-214.12009073181252},{"X":121.0140150768733,"Y":-213.50147160650522},{"X":124.98291087602678,"Y":-212.88285248118336}]'));

	var svgNS = 'http://www.w3.org/2000/svg';
	var svgRoot = function() { return document.documentElement; };

	svgp.showSlide = function showSlide(idx) {
		var slide = svgp.globals.slides[idx];
		if (!slide) {
			return;
		}
		console.log('showing slide: ' + idx);
		svgp.globals.slideIdx = idx;
		var groups = document.getElementsByTagName('g');
		for (var i = 0; i < groups.length; i++) {
			var groupName = groups[i].getAttributeNS(svgp.globals.inkscapeNS, 'label');

			if (svgp.globals.groupNames.indexOf(groupName) !== -1) {
				if (slide.layers.indexOf(groupName) !== -1) {
					groups[i].setAttribute('style', 'display:inline;');
				} else {
					groups[i].setAttribute('style', 'display:none;');
				}
			}
		}

		// move the camera to the slide's frame
		var frame = slide.display && document.getElementById(slide.display);
		if (frame) {
			console.log('moving camera to ' + slide.display);
			svgp.flyTo({
				x: parseFloat(frame.getAttribute('x')) || 0,
				y: parseFloat(frame.getAttribute('y')) || 0,
				w: parseFloat(frame.getAttribute('width')),
				h: parseFloat(frame.getAttribute('height'))
			});
		}

		// set title and notes
		if(top.setTitleAndNotes){
	//		top.setTitleAndNotes(svgp.globals.slides[idx].title,svgp.globals.slides[idx].notes,idx + 1,svgp.globals.slideCount);
		}

		svgp.showDrawingLayer('drawing-' + svgp.globals.slideIdx);
	};

	/**
	* Show the layer the presenter draws on for the current slide, creating it
	* when missing. Drawing layers of other slides are hidden.
	*/
	svgp.showDrawingLayer = function(layerId){
		var layers = document.querySelectorAll('g[id^="drawing-"]');
		for (var i = 0; i < layers.length; i++) {
			layers[i].setAttribute('style', 'display:none;');
		}
		var layer = document.getElementById(layerId);
		if (!layer) {
			layer = document.createElementNS(svgNS, 'g');
			layer.setAttribute('id', layerId);
			svgRoot().appendChild(layer);
		}
		layer.setAttribute('style', 'display:inline;');
	};

	/*---------------- camera ----------------*/

	var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	var cameraFrame = 0;

	svgp.setCamera = function(view) {
		svgp.globals.camera = view;
		svgRoot().setAttribute('viewBox', [view.x, view.y, view.w, view.h].map(function(v) {
			return Math.round(v * 1000) / 1000;
		}).join(' '));
	};

	// Smooth zoom and pan between two views [centerX, centerY, width], after
	// van Wijk and Nuij, "Smooth and efficient zooming and panning" (2003):
	// long moves zoom out, travel and zoom back in.
	function interpolateZoom(p0, p1) {
		var rho = Math.SQRT2;
		var ux0 = p0[0], uy0 = p0[1], w0 = p0[2], ux1 = p1[0], uy1 = p1[1], w1 = p1[2];
		var dx = ux1 - ux0, dy = uy1 - uy0, d2 = dx * dx + dy * dy;
		var interpolate, S;
		if (d2 < 1e-12) {
			S = Math.log(w1 / w0) / rho;
			interpolate = function(t) { return [ux0 + t * dx, uy0 + t * dy, w0 * Math.exp(rho * t * S)]; };
		} else {
			var d1 = Math.sqrt(d2);
			var b0 = (w1 * w1 - w0 * w0 + 4 * d2) / (2 * w0 * 2 * d1);
			var b1 = (w1 * w1 - w0 * w0 - 4 * d2) / (2 * w1 * 2 * d1);
			var r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0);
			var r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
			S = (r1 - r0) / rho;
			interpolate = function(t) {
				var s = t * S, c0 = Math.cosh(r0);
				var u = w0 / (2 * d1) * (c0 * Math.tanh(rho * s + r0) - Math.sinh(r0));
				return [ux0 + u * dx, uy0 + u * dy, w0 * c0 / Math.cosh(rho * s + r0)];
			};
		}
		interpolate.duration = Math.abs(S) * 1000;
		return interpolate;
	}

	function easeInOut(t) {
		return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
	}

	// Animate the camera to a view {x, y, w, h}. The aspect ratio blends from
	// the old view to the new one; preserveAspectRatio keeps it letterboxed.
	svgp.flyTo = function(target, instant) {
		cancelAnimationFrame(cameraFrame);
		var from = svgp.globals.camera;
		if (!from || instant || reduceMotion) {
			svgp.setCamera(target);
			return;
		}
		var zoom = interpolateZoom(
			[from.x + from.w / 2, from.y + from.h / 2, from.w],
			[target.x + target.w / 2, target.y + target.h / 2, target.w]);
		if (!zoom.duration && from.h / from.w === target.h / target.w) {
			svgp.setCamera(target);
			return;
		}
		var aspect0 = from.h / from.w, aspect1 = target.h / target.w;
		var duration = Math.min(2000, Math.max(550, zoom.duration * 0.85));
		var t0 = performance.now();
		var step = function(now) {
			var k = Math.min(1, (now - t0) / duration);
			if (k === 1) {
				svgp.setCamera(target);
				return;
			}
			var e = easeInOut(k), view = zoom(e), w = view[2], h = w * (aspect0 + (aspect1 - aspect0) * e);
			svgp.setCamera({ x: view[0] - w / 2, y: view[1] - h / 2, w: w, h: h });
			cameraFrame = requestAnimationFrame(step);
		};
		cameraFrame = requestAnimationFrame(step);
	};

	// determine all unique groupnames
	svgp.initGroupNames = function() {
		var i, j;
		console.log('init groupNames');
		svgp.globals.groupNames = [];
		for (i = 0; i < svgp.globals.slides.length; i++) {
			for (j = 0; j < svgp.globals.slides[i].layers.length; j++) {
				if (svgp.globals.groupNames.indexOf(svgp.globals.slides[i].layers[j]) === -1) {
					svgp.globals.groupNames.push(svgp.globals.slides[i].layers[j]);
				}
			}
		}
		console.log('All group names: ' + svgp.globals.groupNames);
	};

	// show next slide
	svgp.nextSlide = function() {
		console.log('nextSlide');
		svgp.globals.slideIdx = ((svgp.globals.slideIdx + 1) % svgp.globals.slideCount);
		svgp.showSlide(svgp.globals.slideIdx);
		svgp.updateHistory();
	};

	// show previous slide
	svgp.previousSlide = function() {
		console.log('previousSlide');
		svgp.globals.slideIdx = (svgp.globals.slideIdx - 1);
		// workaround for javascript modulo behaviour
		svgp.globals.slideIdx = ((svgp.globals.slideIdx % svgp.globals.slideCount) + svgp.globals.slideCount) % svgp.globals.slideCount;
		svgp.showSlide(svgp.globals.slideIdx);
		svgp.updateHistory();
	};

	// jump to a slide by index
	svgp.goToSlide = function(idx) {
		svgp.globals.slideIdx = idx;
		svgp.showSlide(svgp.globals.slideIdx);
		svgp.updateHistory();
	};

	/*---------------- keyboard ----------------*/

	// Presenter remotes send PageUp / PageDown, and '.' for their black
	// screen button.
	var keyActions = {
		ArrowRight: function() { svgp.nextSlide(); },
		ArrowDown: function() { svgp.nextSlide(); },
		PageDown: function() { svgp.nextSlide(); },
		' ': function() { svgp.nextSlide(); },
		Enter: function() { svgp.nextSlide(); },
		ArrowLeft: function() { svgp.previousSlide(); },
		ArrowUp: function() { svgp.previousSlide(); },
		PageUp: function() { svgp.previousSlide(); },
		Backspace: function() { svgp.previousSlide(); },
		Home: function() { svgp.goToSlide(0); },
		'0': function() { svgp.goToSlide(0); },
		End: function() { svgp.goToSlide(svgp.globals.slideCount - 1); },
		f: function() { svgp.toggleFullscreenMode(); },
		n: function() { svgp.toggleNotes(); },
		'.': function() { svgp.toggleNotes(); }
	};

	svgp.keypressed = function(e) {
		if (e.ctrlKey || e.metaKey || e.altKey || e.defaultPrevented) {
			return;
		}
		var action = keyActions[e.key.length === 1 ? e.key.toLowerCase() : e.key];
		if (action) {
			e.preventDefault();
			action();
		}
	};

	svgp.updateHistory = function(){
		// modify browser history, so you can bookmark en link to specific slides
		if(top.setUrlState){
			top.setUrlState(
				  svgp.globals.slideIdx
				, svgp.globals.title + " - " + svgp.globals.slideIdx
				+ " - " + svgp.globals.slides[svgp.globals.slideIdx].title
			);
		}
	}
	// Toggle display of notes
	svgp.toggleNotes = function(){
		console.log("toggleNotes");
		if (top.toggleNotesMode) {
			top.toggleNotesMode();
		}
	};

	// Toggle fullscreen. Inside an html page the whole page goes fullscreen,
	// so the notes stay available; on its own the svg does.
	svgp.toggleFullscreenMode = function(){
		console.log('toggleFullScreenMode');
		var doc = document;
		try {
			if (window.frameElement) {
				doc = window.frameElement.ownerDocument;
			}
		} catch (e) {
			// the embedding page is on another origin
		}
		var el = doc.documentElement;
		var done = function(p) { if (p && p.catch) { p.catch(function() {}); } };
		if (doc.fullscreenElement || doc.webkitFullscreenElement) {
			done(doc.exitFullscreen ? doc.exitFullscreen() : doc.webkitExitFullscreen());
		} else if (el.requestFullscreen) {
			done(el.requestFullscreen());
		} else if (el.webkitRequestFullscreen) {
			el.webkitRequestFullscreen();
		}
	};

	/*---------------- pointer input: tap to navigate, drag to draw ----------------*/

	// how far a pointer may move, in pixels, and still count as a tap
	var TAP_SLOP = 8;
	var stroke = null;

	// smooth path through the points: quadratic curves between midpoints
	function strokePath(points) {
		var r = function(v) { return Math.round(v * 10) / 10; };
		var d = 'M' + r(points[0].X) + ' ' + r(points[0].Y);
		for (var i = 1; i < points.length - 1; i++) {
			var p = points[i], q = points[i + 1];
			d += 'Q' + r(p.X) + ' ' + r(p.Y) + ' ' + r((p.X + q.X) / 2) + ' ' + r((p.Y + q.Y) / 2);
		}
		var last = points[points.length - 1];
		return d + 'L' + r(last.X) + ' ' + r(last.Y);
	}

	svgp.pointerdown = function(evt) {
		if (!evt.isPrimary || evt.button > 0) {
			return;
		}
		svgRoot().setPointerCapture(evt.pointerId);
		stroke = {
			id: evt.pointerId,
			x0: evt.clientX, y0: evt.clientY,
			lastX: evt.clientX, lastY: evt.clientY,
			points: [svgp.penToSvg(evt.clientX, evt.clientY)],
			path: null
		};
	};

	svgp.pointermove = function(evt) {
		if (!stroke || evt.pointerId !== stroke.id) {
			return;
		}
		var events = evt.getCoalescedEvents ? evt.getCoalescedEvents() : [];
		if (!events.length) {
			events = [evt];
		}
		for (var i = 0; i < events.length; i++) {
			var e = events[i];
			if (Math.abs(stroke.lastX - e.clientX) < 3 && Math.abs(stroke.lastY - e.clientY) < 3) {
				continue;
			}
			stroke.lastX = e.clientX;
			stroke.lastY = e.clientY;
			stroke.points.push(svgp.penToSvg(e.clientX, e.clientY));
		}
		if (!stroke.path && Math.hypot(evt.clientX - stroke.x0, evt.clientY - stroke.y0) > TAP_SLOP) {
			stroke.path = document.createElementNS(svgNS, 'path');
			stroke.path.setAttribute('id', 'path-' + svgp.globals.pathId++);
			stroke.path.setAttribute('stroke-width', '3');
			stroke.path.setAttribute('stroke', 'red');
			stroke.path.setAttribute('stroke-linecap', 'round');
			stroke.path.setAttribute('stroke-linejoin', 'round');
			stroke.path.setAttribute('vector-effect', 'non-scaling-stroke');
			stroke.path.setAttribute('style', 'fill: none; opacity:0.3;');
			document.getElementById('drawing-' + svgp.globals.slideIdx).appendChild(stroke.path);
		}
		if (stroke.path) {
			stroke.path.setAttribute('d', strokePath(stroke.points));
		}
	};

	svgp.pointerup = function(evt) {
		if (!stroke || evt.pointerId !== stroke.id) {
			return;
		}
		var s = stroke;
		stroke = null;
		if (!s.path) {
			// a tap: left half goes back, right half goes forward
			var box = svgRoot().getBoundingClientRect();
			if (evt.clientX < box.left + box.width / 2) {
				svgp.previousSlide();
			} else {
				svgp.nextSlide();
			}
			return;
		}
		svgp.globals.drawingPoints = s.points;
		svgp.handleGesture();
	};

	svgp.pointercancel = function(evt) {
		if (stroke && evt.pointerId === stroke.id) {
			stroke = null;
		}
	};

	svgp.handleGesture = function(){
		console.log("handleGesture");
		if (svgp.globals.drawingPoints.length >= 10) {
			var result = svgp.recognizer.Recognize(svgp.globals.drawingPoints);
			console.log('recognizer: ' + result.Name);
			if(result.Name == "arrowright" || result.Name == "lineright" || result.Name == "check"){
				svgp.nextSlide();
			} else if (result.Name == "arrowleft" || result.Name == "lineleft" || result.Name == "triangle"){
				svgp.previousSlide();
			} else if (result.Name == "zig-zag") {
				svgp.toggleNotes();
			} else if (result.Name == "circle") {
				svgp.goToSlide(0);
			}
		}
	};

	// translate pointer (client) coordinates to svg drawing coordinates
	svgp.penToSvg = function(clientX, clientY){
		var svg = svgRoot();
		var svgPoint = svg.createSVGPoint();
		svgPoint.x = clientX;
		svgPoint.y = clientY;
		svgPoint = svgPoint.matrixTransform(svg.getScreenCTM().inverse());
		return new Point(svgPoint.x, svgPoint.y);
	};

	svgp.init = function(_slides,_title) {
		console.log('init:' + _title	);

		svgp.globals.slides = _slides;
		svgp.globals.title = _title;
		svgp.initGroupNames();
		svgp.globals.slideCount = svgp.globals.slides.length;
		console.log("Number of slides in deck: " + svgp.globals.slideCount);

		// Start from the whole drawing. From here on the viewBox is the
		// camera, and the svg fills the window (or the <object> holding it):
		// preserveAspectRatio keeps the view fitted whenever that resizes.
		var svgElem = svgRoot();
		var viewBox = svgElem.viewBox.baseVal;
		if (viewBox && viewBox.width) {
			svgp.setCamera({ x: viewBox.x, y: viewBox.y, w: viewBox.width, h: viewBox.height });
		} else {
			svgp.setCamera({ x: 0, y: 0, w: svgElem.width.baseVal.value, h: svgElem.height.baseVal.value });
		}
		svgElem.setAttribute('width', '100%');
		svgElem.setAttribute('height', '100%');
		svgElem.setAttribute('preserveAspectRatio', 'xMidYMid meet');
		svgElem.style.touchAction = 'none';
		svgElem.style.userSelect = 'none';
		svgElem.style.webkitUserSelect = 'none';

		window.addEventListener('keydown', svgp.keypressed);
		svgElem.addEventListener('pointerdown', svgp.pointerdown);
		svgElem.addEventListener('pointermove', svgp.pointermove);
		svgElem.addEventListener('pointerup', svgp.pointerup);
		svgElem.addEventListener('pointercancel', svgp.pointercancel);

		if(top.getUrlSlideIdx){
			var urlIdx = top.getUrlSlideIdx();
			if (urlIdx >= 0 && urlIdx < svgp.globals.slideCount) {
				svgp.globals.slideIdx = urlIdx;
			}
		}
		svgp.showSlide(svgp.globals.slideIdx);
		if (svgElem.focus){
			svgElem.focus();
		}
		if(top){
			top.presentation = svgp;
		}
	};
})();
