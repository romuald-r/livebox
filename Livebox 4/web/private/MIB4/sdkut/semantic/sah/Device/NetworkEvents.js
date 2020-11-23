define(["utils/console"],function(console){"use strict";return{handleEvent:function(aHandler,aReason,aAttributes){var newEvent;console.debug("NetworkEvents: Processing event "+aHandler+"-"+aReason+(aAttributes?" with attributes "+JSON.stringify(aAttributes):""));newEvent={id:"sah.Device.NetworkEvents",data:{reason:aReason,handler:aHandler,attributes:aAttributes,doUpdateState:false}};if(aHandler==="DHCP"&&aReason==="BOUND"){newEvent.data.doUpdateState=true;return newEvent}if(aHandler==="NETWORK"){if(aReason==="DHCP_CONNEXION_FAILED"||aReason==="HTTP_CONNEXION_FAILED"||aReason==="DHCP_CHANGED"||aReason==="CONNECTOR_UNPLUGGED"){return newEvent}if(aReason==="STATE_CHANGE"){if(aAttributes.link.type==="ethernet"){if(aAttributes.link.status==="down"){newEvent.data.doUpdateState=aAttributes.link.status==="up";return newEvent}}}}if(aHandler==="CONNECTION_MANAGER"){newEvent.data.doUpdateState=true;return newEvent}newEvent.data=null;return newEvent}}});