/*
Source
function DefaultSubFrm(){
	var getFrm=document.getElementById('PTZSubFrame');
	var getDragDiv=document.getElementById("divDragResizeifrm");
	getFrm.style.top=getDragDiv.offsetTop+'px';
	getFrm.style.left=getDragDiv.offsetLeft+'px';
	getFrm.style.height=getDragDiv.offsetHeight+'px';
	getFrm.style.width=getDragDiv.offsetWidth+'px';
	getFrm.style.zIndex=getDragDiv.style.zIndex - 1;
}

function EnableSubFrm(){
	var getFrm=document.getElementById('PTZSubFrame');
	var getDragDiv=document.getElementById("divDragResizeifrm");
	getFrm.style.display='block';
	getFrm.style.top=getDragDiv.offsetTop+'px';
	getFrm.style.left=getDragDiv.offsetLeft+'px';
	getFrm.style.height=getDragDiv.offsetHeight+'px';
	getFrm.style.width=getDragDiv.offsetWidth+'px';
}

function DisableSubFrm(){
	document.getElementById('PTZSubFrame').style.display='none';
}

*/

function DefaultSubFrm(){var a=document.getElementById("PTZSubFrame"),b=document.getElementById("divDragResizeifrm");a.style.top=b.offsetTop+"px",a.style.left=b.offsetLeft+"px",a.style.height=b.offsetHeight+"px",a.style.width=b.offsetWidth+"px",a.style.zIndex=b.style.zIndex-1}function EnableSubFrm(){var a=document.getElementById("PTZSubFrame"),b=document.getElementById("divDragResizeifrm");a.style.display="block",a.style.top=b.offsetTop+"px",a.style.left=b.offsetLeft+"px",a.style.height=b.offsetHeight+"px",a.style.width=b.offsetWidth+"px"}function DisableSubFrm(){document.getElementById("PTZSubFrame").style.display="none"}function hasClass(a,b){return!!a.className.match(new RegExp("(\\s|^)"+b+"(\\s|$)"))}function addClass(a,b){hasClass(a,b)||(a.className+=" "+b)}function removeClass(a,b){if(hasClass(a,b)){var c=new RegExp("(\\s|^)"+b+"(\\s|$)");a.className=a.className.replace(c," ")}}function detIEMouseECM(){var a,b,c="",d="";if(parent.IsIE())if(document.documentMode<=8){var e=top.frames.main_frame.document.getElementById("current_ptz");a=hasClass(e,"mouse_ptz_on")?e:null,b=hasClass(e,"box_ptz_on")?e:null}else if(document.documentMode>8)a=top.frames.main_frame.document.getElementsByClassName("mouse_ptz_on")[0],b=top.frames.main_frame.document.getElementsByClassName("box_ptz_on")[0];else{var e=top.frames.main_frame.document.getElementById("current_ptz");a=hasClass(e,"mouse_ptz_on")?e:null,b=hasClass(e,"box_ptz_on")?e:null}else a=top.frames.main_frame.document.getElementsByClassName("mouse_ptz_on")[0],b=top.frames.main_frame.document.getElementsByClassName("box_ptz_on")[0];null!=a&&(c=a.id),null!=b&&(d=b.id),("ptz_on"==top.frames.main_frame.document.getElementById("ptz_icon").className||"current_ptz"==c||"current_ptz"==d)&&top.frames.main_frame.ECM_PTZ_Control()}