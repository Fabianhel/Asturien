$(document).ready(function () {
	
	document.getElementById("close-btn").addEventListener("click", function () {
		window.parent.postMessage("#City-info-container", "*");
	});


	document.getElementById("City_Map").addEventListener("click", function () {
		window.parent.postMessage({ type: "zoomImage", src: document.getElementById("City_Map").src}, "*");
	});
	  
});
