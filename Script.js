
$(document).ready(function () {

	const $wrapper = $("#map-wrapper");

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

	window.addEventListener("message", function (event) {
		if (event.data === "close-iframe") {
			$("#info-frame").attr("src", "");
			hideIframe()
			currentTarget = null;
		}
	});

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
  

	// Drag logic
  	let currentTarget = null;
	let isDragging = false;
	let startX, startY, initialLeft = 0, initialTop = 0;
	
	let scale = 0.7;	
	
	$wrapper.on("mousedown", function (e) {
		if (e.button !== 0) return;

		isDragging = false;
		const offset = $wrapper.offset();
		startX = e.pageX;
		startY = e.pageY;
		initialLeft = parseInt($wrapper.css("left"), 10) || 0;
		initialTop = parseInt($wrapper.css("top"), 10) || 0;

		$(document).on("mousemove.drag", function (e2) {
			isDragging = true;
			$wrapper.addClass("dragging");

			const dx = e2.pageX - startX;
			const dy = e2.pageY - startY;

			$wrapper.css({
				left: initialLeft + dx,
				top: initialTop + dy
			});
		});

		$(document).on("mouseup.drag", function () {
			$(document).off(".drag");
			$wrapper.removeClass("dragging");

			setTimeout(() => {isDragging = false;}, 100);
		});

		e.preventDefault();
	});
  
	function centerMap() {
		const windowWidth = $(window).width();
		const windowHeight = $(window).height();

		const mapWidth = $wrapper.outerWidth();
		const mapHeight = $wrapper.outerHeight();

		const left = ((windowWidth - mapWidth) / 2);
		const top = ((windowHeight - mapHeight) / 2)-100;

		$wrapper.css({ left: left + "px", top: top + "px" });
		scale = 0.3;
		$wrapper.css("transform", `scale(${scale})`);
	}
  
	// Zoom logic
	const minScale = 0.05;
	const maxScale = 3;
	const zoomIntensity = 0.1;
	$("#main-content").on("wheel", function (e) {
		e.preventDefault(); // prevent default page scroll

		const delta = e.originalEvent.deltaY;
		console.log("delta:",delta);
		// Zoom out if delta > 0, zoom in if delta < 0
		if (delta > 0) {
			scale = Math.max(scale - zoomIntensity, minScale); // limit zoom out
		} 
		else {
			scale = Math.min(scale + zoomIntensity, maxScale); // limit zoom in
		}

		$wrapper.css("transform", `scale(${scale})`);
	});
 

	document.getElementById('centerButton').addEventListener('click', () => {
		centerMap();
	});


	centerMap(); // Call on load
		
});
