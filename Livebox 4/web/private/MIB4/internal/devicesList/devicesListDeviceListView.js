define(["utils/console","utils/basics","lib/eventHandler","lib/stateViewInterface","jquery","text","templates_app/template","text!bootstrap/bootstrap.css","json!app/config/devicesListDeviceList.json","app/devicesListSharedView"],function(console,basicUtilities,EventHandlerClass,StateViewClass,$,Text,TemplateClass,Bootstrap,Config,SharedViewClass){"use strict";function DevicesListDeviceListViewClass(aStateId,aTranslateObj){this.fields={deviceIconObj:{Computer:"node-device-icon-computer",Mobile:"node-device-icon-mobile",Tablet:"node-device-icon-tablet",Printer:"node-device-icon-printer",SetTopBox:"node-device-icon-stb",Laptop:"node-device-icon-laptop",Console:"node-device-icon-vgconsole",TV:"node-device-icon-tv",Liveradio:"node-device-icon-liveradio",Disk:"node-device-icon-storage",Phone:"node-device-icon-phone-new",Notebook:"node-device-icon-notebook",HomeLibrary:"node-device-icon-homelibrary",HomePlug:"node-liveplug-icon-solo",SqueezeBox:"node-device-icon-squeezebox",SmokeDetector:"node-device-icon-sensorhome",HomeLive:"node-device-icon-homelive",HomePoint:"node-device-icon-homepoint"},connectionIconObj:{ethernet:"devicelist-menu-ethernet",wifi:"devicelist-menu-wifi",usb:"devicelist-menu-usb",fxs:"devicelist-menu-fxs",dect:"devicelist-menu-dect"},connectionIconObjG:{ethernet:"devicelist-menu-ethernet-g",wifi:"devicelist-menu-wifi-g"},defaultScheduleValues:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],defaultScheduleValuesFormatted:[{start:0,end:604800}]};StateViewClass.call(this,aStateId,aTranslateObj);this.init=function(aCallback){console.debug("DevicesListDeviceListViewClass: Initialising state '"+this.getId()+"'");basicUtilities.queue([function(aNext){SharedViewClass.import(aNext,this)},function(aNext,aResult){if(!aResult||aResult.status===0){this.setStyle(aNext)}else{basicUtilities.callback(aNext,false,0,null);this.notifyError("DevicesListDeviceListViewClass: Failed to import share view class","aba0089")}},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.notifyError("DevicesListDeviceListViewClass: Failed to set style","aba0090")}}],this)};this.quit=function(aCallback){console.debug("DevicesListDeviceListViewClass: Releasing state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.unsetStyle(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.notifyError("DevicesListDeviceListViewClass: Failed to unset style","aba0091")}}],this)};this.enable=function(aCallback){console.debug("DevicesListDeviceListViewClass: Enabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.viewDisplayPage(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){if(this.fields.currentData.hasOwnProperty("targetDeviceId")){if(this.fields.currentData.targetDeviceId!==""&&$("#"+this.fields.currentData.targetDeviceId)){$("#"+this.jQueryEscape(this.fields.currentData.targetDeviceId)).find(".devicelist-menu-device-title").first().click()}else{$(".devicelist-menu-device-title").first().click()}this.fields.currentData.targetDeviceId=""}else{$(".devicelist-menu-device-title").first().click()}basicUtilities.callback(aNext,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null)}},function(aNext,aResult){if(!aResult||aResult.status===0){this.setPageTitle(null,$(".header-title").find("h1").find("span").html());this.setAppCloseButton(aCallback,"app_close")}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.disable=function(aCallback){console.debug("DevicesListDeviceListViewClass: Disabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.viewEmptyPage(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.stripLines=function(aCallback,aString){basicUtilities.callback(aCallback,false,0,aString.replace(/(\r\n|\n|\r|\t)/gm,""))};this.fillTemplate=function(aCallback,template,context){basicUtilities.queue([function(aNext){this.stripLines(aNext,context)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,template(JSON.parse(aResult.data)))}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.viewDisplayPage=function(aCallback){basicUtilities.queue([function(aNext){this.fillTemplate(aNext,TemplateClass.template,Config)},function(aNext,aResult){if(!aResult||aResult.status===0){$(window.document.body).html(aResult.data);this.translate();$("#tab_map").off().on("click",function(event){event.preventDefault();window.location.hash="#map"});$("#tab_template_container").off().on("keydown",function(event){var keyCode=event.keyCode||event.which;if(keyCode===37){event.preventDefault();window.location.hash="#map"}}.bind(this));$("#cancel").off().on("click",function(event){event.preventDefault();$(".devicelist-menu-category-title-selected").click()}.bind(this));$("#save").off().on("click",function(event){event.preventDefault();if(this.isDeviceNameValid($("#device_name").val())){$("#device_name_warning").css("display","none");if($("input[name=scheduler_mode_choice]:checked").val()==="allow"){this.fireEvent("ViewSubmitted",{value:this.retrieveAllInfoInView()})}else if($("input[name=scheduler_mode_choice]:checked").val()==="block"){TemplateClass.showPopup($("#popup_block_confirm"))}else if($("input[name=scheduler_mode_choice]:checked").val()==="manage"){if(this.isCurrentTimeslotOnDisabled()){TemplateClass.showPopup($("#popup_manage_confirm"))}else{this.fireEvent("ViewSubmitted",{value:this.retrieveAllInfoInView()})}}}else{$("#device_name_warning").css("display","inline-block")}}.bind(this));$("#popup_block_confirm_cancel").off().on("click",function(event){event.preventDefault();TemplateClass.hidePopup($("#popup_block_confirm"))});$("#popup_manage_confirm_cancel").off().on("click",function(event){event.preventDefault();TemplateClass.hidePopup($("#popup_manage_confirm"))});$("#popup_block_confirm_submit").off().on("click",function(event){event.preventDefault();this.fireEvent("ViewSubmitted",{value:this.retrieveAllInfoInView()})}.bind(this));$("#popup_manage_confirm_submit").off().on("click",function(event){event.preventDefault();this.fireEvent("ViewSubmitted",{value:this.retrieveAllInfoInView()})}.bind(this));$(".info_template_container").remove();$(".container-content").css("padding-left",0);$(".container-content").css("padding-right",0);$(".container-content").children(".row").prepend("<div class='devicelist-menu' id='devicelist_menu'></div>");$(".container-content").children(".row").children(".col-xs-9").css("display","inline-block");$(".container-content").children(".row").children(".col-xs-9").css("float","left");$(".container-content").children(".row").children(".col-xs-9").css("margin-left","1em");$(".subtitle").css("padding-top","0em");$("#device_type").css("margin-left","3.1em");$("#device_type").css("min-width","13em");$("#device_type").parent().prepend('<div style="position:absolute;width:3.778em;height:2em;display:inline-block;background-size:3.778em 2em;margin-left:-0.5em" id="device_type_icon"></div>');this.changeIcon("device_type_icon");this.changeSchedulerDisplay();$("#device_type").off().on("change keypress",function(){this.changeIcon("device_type_icon")}.bind(this));$("input[name=scheduler_mode_choice]").off().on("change",function(){this.changeSchedulerDisplay()}.bind(this));TemplateClass.enableSchedule("internet_scheduler",this.translate);this.buildDeviceListMenu();$("#content_template_container").css("visibility","hidden");basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.changeIcon=function(targetId){$("#"+targetId).removeClass();$("#"+targetId).addClass(this.fields.deviceIconObj[$("select#device_type option:selected").val()])};this.changeSchedulerDisplay=function(){if($("input[name=scheduler_mode_choice]:checked").val()==="allow"){$("#internet_scheduler").hide()}else if($("input[name=scheduler_mode_choice]:checked").val()==="block"){$("#internet_scheduler").hide()}else if($("input[name=scheduler_mode_choice]:checked").val()==="manage"){$("#internet_scheduler").show()}};this.buildDeviceListMenu=function(){var targetId="devicelist_menu",treeData=this.fields.currentData.getTopology[0],wifiprivate24_pointer,wifiprivate5_pointer,wifiguest24_pointer,wifiguest5_pointer,ethernet1_pointer,ethernet2_pointer,ethernet3_pointer,ethernet4_pointer,dect_pointer,fxs_pointer,usb1_pointer,usb2_pointer,index,index2,currentPointer,currentPointer2;if(treeData.hasOwnProperty("deviceType")&&treeData.hasOwnProperty("children")){if(treeData.deviceType==="HGW"){for(index=0;index<treeData.children.length;index=index+1){currentPointer=treeData.children[index];if(currentPointer.deviceType==="lanIntf"){for(index2=0;index2<currentPointer.children.length;index2=index2+1){currentPointer2=currentPointer.children[index2];if(currentPointer2.deviceType==="portIntf_private_wifi24"){if(currentPointer2.hasOwnProperty("children")){wifiprivate24_pointer=treeData.children[index].children[index2].children}}else if(currentPointer2.deviceType==="portIntf_private_wifi5"){if(currentPointer2.hasOwnProperty("children")){wifiprivate5_pointer=treeData.children[index].children[index2].children}}else if(currentPointer2.deviceType==="portIntf"&&currentPointer2.deviceId==="eth1"){if(currentPointer2.hasOwnProperty("children")){ethernet1_pointer=treeData.children[index].children[index2].children}}else if(currentPointer2.deviceType==="portIntf"&&currentPointer2.deviceId==="eth2"){if(currentPointer2.hasOwnProperty("children")){ethernet2_pointer=treeData.children[index].children[index2].children}}else if(currentPointer2.deviceType==="portIntf"&&currentPointer2.deviceId==="eth3"){if(currentPointer2.hasOwnProperty("children")){ethernet3_pointer=treeData.children[index].children[index2].children}}else if(currentPointer2.deviceType==="portIntf"&&currentPointer2.deviceId==="eth4"){if(currentPointer2.hasOwnProperty("children")){ethernet4_pointer=treeData.children[index].children[index2].children}}}}else if(currentPointer.deviceType==="guestIntf"){for(index2=0;index2<currentPointer.children.length;index2=index2+1){currentPointer2=currentPointer.children[index2];if(currentPointer2.deviceType==="portIntf_guest_wifi24"){if(currentPointer2.hasOwnProperty("children")){wifiguest24_pointer=treeData.children[index].children[index2].children}}else if(currentPointer2.deviceType==="portIntf_guest_wifi5"){if(currentPointer2.hasOwnProperty("children")){wifiguest5_pointer=treeData.children[index].children[index2].children}}}}else if(currentPointer.deviceType==="dectIntf"){if(currentPointer.hasOwnProperty("children")){dect_pointer=treeData.children[index].children}}else if(currentPointer.deviceType==="fxsIntf"){fxs_pointer=treeData.children[index].children}else if(currentPointer.deviceType==="usbIntf"){for(index2=0;index2<currentPointer.children.length;index2=index2+1){currentPointer2=currentPointer.children[index2];if(currentPointer2.deviceType==="portIntf"&&currentPointer2.deviceId==="Port1"){if(currentPointer2.hasOwnProperty("children")){usb1_pointer=treeData.children[index].children[index2].children}}else if(currentPointer2.deviceType==="portIntf"&&currentPointer2.deviceId==="Port2"){if(currentPointer2.hasOwnProperty("children")){usb2_pointer=treeData.children[index].children[index2].children}}}}}this.createCategory(targetId,"livebox_phone","<span class='Translation' data-translation='devicesList.list.devicemenu.phone'></span>","dect");this.createCategory(targetId,"livebox_wifi","<span class='Translation' data-translation='devicesList.list.devicemenu.wifi'></span>","wifi");this.createCategory(targetId,"livebox_ethernet","<span class='Translation' data-translation='devicesList.list.devicemenu.ethernet'></span>","ethernet");this.createCategory(targetId,"livebox_usb","<span class='Translation' data-translation='devicesList.list.devicemenu.usb'></span>","usb");this.createAnyDevice("livebox_ethernet",ethernet1_pointer);this.createAnyDevice("livebox_ethernet",ethernet2_pointer);this.createAnyDevice("livebox_ethernet",ethernet3_pointer);this.createAnyDevice("livebox_ethernet",ethernet4_pointer);this.createAnyDevice("livebox_wifi",wifiprivate24_pointer);this.createAnyDevice("livebox_wifi",wifiprivate5_pointer);this.createAnyDevice("livebox_wifi",wifiguest24_pointer);this.createAnyDevice("livebox_wifi",wifiguest5_pointer);this.createAnyDevice("livebox_phone",dect_pointer);this.createAnyDevice("livebox_phone",fxs_pointer);this.createAnyDevice("livebox_usb",usb1_pointer);this.createAnyDevice("livebox_usb",usb2_pointer);this.translate()}}};this.createCategory=function(targetId,id,name,type){var result;if($("#"+targetId)&&typeof id==="string"&&typeof name==="string"&&this.fields.connectionIconObj.hasOwnProperty(type)){result="<div role='button' id='"+id+"' class='devicelist-menu-category-container'><div class='devicelist-menu-category-title' tabindex='0'><div class='devicelist-menu-category-icon "+this.fields.connectionIconObj[type]+"'></div><div class='devicelist-menu-category-name'>"+name+"</div></div><div id='"+id+"_children' class='devicelist-menu-children'></div></div>";$("#"+targetId).append(result);$("#"+id).children(".devicelist-menu-category-title").off().on("click",function(){if($("#"+id).children(".devicelist-menu-children").css("display").toLowerCase()==="none"){$("#"+id).children(".devicelist-menu-children").css("display","inline-block")}else{$("#"+id).children(".devicelist-menu-children").css("display","none")}});$("#"+id).children(".devicelist-menu-category-title").on("keypress",function(event){var keyCode=event.keyCode||event.which;if(keyCode===13){$(this).trigger("click")}});return true}return false};this.createExtender=function(targetKey,deviceObj){var result;if($("#"+this.jQueryEscape(targetKey)+"_children")&&typeof deviceObj.deviceId==="string"&&typeof deviceObj.deviceName==="string"&&this.fields.deviceIconObj.hasOwnProperty(deviceObj.deviceType)){result="<div role='button' id='"+deviceObj.deviceId+"' class='devicelist-menu-device-container'><div class='devicelist-menu-device-title' tabindex='0'><div class='devicelist-menu-device-icon "+this.fields.deviceIconObj[deviceObj.deviceType]+"'></div><div class='devicelist-menu-device-name'>"+this.shortenName(this.escapeString("js",this.escapeString("html",deviceObj.deviceName)))+"</div><div class='devicelist-menu-extender-downarrow devicelist-menu-extender-uparrow' tabindex='0'></div></div><div id='"+deviceObj.deviceId+"_children' class='devicelist-menu-children'></div></div>";$("#"+this.jQueryEscape(targetKey)+"_children").append(result);$("#"+this.jQueryEscape(deviceObj.deviceId)).children(".devicelist-menu-device-title").children(".devicelist-menu-extender-downarrow").off().on("click",function(event){event.stopPropagation();if($("#"+this.jQueryEscape(deviceObj.deviceId)).children(".devicelist-menu-children").css("display").toLowerCase()==="none"){$("#"+this.jQueryEscape(deviceObj.deviceId)).children(".devicelist-menu-children").css("display","inline-block");$("#"+this.jQueryEscape(deviceObj.deviceId)).children(".devicelist-menu-device-title").children(".devicelist-menu-extender-downarrow").addClass("devicelist-menu-extender-uparrow")}else{$("#"+this.jQueryEscape(deviceObj.deviceId)).children(".devicelist-menu-children").css("display","none");$("#"+this.jQueryEscape(deviceObj.deviceId)).children(".devicelist-menu-device-title").children(".devicelist-menu-extender-downarrow").removeClass("devicelist-menu-extender-uparrow")}}.bind(this));$("#"+this.jQueryEscape(deviceObj.deviceId)).children(".devicelist-menu-device-title").children(".devicelist-menu-extender-downarrow").on("keypress",function(event){event.stopPropagation();var keyCode=event.keyCode||event.which;if(keyCode===13){$(this).trigger("click")}});$("#"+this.jQueryEscape(deviceObj.deviceId)).children(".devicelist-menu-device-title").off().on("click",function(event){event.preventDefault();this.displayDeviceInfo(deviceObj.deviceId)}.bind(this));$("#"+this.jQueryEscape(deviceObj.deviceId)).children(".devicelist-menu-device-title").on("keypress",function(event){var keyCode=event.keyCode||event.which;if(keyCode===13){$(this).trigger("click")}});if(deviceObj.hasOwnProperty("children")){if(deviceObj.children.length>0){this.createAnyDevice(deviceObj.deviceId,deviceObj.children)}}return true}if(deviceObj.hasOwnProperty("children")){if(deviceObj.children.length>0){this.createAnyDevice(targetKey,deviceObj.children);return true}return false}return false};this.createDevice=function(targetKey,deviceObj,connection){var result;if(typeof connection==="undefined"){if($("#"+this.jQueryEscape(targetKey)+"_children")&&typeof deviceObj.deviceId==="string"&&typeof deviceObj.deviceName==="string"&&this.fields.deviceIconObj.hasOwnProperty(deviceObj.deviceType)){result="<div role='button' id='"+deviceObj.deviceId+"' class='devicelist-menu-device-container'><div class='devicelist-menu-device-title' tabindex='0'><div class='devicelist-menu-device-icon "+this.fields.deviceIconObj[deviceObj.deviceType]+"'></div><div class='devicelist-menu-device-name'>"+this.shortenName(this.escapeString("js",this.escapeString("html",deviceObj.deviceName)))+"</div></div></div>";$("#"+this.jQueryEscape(targetKey)+"_children").append(result);$("#"+this.jQueryEscape(deviceObj.deviceId)).children(".devicelist-menu-device-title").off().on("click",function(event){event.preventDefault();this.displayDeviceInfo(deviceObj.deviceId)}.bind(this));$("#"+this.jQueryEscape(deviceObj.deviceId)).children(".devicelist-menu-device-title").on("keypress",function(event){var keyCode=event.keyCode||event.which;if(keyCode===13){$(this).trigger("click")}});return true}return false}if($("#"+this.jQueryEscape(targetKey)+"_children")&&typeof deviceObj.deviceId==="string"&&typeof deviceObj.deviceName==="string"&&this.fields.deviceIconObj.hasOwnProperty(deviceObj.deviceType)&&this.fields.connectionIconObjG.hasOwnProperty(connection)){result="<div role='button' id='"+deviceObj.deviceId+"' class='devicelist-menu-device-container devicelist-menu-device-container2'><div class='devicelist-menu-device-title' tabindex='0'><div class='devicelist-menu-device-icon "+this.fields.deviceIconObj[deviceObj.deviceType]+"'></div><div class='devicelist-menu-device-name devicelist-menu-device-name2'>"+this.shortenName(this.escapeString("js",this.escapeString("html",deviceObj.deviceName)))+"</div><div class='devicelist-menu-connection "+this.fields.connectionIconObjG[connection]+"'></div></div></div>";$("#"+this.jQueryEscape(targetKey)+"_children").append(result);$("#"+this.jQueryEscape(deviceObj.deviceId)).children(".devicelist-menu-device-title").off().on("click",function(event){event.preventDefault();this.displayDeviceInfo(deviceObj.deviceId)}.bind(this));$("#"+this.jQueryEscape(deviceObj.deviceId)).children(".devicelist-menu-device-title").on("keypress",function(event){var keyCode=event.keyCode||event.which;if(keyCode===13){$(this).trigger("click")}});return true}return false};this.createAnyDevice=function(targetKey,deviceObj,connection){var index,currentObj;if(typeof deviceObj!=="undefined"){for(index=0;index<deviceObj.length;index=index+1){currentObj=deviceObj[index];if(currentObj.deviceType.toLowerCase().indexOf("homeplug")>-1){this.createExtender(targetKey,currentObj)}else if(currentObj.deviceType.toLowerCase().indexOf("portintf")>-1){if(currentObj.hasOwnProperty("children")){if(currentObj.children.length>0){if(currentObj.deviceType.toLowerCase().indexOf("portintf_cpl")>-1){this.createAnyDevice(targetKey,currentObj.children,"ethernet")}else{if(typeof connection!=="undefined"){this.createAnyDevice(targetKey,currentObj.children,connection)}else{this.createAnyDevice(targetKey,currentObj.children)}}}}}else{if(typeof connection!=="undefined"){this.createDevice(targetKey,currentObj,connection)}else{this.createDevice(targetKey,currentObj)}}}}};this.displayDeviceInfo=function(id){$(".devicelist-menu-device-title").removeClass("devicelist-menu-category-title-selected");$("#"+this.jQueryEscape(id)).children(".devicelist-menu-device-title").addClass("devicelist-menu-category-title-selected");this.loadDeviceInfo(id)};this.resetDisplay=function(){$(".devicelist-menu-device-title").removeClass("devicelist-menu-category-title-selected");$("#content_template_container").css("visibility","hidden")};this.loadDeviceInfo=function(id){this.fireEvent("ViewUpdated",{value:id})};this.fillDeviceInfo=function(){var aInfoObj,aScheduleObj;if(!this.fields.currentData.getDeviceInfo){return false}aInfoObj=this.fields.currentData.getDeviceInfo;this.setOptionByValue(null,"device_type",aInfoObj.deviceList[0].deviceType);this.changeIcon("device_type_icon");this.setValue(null,"device_name",aInfoObj.deviceList[0].deviceName);$("#device_ip").children(".txtandfield-text-input").html("");if(aInfoObj.deviceList[0].hasOwnProperty("ETHERNET")){if(aInfoObj.deviceList[0].ETHERNET.ipIpv4!==""){$("#device_ip").children(".txtandfield-text-input").html(aInfoObj.deviceList[0].ETHERNET.ipIpv4)}else if(aInfoObj.deviceList[0].ETHERNET.ipIpv6!==""){$("#device_ip").children(".txtandfield-text-input").html(aInfoObj.deviceList[0].ETHERNET.ipIpv6)}}if(aInfoObj.deviceList[0].hasOwnProperty("WIFI")){if(aInfoObj.deviceList[0].WIFI.ipIpv4!==""){$("#device_ip").children(".txtandfield-text-input").html(aInfoObj.deviceList[0].WIFI.ipIpv4)}else if(aInfoObj.deviceList[0].WIFI.ipIpv6!==""){$("#device_ip").children(".txtandfield-text-input").html(aInfoObj.deviceList[0].WIFI.ipIpv6)}}$("#device_mac").children(".txtandfield-text-input").html("");if(aInfoObj.deviceList[0].hasOwnProperty("ETHERNET")){if(aInfoObj.deviceList[0].ETHERNET.macAddress!==""){$("#device_mac").children(".txtandfield-text-input").html(aInfoObj.deviceList[0].ETHERNET.macAddress)}}if(aInfoObj.deviceList[0].hasOwnProperty("WIFI")){if(aInfoObj.deviceList[0].WIFI.macAddress!==""){$("#device_mac").children(".txtandfield-text-input").html(aInfoObj.deviceList[0].WIFI.macAddress)}}if(!this.fields.currentData.getDeviceSchedule){this.setValuesOnScheduler(null,"internet_scheduler",this.fields.defaultScheduleValues)}else{aScheduleObj=this.fields.currentData.getDeviceSchedule;if(aScheduleObj.hasOwnProperty("scheduleList")){this.setValuesOnScheduler(null,"internet_scheduler",this.unformatSchedule(aScheduleObj.scheduleList))}}if(aInfoObj.deviceList[0].useSchedule&&aScheduleObj.hasOwnProperty("scheduleList")){if(this.isSameSchedule(this.fields.defaultScheduleValuesFormatted,aScheduleObj.scheduleList)){$("input[name=scheduler_mode_choice][value=block]").prop("checked",true);$("#internet_scheduler").hide()}else{$("input[name=scheduler_mode_choice][value=manage]").prop("checked",true);$("#internet_scheduler").show()}}else{$("input[name=scheduler_mode_choice][value=allow]").prop("checked",true);$("#internet_scheduler").hide()}if(this.isDeviceAllowed()===1){$("#device_connection").children(".txtandfield-text-input").html('<span class="Translation" data-translation="devicesList.list.customize.connection.values.connected"></span>')}else{$("#device_connection").children(".txtandfield-text-input").html('<span class="Translation" data-translation="devicesList.list.customize.connection.values.disconnected"></span>')}if(aInfoObj.deviceList[0].linkMode.toLowerCase()==="catiq2"){this.setDisabledInput(null,"device_type",true);this.setDisabledInput(null,"device_name",false);$("#device_ip").hide();$("#device_mac").hide();$("#device_connection").hide();$("#content_template_container").find(".content-separator").eq(0).hide();$("#content_template_container").find(".subtitle").eq(0).hide();$("#content_template_container").find(".bodytxt").eq(0).hide();$("#content_template_container").find(".bodytxt").eq(1).hide();$("#scheduler_mode").hide()}else if(aInfoObj.deviceList[0].linkMode.toLowerCase()==="fxs"){this.setDisabledInput(null,"device_type",true);this.setDisabledInput(null,"device_name",true);$("#device_ip").hide();$("#device_mac").hide();$("#device_connection").hide();$("#content_template_container").find(".content-separator").eq(0).hide();$("#content_template_container").find(".subtitle").eq(0).hide();$("#content_template_container").find(".bodytxt").eq(0).hide();$("#content_template_container").find(".bodytxt").eq(1).hide();$("#scheduler_mode").hide();$("#scheduler_mode").hide()}else if(aInfoObj.deviceList[0].linkMode.toLowerCase()==="wifi"||aInfoObj.deviceList[0].linkMode.toLowerCase()==="ethernet"){this.setDisabledInput(null,"device_type",false);this.setDisabledInput(null,"device_name",false);$("#device_ip").show();$("#device_mac").show();$("#device_connection").show();$("#content_template_container").find(".content-separator").eq(0).show();$("#content_template_container").find(".subtitle").eq(0).show();$("#content_template_container").find(".bodytxt").eq(0).show();$("#content_template_container").find(".bodytxt").eq(1).show();$("#scheduler_mode").show()}else{this.setDisabledInput(null,"device_type",true);this.setDisabledInput(null,"device_name",true);$("#device_ip").hide();$("#device_mac").hide();$("#device_connection").hide();$("#content_template_container").find(".content-separator").eq(0).hide();$("#content_template_container").find(".subtitle").eq(0).hide();$("#content_template_container").find(".bodytxt").eq(0).hide();$("#content_template_container").find(".bodytxt").eq(1).hide();$("#scheduler_mode").hide()}this.translate();$("#content_template_container").css("visibility","visible");$("#device_type").focus()};this.isDeviceAllowed=function(){var result,dateArray,dayMultiplicator=0,hour,dataSchedule;if(this.fields.currentData.hasOwnProperty("getTime")){if(this.fields.currentData.getTime.hasOwnProperty("time")){dateArray=this.fields.currentData.getTime.time.split(" ")}else{return-1}}else{return-1}if(this.fields.currentData.hasOwnProperty("getDeviceInfo")){if(this.fields.currentData.getDeviceInfo.hasOwnProperty("deviceList")){if(this.fields.currentData.getDeviceInfo.deviceList.length>0){if(this.fields.currentData.getDeviceInfo.deviceList[0].hasOwnProperty("useSchedule")){if(this.fields.currentData.getDeviceInfo.deviceList[0].useSchedule){switch(dateArray[0].substr(0,3)){case"Tue":dayMultiplicator=1;break;case"Wed":dayMultiplicator=2;break;case"Thu":dayMultiplicator=3;break;case"Fri":dayMultiplicator=4;break;case"Sat":dayMultiplicator=5;break;case"Sun":dayMultiplicator=6;break;case"Mon":dayMultiplicator=0;break;default:dayMultiplicator=0;break}hour=parseInt(dateArray[4].split(":")[0],10);dataSchedule="day"+dayMultiplicator.toString()+"_"+(hour.toString().length===1?"0"+hour.toString():hour.toString());$("#internet_scheduler").find(".scheduler-case[data-schedule='"+dataSchedule+"']").each(function(){if(!$("#internet_scheduler").hasClass("scheduler-case-filled")){result=1}else{result=0}});return result}return 1}return-1}return-1}return-1}return-1};this.formatSchedule=function(aTimetable){var result=[],topLimit=0,bottomLimit=0,previousState=1,index;if(aTimetable.length>0){aTimetable[aTimetable.length]=1;for(index=0;index<aTimetable.length;index=index+1){if(aTimetable[index]===0&&previousState===1){topLimit=index}else if(aTimetable[index]===1&&previousState===0){bottomLimit=index;result.push({start:topLimit*3600,end:bottomLimit*3600})}previousState=aTimetable[index]}}return result};this.unformatSchedule=function(timeTable){var result=[],index,subindex,start=0,stop=0;for(index=0;index<168;index=index+1){result[index]=1}for(index=0;index<timeTable.length;index=index+1){start=timeTable[index].start/3600;stop=timeTable[index].end/3600;for(subindex=start;subindex<stop;subindex=subindex+1){result[subindex]=0}}return result};this.isSameSchedule=function(schedule1,schedule2){var index;if(schedule1.length!==schedule2.length){return false}for(index=0;index<schedule1.length;index=index+1){if(schedule1[index].start!==schedule2[index].start){return false}if(schedule1[index].end!==schedule2[index].end){return false}}return true};this.retrieveScheduleListInView=function(){var result={},scheduleList=[];result.deviceId=this.fields.currentData.getDeviceInfo.deviceList[0].deviceId;$("#internet_scheduler").find(".scheduler-case").each(function(){if($(this).hasClass("scheduler-case-filled")){scheduleList.push(1)}else{scheduleList.push(0)}});if(scheduleList.length===168){if($("input[name=scheduler_mode_choice]:checked").val()==="block"){result.scheduleList=this.formatSchedule(this.fields.defaultScheduleValues)}else{result.scheduleList=this.formatSchedule(scheduleList)}return result}console.error("WifiAdvancedSchedulerViewClass: could not retrieve schedule data on form");return false};this.retrieveDeviceInfoInView=function(){var result={};result.deviceId=this.fields.currentData.getDeviceInfo.deviceList[0].deviceId;result.deviceType=$("select#device_type option:selected").val();result.deviceName=$("#device_name").val();if(this.fields.currentData.isScheduleRelevant){if($("input[name=scheduler_mode_choice]:checked").val()==="allow"){result.useSchedule=false}else if($("input[name=scheduler_mode_choice]:checked").val()==="block"||$("input[name=scheduler_mode_choice]:checked").val()==="manage"){result.useSchedule=true}}return result};this.retrieveAllInfoInView=function(){var result={};if(this.fields.currentData.isScheduleRelevant){result.setDeviceScheduleObj=this.retrieveScheduleListInView()}result.configureDeviceObj=this.retrieveDeviceInfoInView();return result};this.setValuesOnScheduler=function(aCallback,aSchedulerId,aValues){TemplateClass.setValuesOnScheduler(aSchedulerId,aValues,this.translate);basicUtilities.callback(aCallback,false,0,null)};this.hidePopup=function(aId){TemplateClass.hidePopup($("#"+aId))};this.isCurrentTimeslotOnDisabled=function(){var result,dateArray=this.fields.currentData.getTime.time.split(" "),dayMultiplicator=0,hour,dataSchedule="";switch(dateArray[0].substr(0,3)){case"Tue":dayMultiplicator=1;break;case"Wed":dayMultiplicator=2;break;case"Thu":dayMultiplicator=3;break;case"Fri":dayMultiplicator=4;break;case"Sat":dayMultiplicator=5;break;case"Sun":dayMultiplicator=6;break;case"Mon":dayMultiplicator=0;break;default:dayMultiplicator=0;break}hour=parseInt(dateArray[4].split(":")[0],10);dataSchedule="day"+dayMultiplicator.toString()+"_"+(hour.toString().length===1?"0"+hour.toString():hour.toString());$(".scheduler-container").each(function(){if($(this).css("display")==="block"){$(this).find(".scheduler-case[data-schedule='"+dataSchedule+"']").each(function(){if(!$(this).hasClass("scheduler-case-filled")){result=true}else{result=false}})}});return result};this.isDeviceNameValid=function(name){return typeof name==="string"&&name.length>0&&name.length<65}}return DevicesListDeviceListViewClass});