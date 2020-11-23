define(["text","handlebars","jquery","text!templates_install/layoutTemplate","text!templates_install/headerTemplate","text!templates_install/infoTemplate","text!templates_install/contentTemplate","text!templates_install/titleTemplate","text!templates_install/subtitleTemplate","text!templates_install/infotextTemplate","text!templates_install/textTemplate","text!templates_install/bulletTemplate","text!templates_install/textfieldTemplate","text!templates_install/inlinetextfieldTemplate","text!templates_install/spinnerTemplate","text!templates_install/radioTemplate","text!templates_install/fileTemplate","text!templates_install/buttonTemplate","text!templates_install/tickTemplate","text!templates_install/separatorTemplate","text!templates_install/popupTemplate","text!templates_install/template.css"],function(Text,Handlebars,$,aLayout,aHeader,aInfo,aContent,aTitle,aSubtitle,aInfoText,aText,aBullet,aTextfield,aInlineTextfield,aSpinner,aRadio,aFile,aButton,aTick,aSeparator,aPopup,aStyle){"use strict";var result={},spinnerAnimate,positionPopup,showPopup,hidePopup,allPartials,enablePopOver,progressBarCreate,progressBarStop,progressBarStartTimer,progressBarSetValue;Handlebars.registerHelper("ifEqual",function(v1,v2,options){return v1===v2?options.fn(this):options.inverse(this)});Handlebars.registerHelper("ifLower",function(v1,v2,options){return v1<v2?options.fn(this):options.inverse(this)});Handlebars.registerHelper("ifGreater",function(v1,v2,options){return v1>v2?options.fn(this):options.inverse(this)});function stripLines(string){return string.replace(/(\r\n|\n|\r|\t)/gm,"")}spinnerAnimate=function(){$({deg:0}).animate({deg:360},{duration:1e3,step:function(now){$(".spinner").css({transform:"rotate("+now+"deg)"})},complete:function(){spinnerAnimate()}})};progressBarCreate=function(aTargetId,aId){if($("#"+aTargetId)){var c='<div id="'+aId+'"><div class="outer_progress_bar"><div class="inner_progress_bar"></div></div></div>';$("#"+aTargetId).append(c)}else{return 0}};progressBarStop=function(aId,aReset){if($("#"+aId)){$("#"+aId).find(".inner_progress_bar").stop(true,false);if(aReset){$("#"+aId).find(".inner_progress_bar").css({left:0})}}else{return 0}};progressBarStartTimer=function(aId,aTimeout,aCallback){if($("#"+aId)){var total=$("#"+aId).find(".outer_progress_bar").width();if(aCallback){$("#"+aId).find(".inner_progress_bar").animate({left:total},aTimeout*1e3,aCallback)}else{$("#"+aId).find(".inner_progress_bar").animate({left:total},aTimeout*1e3)}}else{return 0}};progressBarSetValue=function(aId,aValue){var total,value;if($("#"+aId)){total=$("#"+aId).find(".outer_progress_bar").width();value=(aValue/100*total).toString()+"px";$("#"+aId).find(".inner_progress_bar").css("left",value)}else{return 0}};positionPopup=function(aPopup){var availableXScreen,availableYScreen,popup_newleft,popup_newtop;availableXScreen=Math.max(window.innerWidth||0);availableYScreen=Math.max(window.innerHeight||0);popup_newleft=availableXScreen/2-aPopup.width()/2+"px";popup_newtop=availableYScreen/2-aPopup.height()/2+"px";aPopup.css({position:"fixed",left:popup_newleft,top:popup_newtop})};enablePopOver=function(){var availableXScreen,selector;availableXScreen=Math.max(window.document.documentElement.clientWidth,window.innerWidth||0);selector=$(".help-img-size");selector.off("click");if(availableXScreen<1024){selector.css("cursor","pointer");selector.on("click",function(e){if(selector.closest(".help-img").siblings(".help-pop-over").css("display")==="none"){selector.closest(".help-img").siblings(".help-pop-over").show();selector.closest(".help-img").siblings(".help-pop-over").css({left:e.pageX-selector.closest(".help-img").siblings(".help-pop-over").width()+"px",top:e.pageY+"px"})}else{selector.closest(".help-img").siblings(".help-pop-over").hide()}})}else{selector.off("click");selector.css("cursor","default")}};showPopup=function(aPopup){positionPopup(aPopup);$(window).resize(function(){positionPopup(aPopup)}.bind(this,aPopup));$(".popup_screen").show();aPopup.show()};hidePopup=function(aPopup){$(".popup_screen").hide();aPopup.hide()};function quickRegisterPartial(aPartial){var partialName;for(partialName in aPartial){if(aPartial.hasOwnProperty(partialName)){Handlebars.registerPartial(partialName,stripLines(aPartial[partialName]))}}}allPartials={titleTemplate:aTitle,subtitleTemplate:aSubtitle,textTemplate:aText,infotextTemplate:aInfoText,bulletTemplate:aBullet,textfieldTemplate:aTextfield,inlinetextfieldTemplate:aInlineTextfield,spinnerTemplate:aSpinner,radioTemplate:aRadio,fileTemplate:aFile,buttonTemplate:aButton,tickTemplate:aTick,separatorTemplate:aSeparator,popupTemplate:aPopup,headerTemplate:aHeader,infoTemplate:aInfo,contentTemplate:aContent};quickRegisterPartial(allPartials);result.template=Handlebars.compile(stripLines(aLayout));result.style=aStyle;result.spinnerAnimate=spinnerAnimate;result.positionPopup=positionPopup;result.showPopup=showPopup;result.hidePopup=hidePopup;result.enablePopOver=enablePopOver;result.progressBarCreate=progressBarCreate;result.progressBarStop=progressBarStop;result.progressBarStartTimer=progressBarStartTimer;result.progressBarSetValue=progressBarSetValue;return result});