define(["utils/console","utils/basics","lib/stateCtrlInterface"],function(console,basicUtilities,StateCtrlClass){"use strict";function Step2CtrlClass(aStateId,aStateManager,aSahObj,aViewObj){var fields,setLanguage=function(aCallback,aLangId){basicUtilities.queue([function(aNext){fields.sahObj.invokeApi("semantic","sah.Device.Information.setLanguage",aNext,[{languageId:aLangId}])},function(aNext,aResult){if(aResult.status!==0){console.error("Step2CtrlClass: Failed to update default language")}basicUtilities.callback(null,false,0,null)}],this)},onViewEvent=function(aEventId,aData){if(aEventId==="ViewUpdated"){console.debug("Step2CtrlClass: View event '"+aEventId+"' with data "+JSON.stringify(aData));if(aData&&aData.langId){setLanguage.call(this,null,aData.langId)}}else if(aEventId==="ViewCancelled"){console.debug("Step2CtrlClass: View event '"+aEventId+"' with data "+JSON.stringify(aData))}else if(aEventId==="ViewSubmitted"){console.debug("Step2CtrlClass: View event '"+aEventId+"' with data "+JSON.stringify(aData));this.ConnectWithCredentials(aData.login,aData.password)}else{console.warn("Step2CtrlClass: Unexpected event '"+aEventId+"'");this.getViewObj().notifyError("Step2CtrlClass: Unexpected event '"+aEventId+"'","rra0127")}};fields={sahObj:aSahObj,HasReceivedSms:false,IsConnectionRunning:false,connectionTimer:null,errorType:1};StateCtrlClass.call(this,aStateId,aStateManager,aSahObj,aViewObj);this.init=function(aCallback){console.debug("Step2CtrlClass: Initialising state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().subscribeEvents(this.getId(),onViewEvent.bind(this));this.getViewObj().init(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){this.listenToSMSEvent(this.OnSmsClickEvent.bind(this));basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("Step2CtrlClass: Initialising state '"+this.getId()+"'","rra0128")}}],this)};this.quit=function(aCallback){console.debug("Step2CtrlClass: Releasing state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().quit(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("Step2CtrlClass: Releasing state '"+this.getId()+"'","rra0129")}}],this)};this.enable=function(aCallback){console.debug("Step2CtrlClass: Enabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().enable(aNext)},function(aNext){this.callSahApi("sah.Connection.Client.Pnp.getUserParameters",aNext)},function(aNext,aResult){if(aResult.status===0){if(!fields.HasReceivedSms&&aResult.data.state!=="ok"){fields.name=aResult.data.lastName;fields.firstname=aResult.data.firstName;fields.phone=aResult.data.phoneNumber;aNext()}else{aStateManager.switchState(aNext,"step3",null)}}else{console.error("InstallContextClass: Internal error as user parameters are invalid "+JSON.stringify(aResult));basicUtilities.callback(null,false,-1,null);this.getViewObj().notifyError("Step2CtrlClass: Internal error as user parameters are invalid "+JSON.stringify(aResult),"rra0130")}},function(){if(!fields.HasReceivedSms){this.getViewObj().ShowConnectionPage(fields.firstname,fields.name,fields.phone)}},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("Step2CtrlClass: Internal error ShowConnectionPage failed","rra0131")}}],this)};this.disable=function(aCallback){console.debug("Step2CtrlClass: Disabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().disable(aNext)},function(aNext,aResult){this.stopEventListener();if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("Step2CtrlClass: Disabling state '"+this.getId()+"'","rra0132")}}],this)};this.ConnectWithCredentials=function(login,password){if(this.isValidCredential(login,password)){basicUtilities.queue([function(aNext){this.callSahApi("sah.Connection.Client.getConnectionState",aNext,null)},function(aNext,aResult){if(aResult.status===0&&aResult.data.linkModeList[0].linkType!==""){var prefix="";if(this.getCapabilities().isOrange){prefix="fti/"}else{prefix=""}var arr=login.split("fti/");if(arr[0]===""){arr=arr.slice(1)}login=arr.join("");if(this.getCapabilities().isOrange){login=prefix+arr.join("fti/")}this.callSahApi("sah.Connection.Client.Wan.connect",aNext,{linkMode:"",linkType:aResult.data.linkModeList[0].linkType,login:login,password:password})}else{console.error("InstallContextClass: Internal error as WAN status is invalid "+JSON.stringify(aResult));basicUtilities.callback(null,false,-1,null);this.getViewObj().notifyError("Step2CtrlClass:  Internal error as WAN status is invalid"+JSON.stringify(aResult),"rra0133")}},function(aNext,aResult){if(aResult.status===0){fields.IsConnectionRunning=true;this.getViewObj().displayConnectionState("connecting");if(fields.connectionTimer!==null){window.clearTimeout(fields.connectionTimer)}fields.connectionTimer=window.setTimeout(function(){this.checkConnection(aNext)}.bind(this),15e3)}else{console.error("InstallContextClass: Internal error as connection request failed "+JSON.stringify(aResult));basicUtilities.callback(null,false,-1,null);this.getViewObj().notifyError("Step2CtrlClass:  Internal error as connection request failed"+JSON.stringify(aResult),"rra0134")}},function(){basicUtilities.callback(null,false,0,null)}],this)}};this.isValidCredential=function(login,password){if(login.trim()===""||login.length>85){this.getViewObj().displayLoginError(false);this.getViewObj().displayPasswordError(true);return false}if(password.trim()===""||password.length>29){this.getViewObj().displayLoginError(true);this.getViewObj().displayPasswordError(false);return false}this.getViewObj().displayLoginError(true);this.getViewObj().displayPasswordError(true);return true};this.checkFirstBoot=function(aCallback){basicUtilities.queue([function(aNext){this.callSahApi("sah.Installation.isInstallationRequired",aNext,null)},function(aNext,aResult){if(aResult.status===0){if(fields.connectionTimer!==null){window.clearTimeout(fields.connectionTimer)}if(!aResult.data.isFirstConnectionRequired){this.getViewObj().displayConnectionState("connecting");fields.connectionTimer=window.setTimeout(function(){this.checkConnection()}.bind(this),1e4)}else{fields.connectionTimer=window.setTimeout(function(){this.checkFirstBoot()}.bind(this),5e3)}}else{console.error("InstallContextClass: Internal error as Installation information is invalid "+JSON.stringify(aResult));basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("InstallContextClass: Internal error as Installation information is invalid "+JSON.stringify(aResult),"rra0135")}},function(){this.getViewObj().ShowConnectionPage(fields.firstname,fields.name,fields.phone);basicUtilities.callback(aCallback,true,0,null)}],this)};this.checkConnection=function(aCallback){basicUtilities.queue([function(aNext){this.callSahApi("sah.Connection.Client.getConnectionState",aNext,null)},function(aNext,aResult){if(aResult.status===0){if(aResult.data.linkModeList[0].state==="OK"){fields.IsConnectionRunning=false;this.getViewObj().displayConnectionState("connected");aStateManager.switchState(null,"step3",null)}else{fields.IsConnectionRunning=true;if(fields.connectionTimer!==null){window.clearTimeout(fields.connectionTimer)}if(fields.errorType===0&&aResult.data.linkModeList[0].state==="ERROR"){fields.errorType=1;if(aResult.data.linkModeList[0].lastError==="ERROR_AUTHENTICATION_FAILURE"){this.getViewObj().displayLoginPasswordError();this.getViewObj().displayConnectionState("")}else{this.getViewObj().displayConnectionState("disconnected")}}else{if(aResult.data.linkModeList[0].state==="ERROR"){fields.errorType-=1}else{fields.errorType=1}fields.connectionTimer=window.setTimeout(function(){this.checkConnection()}.bind(this),5e3)}}}else{console.error("InstallContextClass: Internal error as connection state information is invalid "+JSON.stringify(aResult));basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("Step2CtrlClass: Internal error as connection state information is invalid "+JSON.stringify(aResult),"rra0135")}},function(){this.getViewObj().ShowConnectionPage(fields.firstname,fields.name,fields.phone);basicUtilities.callback(aCallback,true,0,null)}],this)};this.OnSmsClickEvent=function(id,data){if(id==="sah.Connection.Client.PnpEvents.PnPStatusUpdated"&&data.state.toLowerCase()==="ok"){fields.HasReceivedSms=true;this.stopEventListener();if(fields.connectionTimer!==null){window.clearTimeout(fields.connectionTimer)}fields.connectionTimer=window.setTimeout(function(){this.checkFirstBoot()}.bind(this),5e3)}};this.listenToSMSEvent=function(SMSEventHandler){this.startEventListener();this.listenEvent("sah.Connection.Client.PnpEvents",SMSEventHandler)}}return Step2CtrlClass});