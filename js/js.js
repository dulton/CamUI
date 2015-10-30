
var request;

function doRequestAsync(v, func) {

	try {   request = new XMLHttpRequest();
	} catch(e) {
		try {   request = new ActiveXObject("MSXML2.XMLHTTP.3.0");;
		} catch(e) {
			try {   request = new ActieXObject("Msxml2.XMLHTTP");
			} catch(e) {
				try {   request = new ActiveXObject("Microsoft.XMLHTTP");
				} catch(e) {    alert("You cannot run this web");
					return false;
				}
			}
		}
	}

	try {

		request.onreadystatechange = func;
		request.open("GET", v , true, top.gAccount, top.gPwd) ;
		request.setRequestHeader("Cache-Control","no-cache");
		request.setRequestHeader("Content-Type", "text/plain;charset=utf-8");
		request.setRequestHeader("Pragma","no-cache");
		request.setRequestHeader("Expires","0");
		request.setRequestHeader("Last-Modified","Wed, 1 Jan 1997 00:00:00 GMT");
		request.setRequestHeader("If-Modified-Since","01");
		request.send();

	} catch(e) {
		alert(v +'\n'+ e.description);
	}
}

function doXMLDOMRequestAsync(v, func) {
	var url = "/cgi-bin/system?" ;
	url += "USER=" + top.gAccount + "&PWD=" + top.gPwd + "&";
	url += v;

	xmlhttp=new XMLHttpRequest();

	xmlhttp.open("GET", url , true) ;		
	xmlhttp.send();		
	return xmlhttp;
}

//-- getCookie ###########################################################################	
	function getCookie(c_name)
	{
		if (document.cookie.length>0){
			var c_start=document.cookie.indexOf(c_name + "=");
			if (c_start!=-1){ 
				c_start=c_start + c_name.length+1 ;
				c_end=document.cookie.indexOf(";",c_start);
				if (c_end==-1) c_end=document.cookie.length
				return unescape(document.cookie.substring(c_start,c_end));
			} 
		}
		return ""
	}

//-- setCookie ###########################################################################	
function setCookie(c_name,value,expiredays){
	var today = new Date();
	var exdate=new Date();
	exdate.setTime(today.getTime() + 1000*60*60*24*7);//keep for one week 
	document.cookie=c_name+ "=" +escape(value)+"; expires="+exdate.toUTCString();
}

//-- idget ###########################################################################		
	function idget(a){
		return document.getElementById(a);
	}
	
//-- doRequest ###########################################################################
	function doRequest(v) {
		if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
		  xmlhttp=new XMLHttpRequest();
		}else{// code for IE6, IE5
		  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
		
		xmlhttp.open("GET", v , false) ;
		xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xmlhttp.setRequestHeader("Pragma","no-cache");
		xmlhttp.setRequestHeader("Cache-Control","no-cache");
		xmlhttp.setRequestHeader("Expires","0");
		xmlhttp.setRequestHeader("Last-Modified","Wed, 1 Jan 1997 00:00:00 GMT");
		xmlhttp.setRequestHeader("If-Modified-Since","-1");
		xmlhttp.send();
		return xmlhttp.responseText;
	}

	function doRequestXML(v) {
		if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
		  xmlhttp=new XMLHttpRequest();
		}else{// code for IE6, IE5
		  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
		
		xmlhttp.open("GET", v , false) ;
		xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xmlhttp.setRequestHeader("Pragma","no-cache");
		xmlhttp.setRequestHeader("Cache-Control","no-cache");
		xmlhttp.setRequestHeader("Expires","0");
		xmlhttp.setRequestHeader("Last-Modified","Wed, 1 Jan 1997 00:00:00 GMT");
		xmlhttp.setRequestHeader("If-Modified-Since","-1");
		xmlhttp.send();
		return xmlhttp.responseXML;
	}		
	
//-- doSplitValue ###########################################################################		
	function doSplitValue( v ) {
    var r = new Array();
        r[0] = '' ;
        r[1] = '' ;

    if ( v.substr(0,4) != 'ERROR') {
		r[0]=v.slice(0, v.indexOf("="));
		r[1]=v.slice(v.indexOf("=")+1, v.length);
        if ( r[0].substr(r[0].length-1,1) == ' '){ r[0] = r[0].substr(0, r[0].length-1 ) ;}
        if ( r[1].substr(r[1].length-1,1) == '\''){ r[1] = r[1].substr(0, r[1].length-1 ) ;}
       	if ( r[1].substr(            0,1) == '\''){ r[1] = r[1].substr(1, r[1].length-1 ) ;}
    }else {
        r[0] = 'ERROR' ;
        r[1] = v.substr(6,v.length-6) ;
    }
    return r ;
	}

//-- V2doSplitValue ###########################################################################		
	function V2doSplitValue( v ) {
    var r = new Array();
        r[0] = '' ;
        r[1] = '' ;

    if ( v.substr(0,4) != 'ERROR') {
		
        if ( v.indexOf('=') >= 0 ) {
            t = v.split("'") ;        
			//alert(t[0]+','+t[1]);
            r[0] = t[0] ;
            r[1] = t[1] ;
            l = r[1].length ;
            if ( r[0].substr(r[0].length-1,1) == ' '){ r[0] = r[0].substr(0, r[0].length-1 ) ;}
            if ( r[1].substr(r[1].length-1,1) == '\''){ r[1] = r[1].substr(0, r[1].length-1 ) ;}
          	if ( r[1].substr(            0,1) == '\''){ r[1] = r[1].substr(1, r[1].length-1 ) ;}
        }
    }else {
        r[0] = 'ERROR' ;
        r[1] = v.substr(6,v.length-6) ;
    }
    return r ;
	}	
//##################################################################	
	function SetSelectedValue(e, v){
		var i;
		for(i=0; i<e.length; i++){
			if(e.options[i].value == v){
				e.selectedIndex=i;
			}
		}	
	}
		

//-- InsertSelectOptions_Number ###########################################################################
	function InsertSelectOptions_Number(obj, n_min, n_max){
		while (obj.options.length > 0 ) {
			obj.remove(0);
		}
		var nIdx;
		for(nIdx=n_min; nIdx<=n_max; nIdx++){
			//obj.add(new Option(nIdx, nIdx));
			var y=document.createElement('option');
			y.text=nIdx;
			y.value=nIdx;
			try{
				obj.add(y,null); // standards compliant
			}catch(ex){
				obj.add(y); // IE only
			}
		}
	}
	
	function InsertSelectOptions_Number_2(obj, n_min, n_max, str){
		while (obj.options.length > 0 ) {
			obj.remove(0);
		}
		var nIdx;
		for(nIdx=n_min; nIdx<=n_max; nIdx++){
			//obj.add(new Option(nIdx, nIdx));
			var y=document.createElement('option');
			y.text=nIdx+str;
			y.value=nIdx;
			//alert(y.value);
			try{
				obj.add(y,null); // standards compliant
			}catch(ex){
				obj.add(y); // IE only
			}
		}
	}
	

//-- SelectSetOption ###########################################################################
	function SelectSetOption(obj, v){
		var nIdx;
		for(nIdx=0; nIdx<obj.options.length; nIdx++) {
			if(obj.options[nIdx].value==v){
				obj.selectedIndex=nIdx;
				break;
			}
		}
	}	

		
	function frame_extent(){
	
		//alert(window.frameElement.height);		
		window.frameElement.height=document.body.scrollHeight+110;
		window.frameElement.width=document.body.scrollWidth;
		
	}		
	
	function UpdateSelectOptions(obj, items){
		selectedItem=obj.value;
		while (obj.options.length > 0 ) {
			obj.remove(0);
		}		
		items = items.split(",");
		for (i=0;i<items.length; i++) {
			var y=document.createElement('option');
			y.text=items[i];
			y.value=items[i].replace('.','');
			try{
				obj.add(y,null); // standards compliant
			}catch(ex){
				obj.add(y); // IE only
			}
			//alert(selectedItem + "; " + items[i]);
			if(selectedItem==items[i]){
				obj.selectedIndex=i;
			}
		}
	}
	
	function UpdateSelectOptionsWithId(obj, items, str){
		selectedItem=obj.value;
		while (obj.options.length > 0 ) {
			obj.remove(0);
		}		
		items = items.split(",");
		for (i=0;i<items.length; i++) {
			var y=document.createElement('option');
			y.text=items[i];
			y.value=items[i].replace('.','');
			y.id=str+items[i];
			try{
				obj.add(y,null); // standards compliant
			}catch(ex){
				obj.add(y); // IE only
			}
			//alert(selectedItem + "; " + items[i]);
			if(selectedItem==items[i]){
				obj.selectedIndex=i;
			}
		}
	}	
		
	function UpdateSelectOptions_2(obj, values, items){
		selectedItem=obj.value;
		while (obj.options.length > 0 ) {
			obj.remove(0);
		}		
		items = items.split(",");
		values = values.split(",");
		for (i=0;i<items.length; i++) {
			var y=document.createElement('option');
			y.text=items[i];
			y.value=values[i];
			try{
				obj.add(y,null); // standards compliant
			}catch(ex){
				obj.add(y); // IE only
			}
			//alert(selectedItem + "; " + items[i]);
			if(selectedItem==items[i]){
				obj.selectedIndex=i;
			}
		}
	}	

	