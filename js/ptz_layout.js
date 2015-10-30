//---1st section of scripts ---//
	var	ResW=0;
	var	ResH=0;
	var DOs = parseInt(top.gDO);
	//DOs= 8; //this line must be removed in the future
	var DoClicked = 0;
	var CurrentDo = 1;
	var CurrentPTZ = 0;   //0:PTZ, 1:BoxPTZ
	var FisheyeModeClicked = 0;
	var PtzClicked = 0;
	var CurrentMode = 0;  //  0:ePTZ , 1:Panorama , 2:Fisheye_view
	var NowPlayingMedia = 1;
	var ManualTrigger = 1;
	var mic_state = 0;
	var ptz_state = 0;	
	var mini_view_state = 0;	
	var audio_in_enbaled = 0;
	var PORT_CONTROL = 0;
	var PORT_VIDEO = 0;
	var PORT_MULTICAST = 0;
	var PORT_RTSP = 0;
	//var FisheyeModule = 2;
	var MountType = "";
	var ViewMode;
	var ModePTZ;
	var ViewSize;
	var ViewSize_S1;
	var ViewSize_S2;
	var ViewSizeCookie;
	var CameraConf;
	var StreamMode;
	var Screenwidth ;
	var Screenheight ;
	var Res;
	var Mode1Changed = 0;
	var Mode2Changed = 0;
	
	function EnterSetup()
	{
		if(top.guest_preview == 1)
		{
			top.guest_preview = 0;
			top.load_iframe("/login.html");	
		}	
		else
		{
			if(ptz_state == 1){
				//ptz_state = 0;
				//PTZCtrlWindow.close();
				document.getElementById("ptz_icon").click();
			}
			//top.load_iframe('/setup/setup_layout.html');
			window.setTimeout("top.load_iframe('/setup/setup_layout.html')", 200 );
		}	
	}
	
	function SizeUp()
	{
		//alert("NowPlayingMedia="+NowPlayingMedia);
		if(oMedia.height>(Screenheight-90))
			idget("mainbody").scroll="auto";
			
		var Width=parseInt(idget("oMedia").width)*3/2;
		if((top.gUnitType == "Hemispheric Camera" && top.gIspGeneration == "A1_ISP") || (StreamMode=="FISHEYE_VIEW"&&top.gIspGeneration == "C02"))
		{
			if(CurrentMode==1)//Panaroma view
			{	
				if(ResW*ResH>=1440*1080)
				{
					if(Width>1920)
					{
						idget("oMedia").width  = 1920 ;
						idget("oMedia").height = 1080 +16 ;
					}	
					else
					{
						idget("oMedia").width  = Width ;
						idget("oMedia").height = Width*1080/1920 +16 ;
					}
				}
				else if((1280*960<=ResW*ResH) && (ResW*ResH<1440*1080))	
				{
					if(Width>1280)
					{
						idget("oMedia").width  = 1280 ;
						idget("oMedia").height = 720 +16 ;
					}	
					else
					{
						idget("oMedia").width  = Width ;
						idget("oMedia").height = Width*1080/1920 +16 ;
					}
				}
				else
				{
					if(Width>640)
					{
						idget("oMedia").width  = 640 ;
						idget("oMedia").height = 360 +16 ;
					}	
					else
					{
						idget("oMedia").width  = Width ;
						idget("oMedia").height = Width*1080/1920 +16 ;
					}
				}
			}
			else
			{
				if( Width <= ResW){
				idget("oMedia").width  = Width ;
				idget("oMedia").height = Width*ResH/ResW +16 ;
				}else{
					idget("oMedia").width  = ResW ;
					idget("oMedia").height = ResH +16 ;
				}
			}
		}
		else
		{	
			if( Width <= ResW){
				idget("oMedia").width  = Width ;
				idget("oMedia").height = Width*ResH/ResW +16 ;
			}else{
				idget("oMedia").width  = ResW ;
				idget("oMedia").height = ResH +16 ;
			}	
		}
		ViewSizeCookie = oMedia.width+","+oMedia.height;
		//alert("SizeUp"+"\n"+"ViewSizeCookie="+ViewSizeCookie);
		if(NowPlayingMedia==1)
			setCookie("ViewSize_S1",ViewSizeCookie);
		if(NowPlayingMedia==2)
			setCookie("ViewSize_S2",ViewSizeCookie);
	}
	
	function SizeDown()
	{
		var Width=parseInt(idget("oMedia").width)*2/3;
		if(NowPlayingMedia==1 && idget("oMedia").width < 640)
			return;
			
		if((top.gUnitType == "Hemispheric Camera" && top.gIspGeneration == "A1_ISP") || (StreamMode=="FISHEYE_VIEW"&&top.gIspGeneration == "C02"))
		{
			if(CurrentMode==1)
			{				
				if (Width > 640) {
					idget("oMedia").width  = Width;
					idget("oMedia").height = Width*1080/1920 +16 ;
				}else{
					idget("oMedia").width  = 640;
					idget("oMedia").height = 640*1080/1920 +16 ;
				}
			}
			else
			{
				if (Width > 640) {
				idget("oMedia").width  = Width;
				idget("oMedia").height = Width*ResH/ResW +16 ;
				}else{
					idget("oMedia").width  = 640;
					idget("oMedia").height = 640*ResH/ResW +16 ;
				}
			}
		}
		else
		{
			if(NowPlayingMedia==1)
			{
				if (Width > 640) {
					idget("oMedia").width  = Width;
					idget("oMedia").height = Width*ResH/ResW +16 ;
				}else{
					idget("oMedia").width  = 640;
					idget("oMedia").height = 640*ResH/ResW +16 ;
				}
			}
			else
			{
				if (Width > 320) {
					idget("oMedia").width  = Width;
					idget("oMedia").height = Width*ResH/ResW +16 ;
				}else{
					idget("oMedia").width  = 320;
					idget("oMedia").height = 240+16 ;
				}
			}	
		}		
		ViewSizeCookie = oMedia.width+","+oMedia.height;
		//alert("SizeDown"+"\n"+"ViewSizeCookie="+ViewSizeCookie);
		if(NowPlayingMedia==1)
			setCookie("ViewSize_S1",ViewSizeCookie);
		if(NowPlayingMedia==2)
			setCookie("ViewSize_S2",ViewSizeCookie);
	}
	
	
	function FullScreen()
	{
		oMedia.EnableFullScreen();
	}
	
	function plusO(n, l) {
		try {
			n = n.toString();
			var diff = l - n.length;
			var addo = '';
			for(var i = 0; i < diff; i++) {
				addo += '0';
			}
			return addo + n;
		} catch(e) {
			//debug(e, 'plusO');
		}
	}
	
	function SetDO(level)
	{
		var szSystem ;
						
		if(top.guest_preview == 1)
			szSystem = "/cgi-bin/encoder?SET_DO="+CurrentDo+','+ level  ;
		else	
			szSystem = "/cgi-bin/encoder?USER="+ top.gAccount +"&PWD="+ top.gPwd +"&SET_DO=" +CurrentDo+','+ level ;
		top.doRequest(szSystem) ;	
	}
	
	function Snapshot()
	{
		var filename;
		var tmp;
		var dt = new Date();
		var filename = plusO(dt.getYear(), 4) + plusO(dt.getMonth()+1, 2) + plusO(dt.getDate(), 2) + '_' + plusO(dt.getHours(), 2) + '-' + plusO(dt.getMinutes(), 2) + '-' + plusO(dt.getSeconds(), 2) + '.jpg';
		var err = "Error. Get a snapshot";
		
		try { err = top.GetXmlLangTagByName("SNAPSHOT_ERROR") ; } catch(e) {}	
		if(top.IsIE() == true)
		{
			if((top.gUnitType == "Hemispheric Camera" && top.gIspGeneration == "A1_ISP") || StreamMode == "FISHEYE_VIEW") 
			{
				if(oMedia.SnapShot(1, oMedia.GetMyPictureShellFolder() + '\\' + filename, 1, 255, 255, 255,NowPlayingMedia) == 0)
					alert(err);				
				else	
					alert( 'File [' + oMedia.GetMyPictureShellFolder() + '\\' + filename + '] saved');	
			}		
			else
			{
				if(oMedia.SnapShot(0, oMedia.GetMyPictureShellFolder() + '\\' + filename, 1, 255, 255, 255,NowPlayingMedia) == 0)
					alert(err);				
				else	
					alert( 'File [' + oMedia.GetMyPictureShellFolder() + '\\' + filename + '] saved');	
			}
		}
		else
		{
			tmp = "height=" +ResH +","+ "width="+ResW + ",scrollbars=0,location=0,status=0,resizable=0,toolbar=0,menubar=0,directories=0" ;
			window.open('view_snapshot.html','window2',tmp);
		}	
	}	
	
	function VolCtrl()
	{
	
		var xx; 
		xx = event.x;		
		idget("ball").style.left= (xx - 835) + "px";				
		document.onmousemove = mouseMove;
		document.onmouseup = mouseUp;		
	}
	
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//   |<---						document.documentElement.offsetWidth                                  -->|
//   -----------------------------------------------------------------------------------------------------  
//   |    |<--                                      1100px                                     -->|      |
//   |    -----------------------------------------------------------------------------------------      |
//   |    |--------       ---------------------------------------       -------------------       |      |
//   |    |       |       |                                     |       |vol|  |bar||||||||       |      | 
//   |    |--------       ---------------------------------------       -------|----------|       |      |
//   |    |---------------|----------------------------------------------------|----------|--------	     |
//   -----|---------------|----------------------------------------------------|----------|---------------
//        |<-- 120px   -->|                                              bar_start     bar_end 
//  FunBarStart	
//                        |<--                  835px                       -->|
//   |------------------------window.event.clientX------------------------------------|  
//                                                                                 anywhere
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	
	
	function mouseMove()
	{				
		var xx;		
		var FunBarStart;
		var bar_start;
		var bar_end;
		
		if(document.documentElement.offsetWidth <= 1100)
			FunBarStart = 0;
		else	
			FunBarStart = (document.documentElement.offsetWidth -1100)/2;
		bar_start = FunBarStart + 120 + 835;
		bar_end = bar_start + 100;
		
		if(window.event.clientX > bar_start)
			xx = window.event.clientX - FunBarStart - 120 -835 ;
		else	
			xx = event.x - 835;
		oMedia.Mute = 0 ;	
		if(xx <=0  )
		{
			xx = 0;
			oMedia.Mute = 1 ;	
		}	
		if(xx > 93)	
		{
			xx = 93;			
		}
		oMedia.Volume = xx;	
		idget("ball").style.left= xx + "px";			
	}
	
	function mouseUp()
	{	
		var xx ;
		xx = parseInt(idget("ball").style.left);
		
		if(xx <= 0)
			idget("volume_icon").className = "volume_mute";
		else if(xx >0 && xx<33)	
			idget("volume_icon").className = "volume_low";		
		else if(xx >=33 && xx <66)	
			idget("volume_icon").className = "volume_middle";
		else
			idget("volume_icon").className = "volume_high";	
		
		document.onmousemove = null;
		document.onmouseup = null;
	}

	function DrawSubDo()
	{
		if(DOs <= 1)
			return;
		var i = 0;
		var oDiv = document.getElementById("SubDO");
		var oIframe = document.createElement('iframe');
		var oParent = oDiv.parentNode;
		oIframe.id = 'DoFrame';
		oIframe.frameBorder=0+ "px";				 
		oParent.appendChild(oIframe);		 
		oIframe.style.position = 'absolute';
		oIframe.style.top = 0 + "px";
		oIframe.style.left = 0 + "px";
		oDiv.style.height = (DOs*30 + (DOs+1)*3) + "px";

		for(i = 1 ; i <= DOs; i++)
		{
			idget("sub_do"+i).style.marginTop = (30*(i-1) + 3*i) + "px";
			idget("sub_do"+i).style.marginLeft = 3 + "px";
			idget("sub_do"+i).style.display = "";
		}				
				
		oIframe.style.top = oDiv.style.top ;
        oIframe.style.left = oDiv.style.left ;
		
        oIframe.style.zIndex = oDiv.style.zIndex - 1;
		oIframe.style.marginTop = 32 + "px";
		oIframe.style.marginLeft = -3 + "px";
		
        oIframe.style.width = parseInt(oDiv.style.width)+2 + "px";
				
        oIframe.style.height = parseInt(oDiv.style.height)+2 + "px";
		
        oIframe.style.display = 'none';
		

	}
	
	function DrawSubMode()
	{
		var i = 0;
		var oDiv = document.getElementById("SubMode");
		var oIframe = document.createElement('iframe');
		var oParent = oDiv.parentNode;
		oIframe.id = 'ModeFrame';
		oIframe.frameBorder=0 + "px";				 
		oParent.appendChild(oIframe);		 
		oIframe.style.position = 'absolute';
		oIframe.style.top = 0 + "px";
		oIframe.style.left = 0 + "px";
		oDiv.style.height = (3*30 + (3+1)*3) + "px";

		/*for(i = 1 ; i <= 3; i++)
		{
			idget("sub_mode"+i).style.marginTop = (30*(i-1) + 3*i) + "px";
			idget("sub_mode"+i).style.marginLeft = 3 + "px";
			idget("sub_mode"+i).style.display = "";
		}*/				
		
		for(i = 1 ; i <= 4; i++)
		{
			if((i!=2)&&(i!=4))
			{
				idget("sub_mode"+i).style.marginTop = (30*(i-1) + 3*i) + "px";
				idget("sub_mode"+i).style.marginLeft = 3 + "px";
				idget("sub_mode"+i).style.display = "";
			}
			if((i==2) && MountType=="WALL")
			{
				idget("sub_mode"+i).style.marginTop = (30*(i-1) + 3*i) + "px";
				idget("sub_mode"+i).style.marginLeft = 3 + "px";
				idget("sub_mode"+i).style.display = "";
			}
			if((i==4) && (MountType=="CEIL" ||MountType=="GROUND"))
			{
				idget("sub_mode"+i).style.marginTop = (30*(i-3) + 3*(i-2)) + "px";
				idget("sub_mode"+i).style.marginLeft = 3 + "px";
				idget("sub_mode"+i).style.display = "";
			}	
		}
		
		oIframe.style.top = oDiv.style.top;
        oIframe.style.left = oDiv.style.left;
		
        oIframe.style.zIndex = oDiv.style.zIndex - 1;
		oIframe.style.marginTop = 32 + "px";
		oIframe.style.marginLeft = -3 + "px";
		
        oIframe.style.width = parseInt(oDiv.style.width)+2 + "px";
        oIframe.style.height = parseInt(oDiv.style.height)+2 + "px";
        oIframe.style.display = 'none';
		

	}
	
	function DrawSubPtz()
	{
		var i = 0;
		var oDiv = document.getElementById("SubPTZ");
		var oIframe = document.createElement('iframe');
		var oParent = oDiv.parentNode;
		oIframe.id = 'PTZFrame';
		oIframe.frameBorder=0 + "px";				 
		oParent.appendChild(oIframe);		 
		oIframe.style.position = 'absolute';
		oIframe.style.top = 0 + "px";
		oIframe.style.left = 0 + "px";
		oDiv.style.height = (2*30 + (2+1)*3) + "px";
		
		for(i = 1 ; i <= 2; i++)
		{
			idget("ptz_icon"+i).style.marginTop = (30*(i-1) + 3*i) + "px";
			idget("ptz_icon"+i).style.marginLeft = 3 + "px";
			idget("ptz_icon"+i).style.display = "";
		}
		
		oIframe.style.top = oDiv.style.top ;
        oIframe.style.left = oDiv.style.left ;
		
        oIframe.style.zIndex = oDiv.style.zIndex - 1;
		oIframe.style.marginTop = 32 + "px";
		oIframe.style.marginLeft = -3 + "px";
		
        oIframe.style.width = parseInt(oDiv.style.width)+2 + "px";				
        oIframe.style.height = parseInt(oDiv.style.height)+2 + "px";		
        oIframe.style.display = 'none';
	}
	
	function PtzClickHandler()
	{
		if(ptz_state == 1)
		{		
			ptz_state = 0;			
			if(CurrentPTZ==0)
				bg = "url(/images/icon.png) 0px -1290px no-repeat";
			if(CurrentPTZ==1)
				bg = "url(/images/icon.png) 0px -1350px no-repeat";	
								
			idget("current_ptz").style.background = bg ;
			//PTZCtrlWindow.close();
			setTimeout(function(){ top.DisableSubFrm(); }, 0);
			setTimeout(function(){ top.document.getElementById("divDragResizeifrm").style.display = "none"; }, 0);
			setTimeout(function(){ top.document.getElementById("subordinate_frame").style.display = "none"; }, 0);
			if(top.IsIE()){ocxCtrlDisable();}
		}
		else
		{
			var bg;			
			if(PtzClicked == 0)
				PtzClicked = 1 ;
			else	
				PtzClicked = 0 ;
				
			if(PtzClicked == 1)	
			{
				idget("SubPTZ").style.display ="block";
				idget("PTZFrame").style.display ="block";
				if(CurrentPTZ==0)
					bg = "url(/images/icon.png) 0px -1290px no-repeat";
				if(CurrentPTZ==1)
					bg = "url(/images/icon.png) 0px -1350px no-repeat";	
				idget("current_ptz").style.background = bg ;	
			}
			else
			{
				idget("SubPTZ").style.display ="none";
				idget("PTZFrame").style.display ="none";
				if(CurrentPTZ==0)
					bg = "url(/images/icon.png) 0px -1290px no-repeat";
				if(CurrentPTZ==1)
					bg = "url(/images/icon.png) 0px -1350px no-repeat";	
				idget("current_ptz").style.background = bg;	
			}
		}	
	}

	function FisheyeModeClickHandler()
	{
		var bg;
		
		if(FisheyeModeClicked == 0)
			FisheyeModeClicked = 1 ;
		else	
			FisheyeModeClicked = 0 ;
			
		if(FisheyeModeClicked == 1)	
		{
			idget("SubMode").style.display ="block";
			idget("ModeFrame").style.display ="block";
			if(CurrentMode==0)
				bg = "url(/images/icon.png) -45px -720px no-repeat";
			if(CurrentMode==1)
			{
				if(MountType=="WALL")
					bg = "url(/images/icon.png) -45px -1170px no-repeat";	
				if(MountType=="CEIL")
					bg = "url(/images/icon.png) -45px -1260px no-repeat";
				if(MountType=="GROUND")
					bg = "url(/images/icon.png) -45px -1260px no-repeat";
			}	
			if(CurrentMode==2)
				bg = "url(/images/icon.png) -45px -780px no-repeat";
				
			//bg = "url(/images/icon.png) -45px -" + ( CurrentMode*30 + 720) + "px no-repeat";
			idget("current_mode").style.background = bg ;	
		}
		else
		{
			idget("SubMode").style.display ="none";
			idget("ModeFrame").style.display ="none";
			if(CurrentMode==0)
				bg = "url(/images/icon.png) -45px -720px no-repeat";
			if(CurrentMode==1)
			{
				if(MountType=="WALL")
					bg = "url(/images/icon.png) -45px -1170px no-repeat";	
				if(MountType=="CEIL")
					bg = "url(/images/icon.png) -45px -1260px no-repeat";
				if(MountType=="GROUND")
					bg = "url(/images/icon.png) -45px -1260px no-repeat";	
			}		
			if(CurrentMode==2)
				bg = "url(/images/icon.png) -45px -780px no-repeat";
			//bg = "url(/images/icon.png) 0px -" + ( CurrentMode*30 + 720) + "px no-repeat";	
			idget("current_mode").style.background = bg;	
		}
	}
	
	function GetMountType()
	{
		var szSystem;
		szSystem = "/cgi-bin/encoder?USER="+ top.gAccount +"&PWD="+ top.gPwd +"&FISHEYE_INSTALL" ;
		var szReturn = top.doRequest(szSystem) ;
		szReturn = szReturn.split('\n') ;
		for (nIdx=0; nIdx< szReturn.length; nIdx++) {
            szTmp = top.doSplitValue( szReturn[nIdx] ) ;
            
            switch ( szTmp[0] ) {                
				case 'FISHEYE_INSTALL':					
					if(szTmp[1].indexOf("WALL") > -1)
						MountType = "WALL";
					if(szTmp[1].indexOf("CEIL") > -1) 	
						MountType = "CEIL";	
					if(szTmp[1].indexOf("GROUND") > -1) 	
						MountType = "GROUND";		
					break;	
            }
        }	
	}
	
	function PTZModeInit()
	{
		var tmp;
		ModePTZ = getCookie("ModePTZ");		
		if(ModePTZ.indexOf("NaN")> -1 || ModePTZ == "")
			ModePTZ = 0;			//default : 0 ptz
					
		CurrentPTZ = ModePTZ;			
		var bg;
		var PTZModeCookie = "";
		PtzClicked = 0;
		//CurrentPTZ = mode;
			
		idget("SubPTZ").style.display ="none";
		idget("PTZFrame").style.display ="none";
		if(CurrentPTZ==0)
			bg = "url(/images/icon.png) 0px -1290px no-repeat";
		if(CurrentPTZ==1)
			bg = "url(/images/icon.png) 0px -1350px no-repeat";
		
		idget("current_ptz").style.background = bg;	
		PTZModeCookie = CurrentPTZ;	
		setCookie("ModePTZ",PTZModeCookie);
	}
	
	function PTZSeletcHandler(mode)
	{	
		var bg;
		var PTZModeCookie = "";
		var objPtzBtn=idget("current_ptz");
		PtzClicked = 0;
		CurrentPTZ = mode;
		
		idget("SubPTZ").style.display ="none";
		idget("PTZFrame").style.display ="none";
		if(CurrentPTZ==0){
			bg = "url(/images/icon.png) -45px -1290px no-repeat";
			if(top.IsIE() == true){
				idget("oMedia").EnableMousePTZ();	
				idget("oMedia").DisablePixelsPTZ();
				addClass(objPtzBtn, "mouse_ptz_on");
				removeClass(objPtzBtn, "box_ptz_on"); 
			}
		}
		if(CurrentPTZ==1){
			bg = "url(/images/icon.png) -45px -1350px no-repeat";
			if(top.IsIE() == true){
				idget("oMedia").DisableMousePTZ();	
				idget("oMedia").EnablePixelsPTZ();
				addClass(objPtzBtn, "box_ptz_on");
				removeClass(objPtzBtn, "mouse_ptz_on");
			}
		}
		
		objPtzBtn.style.background = bg;	
		PTZModeCookie = CurrentPTZ;	
		setCookie("ModePTZ",PTZModeCookie);
		setTimeout(function(){ top.EnableSubFrm(); }, 10);	
		
		if(ptz_state == 0)
		{
			ptz_state = 1;
			/*
			if(top.IsIE() == true){
				//PTZCtrlWindow = window.showModelessDialog("setup_ptz.html", self, "dialogHeight: 700px; dialogWidth: 400px; help: No; resizable: No; status: No;");
				top.document.getElementById("divDragResizeifrm").style.display = "";
				top.document.getElementById("subordinate_frame").style.display = "";
			}
			else{
				//PTZCtrlWindow=window.open('setup_ptz.html','_blank','width=400,height=700,location=yes ,toolbar=no,resizable=0,scrollbars=yes');		
				top.document.getElementById("divDragResizeifrm").style.display = "";
				top.document.getElementById("subordinate_frame").style.display = "";
			}
			*/
			//setTimeout(function(){ top.EnableSubFrm(); }, 50);			
			top.document.getElementById("divDragResizeifrm").style.display = "";
			top.document.getElementById("subordinate_frame").style.display = "";
			setTimeout(function(){ top.EnableSubFrm(); }, 10);	
		}
		else
		{
			ptz_state = 0;
			//idget("ptz_icon").className = "ptz_off";
			if(CurrentPTZ==0)
				bg = "url(/images/icon.png) 0px -1290px no-repeat";
			if(CurrentPTZ==1)
				bg = "url(/images/icon.png) 0px -1350px no-repeat";		
			idget("current_ptz").style.background = bg;	
			//PTZCtrlWindow.close();
			setTimeout(function(){ top.DisableSubFrm(); }, 0);
			top.document.getElementById("divDragResizeifrm").style.display = "none";
			top.document.getElementById("subordinate_frame").style.display = "none";
			if(top.IsIE()){
				ocxCtrlDisable(); 
				removeClass(objPtzBtn, "mouse_ptz_on");
				removeClass(objPtzBtn, "box_ptz_on"); 
			}
		}
		//ECM_PTZ_Control();
		if(top.IsIE()){ECM_PTZ_Control();}
	}	
	
	function ModeSeletcHandler(Mode)
	{
		//alert("change Mode");
		var bg;
		var ViewModeCookie = "";
		var bMode;
		FisheyeModeClicked = 0;
		CurrentMode = Mode;
		//alert("NowPlayingMedia="+NowPlayingMedia);
		
		doGetSettings();		
		ViewMode = getCookie("ViewMode");
		tmp = ViewMode.split(",");
		bMode = parseInt(tmp[0]);
		//alert("bMode="+bMode+"\n"+"CurrentMode="+CurrentMode);
		if(bMode!=CurrentMode)
		{
			Mode1Changed = 1;
			Mode2Changed = 1;
		}		
		Fit_ScreenSize();
		
		GetMountType();		
		if(Mode == "2")
			idget("MiniatureMode").style.display = "none";
		else	
			idget("MiniatureMode").style.display = "";
			
		idget("SubMode").style.display ="none";
		if(top.guest_preview !=1)
			idget("ModeFrame").style.display ="none";
		//bg = "url(/images/icon.png) 0px -" + (Mode*30 + 720) + "px no-repeat";
		if(CurrentMode==0)
			bg = "url(/images/icon.png) -45px -720px no-repeat";
		if(CurrentMode==1)
		{
			if(MountType=="WALL")
				bg = "url(/images/icon.png) -45px -1170px no-repeat";	
			//if(MountType=="CEIL")
			if(MountType=="CEIL" || MountType=="GROUND")
				bg = "url(/images/icon.png) -45px -1260px no-repeat";			
		}
		if(CurrentMode==2)
			bg = "url(/images/icon.png) -45px -780px no-repeat";
		
		idget("current_mode").style.background = bg;	
		ViewModeCookie = CurrentMode + ',' + mini_view_state;		
		setCookie("ViewMode",ViewModeCookie);
		SetFisheyeMode();
	}	
	
	function DoClickHandler()
	{
		if(DOs <= 1)
			return;
		var bg;
		
		if(DoClicked == 0)
			DoClicked = 1 ;
		else	
			DoClicked = 0 ;
			
		if(DoClicked == 1)	
		{
			idget("SubDO").style.display ="block";
			idget("DoFrame").style.display ="block";
			bg = "url(/images/icon.png) -45px -" + ((CurrentDo-1)*30+300) + "px no-repeat";
			idget("current_do").style.background = bg ;	
		}
		else
		{
			idget("SubDO").style.display ="none";
			idget("DoFrame").style.display ="none";
			bg = "url(/images/icon.png) 0px -" + ((CurrentDo-1)*30+300) + "px no-repeat";
			idget("current_do").style.background = bg;	
		}
	}
	
	function DoSeletcHandler(Do)
	{
		var bg;
		DoClicked = 0;
		CurrentDo = Do;
		idget("SubDO").style.display ="none";
		idget("DoFrame").style.display ="none";
		bg = "url(/images/icon.png) 0px -" + ((Do-1)*30+300) + "px no-repeat";
		
		idget("current_do").style.background = bg;	
		
	}	
		
	function m1mouseover()
	{
		if(NowPlayingMedia == 1)
			return;
		idget("m1").className = "media1_on";
	}
	function m1mouseout()
	{
		if(NowPlayingMedia == 1)
			return;
		idget("m1").className = "media1_off";
	}
	
	function m2mouseover()
	{
		if(NowPlayingMedia == 2)
			return;
		idget("m2").className = "media2_on";
	}
	function m2mouseout()
	{
		if(NowPlayingMedia == 2)
			return;
		idget("m2").className = "media2_off";
	}
	
	function ECM_PTZ_Control()
	{	
		//alert("gZoom_Capability="+top.gZoom_Capability+"\n"+"gPT_Enable="+top.gPT_Enable+"\n"+"gSerialPorts="+top.gSerialPorts);
		if(top.gStreamMode == "EPTZ")//FishEye's EPTZ
		{
			idget("oMedia").EnableRelativePTZ();
		}		
		else //gStreamMode != "EPTZ"
		{
			if(top.gZoom_Capability != "None") //ZoomCap!=None
			{
				if(top.gPT_Enable != 1)
				{
					if(top.gSerialPorts==0)//ZoomOnly
					{
						idget("oMedia").SetMousePTZOnlyZoom(1);					
						idget("oMedia").EnableMousePTZ();
					}
					else
					{
						idget("oMedia").EnableMousePTZ();
					}	
				}
				else
					idget("oMedia").EnableMousePTZ();
		
				if(top.gIspGeneration == "C05" && CurrentPTZ==1)
				{
					idget("oMedia").DisableMousePTZ();	
					idget("oMedia").EnablePixelsPTZ();
					//console.log("CurrentPTZ: "+CurrentPTZ);
				}	
			}
			else //ZoomCap=None
			{
				if(top.gPT_Enable == 1 || top.gSerialPorts!=0)
				{
					idget("oMedia").SetMousePTZOnlyPT(1);
					idget("oMedia").EnableMousePTZ();
				}
			}
		}
	}
	
	function M1ClickHandler()
	{
		if((NowPlayingMedia == 2) && (mic_state == 1))
			ClearMicState();
			
		NowPlayingMedia = 1;
		if(top.IsIE() == true)
		{
			oMedia.Disconnect();
			doGetSettings();
			ECM_Setup();
		}
		else
		{
			doGetSettings();
			SetupPlayer("track1");
		}
		idget("m1").className = "media1_on";
		idget("m2").className = "media2_off";		
		if(idget("ptz_icon").className == "ptz_on") 
		{			
			if(top.IsIE()==true)
			{
				if(top.gStreamMode != "EPTZ")//Not FishEye's EPTZ
				{
					idget("oMedia").DisableRelativePTZ();	
					//idget("oMedia").EnableMousePTZ();
				}				
			}	
		}		
		if(ptz_state == 1 && top.IsIE()==true)
			ECM_PTZ_Control();
	}
	
	function M2ClickHandler()
	{
		if((NowPlayingMedia == 1) && (mic_state == 1))
			ClearMicState();
			
		NowPlayingMedia = 2;
		if(top.IsIE() == true)
		{
			oMedia.Disconnect();
			doGetSettings();
			ECM_Setup();
		}
		else
		{
			doGetSettings();
			SetupPlayer("track2");
		}
		idget("m2").className = "media2_on";
		idget("m1").className = "media1_off";
		
		if(idget("ptz_icon").className == "ptz_on") 
		{
			if(top.IsIE()==true)
			{
				if(top.gStreamMode != "EPTZ")//Not FishEye's EPTZ
				{
					idget("oMedia").DisableRelativePTZ();	
					//idget("oMedia").EnableMousePTZ();
				}						
			}
		}
		if(ptz_state == 1 && top.IsIE()==true)
			ECM_PTZ_Control();
	}
	
	function MouseFunctionSetup()
	{
		idget("m1").onmouseover = m1mouseover;
		idget("m1").onmouseout = m1mouseout;
		idget("m2").onmouseover = m2mouseover;
		idget("m2").onmouseout = m2mouseout;
	}
	
	
	function MicHandler()
	{
		if(mic_state == 0)
		{
			mic_state = 1;
			idget("mic").className = "mic_on";
			oMedia.GetAudioToken() ;
			oMedia.StartAudioTransfer() ;
		}
		else
		{
			mic_state = 0;
			idget("mic").className = "mic_off";
			oMedia.StopAudioTransfer();
			oMedia.FreeAudioToken();
		}
	}
	
	function ClearMicState()
	{
		mic_state = 0;
		idget("mic").className = "mic_off";
		oMedia.StopAudioTransfer();
		oMedia.FreeAudioToken();	
	}
	
	function MiniatureViewhandler()
	{
		var ViewModeCookie = "";
		if(mini_view_state == 0)
		{
			mini_view_state = 1;
			if(top.gIspGeneration == "C02" && StreamMode != "FISHEYE_VIEW")
			{
				var cmd="/cgi-bin/encoder?USER="+top.gAccount +"&PWD="+top.gPwd +"&FISHEYE_MINIATURE_CTRL=1";
				idget("MiniatureMode").className = "miniature_on";
				doRequest(cmd);
			}
			else
			{				
				oMedia.EnableFishEyeSubWindow(1);
				idget("MiniatureMode").className = "miniature_on";	
			}				
		}
		else
		{
			mini_view_state = 0;				
			if(top.gIspGeneration == "C02" && StreamMode != "FISHEYE_VIEW")
			{
				var cmd="/cgi-bin/encoder?USER="+top.gAccount +"&PWD="+top.gPwd +"&FISHEYE_MINIATURE_CTRL=0";
				idget("MiniatureMode").className = "miniature_off";
				doRequest(cmd);	
			}
			else
			{
				oMedia.EnableFishEyeSubWindow(0);
				idget("MiniatureMode").className = "miniature_off";	
			}				
		}
		ViewModeCookie = CurrentMode + ',' + mini_view_state;
		setCookie("ViewMode",ViewModeCookie);
	}
	
	function PTZHandler(){
		if(ptz_state == 0){
			ptz_state = 1;
			idget("ptz_icon").className = "ptz_on";
			if(StreamMode == "EPTZ"){	
				bg = "url(/images/icon.png) -45px -270px no-repeat";	
				idget("ptz_icon").style.background = bg;
			}
			setTimeout(function(){ top.EnableSubFrm(); }, 0);
			top.document.getElementById("divDragResizeifrm").style.display = "";
			top.document.getElementById("subordinate_frame").style.display = "";
			if(top.IsIE()){ECM_PTZ_Control();}
		}
		else{
			ptz_state = 0;
			idget("ptz_icon").className = "ptz_off";
			if(StreamMode == "EPTZ"){
				bg = "url(/images/icon.png) 0px -270px no-repeat";	
				idget("ptz_icon").style.background = bg;
			}
			setTimeout(function(){ top.DisableSubFrm(); }, 0);
			top.document.getElementById("divDragResizeifrm").style.display = "none";
			top.document.getElementById("subordinate_frame").style.display = "none";
			if(top.IsIE()){ocxCtrlDisable();}
		}
	}
	
	function clear_button()
	{		
		ManualTrigger = 1;
		idget("trigger_icon").className = "trigger_off";		
	}	
	function TriggerHandler()
	{
		var szSystem ;
		if(ManualTrigger == 1)
		{
			ManualTrigger = 0;
			idget("trigger_icon").className = "trigger_on";
			if(top.guest_preview == 1)
				szSystem = "/cgi-bin/encoder?EVENT_PUSH"  ;
			else	
				szSystem = "/cgi-bin/encoder?USER="+ top.gAccount +"&PWD="+ top.gPwd +"&EVENT_PUSH"  ;
			
			var szReturn = top.doRequest(szSystem) ;
		
			window.setTimeout("clear_button();", 5000 );	
		}
	}
	
	function Fit_ScreenSize()
	{
		if(NowPlayingMedia==1)
			ViewSize = getCookie("ViewSize_S1");
		if(NowPlayingMedia==2)
			ViewSize = getCookie("ViewSize_S2");
		
		Res = getCookie("ResAll");
		top.Res_S1 = Res.split(",")[0];
		top.Res_S2 = Res.split(",")[1];
		if(top.Res_S1 != CameraConf.CHANNEL[0].VIDEO_RESOLUTION)
			top.Res1Changed = 1;
		if(top.Res_S2 != CameraConf.CHANNEL[1].VIDEO_RESOLUTION)
			top.Res2Changed = 1;
		
			
		tmp = ViewSize.split(",");
		//alert("Res1Changed="+top.Res1Changed+"\n"+"Res2Changed="+top.Res2Changed+"\n"+"Mode1Changed="+Mode1Changed+"\n"+"Mode2Changed="+Mode2Changed+"\n"+"tmp[0]="+tmp[0]+"\n"+"ResW="+ResW+"\n"+"NowPlayingMedia="+NowPlayingMedia);
		if( tmp[0]>ResW || ((top.Res1Changed==1||Mode1Changed==1) && NowPlayingMedia==1) || ((top.Res2Changed==1||Mode2Changed==1) && NowPlayingMedia==2) || tmp[0]==0)
		{
			ViewSize = "";  //clean cookie
			if(NowPlayingMedia==1)
			{
				top.Res1Changed = 0;
				Mode1Changed = 0;
			}	
			if(NowPlayingMedia==2)
			{
				top.Res2Changed = 0;	
				Mode2Changed = 0;
			}	
		}	
		//alert("ViewSize="+ViewSize+"\n"+"Res="+ResW+","+ResH);
		
		if((top.gUnitType == "Hemispheric Camera" && top.gIspGeneration == "A1_ISP") || (StreamMode=="FISHEYE_VIEW"&&top.gIspGeneration == "C02"))//Low cost fisheye
		{
			if(CurrentMode==1)
			{
				if(ResW*ResH>=1440*1080)
				{
					oMedia.width=1920;
					oMedia.height=1080+16;
				}
				else if((1280*960<=ResW*ResH) && (ResW*ResH<1440*1080))	
				{
					oMedia.width=1280;
					oMedia.height=720+16;
				}
				else
				{
					oMedia.width=640;
					oMedia.height=360+16;
				}

				//alert("Fisheye"+"\n"+"width="+oMedia.width+"\n"+"height="+oMedia.height);
				ResW = oMedia.width;
				ResH = oMedia.height-16;	
			}			
		}
		//alert("Screenwidth="+Screenwidth+"\n"+"Screenheight="+Screenheight);
		if(ViewSize.indexOf("NaN")> -1 || ViewSize == "")
		{				
			if(ResW<Screenwidth && ResH<Screenheight)
			{
				oMedia.width=ResW;
				oMedia.height=ResH+16;
			}
			else
			{	
				//oMedia.width = Screenwidth;	
				oMedia.height = Screenheight-90;
				oMedia.width = ResW*(Screenheight-90)/ResH;
			}	
			
			ViewSizeCookie = oMedia.width+","+oMedia.height;
			//alert("ViewSizeCookie="+ViewSizeCookie);
			if(NowPlayingMedia==1)
				setCookie("ViewSize_S1",ViewSizeCookie);
			if(NowPlayingMedia==2)
				setCookie("ViewSize_S2",ViewSizeCookie);			
		}
		else
		{
			//alert("A02");
			tmp = ViewSize.split(",");
			oMedia.width = tmp[0];
			oMedia.height = tmp[1];
			if(oMedia.height>(Screenheight-90))
				idget("mainbody").scroll="auto";
		}
		
	}
	
	function ECM_Setup()
	{		
		oMedia.ID = NowPlayingMedia ;
		oMedia.Channel = 1;                       //for A1,AS
		//oMedia.Channel = NowPlayingMedia ;      //for AB
		oMedia.TCPVideoStreamID = NowPlayingMedia -1;
		oMedia.RTPVideoTrackNumber =1;	 		
		oMedia.StreamType = 0;
		oMedia.MediaType= 0;		//0 : tcp 1:rtp
		oMedia.DisplayTitleBar(1);				
		oMedia.MediaURL = document.location.hostname;			
		oMedia.DeviceType = 1;	//single=0 , quad =1
		oMedia.QuadDeviceMode = 0;
		oMedia.AutoReconnect = 1;
		if(top.guest_preview == 1)
		{
			oMedia.MediaUsername = "" ;
			oMedia.MediaPassword = "" ;
		}
		else
		{
			oMedia.MediaUsername = top.gAccount ;
			oMedia.MediaPassword = top.gPwd ;
		}
		oMedia.RegisterPort = 6000 ;
		oMedia.ControlPort = PORT_CONTROL ;
		oMedia.StreamingPort = PORT_VIDEO ;
		oMedia.RTSPPort = 7070;

		/*if(top.gIsLowCostModel == 1)	
		{			
			SetFisheyeMode();
		}*/	
		
		switch(document.URL.split(":")[0]){
			case "http":
				if(document.location.port == ""){
					idget("oMedia").HttpPort      = 80;
				}else{
					idget("oMedia").HttpPort      = document.location.port;
				}
				idget("oMedia").EnableHTTPS(0);
				break;
			case "https":
				if(document.location.port == ""){
					idget("oMedia").HttpPort      = 443;
				}else{
					idget("oMedia").HttpPort      = document.location.port;
				}
				idget("oMedia").EnableHTTPS(1);
				break;
		}
		
		Fit_ScreenSize();
		
		if(CheckOsdTime() >0){			
			oMedia.SetTitleBarTextLayout(9,12,10,19,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);			
		}		
		else
			oMedia.SetTitleBarTextLayout(9,12,10,19,1,14,3,14,4,18,5,12,6,12,7,0,0,0,0,0);
        oMedia.Connect(1);
		if((top.gUnitType == "Hemispheric Camera" && top.gIspGeneration == "A1_ISP") || StreamMode == "FISHEYE_VIEW")
		{			
			SetFisheyeMode();
		}	
		
		oMedia.DisableMotionDetection();
		//oMedia.EnableFishEye(1,4,0);
		//oMedia.EnableFishEyeSubWindow(1);
	}
	
	function doGetSettings()
	{
		var szSystem;
		if(top.guest_preview == 1)
			szSystem = "/cgi-bin/encoder?&CHANNEL=" + (NowPlayingMedia)+"&FISHEYE_INSTALL&VIDEO_RESOLUTION&VIDEO_STREAM&EVENT_MANUAL&FISHEYE_MINIATURE_CTRL" ;
		else
			szSystem = "/cgi-bin/encoder?USER="+ top.gAccount +"&PWD="+ top.gPwd + "&CHANNEL=" + (NowPlayingMedia) +"&FISHEYE_INSTALL&VIDEO_RESOLUTION&VIDEO_STREAM&EVENT_MANUAL&FISHEYE_MINIATURE_CTRL" ;
        
        var szReturn = top.doRequest(szSystem) ;
		
        szReturn = szReturn.split('\n') ;
		
        for (nIdx=0; nIdx< szReturn.length; nIdx++) {
            szTmp = top.doSplitValue( szReturn[nIdx] ) ;
            
            switch ( szTmp[0] ) {
                case 'VIDEO_RESOLUTION' :					
					szTmp=szTmp[1].substr(1,20);					
					szTmp=szTmp.split('x');
					ResW=parseInt(szTmp[0]);
					ResH=parseInt(szTmp[1]);
					//if(ResH==1080) ResH=1072;
					
					break;
                case 'VIDEO_STREAM' :	
					/*if(szTmp[1] != "DUAL")
						idget("media").style.display = "none";*/	
						StreamMode = szTmp[1] ;	
						top.gStreamMode = szTmp[1] ;
					break;
				case 'EVENT_MANUAL'	:
					if(szTmp[1] != '0')					
						idget("trigger").style.display = "";																
					break;
				case 'FISHEYE_INSTALL':					
					if(szTmp[1].indexOf("WALL") > -1)
						MountType = "WALL";
					else if(szTmp[1].indexOf("CEIL") > -1)	
						MountType = "CEIL";	
					else
						MountType = "GROUND";	
					break;	
				case 'FISHEYE_MINIATURE_CTRL':
					if(szTmp[1]==1)	
					{
						mini_view_state = 1;
						idget("MiniatureMode").className = "miniature_on";
					}
					else
					{
						mini_view_state = 0;
						idget("MiniatureMode").className = "miniature_off";
					}
					break;	
            }
        }				
		
		if(top.guest_preview == 1)
			szSystem = "/cgi-bin/system?PORT&V2_AUDIO_ENABLED";
		else
			szSystem = "/cgi-bin/system?USER="+ top.gAccount +"&PWD="+ top.gPwd +"&PORT&V2_AUDIO_ENABLED";
         
		
        szReturn = top.doRequest(szSystem) ;
		szReturn = szReturn.split('\n') ;
		
        for (nIdx=0; nIdx< szReturn.length; nIdx++) {
            szTmp = top.doSplitValue( szReturn[nIdx] ) ;
            
            switch ( szTmp[0] ) {
                case 'V2_AUDIO_ENABLED' :					
					audio_in_enbaled = parseInt(szTmp[1]);					
					break;				
				case "PORT_CONTROL":
						PORT_CONTROL = parseInt(szTmp[1]);		
					break;
				case "PORT_VIDEO":
						PORT_VIDEO = parseInt(szTmp[1]);			
					break;
				case "PORT_MULTICAST":
						PORT_MULTICAST = parseInt(szTmp[1]);	
					break;
				case "V2_PORT_RTSP":
						PORT_RTSP = parseInt(szTmp[1]);	
					break;	
				case "PORT_HTTP":
					top.gHttpPort = parseInt(szTmp[1]);	
					break;
            }
        }				
		
		if(top.guest_preview == 1)
			szSystem = "/cgi-bin/encoder?CAMERA_PAGE";
		else
			szSystem = "/cgi-bin/encoder?USER="+ top.gAccount +"&PWD="+ top.gPwd+"&CAMERA_PAGE";
		szReturn = doRequest(szSystem) ;		
		CameraConf = eval(szReturn);			
	}
	
	function GetPTZCap()
	{		
		var cmd="/cgi-bin/encoder?USER="+ top.gAccount +"&PWD="+ top.gPwd;
		cmd+="&PTZ_CAP_GET";	
		var szReturn = doRequest(cmd) ;
		szReturn=szReturn.split('\n') ;
		//alert(szReturn);
		PTZ_Cap = szReturn[0];
		PTZ_Cap=top.doSplitValue(PTZ_Cap);
		PTZ_Cap = PTZ_Cap[1];
		
		if(PTZ_Cap == "NA")
		{
			idget("ptz").style.display = "none";
			idget("ptz_line").style.display = "none";
		}
		else
		{
			if(PTZ_Cap.indexOf("PP")!=-1)
			{				
				idget("ptz_icon").style.display ="none";
				DrawSubPtz();
				PTZModeInit();
				idget("current_ptz").style.display = "";				
			}
			else
			{		
				idget("current_ptz").style.display = "none";
				idget("ptz_icon").style.display ="";
				if(StreamMode == "EPTZ")
				{	
					bg = "url(/images/icon.png) 0px -270px no-repeat";	
					idget("ptz_icon").style.background = bg;
				}
			}
			idget("ptz").style.display = "";
			idget("ptz_line").style.display = "";	
		}
	}
	
	function SetButtonDisplayAttribute()
	{
		if(top.IsIE() == false)
		{
			idget("size").style.display = "none";
			idget("size_line").style.display = "none";			
			idget("volume").style.display = "none";
			idget("FisheyeMode").style.display = "none";
			idget("fisheye_line").style.display = "none";
			idget("mic").style.display = "none";
		}	
		if(DOs == 0)
		{
			idget("DO").style.display = "none";
			idget("do_line").style.display = "none";			
		}	
		else		
			DrawSubDo();
		
		if (top.gUnitType ==  "Hemispheric Camera")
		{
			DrawSubMode();
		}
		else
		{
			idget("FisheyeMode").style.display = "none";
			idget("fisheye_line").style.display = "none";					
		}
		
		if(top.gAudioType <= '1') // Device is one-way audio or no audio
			idget("mic").style.display = "none";
		
		if( top.gAudioType == 0 || audio_in_enbaled == 0)   // Audio in is disabled
			idget("volume").style.display = "none";
	
		if (top.gUnitType ==  "Hemispheric Camera")
		{
			if(top.gIspGeneration != "C02")
			{
				idget("current_mode").style.display = "";
			}
			if(top.gIspGeneration == "C02" && StreamMode == "FISHEYE_VIEW")	
			{
				idget("current_mode").style.display = "";
			}			
		}		
	}
	
	function LiveUpdateLanguage()
	{
		top.update_language(this);
		try { document.getElementById('LIVE').title = top.GetXmlLangTagByName("HINT_LIVEVIEW") ; } catch(e) {}
		try { document.getElementById('SETUP').title = top.GetXmlLangTagByName("HINT_SETUP") ; } catch(e) {}
		try { document.getElementById('m1').title = top.GetXmlLangTagByName("HINT_VIEW_STREAM_1") ; } catch(e) {}
		try { document.getElementById('m2').title = top.GetXmlLangTagByName("HINT_VIEW_STREAM_2") ; } catch(e) {}
		try { document.getElementById('Fullscreen').title = top.GetXmlLangTagByName("HINT_FULL_SCREEN") ; } catch(e) {}
		try { document.getElementById('Snapshot').title = top.GetXmlLangTagByName("HINT_SNAPSHOT") ; } catch(e) {}
		try { document.getElementById('mic').title = top.GetXmlLangTagByName("HINT_AUDIO") ; } catch(e) {}
		try { document.getElementById('ZoomIn').title = top.GetXmlLangTagByName("HINT_ZOOM_IN") ; } catch(e) {}
		try { document.getElementById('ZoomOut').title = top.GetXmlLangTagByName("HINT_ZOOM_OUT") ; } catch(e) {}
		try { document.getElementById('ptz_icon').title = top.GetXmlLangTagByName("HINT_PTZ_ON") ; } catch(e) {}
		try { document.getElementById('current_do').title = top.GetXmlLangTagByName("HINT_SELECT_DO") ; } catch(e) {}
		try { document.getElementById('DO_HIGH').title = top.GetXmlLangTagByName("HINT_SET_DO_HIGH") ; } catch(e) {}
		try { document.getElementById('DO_LOW').title = top.GetXmlLangTagByName("HINT_SET_DO_LOW") ; } catch(e) {}
		try { document.getElementById('trigger_icon').title = top.GetXmlLangTagByName("HINT_MANUAL_TRIGGER") ; } catch(e) {}
		try { document.getElementById('bar').title = top.GetXmlLangTagByName("HINT_SET_PC_VOLUME") ; } catch(e) {}
		try { document.getElementById('MiniatureMode').title = top.GetXmlLangTagByName("HINT_MINIATURE_FISHEYE_VIEW_WINDOW") ; } catch(e) {}
		try { document.getElementById('current_mode').title = top.GetXmlLangTagByName("HINT_VIEW_MODE_OPTIONS") ; } catch(e) {}
		try { document.getElementById('sub_mode1').title = top.GetXmlLangTagByName("HINT_EPTZ_VIEW_MODE") ; } catch(e) {}
		try { document.getElementById('sub_mode2').title = top.GetXmlLangTagByName("HINT_PANORAMA_VIEW_MODE") ; } catch(e) {}		
		try { document.getElementById('sub_mode3').title = top.GetXmlLangTagByName("HINT_FISHEYE_VIEW_MODE") ; } catch(e) {}	
		try { document.getElementById('sub_mode4').title = top.GetXmlLangTagByName("HINT_PANORAMA_VIEW_MODE") ; } catch(e) {}	
		try { document.getElementById('current_ptz').title = top.GetXmlLangTagByName("HINT_PTZ_ON") ; } catch(e) {}
		try { document.getElementById('ptz_icon1').title = top.GetXmlLangTagByName("HINT_JOYSTICK_SIMULATED_MODE") ; } catch(e) {}
		try { document.getElementById('ptz_icon2').title = top.GetXmlLangTagByName("HINT_MOUSE_PTZ_MODE") ; } catch(e) {}
	}
	
	//getVLC() and doGo() are copied from  C:\Program Files\VideoLAN\VLC\sdk\activex\test.html
	function getVLC(name)
	{
		if (window.document[name])
		{
			return window.document[name];
		}
		if (navigator.appName.indexOf("Microsoft Internet")==-1)
		{
			if (document.embeds && document.embeds[name])
				return document.embeds[name];
		}
		else // if (navigator.appName.indexOf("Microsoft Internet")!=-1)
		{
			return document.getElementById(name);
		}
	}

	function doGo(targetURL,Cache)
	{
		var vlc = getVLC("vlc");

		if( vlc )
		{
			vlc.playlist.items.clear();
			while( vlc.playlist.items.count > 0 )
			{
				// clear() may return before the playlist has actually been cleared
				// just wait for it to finish its job
			}
		//	var options = [":rtsp-tcp"];
		//	var options = [":rtsp-tcp", ":network-caching=5000"];
		
			//var options = ":network-caching="+Cache; //UDP
			var options = ":rtsp-tcp :network-caching="+Cache;   //RTSP over TCP
			var itemId = vlc.playlist.add(targetURL,"",options);
			options = [];
			if( itemId != -1 )
			{
				// play MRL
				vlc.playlist.playItem(itemId);            
			}
			else
			{
				alert("cannot play at the moment !");
			}					
		}
	}
	
	
	function GetCacheBufferTime(stream)
	{
		var time;
		var fps;
		if(stream == "track1")
			fps = CameraConf.CHANNEL[0].VIDEO_FPS;
		else	
			fps = CameraConf.CHANNEL[1].VIDEO_FPS;
			
		switch(fps)	
		{
			case '1':
				time = 6000;
				break;
			case '3':	
				time = 2000;
				break;
			case '5':
				time = 1000;
				break;
			case '10':	
			case '15':	
			case '30':	
				time = 500;
				break;
			default:
				time = 1000;
				break;
		}
		return time;
	}
	
	function doVclCmd()
	{	
		var cache ;			
		var url = '';				
		var track ='';
		if(NowPlayingMedia==1)
			track ="track1";
		else
			track ="track2";
		cache = GetCacheBufferTime(track);

			url = 'rtsp://'+ top.gAccount + ':' + top.gPwd + '@' + location.hostname + ':' + PORT_RTSP + '/'+ track;	
		doGo(url,cache);
	}
	
	function SetupPlayer(track)
	{
		var HTML = '';
		var Height = ResH ;
		var Width = ResW ;
		var Ratio = 0;	
			
		var ScreenWidth = screen.width;
		var ScreenHeight = screen.height;
		
		var sAgent = navigator.userAgent.toLowerCase();
		if(sAgent.indexOf("safari")==-1 || sAgent.indexOf("chrome")!=-1)
		{
			/*VLC player*/			
			if(ResH > ScreenHeight)
			{
				Height = ScreenHeight-101-80 ; // diff between ScreenHeight-viewportheight(max) = 101
				Ratio = ResH/Height;
				Width =  ResW/Ratio;				
			}
			HTML = '<OBJECT classid="clsid:9BE31822-FDAD-461B-AD51-BE1D1C159921"  id="vlc" events="True">';
			HTML += '<param name="MRL" value="" />' ;
			HTML += '<param name="ShowDisplay" value="True" />' ;
			HTML += '<param name="AutoLoop" value="False" />' ;
			HTML += '<param name="AutoPlay" value="False" />' ;
			HTML += '<param name="Volume" value="50" />' ;
			HTML += '<param name="toolbar" value="False" />' ;
			HTML += '<param name="StartTime" value="0" />' ;
			HTML += '<EMBED pluginspage="http://www.videolan.org"  type="application/x-vlc-plugin" version="VideoLAN.VLCPlugin.2"' + ' width=' + Width + ' height='+ Height + ' windowless="true" toolbar="False" name="vlc"></EMBED>';
			HTML += '</OBJECT>';		
			idget("player").innerHTML = HTML;	
			window.setTimeout("doVclCmd();", 100 );	
		}
		else 
		{
			/*QuickTime Player*/			
			if(ResH > ScreenHeight)
			{
				Height = ScreenHeight-122-80; // diff between ScreenHeight-viewportheight(max) = 122
				Ratio = ResH/Height;
				Width =  ResW/Ratio;
				//Height = Height + 16;
			}
			HTML = '<OBJECT CLASSID="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B" WIDTH=' + Width + ' HEIGHT='+ Height + ' codebase="http://www.apple.com/qtactivex/qtplugin.cab">';
			HTML += '<PARAM name="QTSRC" VALUE="rtsp://' + location.hostname +'">' ;
			HTML += '<PARAM name="AUTOPLAY" VALUE="true">';
			HTML += '<PARAM name="CONTROLLER" VALUE="false">';
			HTML += '<PARAM name="WMODE" VALUE="transparent">';
			HTML += '<embed id="oMedia" src="/control/sample.mov" qtsrc="rtsp://' + location.hostname + '/'+ track +'"' + ' width=' +  Width + ' height='+ Height + ' scale="ASPECT" target="myself" wmode="transparent" controller="false" autoplay="true"></embed>';
			HTML += '</OBJECT>';			
			idget("player").innerHTML = HTML;
		}		
	}
	
	function CheckOsdTime()
	{
		var osd_time = 0;
		var i = 0;
		var osd_format = "";
		for(i = 0 ; i < 4 ; i++)
		{
			if(CameraConf.OSD_CONFIG[i].OSD_STATE == '1')
			{
				osd_format = CameraConf.OSD_CONFIG[i].OSD_FORMAT;
				if(osd_format.indexOf('%YYYY')>-1 || osd_format.indexOf('%YY')>-1 || osd_format.indexOf('%MM')>-1 || osd_format.indexOf('%DD')>-1 || osd_format.indexOf('%hh')>-1 || osd_format.indexOf('%mm')>-1 || osd_format.indexOf('%ss')>-1)
					osd_time++ ;				
			}			
		}
		
		if(osd_time > 0)
			return 1;
		else
			return 0;
	}
	
	function Resize()
	{
		if(document.documentElement.offsetWidth > 1100)
			idget("BG").style.width = "100%";		
		else
			idget("BG").style.width = "1100px";		
	}
	
	function CheckFisheyeModel()
	{
		var LowCostFisheyeModel = "B54,B55,B56,E96,E919,E921,E923,E919M,E921M,E923M,I51,I71,E98,E15,E16,E925,E927,E929,E925M,E927M,E929M,I73,Q111,Q13";
		var DeviceModel = "";
		var i;
		
		DeviceModel = top.gModel.slice(0,5);		
		if(DeviceModel.indexOf('-')!=-1){
			var tmp = top.gModel.indexOf('-');
			DeviceModel = top.gModel.slice(0,tmp);
		}
		
		LowCostFisheyeModel = LowCostFisheyeModel.split(',');
		for( i = 0; i< LowCostFisheyeModel.length ;i++ ) 
		{
			if(DeviceModel == LowCostFisheyeModel[i])
				top.gIsLowCostModel = 1;					
		}
		//alert(DeviceModel);
		switch(DeviceModel){
			case "KCM3911":
				top.gFisheyeModule = 0;
				break;
			case "KCM7911":
				top.gFisheyeModule = 0;
				break;	
			case "B54":
				top.gFisheyeModule = 2;
				break;
			case "B55":
				top.gFisheyeModule = 3;
				break;
			case "B56":
				top.gFisheyeModule = 4;
				break;
			case "E96":
				top.gFisheyeModule = 5;
				break;	
			case "E919":
			case "E919M":
				top.gFisheyeModule = 6;
				break;
			case "E921":
			case "E921M":
				top.gFisheyeModule = 7;
				break;	
			case "E923":
			case "E923M":
				top.gFisheyeModule = 8;
				break;	
			case "I51":
				top.gFisheyeModule = 9;
				break;
			case "I71":
				top.gFisheyeModule = 10;
				break;	
			case "E98":
				top.gFisheyeModule = 11;
				break;
			case "E15":
				top.gFisheyeModule = 12;
				break;	
			case "E16":
				top.gFisheyeModule = 13;
				break;
			case "E925":
			case "E925M":
				top.gFisheyeModule = 14;
				break;	
			case "E927":
			case "E927M":
				top.gFisheyeModule = 15;
				break;
			case "E929":
			case "E929M":
				top.gFisheyeModule = 16;
				break;
			case "I73":
				top.gFisheyeModule = 17;
				break;	
			case "Q111":
				top.gFisheyeModule = 18;
				break;	
			case "Q13":
				top.gFisheyeModule = 19;
				break;	
			default:
				top.gFisheyeModule = 999;
				break;			
		}
	}
	
	function Page_onLoad()
	{
		Screenwidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		Screenheight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		//alert("Screenwidth="+Screenwidth+"\n"+"Screenheight="+Screenheight);
		if(top.gStreamMode=="SINGLE" || top.gVideoStreams == 1)
			idget("media").style.display="none";
		else
			idget("media").style.display="";
					
		CheckFisheyeModel();

		LiveUpdateLanguage();
		MouseFunctionSetup();
		
		doGetSettings();
		GetPTZCap();
		SetButtonDisplayAttribute();
		if(top.IsIE() == true)
		{
			if((top.gUnitType == "Hemispheric Camera" && top.gIspGeneration == "A1_ISP") || StreamMode == "FISHEYE_VIEW")	
				FisheyeModeInit();				
		}
		if(top.IsIE() == true)
		{
			ECM_Setup();
		}	
		else
		{
			SetupPlayer("track1");
			idget("Fullscreen").style.display = "none";			
			idget("oMedia").style.display = "none";
		}
		ResCookie = CameraConf.CHANNEL[0].VIDEO_RESOLUTION +","+ CameraConf.CHANNEL[1].VIDEO_RESOLUTION;
		//alert(ResCookie);
		setCookie("ResAll",ResCookie);
		
		window.setTimeout("top.load_iframe_sub('/live/ptz_ctrl.html')", 500 );//OK GOOD
		
		window.onresize = Resize;
		Resize();		
	}
	Page_onLoad();

/************************************************************************/
/*              FishEye    Mode                                         */
/************************************************************************/
	
/*
enum EN_FISHEYE_MODULE
{
	enACTi_KCM3911       = 0,//Support KCM3911
	enACTi_KCM7911       = 1,//Support KCM7911
	enACTi_B54           = 2,//Support B54
	enACTi_B55           = 3,//Support B55
	enACTi_B56           = 4,//Support B56
	enACTi_E96           = 5,//Support E96
	enACTi_E919          = 6,//Support E919/E919M
	enACTi_E921          = 7,//Support E921/E921M
	enACTi_E923          = 8,//Support E923/E923M
	enACTi_I51           = 9,//Support I51
	enACTi_I71           = 10,//Support I71
	enACTi_E98           = 11,//Support E98
	enACTi_E15           = 12,//Support E15
	enACTi_E16           = 13,//Support E16
	enACTi_E925          = 14,//Support E925
	enACTi_E927          = 15,//Support E927
	enACTi_E929          = 16,//Support E929
	enACTi_I73           = 17,//Support I73
	enACTi_Q111          = 18,//Support Q111
	enACTi_Q13           = 19,//Support Q13
	enACTi_Auto          = 999,//Support all camera
};


enum EN_FISHEYE_MODE
{
    enWall_Dewarping            = 0, //wall eptz
    enWall_Panorama             = 1, //wall Panorama 
    enCeiling_Dewarping         = 2, //Ceiling eptz
    enCeiling_Panorama          = 3, //Ceiling SinglePanorama (not use)
    enCeiling_DoublePanorama    = 4, //Ceiling DoublePanorama
	
	enGround_Dewarping          = 5, //Ground eptz
	enGround_Panorama           = 6, //Ground SinglePanorama (not use)
	enGround_DoublePanorama     = 7, //Ground DoublePanorama

	enWall_DoublePanorama       = 20,
	enWall_PanoramaFocus        = 21,
	enWall_Surround             = 22,
	enCeiling_PanoramaFocus     = 23,
	enCeiling_Surround          = 24,
	enGround_PanoramaFocus      = 25,
	enGround_Surround           = 26,

};

void EnableFishEye(LONG bEnable,LONG lgModule, LONG lgMode);
Void SetFishEyeCircle(LONG x, LONG y, LONG radius, LONG width, LONG height);
LONG bEnable:  1(TRUE) or 0(FALSE)
LONG lgModule: see enum EN_FISHEYE_MODULE
LONG lgMode:  see enum EN_FISHEYE_MODE
void EnableFishEyeSubWindow(LONG bEnable); 
LONG bEnable:  1(TRUE) or 0(FALSE)

*/
	function SetFisheyeMode()
	{
		var szEncoder = "/cgi-bin/encoder?USER="+ top.gAccount +"&PWD="+ top.gPwd+"&FISHEYE_IMAGE_CENTER";			
		var szReturn = doRequest(szEncoder);
		
		var bValid; 
		var bCenterX;
		var bCenterY;
		var bRadius;
		var bImageWidth;
		var bImageHeight;
		
		szReturn=szReturn.split('\n') ;	
		szTmp = top.doSplitValue( szReturn[0] ) ;
		szTmp2 = szTmp[1].split(',');
		bValid = szTmp2[0];
		if (bValid == 1) {	
			bCenterX = szTmp2[1];
			bCenterY = szTmp2[2];
			bRadius = szTmp2[3];
			bImageWidth = szTmp2[4];
			bImageHeight = szTmp2[5];			
			oMedia.SetFishEyeCircle(bCenterX, bCenterY, bRadius, bImageWidth, bImageHeight);
		}
		
		if(CurrentMode == 2)
		{
			oMedia.EnableFishEye(0,top.gFisheyeModule,1);
			return;
		}	
		else {
			if( MountType == "WALL")
			{
				if(CurrentMode == 0)	
					oMedia.EnableFishEye(1,top.gFisheyeModule,0); //EnableMousePtz WALL
				else	
					oMedia.EnableFishEye(1,top.gFisheyeModule,1); //Enable wall Panorama 
			}
			else if( MountType == "CEIL") 	//ceil
			{
				if(CurrentMode == 0)	
					oMedia.EnableFishEye(1,top.gFisheyeModule,2); //EnableMousePtz CEIL
				else	
					oMedia.EnableFishEye(1,top.gFisheyeModule,4);
			}
			else
			{
				if(CurrentMode == 0)	
					oMedia.EnableFishEye(1,top.gFisheyeModule,5); //EnableMousePtz Ground
				else	
					oMedia.EnableFishEye(1,top.gFisheyeModule,7);
			}
		}		
		oMedia.EnableFishEyeSubWindow(mini_view_state);
	}
	
	function FisheyeModeInit()
	{
		var tmp;
		ViewMode = getCookie("ViewMode");	
		
		if(ViewMode.indexOf("NaN")> -1 || ViewMode == "")
			ViewMode = "0,0";			//default : eptz + miniature view
					
		tmp = ViewMode.split(",");
		CurrentMode = parseInt(tmp[0]);
		mini_view_state = parseInt(tmp[1]);
		
		if(StreamMode == "FISHEYE_VIEW")
			mini_view_state = 1;
		
		if(mini_view_state == 1)
			idget("MiniatureMode").className = "miniature_on";							
		else		
			idget("MiniatureMode").className = "miniature_off";							
		ModeSeletcHandler(CurrentMode);
		//SetFisheyeMode();
	}
	
	function PTZWindowClose(){	
		//helpClsPtzScan();
		if(top.IsIE()==true){
			oMedia.Disconnect();		
			if(ptz_state ==1){	
				//idget("oMedia").DisableMousePTZ();
				//idget("oMedia").DisablePixelsPTZ();
				ocxCtrlDisable();
				/*
				if(CurrentPTZ==0){
					idget("oMedia").DisableMousePTZ();//oMedia.DisableMousePTZ();		
				}
				if(CurrentPTZ==1){
					idget("oMedia").DisablePixelsPTZ();//oMedia.DisablePixelsPTZ();		
				}
				*/
			}
		}
		setTimeout(function(){ top.DisableSubFrm(); }, 0);	
		setTimeout(function(){ top.document.getElementById("subordinate_frame").style.display = "none"; }, 0);
		setTimeout(function(){ top.document.getElementById("divDragResizeifrm").style.display = "none"; }, 0);
	}
	window.onbeforeunload  = PTZWindowClose;
	
	function helpClsPtzScan(){			
		var cmd="/cgi-bin/encoder?USER="+ top.gAccount +"&PWD="+ top.gPwd;
		cmd+="&PTZ_TOUR_STATE=DISABLE";
		var szReturn = doRequest(cmd) ;
	}
//---1st section of scripts ---//

	function ocxCtrlDisable(){
		//Only for IE browser
		idget("oMedia").DisableMousePTZ();
		idget("oMedia").DisablePixelsPTZ();
		idget("oMedia").DisableRelativePTZ();
	}
