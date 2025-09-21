
$(document).ready(function () {

	const $wrapper = $("#map-wrapper");

	let currentTarget = null;
	let isDragging = false;
	let startX, startY, initialLeft = 0, initialTop = 0;

	let scale = 0.5;
	let translateX = 0;
	let translateY = 0;
	let minScale = 0.15;
	let maxScale = 1;
	let zoomIntensity = 0.2;


	//Show City Information (Iframe)
	$(".hotspots div").on("click", function (e) {
	  if (isDragging) return;
	  const target = $(this).data("target");

	  if (currentTarget === target) {
		hideIframe();
		currentTarget = null;
	  } else {
		showIframe(target);
		currentTarget = target;
	  }
	});


	//Function to close the iframe
	window.addEventListener("message", function (event) {
		if (event.data === "close-iframe") {
			$("#info-frame").attr("src", "");
			hideIframe()
			currentTarget = null;
		}
	});


	//Show and Hide Iframe
	function showIframe(src) {
		$("#iframe-container").show();
		$("#info-frame").attr("src", src);
		$("#info-frame").css("pointer-events", 'auto');
	}
	function hideIframe() {
		$("#iframe-container").hide();
		$("#info-frame").attr("src", "");
		$("#info-frame").css("pointer-events", 'none');
	}
  

	//update Transform function
	function updateTransform() {
		$wrapper.css("transform", `translate(${translateX}px, ${translateY}px) scale(${scale})`);
	}


	// Drag logic
	$wrapper.on("mousedown", function (e) {
		if (e.button !== 0) return;

		isDragging = false;
		startX = e.pageX;
		startY = e.pageY;
		const startTranslateX = translateX;
		const startTranslateY = translateY;

		$(document).on("mousemove.drag", function (e2) {
			isDragging = true;
			$wrapper.addClass("dragging");

			const dx = e2.pageX - startX;
			const dy = e2.pageY - startY;

			translateX = startTranslateX + dx;
			translateY = startTranslateY + dy;

			updateTransform();
		});

		$(document).on("mouseup.drag", function () {
			$(document).off(".drag");
			$wrapper.removeClass("dragging");

			setTimeout(() => {isDragging = false;}, 50);
		});

		e.preventDefault();
	});
  
	//Center Map
	function centerMap() {
		const windowWidth = $(window).width();
		const windowHeight = $(window).height();

		const mapWidth = $wrapper.outerWidth();
		const mapHeight = $wrapper.outerHeight();

		translateX = (windowWidth - mapWidth) / 2;
		translateY = (windowHeight - mapHeight) / 2;
		scale = 0.5;
	
		updateTransform();
	}
  

	let zoomTimeout;
	// Zoom logic
	$wrapper.on("wheel", function (e) {
		e.preventDefault();

		clearTimeout(zoomTimeout);
		zoomTimeout = setTimeout(() => {
			handleZoom(e);
		  }, 50);

	});

	function handleZoom(e) {
		const rect = $wrapper[0].getBoundingClientRect();
		const mouseX = (e.clientX - rect.left ) / scale;
		const mouseY = (e.clientY - rect.top ) / scale;

		const windowWidth = $(window).width()/2;
		const windowHeight = $(window).height()/2;
	
		const delta = e.originalEvent.deltaY;
		const zoomFactor = delta > 0 ? (1 - zoomIntensity) : (1 + zoomIntensity);
		const newScale = Math.min(Math.max(scale * zoomFactor, minScale), maxScale);

		let offsetX = 0; 
		let offsetY = 0;
		let isMaxScale = false;

		if(newScale != scale & !isMaxScale) {
			offsetX = (-translateX + windowWidth - mouseX) * (newScale/4);
			offsetY = (-translateY + windowHeight - mouseY) * (newScale/4);
		} 

		isMaxScale = newScale == scale ? true : false;
	
		translateX = delta < 0 ? (translateX + offsetX) : (translateX - offsetX);//-(mouseX - (windowWidth * newScale))  ; 
		translateY = delta < 0 ? (translateY + offsetY) : (translateY - offsetY);//-(mouseY - (windowHeight * newScale)) ;

	
		scale = newScale;
		updateTransform();
	}
 

	//Center Button
	document.getElementById('centerButton').addEventListener('click', () => {
		centerMap();
	});


	centerMap(); // Call on load
		

	//Enlarge City maps 
	window.addEventListener("message", (e) => {
		if(e.data.type === "zoomImage") {
			const overlay = document.createElement("div");
			overlay.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999;";
			const zoomedImg = document.createElement("img");
			zoomedImg.src = e.data.src;
			zoomedImg.style.cssText = "max-width:90vw; max-height:90vh";
			overlay.appendChild(zoomedImg);
			document.body.appendChild(overlay);
			overlay.addEventListener("click", () => overlay.remove());
		}
	});


});
