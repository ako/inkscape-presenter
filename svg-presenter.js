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
		touchStartX: 0,
		touchStartY: 0,
		touchEndX: 0,
		touchEndY: 0,
		lastViewbox: 0,
		lastViewboxX: 0,
		lastViewboxY: 0,
		lastViewboxWidth: 0,
		lastViewboxHeight: 0,
		points: [],
		touchPrevX: 0,
		touchPrevY: 0,
		drawingPoints: [],
		isDrawing: false,
		pathId: 0
	};

	svgp.recognizer =  new DollarRecognizer();
	svgp.recognizer.AddGesture("arrowleft",eval('[{"X":-168.7868918470627,"Y":0},{"X":-159.79404420561264,"Y":0.7514015454115679},{"X":-150.8743241201572,"Y":3.4770196219081413},{"X":-141.98366750979733,"Y":6.266049026866483},{"X":-133.21528065625375,"Y":9.28082189557199},{"X":-125.05953249577314,"Y":13.30130801542174},{"X":-116.62939664069185,"Y":16.91915636437966},{"X":-108.18782520088658,"Y":20.52132220764196},{"X":-99.92716708289169,"Y":24.395880637620905},{"X":-91.5428099069029,"Y":28.084191277530067},{"X":-83.07252771132124,"Y":31.643128700937723},{"X":-74.36848453123068,"Y":34.796898678767604},{"X":-65.62470172491146,"Y":37.88178974217516},{"X":-57.37018263505115,"Y":41.73027966359439},{"X":-49.29284761350374,"Y":45.85530256236336},{"X":-41.22681928334305,"Y":49.9950748094775},{"X":-33.16835919917915,"Y":54.144719679160914},{"X":-25.102958064818836,"Y":58.28350949186586},{"X":-16.338915540443935,"Y":61.32969921070941},{"X":-7.579132628456705,"Y":64.38402589998219},{"X":1.1646501778625122,"Y":67.46891696338974},{"X":9.897827117578686,"Y":70.57310844476342},{"X":18.52335555707836,"Y":73.87319726535247},{"X":27.148883996578007,"Y":77.17328608594141},{"X":35.77441243607771,"Y":80.4733749065303},{"X":44.691679595230795,"Y":83.13807079634506},{"X":53.812041215525966,"Y":85.37470979072492},{"X":62.87142322232225,"Y":87.77427517676261},{"X":72.03074238610785,"Y":89.79861640793962},{"X":81.21310815293734,"Y":89.22941031669791},{"X":80.48221846713031,"Y":82.1622113456649},{"X":76.5822164476946,"Y":75.08477339004713},{"X":73.40710904707808,"Y":67.74440106170721},{"X":70.91566141046874,"Y":60.227199826308436},{"X":68.42421377385935,"Y":52.709998590909606},{"X":66.04404192637432,"Y":45.168776087255935},{"X":63.61495881574561,"Y":37.63811212991237},{"X":61.47307581696353,"Y":30.057729751867953},{"X":59.85956829809024,"Y":22.381847535012525},{"X":57.10740961708311,"Y":14.967932464514774},{"X":53.74708174277336,"Y":7.691476153706446},{"X":51.79964088954742,"Y":0.06758611048866214},{"X":49.85220003632159,"Y":-7.556303932729179},{"X":47.904759183095706,"Y":-15.18019397594702},{"X":46.03923614901393,"Y":-22.816838317819162},{"X":44.425728630140696,"Y":-30.49272053467456},{"X":42.321343969610865,"Y":-38.07473205840947},{"X":39.60653573269005,"Y":-45.54001196164239},{"X":36.91974350575319,"Y":-53.01180433197251},{"X":34.42829586914385,"Y":-60.529005567371314},{"X":31.93684823253446,"Y":-68.04620680277014},{"X":29.51027327913411,"Y":-75.57757731154027},{"X":27.087998524294306,"Y":-83.1098870552232},{"X":24.722070840543523,"Y":-90.6539688933018},{"X":22.430966409922092,"Y":-98.21368289081303},{"X":20.000789262726613,"Y":-105.74388570382024},{"X":17.509341626117276,"Y":-113.26108693921907},{"X":15.080079192220609,"Y":-120.79171218578506},{"X":12.661321753231363,"Y":-128.323588719521},{"X":9.748779792463466,"Y":-135.7388463340439},{"X":6.547725750918971,"Y":-143.0734492397167},{"X":3.3016225466023457,"Y":-150.3954584713307},{"X":-0.5892385436535221,"Y":-157.48824481351767},{"X":-2.8858732546437977,"Y":-160.201383592060}]'));
	svgp.recognizer.AddGesture("arrowright",eval('[{"X":-180.77654235966554,"Y":0},{"X":-172.8919462402619,"Y":-2.6814572703660815},{"X":-165.42195648365518,"Y":-6.248416705562477},{"X":-157.9796369132929,"Y":-9.85163386137566},{"X":-150.24072244888924,"Y":-12.913591922695332},{"X":-142.5523078089413,"Y":-16.07335601062988},{"X":-135.18740107477458,"Y":-19.858286804991735},{"X":-127.34850628728475,"Y":-22.686663838236427},{"X":-119.52112167924173,"Y":-25.542480512502607},{"X":-111.73771103645134,"Y":-28.503128725356078},{"X":-104.04417732533798,"Y":-31.66274658014791},{"X":-96.37195262646506,"Y":-34.86953834771606},{"X":-88.740772654132,"Y":-38.16150314568344},{"X":-81.06518234510091,"Y":-41.34360507528342},{"X":-73.0631050321777,"Y":-43.73445392209561},{"X":-65.06102771925441,"Y":-46.1253027689078},{"X":-56.92493533292867,"Y":-48.07546970374261},{"X":-48.832482116777015,"Y":-50.155592854252745},{"X":-40.97516137777154,"Y":-52.93843711123853},{"X":-33.10053275841153,"Y":-55.674412272920335},{"X":-25.098455445488298,"Y":-58.065261119732554},{"X":-17.096378132565064,"Y":-60.45610996654477},{"X":-9.09430081964183,"Y":-62.846958813356935},{"X":-1.0344430195407313,"Y":-65.05000354767517},{"X":7.090270394218464,"Y":-67.04224786202079},{"X":15.082020500905799,"Y":-69.4183079592321},{"X":22.897166988750143,"Y":-72.30415724351974},{"X":30.864914033342075,"Y":-74.78591403895663},{"X":38.86699134626531,"Y":-77.1767628857688},{"X":46.86906865918854,"Y":-79.56761173258104},{"X":54.87114597211172,"Y":-81.9584605793932},{"X":62.612425701280245,"Y":-83.88002588042076},{"X":65.25950869807343,"Y":-76.61834974826093},{"X":64.74538720981434,"Y":-68.9369609085077},{"X":64.05191420669689,"Y":-61.126011474017986},{"X":63.432450732429686,"Y":-53.261062629773846},{"X":62.55453139590793,"Y":-45.414836883232596},{"X":61.000443062105376,"Y":-37.65922917602816},{"X":60.03588628385859,"Y":-29.8392350249552},{"X":59.6564321081446,"Y":-21.955338143790414},{"X":59.2610235409299,"Y":-14.072163048280572},{"X":58.833090497560136,"Y":-6.1904593783857536},{"X":58.31490881923321,"Y":1.6859908308991294},{"X":57.70482106238819,"Y":9.557091098176102},{"X":57.240566122955954,"Y":17.431686652360327},{"X":57.42303182985745,"Y":25.321782655948937},{"X":57.52081256151081,"Y":33.212187720116845},{"X":57.403543160236495,"Y":41.10337761675896},{"X":57.28627375896241,"Y":48.99456751340108},{"X":57.16900435768815,"Y":56.885757410043084},{"X":57.11484358987792,"Y":64.77671698966896},{"X":57.29730929677959,"Y":72.66681299325757},{"X":57.306098503851786,"Y":80.55499299081424},{"X":56.92664432813774,"Y":88.43888987197897},{"X":56.632643308648255,"Y":96.32341814625119},{"X":56.880176589512075,"Y":104.21194768905167},{"X":57.864603738910716,"Y":112.02646547142109},{"X":59.396171382373325,"Y":119.78602984340392},{"X":60.642621909713284,"Y":127.589674710358},{"X":61.83622439888126,"Y":135.40149014143873},{"X":63.13477738115529,"Y":143.19638505242114},{"X":65.01403635098285,"Y":150.87858739286145},{"X":66.84351761447863,"Y":158.56171856792923},{"X":69.22345764033446,"Y":166.11997411957924}]'));
	svgp.recognizer.AddGesture("lineleft",eval('[{"X":-125.00000000000011,"Y":null},{"X":-121.03174603174615,"Y":null},{"X":-117.06349206349218,"Y":null},{"X":-113.09523809523819,"Y":null},{"X":-109.12698412698424,"Y":null},{"X":-105.15873015873028,"Y":null},{"X":-101.1904761904763,"Y":null},{"X":-97.22222222222233,"Y":null},{"X":-93.25396825396837,"Y":null},{"X":-89.28571428571439,"Y":null},{"X":-85.31746031746043,"Y":null},{"X":-81.34920634920647,"Y":null},{"X":-77.3809523809525,"Y":null},{"X":-73.41269841269853,"Y":null},{"X":-69.44444444444456,"Y":null},{"X":-65.47619047619058,"Y":null},{"X":-61.507936507936606,"Y":null},{"X":-57.539682539682616,"Y":null},{"X":-53.57142857142864,"Y":null},{"X":-49.603174603174665,"Y":null},{"X":-45.63492063492069,"Y":null},{"X":-41.6666666666667,"Y":null},{"X":-37.69841269841274,"Y":null},{"X":-33.730158730158735,"Y":null},{"X":-29.76190476190476,"Y":null},{"X":-25.793650793650784,"Y":null},{"X":-21.82539682539681,"Y":null},{"X":-17.857142857142833,"Y":null},{"X":-13.888888888888857,"Y":null},{"X":-9.920634920634882,"Y":null},{"X":-5.952380952380878,"Y":null},{"X":-1.9841269841269025,"Y":null},{"X":1.984126984127073,"Y":null},{"X":5.9523809523810485,"Y":null},{"X":9.920634920635024,"Y":null},{"X":13.888888888889,"Y":null},{"X":17.857142857142975,"Y":null},{"X":21.82539682539695,"Y":null},{"X":25.793650793650954,"Y":null},{"X":29.76190476190493,"Y":null},{"X":33.73015873015888,"Y":null},{"X":37.698412698412824,"Y":null},{"X":41.6666666666668,"Y":null},{"X":45.634920634920746,"Y":null},{"X":49.60317460317469,"Y":null},{"X":53.57142857142867,"Y":null},{"X":57.539682539682616,"Y":null},{"X":61.50793650793659,"Y":null},{"X":65.47619047619054,"Y":null},{"X":69.44444444444449,"Y":null},{"X":73.41269841269846,"Y":null},{"X":77.38095238095241,"Y":null},{"X":81.34920634920636,"Y":null},{"X":85.31746031746033,"Y":null},{"X":89.28571428571425,"Y":null},{"X":93.25396825396822,"Y":null},{"X":97.2222222222222,"Y":null},{"X":101.19047619047612,"Y":null},{"X":105.1587301587301,"Y":null},{"X":109.12698412698407,"Y":null},{"X":113.09523809523805,"Y":null},{"X":117.06349206349196,"Y":null},{"X":121.03174603174594,"Y":null},{"X":124.99999999999991,"Y":null}]'));
    svgp.recognizer.AddGesture("lineright",eval('[{"X":-125.01708912397322,"Y":-1.4551915228366852e-11},{"X":-121.04819332481974,"Y":0.6186191252927529},{"X":-117.07929752566623,"Y":1.2372382506000577},{"X":-113.11040172651273,"Y":1.8558573759219144},{"X":-109.14150592735925,"Y":2.474476501243771},{"X":-105.17261012820576,"Y":3.093095626551076},{"X":-101.20371432905226,"Y":3.7117147518583806},{"X":-97.23481852989877,"Y":4.330333877165685},{"X":-93.26592273074527,"Y":4.948953002502094},{"X":-89.2970269315918,"Y":5.567572127809399},{"X":-85.3281311324383,"Y":6.186191253116704},{"X":-81.3592353332848,"Y":6.804810378424008},{"X":-77.39033953413133,"Y":7.423429503745865},{"X":-73.42144373497783,"Y":8.042048629067722},{"X":-69.45254793582436,"Y":8.660667754375027},{"X":-65.48365213667086,"Y":9.279286879682331},{"X":-61.514756337517355,"Y":9.897906004989636},{"X":-57.54586053836388,"Y":10.516525130326045},{"X":-53.57696473921038,"Y":11.13514425563335},{"X":-49.60806894005691,"Y":11.753763380940654},{"X":-45.63917314090341,"Y":12.372382506247959},{"X":-41.67027734174991,"Y":12.991001631569816},{"X":-37.70138154259641,"Y":13.609620756891672},{"X":-33.732485743442936,"Y":14.228239882198977},{"X":-29.763589944289464,"Y":14.846859007506282},{"X":-25.794694145135963,"Y":15.465478132828139},{"X":-21.825798345982463,"Y":16.084097258135444},{"X":-17.856902546828962,"Y":16.7027163834573},{"X":-13.88800674767549,"Y":17.321335508764605},{"X":-9.919110948522018,"Y":17.93995463407191},{"X":-5.950215149368518,"Y":18.558573759393767},{"X":-1.981319350215017,"Y":19.177192884715623},{"X":1.9875764489384835,"Y":19.795812010022928},{"X":5.956472248091956,"Y":20.414431135330233},{"X":9.925368047245428,"Y":21.03305026065209},{"X":13.894263846398928,"Y":21.651669385959394},{"X":17.86315964555243,"Y":22.27028851128125},{"X":21.8320554447059,"Y":22.888907636588556},{"X":25.80095124385943,"Y":23.507526761910412},{"X":29.769847043012874,"Y":24.126145887217717},{"X":33.7387428421664,"Y":24.744765012525022},{"X":37.707638641319875,"Y":25.36338413784688},{"X":41.67653444047335,"Y":25.982003263154184},{"X":45.645430239626876,"Y":26.60062238847604},{"X":49.61432603878035,"Y":27.219241513783345},{"X":53.58322183793388,"Y":27.8378606391052},{"X":57.55211763708735,"Y":28.456479764412506},{"X":61.52101343624082,"Y":29.075098889734363},{"X":65.4899092353943,"Y":29.693718015041668},{"X":69.45880503454777,"Y":30.312337140348973},{"X":73.4277008337013,"Y":30.93095626567083},{"X":77.39659663285477,"Y":31.549575390992686},{"X":81.36549243200824,"Y":32.16819451629999},{"X":85.33438823116177,"Y":32.786813641607296},{"X":89.30328403031524,"Y":33.4054327669146},{"X":93.27217982946871,"Y":34.02405189223646},{"X":97.24107562862224,"Y":34.642671017558314},{"X":101.20997142777577,"Y":35.26129014286562},{"X":105.16767370517289,"Y":-33.84013151707768},{"X":109.12047077536738,"Y":-133.49415794949164},{"X":113.07622347856625,"Y":-214.73870985713438},{"X":117.04511927771978,"Y":-214.12009073181252},{"X":121.0140150768733,"Y":-213.50147160650522},{"X":124.98291087602678,"Y":-212.88285248118336}]'));

	svgp.showSlide = function showSlide(idx) {
		var i, groupname;
		console.log('showing slide: ' + idx);
		svgp.globals.slideIdx = idx;
		var groups = document.getElementsByTagName('g');
		for (i = 0; i < groups.length; i++) {
			groupName = groups[i].getAttributeNS(svgp.globals.inkscapeNS, 'label');

			if (svgp.globals.groupNames.indexOf(groupName) !== -1) {
				if (svgp.globals.slides[idx].layers.indexOf(groupName) !== -1) {
					groups[i].setAttribute('style', 'display:inline;');
				} else {
					groups[i].setAttribute('style', 'display:none;');
				}
			}
		}
		var viewportFrame = svgp.globals.slides[idx].display;
		var notes = svgp.globals.slides[idx].notes;

		// animate viewbox
		var viewportRect = document.getElementById(viewportFrame);
		if(viewportRect){
			console.log("changing viewbox to " + viewportFrame);
			var viewbox = viewportRect.getAttribute('x') + " " +
				viewportRect.getAttribute('y') + " " +
				viewportRect.getAttribute('width') + " " +
				viewportRect.getAttribute('height') + " ";
			console.log("animating viewbox: " + svgp.globals.lastViewbox + ";" + viewbox);

			svgp.animateViewbox(svgp.globals.lastViewbox, viewbox );
			svgp.globals.lastViewbox = viewbox;
			svgp.globals.lastViewboxX = viewportRect.getAttribute('x');
			svgp.globals.lastViewboxY = viewportRect.getAttribute('y');
			svgp.globals.lastViewboxWidth = viewportRect.getAttribute('width');
			svgp.globals.lastViewboxHeight = viewportRect.getAttribute('height');
		}

		// set title and notes
		if(top.setTitleAndNotes){
	//		top.setTitleAndNotes(svgp.globals.slides[idx].title,svgp.globals.slides[idx].notes,idx + 1,svgp.globals.slideCount);
		}

		svgp.showViewBoxDrawingLayer("drawing-"+ svgp.globals.slideIdx);
	};

	/**
	* Show a layer on which user can draw with a pen. Layer should be the size
	* of the viewbox. Layer is created if missing.
	*/
	svgp.showViewBoxDrawingLayer = function(layerId){
		var viewBox = Sizzle("svg")[0].getAttribute("viewBox");
		var viewBoxCoors = [];
		if (viewBox){
			viewBoxCoords = viewBox.split(/\s+|,/);
		} else {
			viewBoxCoords = [0,0,Sizzle("svg")[0].getAttribute("width"),Sizzle("svg")[0].getAttribute("height")]; 
		}
		svgp.showDrawingLayer("drawing-" + svgp.globals.slideIdx
			, viewBoxCoords[0]
			, viewBoxCoords[1] 
			, viewBoxCoords[2] 
			, viewBoxCoords[3] 
			);
	}
	/**
	*
	*/
	svgp.showDrawingLayer = function(layerId,x,y,width,height){
		// hide existing layers
		var layers = Sizzle("g[id^=drawing]");
		console.log("found # drawing layers " + layers.length);
		for (var i=0; i < layers.length; i++){
			layers[i].setAttribute('style', 'display:none;');
		}

		//show active layer
		var layer = Sizzle("g[id=" + layerId + "]");
		console.log("found layer: " + layer);
		if (layer.length == 0){
			layer = document.createElementNS("http://www.w3.org/2000/svg","g");
			layer.setAttribute("id",layerId);
			layer.setAttribute("style","background-color: red;");

			var lastG = Sizzle("svg")[0];
			console.log("lastG: " + lastG.getAttribute("id"));
			lastG.appendChild(layer);
		} else {
			console.log("found layer: " + layer[0].getAttribute("id"));
			layer[0].setAttribute('style', 'display:inline;');
		}
	}

	svgp.animateViewbox = function(startViewbox,endViewbox){
		if ( startViewbox == endViewbox ){
			return;
		}
		// build animate element
		var anim = document.getElementsByTagName("animate")[0];
		if ( document.getElementsByTagName("animate").length == 0){
			anim = document.createElementNS("http://www.w3.org/2000/svg", "animate");
		} else {
			anim = document.getElementById("anim");
		}
		anim.setAttribute("id","anim");
		anim.setAttribute("attributeName","viewBox");
		anim.setAttribute("dur","1s");
		anim.setAttribute("values",startViewbox  + ";" + endViewbox);
		anim.setAttribute("repeatCount","1");
		anim.setAttribute("begin","indefinite");
		anim.setAttribute("keyTimes","0;1");
		anim.setAttribute("keySplines","0 .75 0.25 1");
		anim.setAttribute("calcMode","spline");
		anim.setAttribute("fill","freeze");

		if(document.getElementsByTagName("animate").length == 0){
			document.getElementsByTagName("svg")[0].appendChild(anim);
		}
		anim.beginElement();
//		document.getElementsByTagName('svg')[0].setAttribute('viewBox',endViewbox);
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

	svgp.keypressed = function(e) {
		console.log('keypressed: ' + e);
		var keyCode = e.keyCode ? e.keyCode : e.charCode;
		console.log('keycode: ' + keyCode);
		//
		// 37 - cursor left
		// 33 - logitech remote presentor back button
		// 39 - cursor right
		// 34 - logitech remote presentor forward button
		// 70 - f - fullscreen
		// 78 - n - show/hide notes
		// 190 - logitech remote presentor black screen
		// 48 - 0 - reset to first slide
		//
		if (keyCode === 37 || keyCode === 33) {
			svgp.previousSlide();
		} else if (keyCode === 39 || keyCode === 34) {
			svgp.nextSlide();
		} else if (keyCode === 70 ) {
			svgp.toggleFullscreenMode();
		} else if (keyCode === 78 || keyCode === 190 ) {
			svgp.toggleNotes();
		} else if (keyCode === 48 ){
			svgp.globals.slideIdx = 0;
			svgp.showSlide(svgp.globals.slideIdx);
			svgp.updateHistory();
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
		top.toggleNotesMode();
	};

	// Toggle fullscreen mode for presentation, this is currently only
	// supported in chrome
	svgp.toggleFullscreenMode = function(){
		console.log('toggleFullScreenMode');
		var svgElem = document.getElementsByTagName('svg')[0];
		if ( svgElem.webkitRequestFullScreen ) {
			// TODO: this crashes chrome
			svgElem.webkitRequestFullScreen();
		}
	};

	svgp.mouseclicked = function(evt) {
		console.log('mouseclicked: ' + evt);
		if (evt.touches){
			return;
		}
		// check if we're drawing instead of clicking next/previous
		if( svgp.globals.drawingPoints.length > 2){
			return;
		}
		var svgElem = document.getElementsByTagName('svg')[0];
		if (evt.clientX < (svgElem.width.baseVal.value / 2)) {
			svgp.previousSlide();
		} else {
			svgp.nextSlide();
		}
	};
	svgp.mousemove = function(evt){
		//console.log("mousemove: " + evt.pageX + ", " + evt.pageY);
		svgp.penMove(evt.pageX,evt.pageY);
	};
	svgp.ontouchmove = function(evt) {
		console.log('ontouchmove: ' + evt + ', ' + evt.touches.length + ', ' + evt.changedTouches.length);
		svgp.penMove(evt.touches[0].pageX,evt.touches[0].pageX);
	};
	svgp.penMove = function(penX,penY){
		if (Math.abs(svgp.globals.touchPrevX - penX) < 3 && Math.abs(svgp.globals.touchPrevY - penY) < 3) {
			return;
		}
		svgp.globals.touchPrevX = penX;
		svgp.globals.touchPrevY = penY;
		svgp.globals.points[svgp.globals.points.length] = new Point(penX,penY);
		
		// show 
		if(svgp.globals.isDrawing){
			var p = svgp.penToSvg(penX,penY);
			svgp.globals.drawingPoints[svgp.globals.drawingPoints.length] = p;

			var path = Sizzle("path[id=path-" + svgp.globals.pathId + "]");
			if( path.length == 0){
				// start new drawing path
				var path = document.createElementNS("http://www.w3.org/2000/svg","path");
				path.setAttribute("id", "path-" + svgp.globals.pathId);
				path.setAttribute("stroke-width","3");
				path.setAttribute("stroke","red");
				path.setAttribute("style","fill: transparent; opacity:0.3;");
				path.setAttribute("d","M " + p.X + " " + p.Y );
			} else {
				path = path[0];
				path.setAttribute("d", path.getAttribute("d") + " S " + p.X + " " + p.Y + " " + (parseInt(p.X) + 2) + " " + (parseInt(p.Y) + 2)   )
			}

			var lastG = Sizzle("g[id=drawing-" + svgp.globals.slideIdx + "]")[0];
			lastG.appendChild(path);					
		}
	}
	svgp.ontouchstart = function(evt) {
		evt.preventDefault();
		console.log('ontouchstart: ' + evt + ', ' + evt.touches.length + ', ' + evt.changedTouches.length);
		svgp.penDown(evt.touches[0].pageX,evt.touches[0].pageX);
		// svgp.globals.points = [];
		// var touch = evt.touches[0];
		// svgp.globals.touchPrevX = touch.pageX;
		// svgp.globals.touchPrevY = touch.pageY;

		// var p = new Point(touch.pageX,touch.pageY);
		// svgp.globals.drawingPoints = [];
		// svgp.globals.drawingPoints[0] = p;
		// svgp.globals.isDrawing = true;
	};
	svgp.mousedown = function(evt){
		console.log("mousedown: " + evt.pageX + ", " + evt.pageY);
		svgp.penDown(evt.pageX,evt.pageY);
		// var p = new Point(evt.pageX,evt.pageY);
		// svgp.globals.drawingPoints = [];
		// svgp.globals.drawingPoints[0] = p;
		// svgp.globals.isDrawing = true;
	};
	svgp.penDown = function(penX,penY){
		var p = new Point(penX,penY);
		svgp.globals.drawingPoints = [];
		svgp.globals.drawingPoints[0] = p;
		svgp.globals.isDrawing = true;		
	}
	svgp.ontouchend = function(evt) {
		console.log('ontouchend: ' + evt + ', ' + evt.touches.length + ', ' 
			+ evt.changedTouches.length + ", " + svgp.globals.points.length + ", " 
			+ svgp.recognizer.Recognize(svgp.globals.points));
		svgp.penUp(evt.touches[0].pageX,evt.touches[0].pageX);
		svgp.handleGesture();
	}
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
				svgp.globals.slideIdx = 0;
				svgp.showSlide(svgp.globals.slideIdx);
				svgp.updateHistory();
			}
		}
	};
	svgp.mouseup = function(evt){
		console.log("mouseup: " + evt.pageX + ", " + evt.pageY);
		svgp.penUp(evt.pageX,evt.pageY);
		svgp.handleGesture();
		// var p = new Point(evt.pageX,evt.pageY);
		// svgp.globals.drawingPoints[svgp.globals.drawingPoints.length] = p;
		// svgp.globals.isDrawing = false;
		// console.log("#points: " + svgp.globals.drawingPoints.length);
		// if(svgp.globals.drawingPoints.length > 2){
		// 	console.log("stopping propagation");
		// 	evt.stopPropagation();
		// 	svgp.globals.pathId = parseInt(svgp.globals.pathId) + 1;
		// }
	};
	svgp.penUp = function(penX,penY){
		var p = new Point(penX,penY);
		svgp.globals.drawingPoints[svgp.globals.drawingPoints.length] = p;
		svgp.globals.isDrawing = false;
		console.log("#points: " + svgp.globals.drawingPoints.length);
		// if(svgp.globals.drawingPoints.length > 2){
		// 	console.log("stopping propagation");
		// 	evt.stopPropagation();
		// }
		svgp.globals.pathId = parseInt(svgp.globals.pathId) + 1;
	}

	// translate mouse pixel coordinates to svg drawing coordinates
	svgp.penToSvg = function(penX,penY){
		var svg = Sizzle("svg")[0];
		var svgPoint = svg.createSVGPoint();
		svgPoint.x = penX;
		svgPoint.y = penY;
		var matrix = svg.getScreenCTM();
		svgPoint = svgPoint.matrixTransform(matrix.inverse());
		if(top.setTitleAndNotes){
			top.setTitleAndNotes("page: ", penX + "," + penY
				+ " svg point: " + svgPoint.x + ", "+ svgPoint.y
				,1,1);
		}    	
    	return new Point(svgPoint.x,svgPoint.y);
    };
	svgp.init = function(_slides,_title) {
		console.log('init:' + _title	);

		svgp.globals.slides = _slides;
		svgp.globals.title = _title;
		svgp.initGroupNames();
		svgp.globals.slideCount = svgp.globals.slides.length;
		console.log("Number of slides in deck: " + svgp.globals.slideCount);
		// entire svg drawing should fit inside viewport
		// gets the width and height of the original image, used to specify
        // that all of the image should be inside the viewport
		var svgElem = document.getElementsByTagName('svg')[0];
		console.log('setting viewbox, using width: ' 
			+ svgElem.width.animVal.value + ' and height: ' + svgElem.height.animVal.value );
		svgElem.setAttribute("preserveAspectRatio","xMinYMin meet");
		//svgElem.setAttribute('viewBox','0 0 ' + svgElem.width.animVal.value + ' ' + svgElem.height.animVal.value );
		svgp.globals.lastViewbox = '0 0 ' + svgElem.width.animVal.value + ' ' + svgElem.height.animVal.value;
		svgElem.setAttribute("width","1500px");

		svgElem.addEventListener('keydown', function(evt) {svgPresenter.keypressed(evt);});
		if ('ontouchstart' in window ){
			console.log("enabling touch event handlers");
			svgElem.addEventListener('touchend', function(evt) {svgPresenter.ontouchend(evt);});
			svgElem.addEventListener('touchstart', function(evt) {svgPresenter.ontouchstart(evt);});
			svgElem.addEventListener('touchmove', function(evt) {svgPresenter.ontouchmove(evt);});
		} else {
			console.log("enabling mouse click event handlers");
			svgElem.addEventListener('click', function(evt) {svgPresenter.mouseclicked(evt);},true);
			svgElem.addEventListener('mousedown', function(evt){svgPresenter.mousedown(evt);},true);
			svgElem.addEventListener('mouseup', function(evt){svgPresenter.mouseup(evt);},true);
			svgElem.addEventListener('mousemove', function(evt){svgPresenter.mousemove(evt);},true);
		}
		if(top.getUrlSlideIdx){
			svgp.globals.slideIdx = top.getUrlSlideIdx();
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

