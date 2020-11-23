define(["utils/console","utils/basics","lib/eventHandler","lib/stateViewInterface","jquery"],function(console,basicUtilities,EventHandlerClass,StateViewClass,$){"use strict";function FakeSecondViewClass(aStateId,aTranslateObj){var fields;fields={};StateViewClass.call(this,aStateId,aTranslateObj);this.init=function(aCallback){console.debug("FakeSecondViewClass: Initialising state '"+this.getId()+"'");$("body").append("<div id='fakeSecond' style='display: none;'><input id='fakeSecondtBtn' type='button' value='Back to First' /></div>");basicUtilities.callback(aCallback,false,0,null)};this.quit=function(aCallback){console.debug("FakeSecondViewClass: Releasing state '"+this.getId()+"'");basicUtilities.callback(aCallback,false,0,null)};this.enable=function(aCallback){console.debug("FakeSecondViewClass: Enabling state '"+this.getId()+"'");$("#fakeSecond").show();$("#fakeSecondtBtn").on("click",null,this.fireEvent.bind(this,"ViewSubmitted",{}));basicUtilities.callback(aCallback,false,0,null)};this.disable=function(aCallback){console.debug("FakeSecondViewClass: Disabling state '"+this.getId()+"'");$("#fakeSecondtBtn").unbind("click");$("#fakeSecond").hide();basicUtilities.callback(aCallback,false,0,null)}}return FakeSecondViewClass});