$(document).ready(function () {

	document.getElementById("close-btn").addEventListener("click", function () {
		window.parent.postMessage("#Map-info-container", "*");
	});




    var imageNodes = document.getElementsByTagName("img");
    for (var i=0; i<imageNodes.length; i++) {
        imageNodes[i].addEventListener("click", function(){
            window.parent.postMessage({type: "Maps", src: this.id}, "*");
        })
    }



});

