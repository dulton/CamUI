//---1st section of scripts ---//
	$(function(){		
		var _showTab = 0;
		$('ul.tabs li').eq(_showTab).addClass('active');
		$('.tab_content').hide().eq(_showTab).show();				
		$('ul.tabs li').click(function() {		
			var $this = $(this),
			_clickTab = $this.find('a').attr('href');			
			$this.addClass('active').siblings('.active').removeClass('active');			
			$(_clickTab).stop(false, true).fadeIn().siblings().hide();
			return false;
		}).find('a').focus(function(){
			this.blur();
		});
	});
//---1st section of scripts ---//


//---2nd section of scripts ---//
	var gPresetNum=32;
	var gAccount_PtzPreset = "admin";  //var gAccount_PtzPreset;
	var gPwd_PtzPreset = "123456";	//var gPwd_PtzPreset;
	var pattern = /^[0-9]*[1-9][0-9]*$/;
	var err1_PtzPreset = 'Error. Invalid settings.';
	var err0 = '1. Only ASCII A~Z, a~z, 0~9, minus sign (-), underscore (_), period (.) and space ( ) are allowed.\n';
		err0 += '2. The last character must not be a minus sign, underscore, period or space.\n';
		err0 += '3. The first character is allowed to either a letter or a digit.\n';
		err0 += '4. NULL string is allowed ';
	var gFocusMode;
	var LimitSetCount = 0;	
	var PresetObjList_PtzPreset ;
	var PTZ_CAP_SC = 0;
	var PTZ_CAP_TR = 0;
	var panel_onclick = 0;
	var home_onclick = 0;
	var cmd_PtzPreset;
	//-------------------------------------------------------------------------------------
	function GoHome()
	{
		var cmd = CMD_Encoder();
		cmd+="&MOVE=HOME";
		doRequest(cmd);
	}
	
	function GoLimitPoint(id){
		if(id==1)
			var cmd_PtzPreset="/cgi-bin/encoder?USER="+ gAccount_PtzPreset +"&PWD="+ gPwd_PtzPreset +"&POSITION=ABSOLUTE,"+idget("Point1").value+",5,5";
		if(id==2)
			var cmd_PtzPreset="/cgi-bin/encoder?USER="+ gAccount_PtzPreset +"&PWD="+ gPwd_PtzPreset +"&POSITION=ABSOLUTE,"+idget("Point2").value+",5,5";
		var ss=doRequest(cmd_PtzPreset);
	}
	
	function DoLimitPointSet(id){
		if(LimitSetCount<2)
			LimitSetCount +=1;
		var cmd_PtzPreset="/cgi-bin/encoder?USER="+ gAccount_PtzPreset +"&PWD="+ gPwd_PtzPreset +"&POSITION_GET";
		var szReturn = doRequest(cmd_PtzPreset);
		szReturn = szReturn.split('\n') ;
		szTmp = top.doSplitValue(szReturn[0]) ;
		if(id==1){
			idget("Point1").value= szTmp[1];
			idget("LimitGo_1").style.display = "";						
		}	
		if(id==2){
			idget("Point2").value= szTmp[1];	
			idget("LimitGo_2").style.display = "";
		}					
		
		if(LimitSetCount==2)
			DoMoveLimit(1);
	}
	
	function DoMoveLimit(id){
		if(id==0){
			var cmd_PtzPreset="/cgi-bin/encoder?USER="+ gAccount_PtzPreset +"&PWD="+ gPwd_PtzPreset +"&MOVE_LIMIT=CLEAR";
			idget("Point1").value= null;
			idget("Point2").value= null;
			idget("LimitGo_1").style.display = "none";	
			idget("LimitGo_2").style.display = "none";
			LimitSetCount = 0;
		}
		else
			var cmd_PtzPreset="/cgi-bin/encoder?USER="+ gAccount_PtzPreset +"&PWD="+ gPwd_PtzPreset +"&MOVE_LIMIT=SET,"+idget("Point1").value+","+idget("Point2").value;	
		
		var szReturn = doRequest(cmd_PtzPreset);
	}
	
	function DoRotate(Dir){
		var cmd_PtzPreset = CMD_Encoder();
		cmd_PtzPreset+="&FISHEYE_ROTATE=";	
		
		if(isNaN(idget('RotateStep').value) == true){
			alert(err1_PtzPreset);
			return;
		}	
		
		var tmp = parseInt(idget('RotateStep').value,10);
		if(tmp > 180 || tmp < 0){
			alert(err1_PtzPreset);
			return;
		}

		if(Dir=="L")
			cmd_PtzPreset+="-";
		cmd_PtzPreset+=tmp;
		doRequest(cmd_PtzPreset);

	}

	//-------------------------------------------------------------------------------------			
	function PtzSpeedOnChange(){
		PtzSpeedCookie = idget("sPanTiltSpeed").value;
		setCookie("PtzSpeed",PtzSpeedCookie);
	}	
	
	
	function ZoomSpeedOnChange(){
		ZoomSpeedCookie = idget("sZoomSpeed").value;
		setCookie("ZoomSpeed",ZoomSpeedCookie);
	}
	//-------------------------------------------------------------------------------------			

	function PtzAutoSpeedOnChange(){
		var cmd_PtzPreset = CMD_Encoder();
		cmd_PtzPreset+="&PTZ_AUTO_SPEED="+idget("sAutoSpeed").value;
		doRequest(cmd_PtzPreset);
	}	
	//----------------------------------------------------------------------------------------
	function PtzVendorOnChange(){
		var cmd_PtzPreset = CMD_Encoder();
		cmd_PtzPreset+="&PTZ_VENDOR=";
		switch(idget("PTZ_VENDOR").value){
			case "ACTI":
				cmd_PtzPreset+='ACTI,ACTI';
				break;
			case "PELCOD":
				cmd_PtzPreset+='PELCO,PELCOD';
				break;
			case "PELCOP":
			case "PELCOPV1":
				cmd_PtzPreset+='PELCO,PELCOPV1';
				break;
			case "PELCOPV2":
				cmd_PtzPreset+='PELCO,PELCOPV2';
				break;
			case "SONY":
				cmd_PtzPreset+='SONY,VISCA';
				break;
		}
		
		doRequest(cmd_PtzPreset);
		SetupPtzVendor2ECM();
	}
	idget("PTZ_VENDOR").onchange=PtzVendorOnChange;	
	
	//----------------------------------------------------------------------------------------
	function PtzAddrOnChange(){
		var cmd_PtzPreset="/cgi-bin/encoder?USER="+ gAccount_PtzPreset +"&PWD="+ gPwd_PtzPreset;
		cmd_PtzPreset+="&ADDR=0x"+parseInt(idget("sPTZ_ADDR").value).toString(16);
		doRequest(cmd_PtzPreset);
		
		switch(idget("PTZ_VENDOR").value){
			case "ACTI":
			case "PELCOD":
			case "SONY":
				top.frames.main_frame.document.getElementById("oMedia").SetPTZAddressID(parseInt(idget("sPTZ_ADDR").value));
				break;
			case "PELCOP":	
			case "PELCOPV1":
			case "PELCOPV2":
				top.frames.main_frame.document.getElementById("oMedia").SetPTZAddressID(parseInt(idget("sPTZ_ADDR").value));
				break;
		}
	}
	idget("sPTZ_ADDR").onchange=PtzAddrOnChange;		
	
	//----------------------------------------------------------------------------------------
	function ApplyAutoFilp(){		
		var cmd_PtzPreset = CMD_Encoder();
		cmd_PtzPreset+="&PTZ_AUTO_FLIP="+idget("sAutoFilp").value;
		doRequest(cmd_PtzPreset);
	}
	
	//----------------------------------------------------------------------------------------
	function DoZoomRatioRange()
	{	
		//idget("BUTTON_APPLY").disabled = true ;
		var value1 =  idget("wide").value;
		var cmd_PtzPreset = CMD_Encoder();
		cmd_PtzPreset+="&ZOOM_RATIO_RANGE="+parseInt(value1*100) +","+ idget("tele").value*100;
		//alert(cmd_PtzPreset);
		SzReturn=doRequest(cmd_PtzPreset) ;
		//alert(SzReturn);
		if(SzReturn.indexOf("OK")==-1)
			alert(err1_PtzPreset);	

		doGetSettings_PtzPreset();
	}	
	
	//----------------------------------------------------------------------------------------
	function ApplyZoomRatio(){
		var cmd_PtzPreset = CMD_Encoder();
		cmd_PtzPreset+="&ZOOM_RATIO_LIMIT=1,"+idget("sZoomRatio").value;
		doRequest(cmd_PtzPreset) ;
	}

	//----------------------------------------------------------------------------------------
	function ApplyDigitalZoom(){		
		var cmd_PtzPreset = CMD_Encoder();
		cmd_PtzPreset+="&DIGITAL_ZOOM="+idget("sDigitalZoom").value;
		doRequest(cmd_PtzPreset);	
	}	
	
	//----------------------------------------------------------------------------------------
	function DoFocusStepNear(){		
		var cmd_PtzPreset="/cgi-bin/encoder?USER="+ gAccount_PtzPreset +"&PWD="+ gPwd_PtzPreset;
		cmd_PtzPreset+="&STEPPED_FOCUS=NEAR,"+idget("sFocusStepSize").value;
		doRequest(cmd_PtzPreset);
	}
	
	//----------------------------------------------------------------------------------------
	function DoFocusStepFar(){	
		var cmd_PtzPreset="/cgi-bin/encoder?USER="+ gAccount_PtzPreset +"&PWD="+ gPwd_PtzPreset;
		cmd_PtzPreset+="&STEPPED_FOCUS=FAR,"+idget("sFocusStepSize").value;
		doRequest(cmd_PtzPreset);
	}
	
	
	function CheckZoomStep(){
		if(pattern.test(idget('ZoomStep').value) == false){
			alert(err1_PtzPreset);
			return false;
		}
		var tmp = parseInt(idget('ZoomStep').value,10);
		if(tmp>255){
			idget("ZoomStep").value=255;
		}
	}
	
	//----------------------------------------------------------------------------------------
	function DoZoomStepTele(){
		if(CheckZoomStep() == false)
			return;
		//var cmd_PtzPreset="/cgi-bin/encoder?USER="+ gAccount_PtzPreset +"&PWD="+ gPwd_PtzPreset;
		var cmd_PtzPreset = CMD_Encoder();
		cmd_PtzPreset+="&STEPPED_ZOOM=TELE,"+idget("ZoomStep").value;
		doRequest(cmd_PtzPreset);		
	}
	
	//----------------------------------------------------------------------------------------
	function DoZoomStepWide(){
		if(CheckZoomStep() == false)
			return;
		//var cmd_PtzPreset="/cgi-bin/encoder?USER="+ gAccount_PtzPreset +"&PWD="+ gPwd_PtzPreset;
		var cmd_PtzPreset = CMD_Encoder();
		cmd_PtzPreset+="&STEPPED_ZOOM=WIDE,"+idget("ZoomStep").value;
		doRequest(cmd_PtzPreset);		
	}	
	
	//----------------------------------------------------------------------------------------
	function DoZoomContTele(){
		
		//var cmd_PtzPreset="/cgi-bin/encoder?USER="+ gAccount_PtzPreset +"&PWD="+ gPwd_PtzPreset;
		var cmd_PtzPreset = CMD_Encoder();
		cmd_PtzPreset+="&ZOOM=TELE,0x"+idget("sZoomSpeed").value;
		doRequest(cmd_PtzPreset);
	}
	
	//----------------------------------------------------------------------------------------
	function DoZoomContWide(){
	
		//var cmd_PtzPreset="/cgi-bin/encoder?USER="+ gAccount_PtzPreset +"&PWD="+ gPwd_PtzPreset;
		var cmd_PtzPreset = CMD_Encoder();
		cmd_PtzPreset+="&ZOOM=WIDE,0x"+idget("sZoomSpeed").value;
		doRequest(cmd_PtzPreset);
	}
	//----------------------------------------------------------------------------------------
	function DoZoomContStop(){
		var cmd_PtzPreset="/cgi-bin/encoder?USER="+ gAccount_PtzPreset +"&PWD="+ gPwd_PtzPreset;
		cmd_PtzPreset+="&ZOOM=STOP";
		doRequest(cmd_PtzPreset);
	}		
	
	function CMD_Encoder(){
		if((parent.IsIE() == true && top.guest_preview ==1) || (parent.IsIE() != true && top.guest_preview ==1))
			cmd_tmp = "/cgi-bin/encoder?";
		else
			cmd_tmp ="/cgi-bin/encoder?USER="+ gAccount_PtzPreset +"&PWD="+ gPwd_PtzPreset;
		return 	cmd_tmp;
	}
	
	function CMD_System(){
		if((parent.IsIE() == true && top.guest_preview ==1) || (parent.IsIE() != true && top.guest_preview ==1))
			cmd_tmp = "/cgi-bin/system?";
		else
			cmd_tmp ="/cgi-bin/system?USER="+ gAccount_PtzPreset +"&PWD="+ gPwd_PtzPreset;
		return 	cmd_tmp;
	}
	
	function PTMove(dir) {
		//var cmd_PtzPreset="/cgi-bin/encoder?USER="+ gAccount_PtzPreset +"&PWD="+ gPwd_PtzPreset+"&";
		var cmd_PtzPreset = CMD_Encoder();
		panel_onclick = 1;
		if(dir != "HOME"){
			var theEvent = window.event || arguments.callee.caller.arguments[0];  //arguments.callee.caller.arguments[0] is for firefox
			oSrc = theEvent.srcElement || theEvent.target  ;			
			tmp = (oSrc.className).split(' ') ;
			oSrc.className = tmp[0] + '_click ' + tmp[1] ;
		}

		switch(dir) {
			case "UP" :  
			case "DOWN" :
				cmd_PtzPreset += "&MOVE=" + dir + "," + idget("sPanTiltSpeed").value ;
				break ;
			case "LEFT" :   
			case "RIGHT" :            
				cmd_PtzPreset += "&MOVE=" + dir + "," + idget("sPanTiltSpeed").value;
				break;
			case "UPLEFT":  
			case "UPRIGHT" :    
			case "DOWNLEFT":   
			case "DOWNRIGHT":
				cmd_PtzPreset += "&MOVE=" + dir + "," + idget("sPanTiltSpeed").value + "," + idget("sPanTiltSpeed").value ;
				break;
			case "HOME"	:
				home_onclick = 1;
				cmd_PtzPreset += "&MOVE=HOME";
				break;       
		}
		
		SzReturn = doRequest(cmd_PtzPreset);		
	}	
	
	function PTMoveStop() {
		if( (panel_onclick != 1) || (home_onclick == 1) ){	
			home_onclick = 0;
			panel_onclick = 0;
			return;
		}
		var theEvent = window.event || arguments.callee.caller.arguments[0];
		oSrc = theEvent.srcElement || theEvent.target  ;
		tmp = (oSrc.className).split(' ') ;
		tt = tmp[0].split('_') ;
		oSrc.className = tt[0] + ' ' + tmp[1] ;	
		var cmd_PtzPreset="/cgi-bin/encoder?USER="+ gAccount_PtzPreset +"&PWD="+ gPwd_PtzPreset+"&MOVE=STOP";
		doRequest(cmd_PtzPreset);
		panel_onclick = 0;
	}
	
	function DoRefocus(){
		var cmd_PtzPreset="/cgi-bin/encoder?USER="+ gAccount_PtzPreset +"&PWD="+ gPwd_PtzPreset;
		cmd_PtzPreset+="&FOCUS=REFOCUS";
		doRequest(cmd_PtzPreset);
	}	

	function DoSaveHome(x){		
		var cmd_PtzPreset = CMD_Encoder();
		cmd_PtzPreset+="&HOME_POS="+x;
		doRequest(cmd_PtzPreset);
	}

	function update_language_PtzPreset(){

		if(parent.IsIE() == true){
			//top.update_language(this);	
			try { err0 = top.GetXmlLangTagByName("SETTING_GENERAL_URI_ERR") ; } catch(e) {}	
			try { err1_PtzPreset = top.GetXmlLangTagByName("COMMON_MSG_SET_ERR") ; } catch(e) {}	
			try { document.getElementById('COMMON_MSG_STEP_SIZES_2').innerHTML = top.GetXmlLangTagByName("COMMON_MSG_STEP_SIZES") ; } catch(e) {}
			try { document.getElementById('SELECT_COMMON_DISABLED2').innerHTML = top.GetXmlLangTagByName("SELECT_COMMON_DISABLED") ; } catch(e) {}	
			try { document.getElementById('SELECT_COMMON_DISABLED3').innerHTML = top.GetXmlLangTagByName("SELECT_COMMON_DISABLED") ; } catch(e) {}	
			try { document.getElementById('COMMOM_MSG_ENABLED2').innerHTML = top.GetXmlLangTagByName("COMMOM_MSG_ENABLED") ; } catch(e) {}
			try { document.getElementById('COMMOM_MSG_ENABLED3').innerHTML = top.GetXmlLangTagByName("COMMOM_MSG_ENABLED") ; } catch(e) {}
			try { document.getElementById('COMMON_MSG_NUM2').innerHTML = top.GetXmlLangTagByName("COMMON_MSG_NUM") ; } catch(e) {}
			try { document.getElementById('set').title = top.GetXmlLangTagByName("SETTING_PTZ_PRESET_SET") ; } catch(e) {}
			try { document.getElementById('goto').title = top.GetXmlLangTagByName("SETTING_PTZ_PRESET_GOTO") ; } catch(e) {}
			try { document.getElementById('set1').title = top.GetXmlLangTagByName("SETTING_PTZ_PRESET_SET") ; } catch(e) {}
			try { document.getElementById('goto1').title = top.GetXmlLangTagByName("SETTING_PTZ_PRESET_GOTO") ; } catch(e) {}
			try { document.getElementById('rm').title = top.GetXmlLangTagByName("COMMON_MSG_REMOVE") ; } catch(e) {}
		}


		else{
			//parent.window.opener.top.update_language(this);								
			try { err0 = top.GetXmlLangTagByName("SETTING_GENERAL_URI_ERR") ; }	catch(e) {}	
			try { err1_PtzPreset = top.GetXmlLangTagByName("COMMON_MSG_SET_ERR") ; }	catch(e) {}	
			try { document.getElementById('COMMON_MSG_STEP_SIZES_2').innerHTML = top.GetXmlLangTagByName("COMMON_MSG_STEP_SIZES") ; } catch(e) {}	
			try { document.getElementById('SELECT_COMMON_DISABLED2').innerHTML = top.GetXmlLangTagByName("SELECT_COMMON_DISABLED") ; } catch(e) {}
			try { document.getElementById('SELECT_COMMON_DISABLED3').innerHTML = top.GetXmlLangTagByName("SELECT_COMMON_DISABLED") ; } catch(e) {}
			try { document.getElementById('COMMOM_MSG_ENABLED2').innerHTML = top.GetXmlLangTagByName("COMMOM_MSG_ENABLED") ; } catch(e) {}
			try { document.getElementById('COMMOM_MSG_ENABLED3').innerHTML = top.GetXmlLangTagByName("COMMOM_MSG_ENABLED") ; } catch(e) {}
			try { document.getElementById('COMMON_MSG_NUM2').innerHTML = top.GetXmlLangTagByName("COMMON_MSG_NUM") ; } catch(e) {}
			try { document.getElementById('set').title = top.GetXmlLangTagByName("SETTING_PTZ_PRESET_SET") ; } catch(e) {}
			try { document.getElementById('goto').title = top.GetXmlLangTagByName("SETTING_PTZ_PRESET_GOTO") ; } catch(e) {}
			try { document.getElementById('set1').title = top.GetXmlLangTagByName("SETTING_PTZ_PRESET_SET") ; } catch(e) {}
			try { document.getElementById('goto1').title = top.GetXmlLangTagByName("SETTING_PTZ_PRESET_GOTO") ; } catch(e) {}
			try { document.getElementById('rm').title = top.GetXmlLangTagByName("COMMON_MSG_REMOVE") ; } catch(e) {}
		}		
	}

	
	function draw_preset_table(){		
		var preset_tbl='';	
		var i;
		preset_tbl = '<table width="100%" border="0">';
		preset_tbl += '<tr bgcolor="#BBBBBB">';
		preset_tbl += '<td colspan="5" align="left">';
		preset_tbl += '<label id="SETTING_VIDEO_PRESET" style="font-weight: bold">Preset</label>';
		preset_tbl += '</td>';
		preset_tbl += '</tr>';
		preset_tbl += '<tr>';
		preset_tbl += '<td width="13%" align="center"><label id="COMMON_MSG_NUM2">No.</label></td>';
		preset_tbl += '<td width="48%" align="center"><label id="COMMON_MSG_NAME">Name</label></td>';
		preset_tbl += '<td width="13%" align="center"><input id="set1" type="image" src="/images/seth.png" title="Set"/></td>';
		preset_tbl += '<td width="13%" align="center"><input id="goto1" type="image" src="/images/run.png" title="GoTo"/></td>';
		preset_tbl += '<td width="13%" align="center"><input id="rm" type="image" src="/images/tr.png" title="Remove"/></td>';
		preset_tbl += '</tr>';
		for(i=1 ; i<=32; i++){
			preset_tbl += '<tr>';
			preset_tbl += '<td align="center"><label>'+i +'</label><input id="hPresetState_'+i + '" type="hidden"></td>';
			preset_tbl += '<td align="center"><div style="width:120px;overflow:hidden"><label id="lPresetName_'+i +'"></label></div><input id="tPresetName_'+i + '" type="text" maxlength="31" size="5" style="display:none"></td>';
			preset_tbl += '<td align="center"><input id="bPresetSet_' +i + '" type="image" src="/images/set.gif"></td>';
			preset_tbl += '<td align="center"><input id="bPresetGo_' + i + '" type="image" src="/images/eye.gif"></td>';
			preset_tbl += '<td align="center"><input id="bPresetDel_' + i + '" type="image" src="/images/delete.gif"></td>';
		}
		
		preset_tbl += '</table>';
		
		idget("Preset_table").innerHTML = preset_tbl;
	}	
	

	function frame_extent_2_PtzPreset(){
		window.frameElement.height=document.body.scrollHeight+10;
		window.frameElement.width=document.body.scrollWidth;		
	}		

	//----------------------------------------------------------------------------------------
	function DoPresetGo(){
		var idx=this.id.split("_")[1];
		var cmd_PtzPreset = "/cgi-bin/encoder?USER="+ gAccount_PtzPreset +"&PWD="+ gPwd_PtzPreset;
			cmd_PtzPreset+="&PTZ_PRESET_GO="+idx
		var Result = doRequest(cmd_PtzPreset);
	}
	
	//----------------------------------------------------------------------------------------
	function bPresetGoMouseOver(){
		this.src="/images/eye_sel.gif"
	}
	//----------------------------------------------------------------------------------------
	function bPresetGoMouseOut(){
		this.src="/images/eye.gif"
	}
	//----------------------------------------------------------------------------------------

	function DoPresetDel(){
		var idx=this.id.split("_")[1];
		var cmd_PtzPreset = "/cgi-bin/encoder?USER="+ gAccount_PtzPreset +"&PWD="+ gPwd_PtzPreset;
			cmd_PtzPreset+="&PTZ_PRESET_SET="+idx+",0"
		var Result = doRequest(cmd_PtzPreset);
		PresetGetConfig_PtzPreset();
		doGetSettings_PtzPreset();
		
		PresetGetConfig_PtzTour();
	}
	
	//----------------------------------------------------------------------------------------
	function bPresetDelMouseOver(){
		this.src="/images/delete_sel.gif"
	}
	//----------------------------------------------------------------------------------------
	function bPresetDelMouseOut(){
		this.src="/images/delete.gif"
	}
	//----------------------------------------------------------------------------------------

	function DoPresetSet(){
		var idx=this.id.split("_")[1];
		this.src="/images/set_sel.gif"
		this.onclick=DoPresetSetDone;
		idget("lPresetName_"+idx).style.display="none";
		idget("tPresetName_"+idx).style.display="";
		idget("tPresetName_"+idx).focus();
	}
	

	
	//----------------------------------------------------------------------------------------
	function DoPresetSetDone(){
	
		var idx=this.id.split("_")[1];
		this.src="/images/set.gif"
		this.onclick=DoPresetSet;
		idget("lPresetName_"+idx).style.display="";
		idget("tPresetName_"+idx).style.display="none";
		
		if(idget("tPresetName_"+idx).value==""){
			var MyName="Entry_" + idx;
			idget("tPresetName_"+idx).value=MyName;
		}
		
		var GeneralRulesOfValidCharactersInURI;
		if(idget("tPresetName_"+idx).value.length==1){
			GeneralRulesOfValidCharactersInURI=new RegExp(/(^[0-9a-zA-Z]{1})/);
		}else{
			GeneralRulesOfValidCharactersInURI=new RegExp(/(^[0-9a-zA-Z]{1})([0-9A-Za-z. _-]*)([0-9A-Za-z]{1})$/);
		}
		flag=GeneralRulesOfValidCharactersInURI.test(idget("tPresetName_"+idx).value);
		if(!flag){
			alert(err0);
			return false;
		}
		
		var cmd_PtzPreset = "/cgi-bin/encoder?USER="+ gAccount_PtzPreset +"&PWD="+ gPwd_PtzPreset;
			cmd_PtzPreset+="&PTZ_PRESET_SET="+idx+",1,0,0,65535,5,5,7,10,"+idget("tPresetName_"+idx).value;
		doRequest(cmd_PtzPreset);
		
		PresetGetConfig_PtzPreset();
		doGetSettings_PtzPreset();
		
		PresetGetConfig_PtzTour();
	}

	function PresetGetConfig_PtzPreset(){
		var cmd_PtzPreset = "/cgi-bin/encoder?USER="+ gAccount_PtzPreset +"&PWD="+ gPwd_PtzPreset;
			cmd_PtzPreset+="&PTZ_PRESET_GET"
		var Presets = doRequest(cmd_PtzPreset).split("\n");
		
		var i;
		var idx;
		var tourpresets=idget('IdlePositionEnable');
		while (tourpresets.options.length > 0 ) {
			tourpresets.remove(0);
		}
		for(i=-1;i<=0;i++){
			var o=document.createElement('option');
			o.value=i;
			if(i==-1) {
				o.id="SELECT_COMMON_DISABLED4";
				o.text="DISABLE";
			}	
			if(i==0) {
				o.id="PTZ_HOME_POS1";
				o.text="HOME";
			}	
			try{
				tourpresets.add(o,null); // standards compliant
			}catch(ex){
				tourpresets.add(o); // IE only
			}
			if(i==-1){
				try { document.getElementById('SELECT_COMMON_DISABLED4').innerHTML = top.GetXmlLangTagByName("SELECT_COMMON_DISABLED") ; } catch(e) {}
				try { document.getElementById('SELECT_COMMON_DISABLED4').innerHTML = top.GetXmlLangTagByName("SELECT_COMMON_DISABLED") ; } catch(e) {}
			}
			if(i==0){
				try { document.getElementById('PTZ_HOME_POS1').innerHTML = top.GetXmlLangTagByName("PTZ_HOME_POS") ; } catch(e) {}
				try { document.getElementById('PTZ_HOME_POS1').innerHTML = top.GetXmlLangTagByName("PTZ_HOME_POS") ; } catch(e) {}
			}
		}
		
		for(i=1; i<=gPresetNum; i++){
			idget("hPresetState_"+i).value=0;
			idget("lPresetName_"+i).innerHTML="";
			idget("tPresetName_"+i).value="";
		}
		
		PresetObjList_PtzPreset = [] ;
		
		for(i in Presets){
			Preset=Presets[i].split("'")[1];
			if(Preset==undefined) continue;
			Preset=Preset.split(",");
			idx=Preset[0];
			if(idx>32 || idx<1) continue;
			idget("hPresetState_"+idx).value=1;
			idget("lPresetName_"+idx).innerHTML=Preset[8];
			idget("tPresetName_"+idx).value=Preset[8];

			var o=document.createElement('option');
			o.id="idp_"+Preset[8];
			o.text="Preset "+Preset[8];
			//o.value=Preset[0] +'|%|'+ Preset[8];
			o.value=Preset[0];
			//alert("o.id = "+o.id+"\n" + "o.text = "+o.text +"\n"+"o.value = "+o.value);
			PresetObjList_PtzPreset[PresetObjList_PtzPreset.length] = {index:Preset[0],name:Preset[8]} ;
			
			try{
				tourpresets.add(o,null); // standards compliant
			}catch(ex){
				tourpresets.add(o); // IE only
			}
		}		
		
		for(i=1; i<=gPresetNum; i++){
			if(idget("hPresetState_"+i).value==1){
				idget("bPresetGo_"+i).style.display="";
				idget("bPresetDel_"+i).style.display="";
			}else{
				idget("bPresetGo_"+i).style.display="none";
				idget("bPresetDel_"+i).style.display="none";
			}
		}
		
		if(PresetObjList_PtzPreset.length>0 && PTZ_CAP_TR==1)
			idget("TabTour").style.display = "";
		else
			idget("TabTour").style.display = "none";
	}
	
	function SetupPtzVendor2ECM(){
		var cmd_PtzPreset="/cgi-bin/encoder?USER="+ gAccount_PtzPreset +"&PWD="+ gPwd_PtzPreset+"&ADDR";
		var szReturn = doRequest(cmd_PtzPreset) ;	
		var addr = szReturn.substring(szReturn.search("x")+1,szReturn.search("x")+3);
		if(parent.IsIE() == true){
			if(top.frames.main_frame.CurrentPTZ==0){
				top.frames.main_frame.document.getElementById("oMedia").DisableMousePTZ();
			}
			else{
				top.frames.main_frame.document.getElementById("oMedia").DisablePixelsPTZ();
			}
			
			top.frames.main_frame.document.getElementById("oMedia").SetPTZAddressID(parseInt(addr,16));
		}
		idget("sPTZ_ADDR").value = parseInt(addr,16);
		
		if(parent.IsIE() == true){
			switch(idget("PTZ_VENDOR").value){
				case "ACTI":			
					top.frames.main_frame.document.getElementById("oMedia").PTZVendor="ACTi";
					top.frames.main_frame.document.getElementById("oMedia").PTZProtocol="VISCA";
					break;
				case "PELCOD":
					top.frames.main_frame.document.getElementById("oMedia").PTZVendor="Pelco";
					top.frames.main_frame.document.getElementById("oMedia").PTZProtocol="Pelco-D";
					break;
				case "PELCOP":
				case "PELCOPV1":
					top.frames.main_frame.document.getElementById("oMedia").PTZVendor="Pelco";
					top.frames.main_frame.document.getElementById("oMedia").PTZProtocol="Pelco-P-V1";
					top.frames.main_frame.document.getElementById("oMedia").SetPTZAddressID(parseInt(addr,16));				
					break;
				case "PELCOPV2":
					top.frames.main_frame.document.getElementById("oMedia").PTZVendor="Pelco";
					top.frames.main_frame.document.getElementById("oMedia").PTZProtocol="Pelco-P-V2";
					break;
				case "SONY":
					top.frames.main_frame.document.getElementById("oMedia").PTZVendor="SONY";
					top.frames.main_frame.document.getElementById("oMedia").PTZProtocol="VISCA";
					break;
			}

			top.frames.main_frame.document.getElementById("oMedia").EnablePTZ(); //must do			
			setTimeout(function(){detIEMouseECM();}, 0);
		}
	}
	
	function DoIdlePosition(){
		if(idget('IdleTime').value>65535){
			idget('IdleTime').value=65535;
		}
		if(idget('IdleTime').value<1){
			idget('IdleTime').value=1;
		}
		
		var cmd_PtzPreset = CMD_Encoder();
		//var cmd_PtzPreset="/cgi-bin/encoder?USER="+ gAccount_PtzPreset +"&PWD="+ gPwd_PtzPreset;
		if(idget("IdlePositionEnable").value >= 0)
			cmd_PtzPreset+="&PTZ_IDLE_POSITION="+"1"+","+idget("IdleTime").value+","+idget("IdlePositionEnable").value;
		else
			cmd_PtzPreset+="&PTZ_IDLE_POSITION="+"0"+","+idget("IdleTime").value+",0";
		doRequest(cmd_PtzPreset);
		//PtzVendorGetConfig();
	}
	
	idget("IdleTime").onchange=DoIdlePosition;
	
	idget("IdlePositionEnable").onchange=function(){
		DoIdlePosition();
		//UpdateUI_IdlePosition();
	};
	
	function UpdateUI_IdlePosition(){
		if(top.gPT_Enable	== 1){
			idget("trIdlePosition0").style.display="";
			idget("trIdlePosition1").style.display="";
			idget("trIdlePosition2").style.display="";			
		}
	}
	
	function PtzVendorGetConfig(){	
		if(parent.IsIE() == true){
			if(top.gFwType == 'AC')
				UpdateSelectOptions_2(idget('PTZ_VENDOR'),"ACTI,PELCOD,PELCOP,SONY","ACTI/ACTI,PELCO/PELCOD,PELCO/PELCOP,SONY/VISCA");
			else
				UpdateSelectOptions_2(idget('PTZ_VENDOR'),"PELCOD,PELCOP,SONY","PELCO/PELCOD,PELCO/PELCOP,SONY/VISCA");	
		}
		else{
			if(top.gFwType == 'AC')
				UpdateSelectOptions_2(idget('PTZ_VENDOR'),"ACTI,PELCOD,PELCOP,SONY","ACTI/ACTI,PELCO/PELCOD,PELCO/PELCOP,SONY/VISCA");
			else
				UpdateSelectOptions_2(idget('PTZ_VENDOR'),"PELCOD,PELCOP,SONY","PELCO/PELCOD,PELCO/PELCOP,SONY/VISCA");
		}	
		 
		InsertSelectOptions_Number(idget('sPTZ_ADDR'), 1, 0xdf);
		
		var cmd_PtzPreset = "/cgi-bin/encoder?USER="+ gAccount_PtzPreset +"&PWD="+ gPwd_PtzPreset;
			cmd_PtzPreset+="&PTZ_VENDOR"
		var Vendor = doRequest(cmd_PtzPreset).split("'")[1];
		//Vendor = "PELCO,PELCOD"
		var Protocol = Vendor.split(',')[1];
		Vendor = Vendor.split(',')[0];

		switch(Vendor){
			case "ACTI":
				SetSelectedValue(idget("PTZ_VENDOR"), Protocol);
				if(parent.IsIE() == true){
					if(top.gFwType == 'NB')
						SetSelectedValue(idget("PTZ_VENDOR"), "SONY");
				}
				else{
					if(top.gFwType == 'NB')
						SetSelectedValue(idget("PTZ_VENDOR"), "SONY");
				}
				break;
			case "PELCO":
				SetSelectedValue(idget("PTZ_VENDOR"), Protocol);
				break;
			case "SONY":
				if(Protocol=="VISCA")
					Protocol = 'SONY';
				SetSelectedValue(idget("PTZ_VENDOR"), Protocol);
				break;
		}
		setTimeout(function(){ SetupPtzVendor2ECM(); }, 0);					
	}
	
	function UpdateFocusUI(){
		switch(idget("sFocusMode").value){
			case "AUTO":
				idget("trFocusStep").style.display="none";				
				idget("trSteppedFoscusing").style.display="none";
				idget("bRefocus").style.display="none";
				break
			case "ZOOM_AF":
				idget("trFocusStep").style.display="none";				
				idget("trSteppedFoscusing").style.display="none";
				idget("bRefocus").style.display="";
				break
			default:
			case "MANUAL":
				idget("trFocusStep").style.display="";				
				idget("trSteppedFoscusing").style.display="";
				idget("bRefocus").style.display="none";
				break;
		}			
	}
	
	function GetFocusMode(){
		SelectSetOption(idget("sFocusMode"), doRequest("/cgi-bin/encoder?USER="+ gAccount_PtzPreset +"&PWD="+ gPwd_PtzPreset +"&FOCUS").split("'")[1]);
		gFocusMode = idget("sFocusMode").value;
		UpdateFocusUI();
	}

	var ReFocusMode = "";
	var FocusCount = 0;
	function DoFocusMode(){
		//var cmd_PtzPreset="/cgi-bin/encoder?USER="+ gAccount_PtzPreset +"&PWD="+ gPwd_PtzPreset +"&FOCUS=";
		var cmd_PtzPreset = CMD_Encoder();
		cmd_PtzPreset += "&FOCUS=";
		if(ReFocusMode==""){			
			cmd_PtzPreset+= idget("sFocusMode").value;
		}
		else{	
			cmd_PtzPreset+= ReFocusMode;
		}
		var szReturn = doRequest(cmd_PtzPreset);
	
		if(szReturn.indexOf('ERROR')>-1){
			idget("sFocusMode").disabled = true;
			idget("bRefocus").disabled = true;
			if(ReFocusMode==""){
				ReFocusMode = idget("sFocusMode").value;
			}
			idget("sFocusMode").value = gFocusMode;			
			if(FocusCount<=8){ //Focus time = 8 seconds
				window.setTimeout("DoFocusMode();", 1000 );
				FocusCount++;
			}	
			else{
				idget("sFocusMode").value = gFocusMode;
				idget("sFocusMode").disabled = false;
				idget("bRefocus").disabled = false;
			}
		}	
		else{
			if(ReFocusMode!=""){
				idget("sFocusMode").value = ReFocusMode;
				idget("sFocusMode").disabled = false;
				idget("bRefocus").disabled = false;
				ReFocusMode = "";
				FocusCount = 0;
			}				
			UpdateFocusUI();
			if(idget("sFocusMode").value== "MANUAL"){	
				window.frameElement.height=document.body.scrollHeight+10;
			}
			else{
				window.frameElement.height=document.body.scrollHeight-50;
			}
		}	
		gFocusMode = idget("sFocusMode").value;			
	}	
	
	function GetPTZCap(){		
		var i = 0;
		var cmd_PtzPreset="/cgi-bin/encoder?USER="+ gAccount_PtzPreset +"&PWD="+ gPwd_PtzPreset;
		cmd_PtzPreset+="&PTZ_CAP_GET";	
		var szReturn = doRequest(cmd_PtzPreset) ;
		szReturn=szReturn.split('\n') ;
		//alert(szReturn);
		
		PTZ_PROTOCOL = szReturn[1];
		PTZ_PROTOCOL=top.doSplitValue(PTZ_PROTOCOL);
		var PTZ_PROTOCOLs = PTZ_PROTOCOL[1].split(',');
		PTZ_PROTOCOL_value = PTZ_PROTOCOLs.length;
		if(PTZ_PROTOCOL_value > 1)
			idget("Vender_Protocol").style.display = "";
		
		PTZ_Cap = szReturn[0];	
		PTZ_Cap=top.doSplitValue(PTZ_Cap);
		var PTZ_Cap_value = PTZ_Cap[1].split(',');
		
		if(PTZ_Cap_value != "NA")
			idget("SaveHome").style.display = "";
		else
			idget("SaveHome").style.display = "none";
		
		for(i = 0 ; i < PTZ_Cap_value.length ; i++){
			switch(PTZ_Cap_value[i]){
				case 'AS':
					idget("PT_Control").style.display = "";
					idget("trPTZ_AUTO_SPEED").style.display = "";
					break;
				case 'PF':
					idget("PT_Control").style.display = "";
					idget("trPTZ_AUTO_FLIP").style.display = "";
					break;	
				case 'PT':
					idget("PT_Control").style.display = "";
					idget("trPT_Control").style.display = "";
					idget("home_pos").style.display = "none";
					break;	
				case 'MS':
					idget("tdPT_Speed").style.display = "";
					break;	
				case 'ML':
					idget("PTZ_MOVE_LIMIT").style.display = "";
					break;	
				case 'IP':
					idget("PTZ_IDLE").style.display = "";
					break;		
				case 'AF':
					idget("Focus_Control").style.display = "";
					break;
				case 'OZ':
					idget("Zoom_Control").style.display = "";
					break;		
				case 'DZ':
					// for I51/I71 in EPTZ mode open OZ and Hide DZ function
					if((parent.IsIE() == true && top.gStreamMode=="EPTZ") || (parent.IsIE() != true && top.gStreamMode=="EPTZ")){
						idget("Zoom_Control").style.display = "";
						//idget("trPTZ_Digital_Zoom").style.display = "";
						if(top.gUnitType == "Hemispheric Camera" && top.gIspGeneration == "C02")
							idget("trContinuedZoom").style.display = "none";						
					}
					else	
						idget("trPTZ_Digital_Zoom").style.display = "";					
					break;
				case 'ZS':
					idget("trSpeed").style.display = "";
					break;	
				case 'PS':
					idget("Preset_table").style.display = "";
					break;
				case 'PL':
					idget("Preset_table").style.display = "none";
					break;
				case 'TR':
					PTZ_CAP_TR = 1;
					break;		
				case 'SC':
					PTZ_CAP_SC = 1;
					break;
				case 'ZR':
					idget("trPTZ_Zoom_Ratio").style.display = "";
					break;
				case 'ZI':
					idget("trPTZ_Zoom_Ratio_ZI").style.display = "";
					break;		
			}
		}	
	}
	
	function doGetSettings_PtzPreset(){
		var szReturn;
		var szSystem="/cgi-bin/system?USER="+ gAccount_PtzPreset +"&PWD="+ gPwd_PtzPreset+"&SYSTEM_INFO";
		szReturn = doRequest(szSystem) ;
		szReturn=szReturn.split('\n') ;
		for(i=0; i<szReturn.length; i++){
			var r=doSplitValue( szReturn[i] ) ;
			switch(r[0]){
			case "ZOOM_LENS":
				var ZoomLens = parseInt(r[1]);
				//if(ZoomLens >= 18)
					//idget("trPTZ_Zoom_Ratio").style.display="";
				break;	
			}
		}
		InsertSelectOptions_Number_2(idget("sZoomRatio"), 1, ZoomLens, "x");		
		PresetGetConfig_PtzPreset();
		
		var cmd_PtzPreset="/cgi-bin/encoder?USER="+ gAccount_PtzPreset +"&PWD="+ gPwd_PtzPreset;
		cmd_PtzPreset+="&PTZ_AUTO_SPEED"+"&PTZ_AUTO_FLIP"+"&DIGITAL_ZOOM"+"&ZOOM_RATIO_LIMIT"+"&PTZ_TOUR_STATE"+"&PTZ_IDLE_POSITION"+"&MOVE_LIMIT"+"&ZOOM_RATIO_RANGE"+"&ZOOM_CAP_GET";	
		szReturn = doRequest(cmd_PtzPreset) ;
		//alert(szReturn);
		szReturn = szReturn.split('\n') ;
		//alert(szReturn);
		for (nIdx=0; nIdx< szReturn.length; nIdx++) {
			szTmp = top.doSplitValue( szReturn[nIdx] ) ;
		   
		   switch ( szTmp[0] ) {                
				case 'PTZ_AUTO_SPEED':
					SetSelectedValue(idget("sAutoSpeed"),szTmp[1]);
					break;	
				case 'PTZ_AUTO_FLIP':
					SetSelectedValue(idget("sAutoFilp"),szTmp[1]);
					break;
				case 'DIGITAL_ZOOM':
					SetSelectedValue(idget("sDigitalZoom"),szTmp[1]);
					break;
				case 'ZOOM_RATIO_LIMIT':
					var tmp=szTmp[1].split(",");
					SetSelectedValue(idget("sZoomRatio"),tmp[1]);	
					break;	
				case 'PTZ_IDLE_POSITION':
					var tmp=szTmp[1].split(",");
					if(tmp[0]==0)
						SetSelectedValue(idget("IdlePositionEnable"),"-1");
					else
						SetSelectedValue(idget("IdlePositionEnable"),tmp[2]);
					idget("IdleTime").value = tmp[1];					
					break;	
				case 'PTZ_TOUR_STATE':	
					var state = szTmp[1] ;
					if(state == 'SCAN'){
						//idget("IdlePositionEnable").value = -1;
						idget("IdlePositionEnable").disabled = true;
						idget("IdleTime").disabled = true;
					}
					else{
						idget("IdlePositionEnable").disabled = false;
						idget("IdleTime").disabled = false;
					}
					break ;
				case 'MOVE_LIMIT':
					var tmp=szTmp[1].split(",");
					if(tmp[0]=="set"){
						idget("Point1").value= tmp[1]+","+tmp[2];
						idget("Point2").value= tmp[3]+","+tmp[4];
						idget("LimitGo_1").style.display = "";
						idget("LimitGo_2").style.display = "";
						LimitSetCount = 2;
					}	
					break;	
				case 'ZOOM_RATIO_RANGE':
					var tmp=szTmp[1].split(",");
					//alert("tmp[0]="+tmp[0]+","+"tmp[1]="+tmp[1]);
					idget("wide").value = (tmp[0]/100).toFixed(2);
					idget("tele").value = (tmp[1]/100).toFixed(2);
					break;
				case 'ZOOM_CAP_GET':
					var tmp1=szTmp[1].split(",");
					idget("tip1").innerText = (tmp1[1]/100).toFixed(2);
					idget("tip2").innerText = (tmp1[0]/100).toFixed(2);
					break;	
			}
		}		
		//PresetGetConfig_PtzPreset();
		PtzVendorGetConfig();
	}
	
	function upate_UI(){
		if((parent.IsIE() == true && top.guest_preview ==1) || (parent.IsIE() != true && top.guest_preview ==1)){
			idget("SaveHome").style.display = "none";
			idget("Vender_Protocol").style.display = "none";
			idget("PTZ_MOVE_LIMIT").style.display = "none";
			idget("trPTZ_AUTO_SPEED").style.display = "none";
			idget("trPTZ_AUTO_FLIP").style.display = "none";
			idget("PTZ_IDLE").style.display = "none";
			idget("trPTZ_Zoom_Ratio").style.display = "none";
			idget("trPTZ_Digital_Zoom").style.display = "none";
			idget("Focus_Control").style.display = "none";
			idget("Rotate_Control").style.display = "none";
			
			for(i=1 ; i<=32; i++){	
				idget("bPresetSet_"+i).style.display = "none";
				idget("bPresetDel_"+i).style.display = "none";
			}			
		}
	}
	
	function Get_System_Config(){
		var szSystem="/cgi-bin/system?&SYSTEM_INFO";
		var szReturn = doRequest(szSystem) ;
		szReturn = szReturn.split('\n') ;
		var i;
		for(i=0; i<szReturn.length; i++){
			r=doSplitValue( szReturn[i] ) ;
			switch(r[0]){
				case "Serial Port":
					if(parent.IsIE() == true)
						top.gSerialPorts=parseInt(r[1]);
					else
						top.gSerialPorts=parseInt(r[1]);
					break;						
				case "ZOOM_CAP":
					if(parent.IsIE() == true)
						top.gZoom_Capability=r[1].slice(1);
					else
						top.gZoom_Capability=r[1].slice(1);
					break;
				case "PT_ENABLE":
					if(parent.IsIE() == true)
						top.gPT_Enable=parseInt(r[1]);
					else
						top.gPT_Enable=parseInt(r[1]);
					break;		
				case "Unit Type":
					if(parent.IsIE() == true)
						top.gUnitType = r[1].slice(1);
					else
						top.gUnitType = r[1].slice(1);
					break;
				case "STREAMING_MODE_CAP":
					if(parent.IsIE() == true)
						top.gStreamCap = r[1].slice(1);
					else
						top.gStreamCap = r[1].slice(1);
					break;	
				case "ISP_GENERATION":
					if(parent.IsIE() == true)
						top.gIspGeneration = r[1].slice(1);
					else
						top.gIspGeneration = r[1].slice(1);
					break;
				case "Firmware Version":
					if((r[1].slice(1).indexOf('AC') > -1)){
						if(parent.IsIE() == true)
							top.gFwType ="AC";
						else
							top.gFwType ="AC";
					}	
					else	{
						if(parent.IsIE() == true)
							top.gFwType ="NB";
						else
							top.gFwType ="NB";
					}
					break;		
			}
		}		
	}
	
	function PageOnLoad_PtzPreset(){
		var i;
		draw_preset_table();
		setTimeout(function(){ update_language_PtzPreset(); }, 0);
		
		if((parent.IsIE() == true && top.guest_preview ==1) || (parent.IsIE() != true && top.guest_preview ==1))
			Get_System_Config();
		idget("TabScan").style.display = "none";
		
		for(i=1; i<=gPresetNum; i++){
			idget("bPresetSet_"+i).onclick=DoPresetSet;
			idget("bPresetGo_"+i).onmousedown=DoPresetGo;
			idget("bPresetGo_"+i).onmouseover=bPresetGoMouseOver;
			idget("bPresetGo_"+i).onmouseout=bPresetGoMouseOut;
			idget("bPresetDel_"+i).onmousedown=DoPresetDel;
			idget("bPresetDel_"+i).onmouseover=bPresetDelMouseOver;
			idget("bPresetDel_"+i).onmouseout=bPresetDelMouseOut;
		}				
		
		if(parent.IsIE() == true){
			gAccount_PtzPreset = top.gAccount;
			gPwd_PtzPreset = top.gPwd;		
			top.frames.main_frame.document.getElementById("oMedia").DisableMousePTZ();
			top.frames.main_frame.document.getElementById("oMedia").SetPTZAddressID(1);
			top.frames.main_frame.document.getElementById("oMedia").PTZVendor="ACTi";
			top.frames.main_frame.document.getElementById("oMedia").PTZProtocol="VISCA";
			
			top.frames.main_frame.document.getElementById("oMedia").EnablePTZ();
		}	
		else{
			gAccount_PtzPreset = top.gAccount;	
			gPwd_PtzPreset = top.gPwd;		
		}	
			
		GetPTZCap();
		if((parent.IsIE() == true && top.gStreamMode == "EPTZ") || (parent.IsIE() != true && top.gStreamMode == "EPTZ") ){//STREAMING MODE = EPTZ
			idget("Rotate_Control").style.display="";				
		}	
		InsertSelectOptions_Number(idget("sFocusStepSize"), 1, 255);
		SetSelectedValue(idget("sFocusStepSize"), 5);		
		doGetSettings_PtzPreset();
		upate_UI();
		GetFocusMode();
		
		//update_language_PtzPreset();
		if(PTZ_CAP_SC == 1){ //After Preset page is onload finish ,Scan page will display
			idget("TabScan").style.display = "";	
		}


		if((parent.IsIE() == true && top.guest_preview ==1) || (parent.IsIE() != true && top.guest_preview ==1)){
			idget("TabTour").style.display = "none";
			idget("TabScan").style.display = "none";	
		}	


		if(getCookie("PtzSpeed")=="")
			idget("sPanTiltSpeed").value = 3;
		else		
			idget("sPanTiltSpeed").value = getCookie("PtzSpeed");
			
		if(getCookie("ZoomSpeed")=="")
			idget("sZoomSpeed").value = 5;
		else		
			idget("sZoomSpeed").value = getCookie("ZoomSpeed");	
			
		//window.onbeforeunload  = PTZWindowClose;	
	}
	
	setTimeout(function(){ PageOnLoad_PtzPreset();}, 0);//PageOnLoad_PtzPreset();	
//---2nd section of scripts ---//

//---3rd section of scripts ---//
	var id_PtzScan;
	var Sdirection;
	var gAccount_PtzScan = "admin";
	var gPwd_PtzScan;
	var start_on = 0 ;
	var stop_on = 0;
	var resume_on = 0 ;
	var err_PtzScan = "COMMON_MSG_SET_ERR";
	var PTZ_SCAN_STATE ="";		

	HtmSrc = '<select id="txt_Seconds" onchange="PTZ_PARK_CHECK()">';
	for(i=5;i<=255;i++)
		HtmSrc += '<option value='+i+'>'+i+'</option>';	
	HtmSrc += '</select>'; 
	idget('PARK_TIME').innerHTML=HtmSrc;

	function start_status(){
		if(start_on == 0){
			//idget('selTourstate').value="DISABLE";
			idget('selTourstate').selectedIndex =0;
			var cmd="/cgi-bin/encoder?USER="+ gAccount_PtzScan +"&PWD="+ gPwd_PtzScan;
			cmd+="&PTZ_TOUR_STATE=SCAN";
			var szReturn = doRequest(cmd) ;
			if(szReturn.indexOf('ERROR') == -1){
				start_on = 1;
				stop_on = 0;
				resume_on = 0;
				idget("PTZ_SCAN_START_ON").style.display="";
				idget("PTZ_SCAN_START").style.display="none";
				idget("PTZ_SCAN_STOP").style.display="";
				idget("PTZ_SCAN_STOP_ON").style.display="none";					
			}
			else{
				alert(err_PtzScan);
				doGetSettings_PtzScan();
				return;
			}	
		}
		else{
			return;
		}	
	}

	function stop_status(){
		if(stop_on == 0){
			start_on = 0;
			stop_on = 1;
			resume_on = 0;
			var cmd="/cgi-bin/encoder?USER="+ gAccount_PtzScan +"&PWD="+ gPwd_PtzScan;
			cmd+="&PTZ_TOUR_STATE=DISABLE";
			var szReturn = doRequest(cmd) ;
			
			idget("PTZ_SCAN_START_ON").style.display="none";
			idget("PTZ_SCAN_START").style.display="";
			idget("PTZ_SCAN_STOP").style.display="none";
			idget("PTZ_SCAN_STOP_ON").style.display="";
		}
		else{
			return;
		}
	}

	function resume_status(){
		var cmd="/cgi-bin/encoder?USER="+ gAccount_PtzScan +"&PWD="+ gPwd_PtzScan;
		cmd+="&PTZ_SCAN_RESUME";
		var szReturn = doRequest(cmd) ;
		if(szReturn.indexOf('ERROR')==-1){
			start_on = 0;
			stop_on = 0;
			idget("PTZ_SCAN_START").style.display="";
			idget("PTZ_SCAN_START_ON").style.display="none";
			idget("PTZ_SCAN_STOP").style.display="";
			idget("PTZ_SCAN_STOP_ON").style.display="none";
			idget("PTZ_SCAN_RESUME").style.display="none";
			idget("PTZ_SCAN_RESUME_ON").style.display="";
		}
		else{
			return;
		}		
		
		window.setTimeout("clean_result();", 500 );
	}

	function clean_result(){
		idget("PTZ_SCAN_RESUME").style.display="";
		idget("PTZ_SCAN_RESUME_ON").style.display="none";
		idget("PTZ_SCAN_START_ON").style.display="";
		idget("PTZ_SCAN_START").style.display="none";
	}

	function PTZ_PARK_CHECK(){	
		var cmd="/cgi-bin/encoder?USER="+ gAccount_PtzScan +"&PWD="+ gPwd_PtzScan;
			cmd+="&PTZ_PARK_CONFIG=";
		if(idget("SETTING_PTZ_PARK_CHECK").checked == false){
			//idget("txt_Seconds").disabled = true;	
			cmd+="0," + idget("txt_Seconds").value;		
		}
		else{
			//idget("txt_Seconds").disabled = false;
			cmd+="1," + idget("txt_Seconds").value;				
		}
		var Result = doRequest(cmd);
		if(Result.indexOf('ERROR')>-1){
			alert(err_PtzScan);
			doGetSettings_PtzScan();
		}	
	}

	function PanSpeedChange(){
		//stop_status();
		var cmd="/cgi-bin/encoder?USER="+ gAccount_PtzScan +"&PWD="+ gPwd_PtzScan;
			cmd+="&PTZ_TOUR_SCAN=" + idget("ScanPanSpeed").value + "," + Sdirection + "," + "-32767,32767" ;   
		doRequest(cmd);
		//start_status();
	}

	function DirectionChange2_anti_clockwise(anchor){
		idget("scan_clockwise").style.display ="none";
		idget("scan_anti_clockwise").style.display ="";
		Sdirection = 1;	
		var cmd="/cgi-bin/encoder?USER="+ gAccount_PtzScan +"&PWD="+ gPwd_PtzScan;
			cmd+="&PTZ_TOUR_SCAN=" + idget("ScanPanSpeed").value + "," + Sdirection + "," + "-32767,32767" ;
		doRequest(cmd);
	}

	function DirectionChange2_clockwise(anchor){
		idget("scan_clockwise").style.display ="";
		idget("scan_anti_clockwise").style.display ="none";
		Sdirection = 0;
		var cmd="/cgi-bin/encoder?USER="+ gAccount_PtzScan +"&PWD="+ gPwd_PtzScan;
			cmd+="&PTZ_TOUR_SCAN=" + idget("ScanPanSpeed").value + "," + Sdirection + "," + "-32767,32767" ;
		doRequest(cmd);
	}
	
	//----------------------------------------------------------------------------------------
	function bScansetMouseOver(){
		var cmd1="/cgi-bin/encoder?USER="+ gAccount_PtzScan +"&PWD="+ gPwd_PtzScan +"&PTZ_TOUR_STATE";	
		var szReturn = doRequest(cmd1) ;
		if(szReturn.indexOf('SCAN')>-1)
			return;
		this.src="/images/set_sel.gif"
	}
	//----------------------------------------------------------------------------------------
	function bScansetMouseOut(){
		this.src="/images/set.gif"
	}	
	//----------------------------------------------------------------------------------------
	function bScanGoMouseOver(){
		this.src="/images/eye_sel.gif"
	}
	//----------------------------------------------------------------------------------------
	function bScanGoMouseOut(){
		this.src="/images/eye.gif"
	}
	//----------------------------------------------------------------------------------------
	function bScanDelMouseOver(){
		var cmd1="/cgi-bin/encoder?USER="+ gAccount_PtzScan +"&PWD="+ gPwd_PtzScan +"&PTZ_TOUR_STATE";	
		var szReturn = doRequest(cmd1) ;
		if(szReturn.indexOf('SCAN')>-1)
			return;
		this.src="/images/delete_sel.gif"
	}
	//----------------------------------------------------------------------------------------
	function bScanDelMouseOut(){
		this.src="/images/delete.gif"
	}
	//----------------------------------------------------------------------------------------

	function DoScanDel(id_PtzScan){
		var cmd1="/cgi-bin/encoder?USER="+ gAccount_PtzScan +"&PWD="+ gPwd_PtzScan +"&PTZ_TOUR_STATE";	
		var szReturn = doRequest(cmd1) ;
		if(szReturn.indexOf('SCAN')>-1)
			return;
			
		var cmd="/cgi-bin/encoder?USER="+ gAccount_PtzScan +"&PWD="+ gPwd_PtzScan;
			cmd+="&PTZ_SCAN_SET=";
		if(id_PtzScan==1){
			idget("bScanDelStart").style.display ="none";
			//idget("bScanGoStart").style.display ="none";
			cmd+="1,0"
		}	
		else{
			idget("bScanDelEnd").style.display ="none";
			//idget("bScanGoEnd").style.display ="none";
			cmd+="2,0"
		}
		doRequest(cmd);
	}
		
	function DoScanSet(id_PtzScan){
		var cmd1="/cgi-bin/encoder?USER="+ gAccount_PtzScan +"&PWD="+ gPwd_PtzScan +"&PTZ_TOUR_STATE";	
		var szReturn = doRequest(cmd1) ;
		if(szReturn.indexOf('SCAN')>-1)
			return;
			
		var cmd="/cgi-bin/encoder?USER="+ gAccount_PtzScan +"&PWD="+ gPwd_PtzScan;
			cmd+="&PTZ_SCAN_SET=";
		if(id_PtzScan == 1){
			idget("bScanDelStart").style.display ="";
			//idget("bScanGoStart").style.display ="";
			cmd+="1,1,0,0,65535"
		}
		else{
			idget("bScanDelEnd").style.display ="";
			//idget("bScanGoEnd").style.display ="";
			cmd+="2,1,0,0,65535"
		}
		doRequest(cmd);
	}

	function doGetSettings_PtzScan(){
		var tmp;
		var Scanset;
		if(parent.IsIE() == true){
			gAccount_PtzScan = top.gAccount;
			gPwd_PtzScan = top.gPwd;
		}
		else{			
			gAccount_PtzScan = top.gAccount;
			gPwd_PtzScan = top.gPwd;
		}
		
		var cmd="/cgi-bin/encoder?USER="+ gAccount_PtzScan +"&PWD="+ gPwd_PtzScan;
			cmd+="&PTZ_PARK_CONFIG"+"&PTZ_TOUR_SCAN"+"&PTZ_SCAN_GET"+"&PTZ_TOUR_STATE";	
			var szReturn = doRequest(cmd) ;
			
		szReturn = szReturn.split('\n') ;
		for (nIdx=0; nIdx< szReturn.length; nIdx++) {
			szTmp = top.doSplitValue( szReturn[nIdx] ) ;
			
			switch ( szTmp[0] ) {                
				case 'PTZ_TOUR_STATE':	
					PTZ_SCAN_STATE = szTmp[1];
					if(szTmp[1] == "SCAN"){
						start_on = 1;
						idget("PTZ_SCAN_START_ON").style.display="";
						idget("PTZ_SCAN_START").style.display="none";
						idget("PTZ_SCAN_STOP").style.display="";
						idget("PTZ_SCAN_STOP_ON").style.display="none";
						idget("PTZ_SCAN_RESUME").style.display="";
						idget("PTZ_SCAN_RESUME_ON").style.display="none";	
					}
					else{
						stop_on = 1;
						idget("PTZ_SCAN_START_ON").style.display="none";
						idget("PTZ_SCAN_START").style.display="";
						idget("PTZ_SCAN_STOP").style.display="none";
						idget("PTZ_SCAN_STOP_ON").style.display="";
						idget("PTZ_SCAN_RESUME").style.display="";
						idget("PTZ_SCAN_RESUME_ON").style.display="none";
					}
					break;	
					
				case 'PTZ_PARK_CONFIG':
					tmp = szTmp[1].split(',') ;
					idget("txt_Seconds").value = tmp[1];
					if(tmp[0] ==1){
						idget("SETTING_PTZ_PARK_CHECK").checked = true;
						//idget("txt_Seconds").disabled = false;
					}	
					else{
						idget("SETTING_PTZ_PARK_CHECK").checked = false;
						//idget("txt_Seconds").disabled = true;
					}	
					break;
					
				case 'PTZ_TOUR_SCAN':
					tmp = szTmp[1].split(',') ;
					SetSelectedValue(idget("ScanPanSpeed"),tmp[0]);
					Sdirection = tmp[1];
					if (Sdirection == 0)
						idget("scan_clockwise").style.display ="";
					else
						idget("scan_anti_clockwise").style.display ="";
					break;	
					
				case 'PTZ_SCAN_GET':
					Scanset = szTmp[1];
					Scanset = Scanset.split(",");
					var idx_PtzScan=Scanset[0];
					if(idx_PtzScan == 1){
						idget("bScanDelStart").style.display ="";
						//idget("bScanGoStart").style.display ="";
					}
					if(idx_PtzScan == 2){
						idget("bScanDelEnd").style.display ="";
						//idget("bScanGoEnd").style.display ="";
					}
					break;				
			}
		}
	}

	function update_language_PtzScan(){
		if(parent.IsIE() == true){
			//top.update_language(this);													
			try { document.getElementById('set_scan').title = top.GetXmlLangTagByName("SETTING_PTZ_PRESET_SET") ; } catch(e) {}
			try { document.getElementById('goto_scan').title = top.GetXmlLangTagByName("SETTING_PTZ_PRESET_GOTO") ; } catch(e) {}
			try { document.getElementById('rm_scan').title = top.GetXmlLangTagByName("COMMON_MSG_REMOVE") ; } catch(e) {}
			try { document.getElementById('pt_speed1_scan').title = top.GetXmlLangTagByName("PTZ_PAN_TILT_SPEED") ; } catch(e) {}
			try { document.getElementById('scan_anti_clockwise').title = top.GetXmlLangTagByName("PTZ_SCAN_ANTI_CLOCKWISE") ; } catch(e) {}
			try { document.getElementById('scan_clockwise').title = top.GetXmlLangTagByName("PTZ_SCAN_CLOCKWISE") ; } catch(e) {}
			try { document.getElementById('PTZ_SCAN_START').title = top.GetXmlLangTagByName("COMMON_MSG_START") ; } catch(e) {}
			try { document.getElementById('PTZ_SCAN_STOP').title = top.GetXmlLangTagByName("COMMON_MSG_STOP") ; } catch(e) {}
			try { document.getElementById('PTZ_SCAN_RESUME').title = top.GetXmlLangTagByName("COMMON_MSG_RESUME") ; } catch(e) {}
			try { document.getElementById('PTZ_SCAN_START_ON').title = top.GetXmlLangTagByName("COMMON_MSG_START") ; } catch(e) {}
			try { document.getElementById('PTZ_SCAN_STOP_ON').title = top.GetXmlLangTagByName("COMMON_MSG_STOP") ; } catch(e) {}
			try { document.getElementById('PTZ_SCAN_RESUME_ON').title = top.GetXmlLangTagByName("COMMON_MSG_RESUME") ; } catch(e) {}
			try { document.getElementById('StartPoint').innerHTML = top.GetXmlLangTagByName("COMMON_MSG_START") ; } catch(e) {}
			try { document.getElementById('EndPoint').innerHTML = top.GetXmlLangTagByName("COMMON_MSG_END") ; } catch(e) {}
			try { err_PtzScan = top.GetXmlLangTagByName("COMMON_MSG_SET_ERR") ; } catch(e) {}												
		}
		else{
			//parent.window.opener.top.update_language(this);
			//top.update_language(this);
			try { document.getElementById('set_scan').title = top.GetXmlLangTagByName("SETTING_PTZ_PRESET_SET") ; } catch(e) {}
			try { document.getElementById('goto_scan').title = top.GetXmlLangTagByName("SETTING_PTZ_PRESET_GOTO") ; } catch(e) {}
			try { document.getElementById('rm_scan').title = top.GetXmlLangTagByName("COMMON_MSG_REMOVE") ; } catch(e) {}
			try { document.getElementById('pt_speed1_scan').title = top.GetXmlLangTagByName("PTZ_PAN_TILT_SPEED") ; } catch(e) {}
			try { document.getElementById('scan_anti_clockwise').title = top.GetXmlLangTagByName("PTZ_SCAN_ANTI_CLOCKWISE") ; } catch(e) {}
			try { document.getElementById('scan_clockwise').title = top.GetXmlLangTagByName("PTZ_SCAN_CLOCKWISE") ; } catch(e) {}
			try { document.getElementById('PTZ_SCAN_START').title = top.GetXmlLangTagByName("COMMON_MSG_START") ; } catch(e) {}
			try { document.getElementById('PTZ_SCAN_STOP').title = top.GetXmlLangTagByName("COMMON_MSG_STOP") ; } catch(e) {}
			try { document.getElementById('PTZ_SCAN_RESUME').title = top.GetXmlLangTagByName("COMMON_MSG_RESUME") ; } catch(e) {}
			try { document.getElementById('PTZ_SCAN_START_ON').title = top.GetXmlLangTagByName("COMMON_MSG_START") ; } catch(e) {}
			try { document.getElementById('PTZ_SCAN_STOP_ON').title = top.GetXmlLangTagByName("COMMON_MSG_STOP") ; } catch(e) {}
			try { document.getElementById('PTZ_SCAN_RESUME_ON').title = top.GetXmlLangTagByName("COMMON_MSG_RESUME") ; } catch(e) {}
			try { document.getElementById('StartPoint').innerHTML = top.GetXmlLangTagByName("COMMON_MSG_START") ; } catch(e) {}
			try { document.getElementById('EndPoint').innerHTML = top.GetXmlLangTagByName("COMMON_MSG_END") ; } catch(e) {}
			try { err_PtzScan = top.GetXmlLangTagByName("COMMON_MSG_SET_ERR") ; } catch(e) {}
		}
	}

	function PageOnload_PtzScan(){
		//idget("bScanGoStart").onmousedown=DoScanGo;
		idget("bScanSetStart").onmouseover=bScansetMouseOver;
		idget("bScanSetStart").onmouseout=bScansetMouseOut;
		idget("bScanGoStart").onmouseover=bScanGoMouseOver;
		idget("bScanGoStart").onmouseout=bScanGoMouseOut;
		idget("bScanDelStart").onmouseover=bScanDelMouseOver;
		idget("bScanDelStart").onmouseout=bScanDelMouseOut;
		
		//idget("bScanGoEnd").onmousedown=DoScanGo;
		idget("bScanSetEnd").onmouseover=bScansetMouseOver;
		idget("bScanSetEnd").onmouseout=bScansetMouseOut;
		idget("bScanGoEnd").onmouseover=bScanGoMouseOver;
		idget("bScanGoEnd").onmouseout=bScanGoMouseOut;
		idget("bScanDelEnd").onmouseover=bScanDelMouseOver;
		idget("bScanDelEnd").onmouseout=bScanDelMouseOut;
				
		if(parent.IsIE() == true){
			CameraType = top.gUnitType;
		}
		else{
			CameraType = top.gUnitType;
		}
		
		if(CameraType.indexOf("Speed Dome")>-1){
			idget("scan_direction").style.display ="";
			idget("scan_direction1").style.display ="";
		}
		else{	
			idget("scan_direction").style.display ="none";
			idget("scan_direction1").style.display ="none";
		}
		
		update_language_PtzScan();
		doGetSettings_PtzScan();		
	}	

	function frame_extent_2_PtzScan(){		
		window.frameElement.height=800;		
		}
		
	PageOnload_PtzScan();	
//---3rd section of scripts ---//

//---4th section of scripts ---//
	var err1_PtzTour = 'Error. Invalid settings.';	
	var gAccount_PtzTour = "admin";	//var gAccount_PtzTour = "admin";
	var gPwd_PtzTour = "123456";	//var gPwd_PtzTour = "123456";
	var tourPresetList = [] ;
	var PresetObjList_PtzTour = [] ;
	var ShowSpeed = false;
	
	function StartStopTouring(){
		stop_status();
		var cmd = "/cgi-bin/encoder?USER="+ gAccount_PtzTour +"&PWD="+ gPwd_PtzTour;
			cmd+="&PTZ_TOUR_STATE=";
			cmd+=idget('selTourstate').value;			
		var resp=doRequest(cmd);			
		if(resp.split(":")[0]!="OK"){
			ReadPTZTOURSTATE();
		}		
	}

	function SaveCancel(mode){
		var group = document.getElementById('selCurrentTour').value.substring(4,6);
		var cmd = "/cgi-bin/encoder?USER="+ gAccount_PtzTour +"&PWD="+ gPwd_PtzTour +"&";
		var cmdDisable = cmd + 'PTZ_TOUR_SET='+ group + ',0';	
		
		idget("BUTTON_SAVE").style.display="none";
		idget("BUTTON_CANCEL").style.display="none";
		idget("BUTTON_EDIT").style.display="";
		idget("trEditTile").style.display="none";
		idget("trEditAdd").style.display="none";
		if(ShowSpeed == false){
			var PS='5';
			var TS='5';
		
		}
		if(mode == "Cancel"){
			toChangeModifyTour();
		}else if(tourPresetList.length == 0){
			doRequest(cmdDisable);
		}else if(mode == "Save"){
			for(var i = 0; i<tourPresetList.length; i++){
				var entry = i + 1 ;
				if(i > 0){
					cmd = cmd + '&' ;
				}
				if(ShowSpeed == false)
					cmd = cmd + 'PTZ_TOUR_SET='+ group +','+ entry +',1,'+ tourPresetList[i].presetIndex +','+ tourPresetList[i].time +','+ entry +','+ PS +','+ TS +',7';
				else	
					cmd = cmd + 'PTZ_TOUR_SET='+ group +','+ entry +',1,'+ tourPresetList[i].presetIndex +','+ tourPresetList[i].time +','+ entry +','+ tourPresetList[i].PanSpeed +','+ tourPresetList[i].TiltSpeed +',7';
			}
			doRequest(cmdDisable);			
			doRequest(cmd);
			DrawTourPresetList_PtzTour();
		}
	}	
	
	function EditTour(){
		idget("BUTTON_SAVE").style.display="";
		idget("BUTTON_CANCEL").style.display="";
		idget("BUTTON_EDIT").style.display="none";
		idget("trEditTile").style.display="";
		idget("trEditAdd").style.display="";
		DrawTourPresetList_PtzTour();
	}	

	function addPresetToTour(){
		var preset = document.getElementById('selectPreset').value ;
		var tmp = preset.split('|%|') ;
		var pIndex = tmp[0] ;
		var pName = tmp[1] ;
		var times = document.getElementById('StayTimes').value ;
		if(ShowSpeed == true){
			var xS = document.getElementById('TourPanSpeed').value ;		
			var yS = document.getElementById('TourPanSpeed').value ;
		}
		if(isNaN(parseInt(times)) == true){
			alert(err1_PtzTour);
			document.getElementById('StayTimes').focus();
			return false;
		}
		if(times>=1 && times<=255 ){
		
		}
		else{
			alert(err1_PtzTour);
			document.getElementById('StayTimes').focus();
			return false;
		}
		var obj = {entry:tourPresetList.length,presetIndex:pIndex,presetName:pName,time:times,PanSpeed:xS,TiltSpeed:yS};
		tourPresetList[tourPresetList.length] = obj ;		
		DrawTourPresetList_PtzTour();
	}

	function ReadPTZTOURSTATE(){
		var cmd = "/cgi-bin/encoder?USER="+ gAccount_PtzTour +"&PWD="+ gPwd_PtzTour;
			cmd+="&PTZ_TOUR_STATE"
		var szReturn = doRequest(cmd);

		szReturn = szReturn.split('\n') ;
		for (nIdx=0; nIdx< szReturn.length; nIdx++) {
			szTmp = doSplitValue( szReturn[nIdx] ) ;
			switch ( szTmp[0] ) {
				case 'PTZ_TOUR_STATE' :
					var state = szTmp[1] ;
					if(state == 'DISABLE' || state == 'SCAN')
						document.getElementById('selTourstate').value = "DISABLE" ;
					else
						document.getElementById('selTourstate').value = state ;
					break ;
			}
		}
	}	
	
	function FindPresetName(x){	
		for(var i=0; i<=PresetObjList_PtzTour.length-1; i++ ){
			if(PresetObjList_PtzTour[i].index == x){
				return PresetObjList_PtzTour[i].name ;
			}
		}
		return "Deleted";
	}
	
	function toChangeModifyTour(){		
		var value = document.getElementById('selCurrentTour').value.substring(4,6);
		tourPresetList = [] ;
		var cmd = "/cgi-bin/encoder?USER="+ gAccount_PtzTour +"&PWD="+ gPwd_PtzTour;
			cmd+="&PTZ_TOUR_GET=";
			cmd+=value;
		var szReturn = doRequest(cmd);
		szReturn = szReturn.split('\n') ;
		for (nIdx=0; nIdx< szReturn.length; nIdx++) {
			szTmp = doSplitValue( szReturn[nIdx] ) ;
			switch ( szTmp[0] ) {
				case 'PTZ_TOUR_GET' :
					var result = szTmp[1].split(',') ;
					if(result[1] == 0){
						
						break;
					}
					pName = FindPresetName(result[2]);
					var obj = {entry:result[1],presetIndex:result[2],presetName:pName,time:result[3],PanSpeed:result[5],TiltSpeed:result[6]};
					tourPresetList[tourPresetList.length] = obj ;
					break ;
			}
		}
		DrawTourPresetList_PtzTour();
	}	
	
	function DrawTourPresetList_PtzTour(){		
		var sb = [] ;
		var w0,w1,w2;

		if (ShowSpeed == true){											
			w0 = "32%";
			w1 = "20%";
			w2 = "12%";
		}else{											
			w0 = "54%";
			w1 = "22%";
			w2 = "12%";
		}

		if(tourPresetList.length == 0)
			idget('DivTourPresetList').innerHTML = "";
		else{
			sb[sb.length] = '<table width="100%" border="0" cellspacing="1" cellpadding="1">' ;
			for(var i=0; i<tourPresetList.length; i++){
				sb[sb.length] = '<tr>' ;
				sb[sb.length] = '<td width='+w0+' align="left">' ;
				sb[sb.length] = '<label align="left">'+ tourPresetList[i].presetName +'</label>' ;
				sb[sb.length] = '</td>' ;
				
				if(idget("BUTTON_EDIT").style.display == "none")
					sb[sb.length] = '<td width='+w1+' align="center"><img src="../images/up.png" alt="" border="0" onclick="movePresetItem(\'upup\','+ i +');" style="cursor:pointer;margin-right:1px;"><img src="../images/up1.png" style="cursor:pointer;margin-right:1px;" onclick="movePresetItem(\'up\','+ i +');"><img src="../images/down1.png" style="cursor:pointer;margin-right:1px;" onclick="movePresetItem(\'down\','+ i +');"><img src="../images/down.png" alt="" style="cursor:pointer" onclick="movePresetItem(\'downdown\','+ i +');"></td>' ;
				else
					sb[sb.length] = '<td width='+w1+'></td>';

				sb[sb.length] = '<td width='+w2+' align="center"><label>'+ tourPresetList[i].time +'</label></td>' ;
				if (ShowSpeed == true){
					sb[sb.length] = '<td width="24%" align="center"><label>'+ tourPresetList[i].PanSpeed +'</label></td>' ;
				}
				if(idget("BUTTON_EDIT").style.display == "none"){
					sb[sb.length] = '<td width="6%" align="center"><img src="../images/eye.gif" alt="" style="cursor:pointer" onclick="GoToPreset('+ tourPresetList[i].presetIndex +')"></td>' ;
					sb[sb.length] = '<td width="6%" align="center"><img src="../images/delete.gif" alt="" style="cursor:pointer" onclick="toRemovePreset('+ i +')"></td>' ;
				}else{
					sb[sb.length] = '<td width="6%"></td>';
					sb[sb.length] = '<td width="6%"></td>';
				}
				sb[sb.length] = '</tr>' ;
			}
			sb[sb.length] = '</table>' ;
			idget('DivTourPresetList').innerHTML = sb.join('') ;
		}
	}

	
	function update_language_PtzTour(){
		if(parent.IsIE() == true){
			//top.update_language(this);	
			try { document.getElementById('SETTING_PTZ_TOUR_PAN2').innerHTML = top.GetXmlLangTagByName("SETTING_PTZ_TOUR_PAN") ; } catch(e) {}	
			try { document.getElementById('SETTING_PTZ_TOUR_TILT2').innerHTML = top.GetXmlLangTagByName("SETTING_PTZ_TOUR_TILT") ; } catch(e) {}				
			try { document.getElementById('pt_speed1_tour').title = top.GetXmlLangTagByName("PTZ_PAN_TILT_SPEED") ; } catch(e) {}
			try { document.getElementById('pt_speed2').title = top.GetXmlLangTagByName("PTZ_PAN_TILT_SPEED") ; } catch(e) {}
			try { document.getElementById('dwell1').title = top.GetXmlLangTagByName("SETTING_EVENT_LIST_DURATION") ; } catch(e) {}
			try { document.getElementById('dwell2').title = top.GetXmlLangTagByName("SETTING_EVENT_LIST_DURATION") ; } catch(e) {}
			try { err1_PtzTour = top.GetXmlLangTagByName("COMMON_MSG_SET_ERR") ; } catch(e) {}			
		}	
		else{
			//parent.window.opener.top.update_language(this);		
			try { document.getElementById('SETTING_PTZ_TOUR_PAN2').innerHTML = top.GetXmlLangTagByName("SETTING_PTZ_TOUR_PAN") ; } catch(e) {}	
			try { document.getElementById('SETTING_PTZ_TOUR_TILT2').innerHTML = top.GetXmlLangTagByName("SETTING_PTZ_TOUR_TILT") ; } catch(e) {}				
			try { document.getElementById('pt_speed1_tour').innerHTML = top.GetXmlLangTagByName("PTZ_PAN_TILT_SPEED") ; } catch(e) {}				
			try { document.getElementById('pt_speed2').innerHTML = top.GetXmlLangTagByName("PTZ_PAN_TILT_SPEED") ; } catch(e) {}				
			try { document.getElementById('dwell1').innerHTML = top.GetXmlLangTagByName("SETTING_EVENT_LIST_DURATION") ; } catch(e) {}				
			try { document.getElementById('dwell2').innerHTML = top.GetXmlLangTagByName("SETTING_EVENT_LIST_DURATION") ; } catch(e) {}
			try { err1_PtzTour = top.GetXmlLangTagByName("COMMON_MSG_SET_ERR") ; } catch(e) {}				
		}
	}

	function GoToPreset(PresetIndex){
		var cmd = "/cgi-bin/encoder?USER="+ gAccount_PtzTour +"&PWD="+ gPwd_PtzTour;
			cmd+="&PTZ_PRESET_GO="+PresetIndex;
		var Result = doRequest(cmd);
	}
	
	function toRemovePreset(x){
		tourPresetList.splice(x,1);
		DrawTourPresetList_PtzTour();
	}
	
	function movePresetItem(mode,x){
		if(tourPresetList.length < 2)
			return false ;
		
		switch ( mode ) {
			case 'upup' :
				if(x > 0){
					var target = tourPresetList.splice(x,1);
					tourPresetList.splice(0,0,target[0]);
					DrawTourPresetList_PtzTour();
				}
				break;
			
			case 'up' :
				if(x > 0){
					var target = tourPresetList[x];
					tourPresetList[x]=tourPresetList[x-1];
					tourPresetList[x-1]=target;
					DrawTourPresetList_PtzTour();
				}
				break;
			
			case 'downdown' :
				if(x < tourPresetList.length-1){
					var target = tourPresetList.splice(x,1);
					tourPresetList[tourPresetList.length] = target[0];
					DrawTourPresetList_PtzTour();
				}
				break;
			
			case 'down' :
				if(x < tourPresetList.length-1){
					var target = tourPresetList[x];
					tourPresetList[x] = tourPresetList[x+1];
					tourPresetList[x+1] = target;
					DrawTourPresetList_PtzTour();
				}
				break;	
		}
	}
	
	function UpdateUI_PtzTour(){
		if(parent.IsIE() == true){
			if(top.gPT_Enable == 1)
				ShowSpeed = true;				
			else	
				ShowSpeed = false;
		}	
		else{
			if(top.gPT_Enable == 1)
				ShowSpeed = true;				
			else	
				ShowSpeed = false;
		}	
			
		if(ShowSpeed == false){
			idget("tbSpeed1").rows[0].deleteCell(2);
			idget("tbSpeed1").rows[1].deleteCell(2);
			idget("tbSpeed1").rows[2].deleteCell(2);
			idget("tbSpeed1").rows[3].cells[0].colSpan="3";
			
			idget("tbSpeed1").rows[0].cells[0].width="76%";
			idget("tbSpeed1").rows[2].cells[0].width="76%";//marty
			idget("tbSpeed1").rows[0].cells[1].width="12%";
			idget("tbSpeed1").rows[0].cells[2].width="12%";
		}
	}	
	
	function PresetGetConfig_PtzTour(){
		var cmd = "/cgi-bin/encoder?USER="+ gAccount_PtzTour +"&PWD="+ gPwd_PtzTour;
			cmd+="&PTZ_PRESET_GET"
		var Presets = doRequest(cmd).split("\n");
		var i;
		var idx;
		var tourpresets=document.getElementById('selectPreset');
		

		while (tourpresets.options.length > 0 ) {
			tourpresets.remove(0);
		}
		
		for(i in Presets){
			Preset=Presets[i].split("'")[1];
			if(Preset==undefined) continue;
			Preset=Preset.split(",");
			idx=Preset[0];
			if(idx>32 || idx<1) continue;

			var o=document.createElement('option');
			o.text=Preset[8];
			o.value=Preset[0] +'|%|'+ Preset[8];
			PresetObjList_PtzTour[PresetObjList_PtzTour.length] = {index:Preset[0],name:Preset[8]} ;
			try{
				tourpresets.add(o,null); // standards compliant
			}catch(ex){
				tourpresets.add(o); // IE only
			}			
		}
	}	
	
	function PageOnload_PtzTour(){		
		update_language_PtzTour();
		if(parent.IsIE() == true){
			gAccount_PtzTour = top.gAccount;
			gPwd_PtzTour = top.gPwd;												
		}	
		else{
			gAccount_PtzTour = top.gAccount;
			gPwd_PtzTour = top.gPwd;
		}	
		
		UpdateUI_PtzTour();
		PresetGetConfig_PtzTour();
		ReadPTZTOURSTATE();
		toChangeModifyTour();	
		idget("BUTTON_SAVE").style.display="none";
		idget("BUTTON_CANCEL").style.display="none";
		idget("BUTTON_EDIT").style.display="";
		idget("trEditTile").style.display="none";
		idget("trEditAdd").style.display="none";		
		DrawTourPresetList_PtzTour();
	}
	
	
	function frame_extent_2_PtzTour(){		
		window.frameElement.height=800;											
	}
	
	PageOnload_PtzTour();	
//---4th section of scripts ---//

//---5th section of scripts ---//
	var parentWin = window.dialogArguments ;
	
	function IsIE(){	
		if(document.documentMode)
			return true;
		else	
			return false;	
	}	
	function PTZWindowClose(){
		try{
			if(IsIE() == true){	
				parentWin.ptz_state = 0;
				if(parentWin.top.gIspGeneration=="C05"){
					if(parentWin.CurrentPTZ==0)
						bg = "url(/images/icon.png) 0px -1290px no-repeat";
					if(parentWin.CurrentPTZ==1)
						bg = "url(/images/icon.png) 0px -1350px no-repeat";	
					parentWin.idget("current_ptz").style.background = bg ;
				}
				else{
					parentWin.document.getElementById("ptz_icon").className = "ptz_off";	
					if(parentWin.StreamMode == "EPTZ"){	
						bg = "url(/images/icon.png) 0px -270px no-repeat";	
						parentWin.idget("ptz_icon").style.background = bg;
					}
				}	
					
				parentWin.document.getElementById("oMedia").DisableMousePTZ();	
				parentWin.document.getElementById("oMedia").DisableRelativePTZ();			
				parentWin.document.getElementById("oMedia").DisablePixelsPTZ();					
			}
			else{
				window.opener.ptz_state = 0;
				window.opener.document.getElementById("ptz_icon").className = "ptz_off";		
			}	
		}catch(e) {}
		
	}

	function UpdateCss(){	
		if(IsIE() == false){		
			document.styleSheets[1].cssRules[3].style.backgroundColor = document.styleSheets[0].cssRules[0].styleSheet.cssRules[5].style.backgroundColor;
			document.styleSheets[1].cssRules[5].style.backgroundColor = document.styleSheets[0].cssRules[0].styleSheet.cssRules[5].style.backgroundColor;
			document.styleSheets[1].cssRules[6].style.backgroundColor = document.styleSheets[0].cssRules[0].styleSheet.cssRules[5].style.backgroundColor;
			document.styleSheets[1].cssRules[6].style.borderBottomColor = document.styleSheets[0].cssRules[0].styleSheet.cssRules[5].style.backgroundColor;
			document.styleSheets[1].cssRules[7].style.backgroundColor = document.styleSheets[0].cssRules[0].styleSheet.cssRules[5].style.backgroundColor;		
		}
		else{
			document.styleSheets[1].rules[4].style.backgroundColor = document.styleSheets[0].imports[0].rules[5].style.backgroundColor;//ie	
			document.styleSheets[1].rules[6].style.backgroundColor = document.styleSheets[0].imports[0].rules[5].style.backgroundColor;//ie	
			document.styleSheets[1].rules[7].style.backgroundColor = document.styleSheets[0].imports[0].rules[5].style.backgroundColor;//ie	
			document.styleSheets[1].rules[7].style.borderBottomColor = document.styleSheets[0].imports[0].rules[5].style.backgroundColor;//ie	
			document.styleSheets[1].rules[8].style.backgroundColor = document.styleSheets[0].imports[0].rules[5].style.backgroundColor;//ie	
		}
	}
		
	function update_language_myPTZ(){
		if(IsIE() == true){		
			top.update_language(this);					
		}
		else{		
			//window.opener.top.update_language(this);
			top.update_language(this);
		}		
	}
	
	function PageOnLoad_myPTZ(){
		update_language_myPTZ();
		UpdateCss();			
		//window.onbeforeunload  = PTZWindowClose;
	}

	setTimeout(function(){ PageOnLoad_myPTZ(); }, 0);  //PageOnLoad_myPTZ();
//---5th section of scripts ---//