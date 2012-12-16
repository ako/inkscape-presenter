function toggleNotesMode(){
	console.log("toggleNotesMode");
	var notesDiv = document.getElementById("notes");
	if (notesDiv.style.display == "block"){
		notesDiv.style.display = "none";
	} else {
		notesDiv.style.display = "block";
	}
}
function setTitleAndNotes(title, notes,page,pages){
	console.log("setTitleAndNotes: " + title + ", "+ notes);
	document.getElementById("notesTitle").innerHTML = (title ? title : "");
	document.getElementById("notesContent").innerHTML = (notes ? notes : "");
	document.getElementById("pagecounter").innerHTML = page + "/" + pages;
}
function setUrlState(slideIdx,title){
	console.log("setUrlState: " + slideIdx)
	history.pushState({page:slideIdx},"Slide " + slideIdx,"#" + slideIdx);
	document.title = title;
}
function getUrlSlideIdx(){
	console.log("location hash: " + location.hash);
	if ( location.hash.indexOf("#") == 0){
		return parseInt(location.hash.substring(1));
	} else {
		return 0;
	}
}
var popStateListener = function () { 
	console.log("popStateListener");
	//var svgDoc = document.getElementById("presentation-2").getSVGDocument();
	//var svgRoot = svgDoc.documentElement;
	//console.log("svg doc: " + svgDoc + ", " + svgRoot);
	if (location.hash.length > 1){
		var slideIdx = parseInt(location.hash.substring(1));
		try{
			presentation.showSlide(slideIdx);
		} catch(e){}
		//console.log("history length: " + window.history.length);
		//console.log("current state: " + window.history.state.page);
	}
	console.log("done on hash change");
}

var onLoadListener = function(){
	window.addEventListener("popstate",popStateListener,false);
//	document.addEventListener('touchstart', function(evt) {evt.preventDefault();}, false);
//	document.addEventListener('touchmove', function(evt) {evt.preventDefault();}, false);
//	document.getElementById("presentation-2").getSVGDocument().documentElement.focus();
};
console.log("window: "+window);
console.log("window.onload: " + window.onload);
//window.onload(onLoadListener);
//window.onEventListener("load",window,function(){console.log("hi there!");});
onLoadListener();
