define(["utils/console","utils/basics","lib/stateManager","app/orangeCloudCtrl","app/orangeCloudView","jquery"],function(console,basicUtilities,StateManagerClass,OrangeCloudCtrlClass,OrangeCloudViewClass,$){"use strict";function MainClass(aSahObj,aConfigObj,aTranslateObj){var fields;fields={sahObj:aSahObj,stateManagerObj:null};fields.stateManagerObj=new StateManagerClass("OrangeCloudApp",aSahObj,aTranslateObj);this.run=function(){basicUtilities.queue([function(aNext){fields.stateManagerObj.registerState(aNext,"OrangeCloud",OrangeCloudCtrlClass,OrangeCloudViewClass,false)},function(aNext,aResult){if(!aResult||aResult.status===0){$(window).on("hashchange",{},function(){if(window.location.hash.substr(1)==="OrangeCloud"){fields.stateManagerObj.switchState(null,"OrangeCloud",null)}else{fields.stateManagerObj.requestAppClose(null)}});basicUtilities.callback(aNext,false,0,null)}},function(aNext,aResult){if(!aResult||aResult.status===0){window.location.hash="#OrangeCloud";basicUtilities.callback(aNext,false,0,null)}else{console.error("MainClass: Internal error. Aborting...");basicUtilities.callback(aNext,false,-1,null)}}],this)}}return MainClass});