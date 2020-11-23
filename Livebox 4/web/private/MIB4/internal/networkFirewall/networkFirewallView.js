define(["utils/console","utils/basics","lib/eventHandler","lib/stateViewInterface","jquery","text","templates_app/template","text!bootstrap/bootstrap.css","text!app/config/networkFirewall.json"],function(console,basicUtilities,EventHandlerClass,StateViewClass,$,Text,TemplateClass,Bootstrap,Config){"use strict";function NetworkFirewallViewClass(aStateId,aTranslateObj){var fields,devices;fields={};devices="";StateViewClass.call(this,aStateId,aTranslateObj);this.init=function(aCallback){console.debug("NetworkFirewallViewClass: Initialising state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.setStyle(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.quit=function(aCallback){console.debug("NetworkFirewallViewClass: Releasing state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.unsetStyle(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.enable=function(aCallback){console.debug("NetworkFirewallViewClass: Enabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.setAppCloseButton(aNext,"app_close")},function(aNext){this.setAppCloseButton(aNext,"cancelState")},function(aNext){this.setAppCloseButton(aNext,"cancelRules")},function(aNext){this.viewDisplayPage(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.disable=function(aCallback){console.debug("NetworkFirewallViewClass: Disabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.viewEmptyPage(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.stripLines=function(aCallback,aString){basicUtilities.callback(aCallback,false,0,aString.replace(/(\r\n|\n|\r|\t)/gm,""))};this.fillTemplate=function(aCallback,template,context){basicUtilities.queue([function(aNext){this.stripLines(aNext,context)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,template(JSON.parse(aResult.data)))}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.setStyle=function(aCallback){basicUtilities.queue([function(aNext){this.stripLines(aNext,Bootstrap)},function(aNext,aResult){if(!aResult||aResult.status===0){if(!$("#app_conf_style_sheet").length){$("head").append('<style id="app_conf_style_sheet">'+aResult.data+"</style>")}if(!$("#bootstrap_style_sheet").length){$("head").append('<style id="bootstrap_style_sheet">'+TemplateClass.style+"</style>")}basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.unsetStyle=function(aCallback){if($("#app_conf_style_sheet").length){$("head").children("#app_conf_style_sheet").remove()}if($("#bootstrap_style_sheet").length){$("head").children("#bootstrap_style_sheet").remove()}basicUtilities.callback(aCallback,false,0,null)};this.viewEmptyPage=function(aCallback){$(window.document.body).html();basicUtilities.callback(aCallback,false,0,null)};this.viewDisplayPage=function(aCallback){basicUtilities.queue([function(aNext){this.fillTemplate(aNext,TemplateClass.template,Config)},function(aNext,aResult){var radioValue,self;if(!aResult||aResult.status===0){$(window.document.body).html(aResult.data);this.translate();this.setPageTitle(null,$(".header-title").find("h1").find("span").html());$(".title").css("margin-top","1.5em");$(".button-container").css("margin-top","4.5em");$("#submit").attr("disabled",true);radioValue=$('input[name="securityChoice"]').val();$('input[name="securityChoice"]').on("change",function(){if($(this).value!==radioValue){$("#submit").attr("disabled",false)}else{$("#submit").attr("disabled",true)}});self=this;$(document).on("click keypress","#customLink.orangetxt",function(event){if(event.which===13||event.type==="click"){self.fireEvent("ViewSubmitted",{action:"switch"})}});basicUtilities.callback(aNext,false,0,null)}else{basicUtilities.callback(aNext,false,-1,null)}},function(aNext,aResult){if(!aResult||aResult.status===0){$("#security_Low").parent().append("<br>"+'<div style="font-size:14;padding-left:28px;">'+'<span class="Translation"  data-translation="networkFirewall.main.lowLevel.desc"></span>'+"<br>"+'<span class="Translation bold"  data-translation="networkFirewall.main.lowLevel.note"></span>'+"</div>");$("#security_Medium").parent().append("<br>"+'<div style="font-size:14;padding-left:28px;">'+'<span class="Translation"  data-translation="networkFirewall.main.mediumLevel.desc"></span>'+"</div>");$("#security_High").parent().append("<br>"+'<div style="font-size:14;padding-left:28px;">'+'<span class="Translation"  data-translation="networkFirewall.main.highLevel.desc"></span>'+"<br>"+'<span class="Translation bold"  data-translation="networkFirewall.main.highLevel.note"></span>'+"</div>");$("#security_Custom").parent().append("<br>"+'<div style="font-size:14;padding-left:28px;">'+'<span class="Translation"  data-translation="networkFirewall.main.customLevel.desc"></span>'+"<br>"+'<span class="Translation bold"  data-translation="networkFirewall.main.customLevel.note"></span>'+"</div>");this.translate();basicUtilities.callback(aNext,false,0,null)}else{basicUtilities.callback(aNext,false,-1,null)}},function(aNext,aResult){if(!aResult||aResult.status===0){$("#submit").on("click",function(){if($("#security_Custom").is(":checked")){this.showLink(true)}else{this.showLink(false)}$("input[name=securityChoice]").parent().find("label > span").removeClass("orangetxt");$("input[name=securityChoice]:checked").parent().find("label > span").addClass("orangetxt");this.notifyUser("<span class='Translation' data-translation='networkFirewall.main.notify'></span>",1,5);this.fireEvent("ViewSubmitted",{state:$("input[name=securityChoice]:checked").val()})}.bind(this));$("#cancel").on("click",function(){this.fireEvent("ViewCancelled",null)});$("#cancelRules").on("click",function(){this.fireEvent("ViewCancelled",null)});this.addButtonListener();$(".conf-table-blank-cell-empty").css("width","35px");var self=this;$("#add").on("click keypress",function(event){if(event.which===13||event.type==="click"){self.fireEvent("ViewUpdated",{aData:{isEnabled:$("#activateRuleAdd").is(":checked"),protocol:$("#prococole").val(),externalIpAddress:$("#ip").val(),externalPortRange:$("#port").val()}})}}.bind(this));$(document).on("click keypress",".conf-table-button-delete",function(event){if(event.which===13||event.type==="click"){if($(this).attr("id")!==undefined){self.fireEvent("ViewUpdated",{aData:{name:$(this).attr("id")}})}else{$("#empty").parent().css("display","table-cell");$("#addnew").remove()}}}.bind(this));basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.showLink=function(show){if(show){$("#customLink").addClass("orangetxt txt-underline");$("#customLink").attr("tabindex",0);$("#customLink").css("cursor","pointer")}else{$("#customLink").removeClass("orangetxt txt-underline");$("#customLink").css("cursor","default")}};this.displayFirewallState=function(state){$("#security_"+state).attr("checked","checked");$("#security_"+state).parent().find("label > span").addClass("orangetxt");if(state==="Custom"){this.showLink(true)}};this.addButtonListener=function(){$("#addRules").on("click keypress",function(event){if(event.which===13||event.type==="click"){if($("#empty").length>0){$("#empty").parent().css("display","none")}$("#firewall_list_table tr:last").after('<tr class="conf-table-row" tabindex="0" id="addnew">'+'<td class="conf-table-cell">'+'<input id="activateRuleAdd" tabindex="0" type="checkbox" value="true" name="activateCheckbox" style="display:none;" checked>'+'<label for="activateRuleAdd" style="margin:0;background-size: 2em 2em;height: 2em;width: 2em;"></label>'+"</td>"+'<td class="conf-table-cell">'+'<select class="select" id="protocole">'+'<option value="" class="Translation" data-translation="networkFirewall.IPv6.tab.firstTitle">protocole</option>'+'<option value="UDP" class="Translation" data-translation="networkFirewall.IPv4.modal.protocole.firstValue">UDP</option>'+'<option value="TCP" class="Translation" data-translation="networkFirewall.IPv4.modal.protocole.secondValue">TCP</option>'+'<option value="Les deux" class="Translation" data-translation="networkFirewall.IPv4.modal.protocole.thirdValue">Les deux</option>'+"</select>"+"</td>"+'<td class="conf-table-cell">'+'<select class="select" id="ip">'+'<option value="" class="Translation" data-translation="networkFirewall.IPv6.tab.secondTitle">équipement</option>'+devices+"</select>"+"</td>"+'<td class="conf-table-cell">'+'<input id="port" value="" class="field" type="text">'+"</td>"+'<td class="conf-table-blank-cell">'+'<img alt="supprimer" tabindex="0" class="conf-table-button-delete Translation associate_telephone_table_delete" data-translation="common.delete" src="../../common/img/app_conf/trashbin_666.png">'+"</td>"+"</tr>")}}.bind(this))};this.displayInfo=function(rulesList){var i;if($("#empty").length>0){$("#empty").parent().hide()}$(".ipv4infos").remove();for(i=0;i<=rulesList.length-1;i+=1){if($("#firewall_list_table tr:last").length>0){$("#firewall_list_table tr:last").after('<tr class="conf-table-row ipv4infos">'+'<td class="conf-table-cell">'+'<input tabindex="0" id="activateRule_'+i+'" type="checkbox" value="true" name="activateCheckbox" style="display:none;" '+(rulesList[i].isEnabled?"checked":"")+">"+'<label for="activateRule_'+i+'" tabindex="0"  style="margin:0;background-size: 2em 2em;height: 2em;width: 2em;"></label>'+"</td>"+'<td class="conf-table-cell">'+rulesList[i].name+"</td>"+'<td class="conf-table-cell">'+rulesList[i].protocol+"</td>"+'<td class="conf-table-cell">'+rulesList[i].externalPortRange+"</td>"+'<td class="conf-table-blank-cell">'+'<img alt="supprimer" id="'+rulesList[i].name+'" tabindex="0" class="conf-table-button-delete" id="'+rulesList[i].name+'" src="../../common/img/app_conf/trashbin_666.png">'+"</td>"+"</tr>")}else{$("#firewall_list_table").append('<tr class="conf-table-row ipv4infos">'+'<td class="conf-table-cell">'+'<input id="activateRule_'+i+'" type="checkbox" value="true" name="activateCheckbox" style="display:none;" '+(rulesList[i].isEnabled?"checked":"")+">"+'<label for="activateRule_'+i+'" tabindex="0"  style="margin:0;background-size: 2em 2em;height: 2em;width: 2em;"></label>'+"</td>"+'<td class="conf-table-cell">'+rulesList[i].name+"</td>"+'<td class="conf-table-cell">'+rulesList[i].protocol+"</td>"+'<td class="conf-table-cell">'+rulesList[i].externalPortRange+"</td>"+'<td class="conf-table-blank-cell">'+'<img alt="supprimer" id="'+rulesList[i].name+'" tabindex="0" class="conf-table-button-delete" src="../../common/img/app_conf/trashbin_666.png">'+"</td>"+"</tr>")}}};this.displayIPV6=function(display){if(display){$("#IPV6Title").show();$("#IPV6Add").show();$("#firewall_list").show();$("#IPV6Buttons").show()}else{$("#IPV6Title").hide();$("#IPV6Add").hide();$("#firewall_list").hide();$("#IPV6Buttons").hide()}};this.setListDevices=function(devicesList){var i;for(i=0;i<=devicesList.length-1;i+=1){devices=devices+'<option value="'+devicesList[i].deviceId+'">'+devicesList[i].deviceName+"</option>"}}}return NetworkFirewallViewClass});