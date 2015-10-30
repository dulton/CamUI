	if(top.IsIE()){
		document.getElementById("oMedia").onmouseleave = function() {
			if(ptz_state==1){
				mouseScrollEnable();
				parent.focus();
			}
		};

		document.getElementById("oMedia").onmouseenter = function() {
			if(ptz_state==1){
				mouseScrollDisable();
			}
		};
	}

	var keys = {37: 1, 38: 1, 39: 1, 40: 1};

	function preventDefault(e) {
		e = e || window.event;
		if (e.preventDefault){
			e.preventDefault();
		}
		e.returnValue = false;  
	}

	function keyPreventExe(e) {
		if (keys[e.keyCode]) {
			preventDefault(e);
			return false;
		}
	}

	function mouseScrollDisable() {
		if (window.addEventListener){
			window.addEventListener('DOMMouseScroll', preventDefault, false);
		}
		window.onwheel = preventDefault;
		window.onmousewheel = document.onmousewheel = preventDefault;
		window.ontouchmove  = preventDefault;
		document.onkeydown  = keyPreventExe;
	}

	function mouseScrollEnable() {
		if (window.removeEventListener){
			window.removeEventListener('DOMMouseScroll', preventDefault, false);
		}
		window.onmousewheel = document.onmousewheel = null; 
		window.onwheel = null; 
		window.ontouchmove = null;  
		document.onkeydown = null;  
	}