define(["utils/console","utils/basics","engine/callStack"],function(console,basicUtilities,callStack){"use strict";return{getStatus:{name:"getStatus",description:"This method gets details about the current ethernet status",fields:{uuid:null,nbStep:0,mxStep:0,status:0,data:{linkMode:"",linkType:""}},call:function(aStep,aResult){if(aStep==="0"){this.fields.uuid=aResult.uuid;this.fields.status=0;this.fields.nbStep=0;this.fields.mxStep=0;this.fields.mxStep+=1;if(callStack.isOnHgw()){callStack.push("api","pcb.NMC.getWANStatus","1",this,{})}else{callStack.push("api","com.softathome.ConnectionManager.Client.Common.GetConnectionState","1",this)}}else{this.fields.nbStep+=1;switch(aStep){case"1":if(aResult.status===0||aResult.status===true){this.fields.data.linkMode=aResult.data.LinkType.toUpperCase();this.fields.data.linkType=aResult.data.LinkType.toUpperCase()+"_"+aResult.data.Protocol.toUpperCase();if(this.fields.data.linkMode==="Ethernet"){this.fields.data.FTTH={vlan:"",encapsulation:"802.1q",dataPath:"Fast",MtuSize:""}}this.fields.data.protocol=aResult.data.Protocol;if(this.fields.data.protocol==="ppp"){this.fields.data.PPP={protocolType:"",login:"",authenticationMode:"Auto",isAuthenticated:"",state:""};if(aResult.data.ConnectionState==="Connected"){this.fields.data.PPP.state="OK"}else{this.fields.data.PPP.state="Error"}}}else{console.warn("No active wan connection detected")}if(callStack.isOnHgw()){if(this.fields.data.linkMode==="Ethernet"){this.fields.mxStep+=1;callStack.push("api","pcb.NetMaster.getInterfaceConfig","2",this,{name:this.fields.data.linkType})}else{if(this.fields.data.protocol==="ppp"){this.fields.mxStep+=1;callStack.push("api","pcb.NeMo.getMIBs","4",this,"data",{mibs:"base ppp dhcp"})}}}break;case"2":if(aResult.status===0||aResult.status===true){this.fields.data.FTTH.vlan=aResult.data.data.VLANID}else{this.fields.data.FTTH.vlan="";console.warn("No active wan connection detected")}if(callStack.isOnHgw()){this.fields.mxStep+=1;callStack.push("api","pcb.NeMo.getFirstParameter","3",this,"data",{name:"MTU"})}break;case"3":if(aResult.status===0||aResult.status===true){this.fields.data.FTTH.MtuSize=aResult.data}else{console.warn("No active wan connection detected")}if(callStack.isOnHgw()){if(this.fields.data.protocol==="ppp"){this.fields.mxStep+=1;callStack.push("api","pcb.NeMo.getMIBs","4",this,"data",{mibs:"base ppp dhcp"})}}break;case"4":if(aResult.status===0||aResult.status===true){this.fields.data.PPP.protocolType=aResult.data.ppp.ppp_data.TransportType}else{console.warn("No active wan connection detected")}if(callStack.isOnHgw()){this.fields.mxStep+=1;callStack.push("api","pcb.NeMo.getFirstParameter","5",this,"data",{name:"Username"})}break;case"5":if(aResult.status===0||aResult.status===true){this.fields.data.PPP.login=aResult.data}else{console.warn("No active wan connection detected")}if(callStack.isOnHgw()){this.fields.mxStep+=1;callStack.push("api","pcb.NeMo.isUp","6",this,"data",{flag:"logical"})}break;case"6":this.fields.data.PPP.isAuthenticated=aResult.data;break;default:console.warn("Unexpected step '"+aStep+"' in call stack");this.fields.nbStep-=1;break}}if(this.fields.nbStep>=this.fields.mxStep){var result={status:this.fields.status};if(this.fields.status===0&&this.fields.data){result.data=this.fields.data}callStack.popAll("api",result,this.fields.uuid)}}},getStatistics:{name:"getStatistics",description:"This method gets details about the current ethernet/dsl statistics",fields:{uuid:null,nbStep:0,mxStep:0,status:0,data:{linkMode:"",linkType:""}},call:function(aStep,aResult){var ethId,result;if(aStep==="0"){this.fields.uuid=aResult.uuid;this.fields.status=0;this.fields.nbStep=0;this.fields.mxStep=0;this.fields.mxStep+=1;this.fields.synchroDuration=0;this.fields.LinkState="down";if(callStack.isOnHgw()){callStack.push("api","pcb.NMC.getWANStatus","1",this,{})}else{callStack.push("api","com.softathome.ConnectionManager.Client.Common.GetConnectionState","1",this)}}else{this.fields.nbStep+=1;switch(aStep){case"1":if(aResult.status===0||aResult.status===true){this.fields.data.linkMode=aResult.data.LinkType.toUpperCase();this.fields.data.linkType=aResult.data.LinkType.toUpperCase()+"_"+aResult.data.Protocol.toUpperCase();this.fields.LinkState=aResult.data.LinkState;if(this.fields.data.linkMode.toLowerCase()==="ethernet"){this.fields.data.FTTH={connectionDuration:0,uploadBandwidth:0,downloadBandwidth:0,noiseLevel:0,downloadErrorDuration:0,downloadFailureDuration:0,crcErrors:0,fecCorrections:0}}else{this.fields.data.DSL={connectionDuration:0,uploadBandwidth:0,downloadBandwidth:0,noiseLevel:0,downloadErrorDuration:0,downloadFailureDuration:0,crcErrors:0,fecCorrections:0}}this.fields.data.protocol=aResult.data.Protocol;if(this.fields.data.protocol==="ppp"){this.fields.data.PPP={lastConnectionTime:0,connectionDuration:0,lastDisconnectionTime:0,lastError:""}}}else{console.warn("No active wan connection detected")}if(callStack.isOnHgw()){this.fields.mxStep+=1;callStack.push("api","pcb.DeviceManager.getDeviceInfo","2",this)}break;case"2":if(aResult.status===0||aResult.status===true){this.fields.synchroDuration=aResult.data.UpTime}else{console.warn("No active wan connection detected")}if(callStack.isOnHgw()){if(this.fields.data.linkMode.toLowerCase()==="ethernet"){this.fields.mxStep+=1;callStack.push("api","pcb.NeMo.getMIBs","3",this,"data",{mibs:"eth"})}else{this.fields.mxStep+=1;callStack.push("api","pcb.NeMo.getMIBs","3",this,"data",{mibs:"dsl"})}}break;case"3":if(aResult.status===0||aResult.status===true){if(aResult.data.dsl){if(aResult.data.dsl.dsl0){if(aResult.data.dsl.dsl0.LinkStatus.toLowerCase()==="up"){this.fields.data.DSL.connectionDuration=this.fields.synchroDuration}else{this.fields.data.DSL.connectionDuration=0}this.fields.data.DSL.uploadBandwidth=aResult.data.dsl.dsl0.UpstreamCurrRate;this.fields.data.DSL.downloadBandwidth=aResult.data.dsl.dsl0.DownstreamCurrRate;this.fields.data.DSL.uploadAttenuation=aResult.data.dsl.dsl0.UpstreamAttenuation;this.fields.data.DSL.downloadAttenuation=aResult.data.dsl.dsl0.DownstreamAttenuation;this.fields.data.DSL.uploadNoiseMargin=aResult.data.dsl.dsl0.UpstreamNoiseMargin;this.fields.data.DSL.downloadNoiseMargin=aResult.data.dsl.dsl0.DownstreamNoiseMargin;this.fields.data.DSL.noiseLevel=aResult.data.dsl.dsl0.DownstreamNoiseMargin;this.fields.data.DSL.connectionStatus=aResult.data.dsl.dsl0.LinkStatus;this.fields.data.DSL.dataPath=aResult.data.dsl.dsl0.DataPath;this.fields.data.DSL.standard=aResult.data.dsl.dsl0.StandardUsed;this.fields.data.DSL.modulationType=aResult.data.dsl.dsl0.ModulationType}}else{if(this.fields.LinkState.toLowerCase()==="up"){this.fields.data.FTTH.connectionDuration=this.fields.synchroDuration;for(ethId in aResult.data.eth){if(aResult.data.eth.hasOwnProperty(ethId)&&aResult.data.eth[ethId].CurrentBitRate>0){this.fields.data.FTTH.uploadBandwidth=aResult.data.eth[ethId].CurrentBitRate;this.fields.data.FTTH.downloadBandwidth=aResult.data.eth[ethId].CurrentBitRate;break}}}else{this.fields.data.FTTH.connectionDuration=0}}}else{console.warn("No active wan connection detected")}if(callStack.isOnHgw()){if(aResult.data.dsl){this.fields.mxStep+=1;callStack.push("api","pcb.NeMo.getDSLStats","4",this)}else{if(this.fields.data.protocol==="ppp"){this.fields.mxStep+=1;callStack.push("api","pcb.NeMo.getMIBs","5",this,"data",{mibs:"base ppp"})}}}break;case"4":if(aResult.status===0||aResult.status===true){this.fields.data.DSL.downloadErrorDuration=aResult.data.ErroredSecs;this.fields.data.DSL.downloadFailureDuration=aResult.data.SeverelyErroredSecs;this.fields.data.DSL.crcErrors=aResult.data.CRCErrors;this.fields.data.DSL.fecCorrections=aResult.data.FECErrors}else{console.warn("No active wan connection detected")}if(callStack.isOnHgw()){if(this.fields.data.protocol==="ppp"){this.fields.mxStep+=1;callStack.push("api","pcb.NeMo.getMIBs","5",this,"data",{mibs:"base ppp"})}}break;case"5":if(aResult.status===0||aResult.status===true){this.fields.data.PPP.lastConnectionTime=aResult.data.ppp.ppp_data.LastChange;if(aResult.data.base.ppp_data.Status===true){this.fields.data.PPP.connectionDuration=aResult.data.ppp.ppp_data.LastChangeTime}else{this.fields.data.PPP.connectionDuration=0}this.fields.data.PPP.lastDisconnectionTime=aResult.data.ppp.ppp_data.IdleDisconnectTime;this.fields.data.PPP.lastError=aResult.data.ppp.ppp_data.LastConnectionError}else{console.warn("No active wan connection detected")}break;default:console.warn("Unexpected step '"+aStep+"' in call stack");this.fields.nbStep-=1;break}}if(this.fields.nbStep>=this.fields.mxStep){result={status:this.fields.status};if(this.fields.status===0&&this.fields.data){result.data=this.fields.data}callStack.popAll("api",result,this.fields.uuid)}}},connect:{name:"Sets WAN advanced configuration",description:"This method sets an advanced description of current WAN configuration.",fields:{uuid:null,nbStep:0,mxStep:0,status:0,data:{},initialParameters:{}},call:function(aStep,aResult){var result,aSetWanModeObj;if(aStep==="0"){this.fields.uuid=aResult.uuid;this.fields.status=0;this.fields.nbStep=0;this.fields.mxStep=0;this.fields.initialParameters=aResult.inputList[0];if(typeof this.fields.initialParameters!=="undefined"){aSetWanModeObj={};if(this.fields.initialParameters.hasOwnProperty("linkType")&&typeof this.fields.initialParameters.linkType==="string"&&this.fields.initialParameters.hasOwnProperty("login")&&typeof this.fields.initialParameters.login==="string"&&this.fields.initialParameters.hasOwnProperty("password")&&typeof this.fields.initialParameters.password==="string"){aSetWanModeObj.WanMode=this.fields.initialParameters.linkType;aSetWanModeObj.Username=this.fields.initialParameters.login;aSetWanModeObj.Password=this.fields.initialParameters.password;this.fields.mxStep+=1;callStack.push("api","pcb.NMC.setWANMode","1",this,aSetWanModeObj)}else if(this.fields.initialParameters.hasOwnProperty("linkType")&&typeof this.fields.initialParameters.linkType==="string"&&!this.fields.initialParameters.hasOwnProperty("login")&&!this.fields.initialParameters.hasOwnProperty("password")){if(!this.fields.initialParameters.hasOwnProperty("ipVersion")||this.fields.initialParameters.ipVersion==="4"||this.fields.initialParameters.ipVersion==="0"){aSetWanModeObj={name:"Enable",value:0,flag:this.fields.initialParameters.linkType.indexOf("DHCP")>=0?"dhcp":"ppp",traverse:"down"};this.fields.mxStep+=1;callStack.push("api","pcb.NeMo.setFirstParameter","2",this,"data",aSetWanModeObj)}else{this.fields.mxStep+=1;callStack.reCall(this,"2",0)}}else{this.fields.status=-1;this.fields.mxStep=0;callStack.logMessage("SEM_SYN_ERROR")}}else{this.fields.status=-1;this.fields.mxStep=0;callStack.logMessage("SEM_SYN_ERROR")}}else{this.fields.nbStep+=1;switch(aStep){case"1":if(aResult.status===0||aResult.status===true){this.fields.status=0}else{this.fields.mxStep=0;this.fields.status=-1;callStack.logMessage("SEM_SYN_ERROR")}break;case"2":if(!aResult||aResult.status===0||aResult.status===true){if(this.fields.initialParameters.hasOwnProperty("ipVersion")&&(this.fields.initialParameters.ipVersion==="6"||this.fields.initialParameters.ipVersion==="0")){aSetWanModeObj={name:"Enable",value:0,flag:"dhcpv6",traverse:"down"};this.fields.mxStep+=1;callStack.push("api","pcb.NeMo.setFirstParameter","3",this,"data",aSetWanModeObj)}else{this.fields.mxStep+=1;callStack.reCall(this,"3",0)}}else{this.fields.mxStep=0;this.fields.status=-1;callStack.logMessage("SEM_SYN_ERROR")}break;case"3":if(!aResult||aResult.status===0||aResult.status===true){if(!this.fields.initialParameters.hasOwnProperty("ipVersion")||this.fields.initialParameters.ipVersion==="4"||this.fields.initialParameters.ipVersion==="0"){aSetWanModeObj={name:"Enable",value:1,flag:this.fields.initialParameters.linkType.indexOf("DHCP")>=0?"dhcp":"ppp",traverse:"down"};this.fields.mxStep+=1;callStack.push("api","pcb.NeMo.setFirstParameter","4",this,"data",aSetWanModeObj)}else{this.fields.mxStep+=1;callStack.reCall(this,"4",0)}}else{this.fields.mxStep=0;this.fields.status=-1;callStack.logMessage("SEM_SYN_ERROR")}break;case"4":if(!aResult||aResult.status===0||aResult.status===true){if(this.fields.initialParameters.hasOwnProperty("ipVersion")&&(this.fields.initialParameters.ipVersion==="6"||this.fields.initialParameters.ipVersion==="0")){aSetWanModeObj={name:"Enable",value:1,flag:"dhcpv6",traverse:"down"};this.fields.mxStep+=1;callStack.push("api","pcb.NeMo.setFirstParameter","5",this,"data",aSetWanModeObj)}}else{this.fields.mxStep=0;this.fields.status=-1;callStack.logMessage("SEM_SYN_ERROR")}break;case"5":if(aResult.status===0||aResult.status===true){this.fields.status=0}else{this.fields.mxStep=0;this.fields.status=-1;callStack.logMessage("SEM_SYN_ERROR")}break;default:console.warn("Unexpected step '"+aStep+"' in call stack");this.fields.nbStep-=1;break}}if(this.fields.nbStep>=this.fields.mxStep){result={status:this.fields.status};if(this.fields.status===0&&this.fields.data){result.data=this.fields.data}callStack.popAll("api",result,this.fields.uuid)}}}}});