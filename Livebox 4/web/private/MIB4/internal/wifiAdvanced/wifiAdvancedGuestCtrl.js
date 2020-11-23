define(["utils/console","utils/basics","lib/stateCtrlInterface"],function(console,basicUtilities,StateCtrlClass){"use strict";function WifiAdvancedGuestCtrlClass(aStateId,aStateManager,aSahObj,aViewObj){var fields={currentData:{getAccessPoints:{},getGuestLimitation:{},getDevices:{},ssidCollision:{}}},onViewEvent=function(aEventId,aData){if(aEventId==="ViewUpdated"){console.debug("WifiAdvancedGuestCtrlClass: View event '"+aEventId+"' with data "+JSON.stringify(aData))}else if(aEventId==="ViewCancelled"){console.debug("WifiAdvancedGuestCtrlClass: View event '"+aEventId+"' with data "+JSON.stringify(aData))}else if(aEventId==="ViewSubmitted"){console.debug("WifiAdvancedGuestCtrlClass: View event '"+aEventId+"' with data "+JSON.stringify(aData));basicUtilities.queue([function(aNext){this.getViewObj().showLoadingScreen(aNext)},function(aNext){this.saveAll(aNext,aData.value)},function(aNext,aResult){this.getViewObj().hideLoadingScreen(null);if(!aResult||aResult.status===0){window.location.hash="#summary";basicUtilities.callback(aNext,false,0,null)}else{console.warn("WifiAdvancedGuestCtrlClass: Settings could not be saved");basicUtilities.callback(aNext,false,-1,null);this.getViewObj().notifyError("WifiAdvancedGuestCtrlClass: Settings could not be saved","aba0161")}}],this)}else{console.warn("WifiAdvancedGuestCtrlClass: Unexpected event '"+aEventId+"'")}};StateCtrlClass.call(this,aStateId,aStateManager,aSahObj,aViewObj);this.init=function(aCallback){console.debug("WifiAdvancedGuestCtrlClass: Initialising state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().subscribeEvents(this.getId(),onViewEvent.bind(this));this.getViewObj().init(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedGuestCtrlClass: Failed to init","aba0162")}}],this)};this.quit=function(aCallback){console.debug("FakeFirstCtrlClass: Releasing state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().quit(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedGuestCtrlClass: Failed to quit","aba0163")}}],this)};this.enable=function(aCallback){console.debug("WifiAdvancedGuestCtrlClass: Enabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getAccessPoints(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){this.getHotspot(aNext)}else{console.error("WifiAdvancedGuestCtrlClass: Internal error");basicUtilities.callback(aNext,false,0,null);this.getViewObj().notifyError("WifiAdvancedGuestCtrlClass: Failed to get access points","aba0164")}},function(aNext,aResult){if(!aResult||aResult.status===0){this.getGuestLimitation(aNext)}else{console.error("WifiAdvancedGuestCtrlClass: Internal error");basicUtilities.callback(aNext,false,0,null);this.getViewObj().notifyError("WifiAdvancedGuestCtrlClass: Failed to get hotspot","aba0215")}},function(aNext,aResult){if(!aResult||aResult.status===0){this.getViewObj().fields.currentData=fields.currentData;aNext()}else{console.error("WifiAdvancedGuestCtrlClass: Internal error");basicUtilities.callback(aNext,false,0,null);this.getViewObj().notifyError("WifiAdvancedGuestCtrlClass: Failed to get guest limitation settings","aba0165")}},function(aNext){this.getViewObj().enable(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aNext,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedGuestCtrlClass: Failed to enable view","aba0166")}}],this)};this.disable=function(aCallback){console.debug("WifiAdvancedGuestCtrlClass: Disabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().disable(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedGuestCtrlClass: Failed to disable view","aba0168")}}],this)};this.getAccessPoints=function(aCallback){basicUtilities.queue([function(aNext){this.callSahApi("sah.Connection.Server.WiFi.listAccessPoints",aNext,{})},function(aNext,aResult){var index;fields.currentData.isGuestEnabled=false;if(aResult.status===0){if(aResult.hasOwnProperty("data")){fields.currentData.getAccessPoints=aResult.data;if(aResult.data.hasOwnProperty("accessPointList")){for(index=0;index<aResult.data.accessPointList.length;index=index+1){if(aResult.data.accessPointList[index].linkType.indexOf("WIFI_2.4_GUEST")>-1){fields.currentData.guest24VapRoot=aResult.data.accessPointList[index];fields.currentData.guest24Id=aResult.data.accessPointList[index].accessPointId;fields.currentData.isGuestEnabled=fields.currentData.isGuestEnabled||aResult.data.accessPointList[index].isEnabled}else if(aResult.data.accessPointList[index].linkType.indexOf("WIFI_5_GUEST")>-1){fields.currentData.guest5VapRoot=aResult.data.accessPointList[index];fields.currentData.guest5Id=aResult.data.accessPointList[index].accessPointId;fields.currentData.isGuestEnabled=fields.currentData.isGuestEnabled||aResult.data.accessPointList[index].isEnabled}else if(aResult.data.accessPointList[index].linkType.indexOf("WIFI_2.4_PRIVATE")>-1){fields.currentData.ssidCollision.private24=aResult.data.accessPointList[index].ssid}else if(aResult.data.accessPointList[index].linkType.indexOf("WIFI_5_PRIVATE")>-1){fields.currentData.ssidCollision.private5=aResult.data.accessPointList[index].ssid}}}}basicUtilities.callback(aCallback,false,0,aResult.data)}else{console.warn("WifiAdvancedGuestCtrlClass: Failed to retrieve global wifi status");basicUtilities.callback(aCallback,false,0,null);this.getViewObj().notifyError("WifiAdvancedGuestCtrlClass: Failed to retrieve global wifi status","aba0169")}}],this)};this.getHotspot=function(aCallback){basicUtilities.queue([function(aNext){this.callSahApi("sah.Connection.Server.WiFi.getHotSpotState",aNext,null)},function(aNext,aResult){var index;if(aResult.status===0){if(aResult.hasOwnProperty("data")){if(aResult.data.hasOwnProperty("hostspotList")){for(index=0;index<aResult.data.hostspotList.length;index=index+1){if(aResult.data.hostspotList[index].isSecured){fields.currentData.ssidCollision.secureHotspot=aResult.data.hostspotList[index].ssid}else{fields.currentData.ssidCollision.openHotspot=aResult.data.hostspotList[index].ssid}}}}basicUtilities.callback(aCallback,false,0,aResult.data)}else{console.warn("WifiAdvancedGuestCtrlClass: Failed to retrieve hotspot state");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedGuestCtrlClass: Failed to retrieve hotspot state","aba0214")}}],this)};this.setAccessPoint=function(aCallback,aParam){if(typeof aParam!=="undefined"){if(aParam.hasOwnProperty("accessPointId")){basicUtilities.queue([function(aNext){this.callSahApi("sah.Connection.Server.WiFi.configureAccessPoint",aNext,aParam)},function(aNext,aResult){if(aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{console.warn("WifiAdvancedGuestCtrlClass: Failed to set access point");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedGuestCtrlClass: Failed to set access point","aba0170")}}],this)}else{console.error("WifiAdvancedGuestCtrlClass: no access point ID was given to set");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedGuestCtrlClass: no access point ID was given to set","aba0171")}}else{console.error("WifiAdvancedGuestCtrlClass: no value was given to set");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedGuestCtrlClass: no value was given to set","aba0172")}};this.getGuestLimitation=function(aCallback){basicUtilities.queue([function(aNext){this.callSahApi("sah.Connection.Server.WiFi.getGuestLimitation",aNext,null)},function(aNext,aResult){if(aResult.status===0){fields.currentData.getGuestLimitation=aResult.data;basicUtilities.callback(aCallback,false,0,aResult.data)}else{console.warn("WifiAdvancedGuestCtrlClass: Failed to retrieve wifi guest limitation setting");basicUtilities.callback(aCallback,false,0,null);this.getViewObj().notifyError("WifiAdvancedGuestCtrlClass: Failed to retrieve wifi guest limitation setting","aba0173")}}],this)};this.setGuestLimitation=function(aCallback,aParam){if(typeof aParam!=="undefined"){basicUtilities.queue([function(aNext){this.callSahApi("sah.Connection.Server.WiFi.setGuestLimitation",aNext,aParam)},function(aNext,aResult){if(aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{console.warn("WifiAdvancedGuestCtrlClass: Failed to set access point");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedGuestCtrlClass: Failed to set access point","aba0174")}}],this)}else{console.error("WifiAdvancedGuestCtrlClass: no value was given to set");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedGuestCtrlClass: no value was given to set","aba0175")}};this.getDevices=function(aCallback){basicUtilities.queue([function(aNext){this.callSahApi("sah.HomeNetwork.NetworkMap.listDevices",aNext,{filter:{linkModeList:"WIFI",isActive:true}})},function(aNext,aResult){if(aResult.status===0){fields.currentData.getDevices=aResult.data;basicUtilities.callback(aCallback,false,0,aResult.data)}else{console.warn("WifiAdvancedGuestCtrlClass: Failed to retrieve active devices on WiFi");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedGuestCtrlClass: Failed to retrieve active devices on WiFi","aba0176")}}],this)};this.saveAll=function(aCallback,aData){basicUtilities.queue([function(aNext){if(fields.currentData.guest24Id){aData.vap.accessPointId=fields.currentData.guest24Id;this.setAccessPoint(aNext,aData.vap)}else{console.warn("WifiAdvancedGuestCtrlClass: No Wifi guest 2.4Ghz access point id found");basicUtilities.callback(aNext,false,0,null)}},function(aNext,aResult){if(aResult.status===0){if(fields.currentData.guest5Id){aData.vap.accessPointId=fields.currentData.guest5Id;this.setAccessPoint(aNext,aData.vap)}else{console.warn("WifiAdvancedGuestCtrlClass: No Wifi guest 5Ghz access point id found");basicUtilities.callback(aNext,false,0,null)}}else{console.warn("WifiAdvancedGuestCtrlClass: Failed to set Wifi guest 2.4Ghz access point settings");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedGuestCtrlClass: Failed to set Wifi guest access point settings","aba0211")}},function(aNext,aResult){if(aResult.status===0){this.setGuestLimitation(aNext,aData.glim)}else{console.warn("WifiAdvancedGuestCtrlClass: Failed to set Wifi guest 5Ghz access point settings");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedGuestCtrlClass: Failed to set Wifi guest access point settings","aba0177")}},function(aNext,aResult){if(aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{console.warn("WifiAdvancedGuestCtrlClass: Failed to set Wifi guest access point limitations");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedGuestCtrlClass: Failed to set Wifi guest access point limitations","aba0178")}}],this)}}return WifiAdvancedGuestCtrlClass});