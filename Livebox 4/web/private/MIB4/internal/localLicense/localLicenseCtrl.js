define(["utils/console","utils/basics","lib/stateCtrlInterface"],function(console,basicUtilities,StateCtrlClass){"use strict";function LocalLicenseCtrlClass(aStateId,aStateManager,aSahObj,aViewObj){var fields,onViewEvent=function(aEventId,aData){if(aEventId==="ViewUpdated"){console.debug("LocalLicenseCtrlClass: View event '"+aEventId+"' with data "+JSON.stringify(aData))}else if(aEventId==="ViewCancelled"){console.debug("LocalLicenseCtrlClass: View event '"+aEventId+"' with data "+JSON.stringify(aData))}else if(aEventId==="ViewSubmitted"){console.debug("LocalLicenseCtrlClass: View event '"+aEventId+"' with data "+JSON.stringify(aData));this.switchState(null,"Second",null)}else{console.warn("LocalLicenseCtrlClass: Unexpected event '"+aEventId+"'")}};fields={};StateCtrlClass.call(this,aStateId,aStateManager,aSahObj,aViewObj);this.init=function(aCallback){console.debug("LocalLicenseCtrlClass: Initialising state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().subscribeEvents(this.getId(),onViewEvent.bind(this));this.getViewObj().init(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("LocalLicenseCtrlClass: Initialising state '"+this.getId()+"'","rra0233")}}],this)};this.quit=function(aCallback){console.debug("LocalLicenseCtrlClass: Releasing state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().quit(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("LocalLicenseCtrlClass: Releasing state '"+this.getId()+"'","rra0234")}}],this)};this.enable=function(aCallback){console.debug("LocalLicenseCtrlClass: Enabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().enable(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("LocalLicenseCtrlClass: Enabling state '"+this.getId()+"'","rra0235")}}],this)};this.disable=function(aCallback){console.debug("LocalLicenseCtrlClass: Disabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().disable(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("LocalLicenseCtrlClass: Disabling state '"+this.getId()+"'","rra0236")}}],this)}}return LocalLicenseCtrlClass});