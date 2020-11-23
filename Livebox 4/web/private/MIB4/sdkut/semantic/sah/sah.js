define(["utils/console","utils/basics","engine/callStack"],function(console,basicUtilities,aCallStackObj){"use strict";function SahClass(aReferrerId,aProjectId,aEnvironmentId){var fields,abandonApi;fields={targetType:"",referrerId:aReferrerId,projectId:aProjectId,environmentId:aEnvironmentId,isEmulated:false,useRemoteControlMode:false,useApplicationMode:false,reporterUrl:"",ajaxCrosserUrl:"",callStackObj:aCallStackObj,api_queue:[],calls_queue:[],recallTimer:null,nbInvokes:0};abandonApi=function(aApiType,aApiName,nApiName){if(aApiType!=="semantic"){return}if(fields.api_queue.indexOf(aApiName)>=0){fields.api_queue.splice(fields.api_queue.indexOf(aApiName),1);console.error("SahClass: abandon execution of "+aApiType+"."+nApiName+" after a 30 sec timeout");if(fields.calls_queue.indexOf(nApiName)>=0){fields.calls_queue.splice(fields.calls_queue.indexOf(nApiName),1)}}};fields.callStackObj.cache.clearAll();this.setEnvironment=function(aConfig){var needUpdate;needUpdate=false;if(Object.typeOf(aConfig.useApiSimulationMode)==="boolean"){if(Object.typeOf(aConfig.useSemanticSimulationMode)==="boolean"){if(aConfig.useSemanticSimulationMode){fields.callStackObj.setApiSimulationMode(false);fields.callStackObj.setSemanticSimulationMode(true);fields.isEmulated=true}else{fields.callStackObj.setApiSimulationMode(aConfig.useApiSimulationMode);fields.callStackObj.setSemanticSimulationMode(false);fields.isEmulated=aConfig.useApiSimulationMode}}else{fields.callStackObj.setApiSimulationMode(aConfig.useApiSimulationMode);fields.callStackObj.setSemanticSimulationMode(false);fields.isEmulated=aConfig.useApiSimulationMode}}else if(Object.typeOf(aConfig.useSemanticSimulationMode)==="boolean"){fields.callStackObj.setApiSimulationMode(false);fields.callStackObj.setSemanticSimulationMode(aConfig.useSemanticSimulationMode);fields.isEmulated=aConfig.useSemanticSimulationMode}if(Object.typeOf(aConfig.useRemoteControlMode)==="boolean"){fields.callStackObj.setRemoteMode(aConfig.useRemoteControlMode);fields.useRemoteControlMode=aConfig.useRemoteControlMode}if(Object.typeOf(aConfig.useApplicationMode)==="boolean"){fields.callStackObj.setApplicationMode(aConfig.useApplicationMode);fields.useApplicationMode=aConfig.useApplicationMode}if(aConfig.reporterUrl){fields.callStackObj.setReporter(basicUtilities.settleUrl(aConfig.reporterUrl));fields.reporterUrl=aConfig.reporterUrl}if(!fields.isEmulated){if(Object.typeOf(aConfig.useValidationMode)==="boolean"){if(fields.reporterUrl){fields.callStackObj.useValidationMode(aConfig.useValidationMode)}else{console.warn("SahClass: Validation mode cannot be activated as mandatory reporter url is missing")}}}else{fields.callStackObj.useValidationMode(false)}if(aConfig.ajaxCrosserUrl){fields.ajaxCrosserUrl=aConfig.ajaxCrosserUrl}if(aConfig.referrerId){fields.referrerId=aConfig.referrerId;needUpdate=true}if(aConfig.projectId){fields.projectId=aConfig.projectId;needUpdate=true}if(aConfig.environmentId){fields.environmentId=aConfig.environmentId;needUpdate=true}if(needUpdate){fields.callStackObj.setEnv("DEV/BASE",fields.projectId,fields.referrerId,fields.environmentId,null)}};this.getEnvironment=function(){return{targetType:fields.targetType,referrerId:fields.referrerId,projectId:fields.projectId,environmentId:fields.environmentId,isEmulated:fields.isEmulated,useRemoteControlMode:fields.useRemoteControlMode,useApplicationMode:fields.useApplicationMode}};this.isEmulated=function(){return fields.isEmulated};this.setDeviceTarget=function(aParameters,aCallback){fields.targetType=aParameters.deviceType;fields.callStackObj.setOnStb(fields.targetType==="stb"&&basicUtilities.isOnStb()?true:false);fields.callStackObj.setOnHgw(fields.targetType==="hgw"?true:false);if(!fields.isEmulated&&!basicUtilities.isOnStb()){if(aParameters.skipCrosser){fields.callStackObj.setProxy("",0)}else if(fields.ajaxCrosserUrl){fields.callStackObj.setProxy(fields.ajaxCrosserUrl,80)}else{console.warn("SahClass: Missing mandatory AjaxCrosser url");fields.callStackObj.setProxy("",0)}fields.callStackObj.setContextHeader(aParameters.contextId||null);fields.callStackObj.setRequest(aParameters.host,aParameters.port,"application/x-sah-ws-4-call+json",aParameters.protocol)}fields.callStackObj.setEnv("DEV/BASE",fields.projectId,fields.referrerId,fields.environmentId);fields.callStackObj.init(aCallback)};this.logIn=function(aUser,aPassword){return fields.callStackObj.logIn(aUser,aPassword)};this.logOut=function(){fields.callStackObj.logOut()};this.isLoggedIn=function(){return fields.callStackObj.isLoggedIn()};this.stopPollingForAuthentication=function(){return fields.callStackObj.stopPollingForAuthentication()};this.invokeApi=function(aApiType,aApiName,aCallback,aValueList){var sdkutObj,nApiName=aApiName;if(!fields.isEmulated&&!fields.targetType){console.error("SahClass: Mandatory device target has not been set");return}if(arguments.length>4){console.warn("SahClass: Unexpected arguments list when array is requested");return}if(aApiType==="suite"){fields.callStackObj.cache.clearAll()}sdkutObj={call:function(aStep,aResult){var parameterTab;if(aStep==="0"){aCallStackObj.reset();console.debug("SahClass: Invoking method '"+aApiType+":"+nApiName+"'");this.skipEvents=false;this.stackId=basicUtilities.generateUUID();parameterTab=[aApiType,aApiName,"1",this];if(aValueList){parameterTab=parameterTab.concat(aValueList)}try{aCallStackObj.push.apply(this,parameterTab)}catch(e){console.debug("SahClass: Test failed ("+e.message+")");if(fields.api_queue.indexOf(aApiName)>=0){fields.api_queue.splice(fields.api_queue.indexOf(aApiName),1)}if(fields.calls_queue.indexOf(nApiName)>=0){fields.calls_queue.splice(fields.calls_queue.indexOf(nApiName),1)}aCallback({status:-1})}}else if(aStep==="1"){console.debug("SahClass: Method '"+aApiType+":"+aApiName+"' returned "+JSON.stringify(aResult));aCallStackObj.popAll(aApiType);if(fields.api_queue.indexOf(aApiName)>=0){fields.api_queue.splice(fields.api_queue.indexOf(aApiName),1)}if(fields.calls_queue.indexOf(nApiName)>=0){fields.calls_queue.splice(fields.calls_queue.indexOf(nApiName),1)}aCallback(aResult)}else{console.warn("SahClass: Unexpected step '"+aStep+"' in call stack")}}};if(aApiName[0]<=0||aApiName[0]>0){nApiName=aApiName;aApiName=aApiName.substr(aApiName.indexOf(".")+1)}else{nApiName=fields.nbInvokes+"."+aApiName;fields.nbInvokes+=1}if(fields.calls_queue.indexOf(nApiName)>=0){if(fields.api_queue.indexOf(aApiName)>=0){console.warn("SahClass: "+aApiType+"."+aApiName+" is currently being treated. Wait for completion, recall in 1 sec");fields.recallTimer=window.setTimeout(this.invokeApi.bind(this,aApiType,nApiName,aCallback,aValueList),1e3)}else{fields.api_queue.push(aApiName);window.setTimeout(abandonApi.bind(this,aApiType,aApiName,nApiName),3e4);sdkutObj.call("0")}}else{if(fields.api_queue.indexOf(aApiName)>=0){fields.calls_queue.push(nApiName);console.warn("SahClass: "+aApiType+"."+aApiName+" is currently being treated. Wait for completion, recall in 1 sec");fields.recallTimer=window.setTimeout(this.invokeApi.bind(this,aApiType,nApiName,aCallback,aValueList),1e3)}else{fields.api_queue.push(aApiName);fields.calls_queue.push(nApiName);window.setTimeout(abandonApi.bind(this,aApiType,aApiName,nApiName),3e4);sdkutObj.call("0")}}};this.invokeApi_s=function(aApiType,aApiName,aCallback,aValueList){var sdkutObj,nApiName=aApiName;if(!fields.isEmulated&&!fields.targetType){console.error("SahClass: Mandatory device target has not been set");return}if(arguments.length>4){console.warn("SahClass: Unexpected arguments list when array is requested");return}if(aApiType==="suite"){fields.callStackObj.cache.clearAll()}sdkutObj={call:function(aStep,aResult){var parameterTab;if(aStep==="0"){aCallStackObj.reset();console.debug("SahClass: Fast call to method '"+aApiType+":"+aApiName+"'");this.skipEvents=true;this.stackId=basicUtilities.generateUUID();parameterTab=[aApiType,aApiName,"1",this];if(aValueList){parameterTab=parameterTab.concat(aValueList)}try{aCallStackObj.push.apply(this,parameterTab)}catch(e){console.debug("SahClass: Test failed ("+e.message+")");window.clearTimeout(fields.recallTimer);if(fields.api_queue.indexOf(aApiName)>=0){fields.api_queue.splice(fields.api_queue.indexOf(aApiName),1)}if(fields.calls_queue.indexOf(nApiName)>=0){fields.calls_queue.splice(fields.calls_queue.indexOf(nApiName),1)}aCallback({status:-1})}}else if(aStep==="1"){console.debug("SahClass: Method '"+aApiType+":"+aApiName+"' returned "+JSON.stringify(aResult));aCallStackObj.popAll(aApiType);if(fields.api_queue.indexOf(aApiName)>=0){fields.api_queue.splice(fields.api_queue.indexOf(aApiName),1)}if(fields.calls_queue.indexOf(nApiName)>=0){fields.calls_queue.splice(fields.calls_queue.indexOf(nApiName),1)}aCallback(aResult)}else{console.warn("SahClass: Unexpected step '"+aStep+"' in call stack")}}};if(aApiName[0]<=0||aApiName[0]>0){nApiName=aApiName;aApiName=aApiName.substr(aApiName.indexOf(".")+1)}else{nApiName=fields.nbInvokes+"."+aApiName;fields.nbInvokes+=1}if(fields.calls_queue.indexOf(nApiName)>=0){if(fields.api_queue.indexOf(aApiName)>=0){console.warn("SahClass: "+aApiType+"."+aApiName+" is currently being treated. Wait for completion, recall in 1 sec");fields.recallTimer=window.setTimeout(this.invokeApi_s.bind(this,aApiType,nApiName,aCallback,aValueList),1e3)}else{fields.api_queue.push(aApiName);window.setTimeout(abandonApi.bind(this,aApiType,aApiName,nApiName),3e4);sdkutObj.call("0")}}else{if(fields.api_queue.indexOf(aApiName)>=0){fields.calls_queue.push(nApiName);console.warn("SahClass: "+aApiType+"."+aApiName+" is currently being treated. Wait for completion, recall in 1 sec");fields.recallTimer=window.setTimeout(this.invokeApi_s.bind(this,aApiType,nApiName,aCallback,aValueList),1e3)}else{fields.api_queue.push(aApiName);fields.calls_queue.push(nApiName);window.setTimeout(abandonApi.bind(this,aApiType,aApiName,nApiName),3e4);sdkutObj.call("0")}}};this.rebootStb=function(aCallback){var sdkutObj;if(!fields.isEmulated&&!fields.targetType){console.error("SahClass: Mandatory device target has not been set");return}sdkutObj={fields:{nbStep:0,mxStep:0},call:function(aStep,aResult){if(aStep==="0"){this.fields.nbStep=0;this.fields.mxStep=0;console.info("SahClass: Rebooting Set-Top Box...");this.fields.mxStep+=1;aCallStackObj.push("api","com.softathome.System.Power.Reboot","1",this)}else{this.fields.nbStep+=1;switch(aStep){case"1":if(aResult.status===0){this.fields.mxStep+=1;aCallStackObj.reCall(this,"2",9e4)}else{this.fields.mxStep=-1;aCallStackObj.logMessage("FUN_SEM_ERROR")}break;case"2":console.info("SahClass: Waiting for Set-Top Box...");this.fields.mxStep+=1;aCallStackObj.push("api","com.softathome.System.Software.GetSopVersion","3",this);break;case"3":if(aResult.status===0){console.info("SahClass: Set-Top Box is back !");this.fields.mxStep+=1;aCallStackObj.reCall(this,"4",3e4)}else if(aResult.status===-1001){console.info("SahClass: Set-Top Box is back but context seems to be invalid !");this.fields.mxStep+=1;aCallStackObj.reCall(this,"4",3e4)}else{this.fields.mxStep+=1;aCallStackObj.reCall(this,"2",15e3)}break;case"4":break;default:console.error("SahClass: Unhandled step <%s>, with a received Result: <%o>",aStep,aResult);this.fields.nbStep-=1;break}}if(this.fields.nbStep>=this.fields.mxStep){aCallStackObj.popAll("api");aCallback()}}};sdkutObj.call("0")};this.getSopVersion=function(){return fields.callStackObj.getEnv("sop")};this.getPlatform=function(){return fields.callStackObj.getEnv("hardware")};this.getCapabilities=function(){return fields.callStackObj.getCapabilities()};this.loadResources=function(aCallback){return fields.callStackObj.loadResources(aCallback)};this.getResources=function(){return fields.callStackObj.getResources()};this.getInvokeApiState=function(){return fields.callStackObj.getCurrState()};this.setStateCallback=function(aCallback){return fields.callStackObj.setConsoleOutput(aCallback)};this.setProgressBarCallback=function(aCallback){return fields.callStackObj.setProgressBarCallback(aCallback)};this.showErrorsReport=function(){return fields.callStackObj.reportErrors()};this.listenEvent=function(aHandler,aCallback){return fields.callStackObj.listenEvent(aHandler,aCallback)};this.unlistenEvent=function(aHandler,aEventUUID){return fields.callStackObj.unlistenEvent(aHandler,aEventUUID)};this.triggerEvent=function(aHandler,aReason,aSessionId,aAttributes){return fields.callStackObj.triggerEvent(aHandler,aReason,aSessionId,aAttributes)};this.startEventListener=function(){fields.callStackObj.reset();return fields.callStackObj.startPolling()};this.stopEventListener=function(){return fields.callStackObj.stopPolling()};this.updateEventListener=function(aNewEventHandler){fields.callStackObj.updateEventHandlersList(aNewEventHandler)};this.setOptimizer=function(aPreviousCall,aCurrentCall,aNextCall){fields.callStackObj.setOptimizer(aPreviousCall,aCurrentCall,aNextCall)};this.getOptimizer=function(){return fields.callStackObj.getOptimizer()};this.checkOptimizer=function(aWay){return fields.callStackObj.checkOptimizer(aWay)};this.getExecResults=function(){return fields.callStackObj.getExecResults()};this.stopExecution=function(){fields.callStackObj.push=fields.callStackObj.doNothing;fields.callStackObj.reCall=fields.callStackObj.doNothing;fields.callStackObj.popAll=fields.callStackObj.doNothing;fields.currentInvokes=[];window.clearTimeout(fields.recallTimer)};this.resetExecution=function(){fields.callStackObj.push=fields.callStackObj.realPush;fields.callStackObj.reCall=fields.callStackObj.realReCall;fields.callStackObj.popAll=fields.callStackObj.realPopAll};this.statProcessor=function(){return fields.callStackObj.statProcessor()}}return SahClass});