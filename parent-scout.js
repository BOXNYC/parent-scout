
/**
  * Parent Scout v1.0
  * --------------
  * Add this script file into the parent window,
  * and append the iFrame's id to it in a query:
  * src="parent-scout-1.0.js?id=250-200-dcs.if"
  * 
  * It will send this data to the iFrame via message API:
  *   • resize: {outerWidth, innerWidth, outerHeight, innerHeight}
  *   • scroll: {left, top}
  *   • deviceOrientation: {alpha, beta, gamma}
  *   • deviceOrientation8w: {alpha, beta, gamma}
  *   • deviceMotion: acceleration: {x,y,z}, accelerationIncludingGravity: {x, y, z}, rotationRate: {alpha, beta, gamma}
  *   • deviceMotion8w: acceleration: {x,y,z}, accelerationIncludingGravity: {x, y, z}, rotationRate: {alpha, beta, gamma}
  */
(function($window) {
  
  var parentScoutElements = [];
  
  if (document.registerElement) {
    
    var proto = Object.create(HTMLElement.prototype, {
      createdCallback: {
        value: function() {
          parentScoutElements.push(this);
        },
        enumerable: true
      }
    });
    document.registerElement('parent-scout', {prototype: proto});
    
  }
  
  function parentScoutMessageRecieved(messageEvent) {
    if (typeof messageEvent.data.sender !== 'string') return;
    if (messageEvent.data.sender != 'parentScout') return;
    if (typeof messageEvent.data.type !== 'string') return;
    if (
      messageEvent.data.type != 'scroll' && 
      messageEvent.data.type != 'resize' && 
      messageEvent.data.type != 'devicemotion' && 
      messageEvent.data.type != 'orientationchange' && 
      messageEvent.data.type != 'deviceOrientation'
    ) return;
    var iFrames = document.getElementsByTagName('iframe');
    for(var i=0; i<iFrames.length; i++) {
      iFrames[i].contentWindow.postMessage(messageEvent.data, '*');
      iFrames[i].contentWindow.dispatchEvent(messageEvent.data.originalEvent);
    }
    parentScoutElements.forEach(function(parentScoutElement){
      var event = new CustomEvent('recieved_parent_scout_message');
      event.data = messageEvent.data;
      parentScoutElement.dispatchEvent(event);
    });
  };
  
  if($window.addEventListener) {
    $window.addEventListener("message", parentScoutMessageRecieved, false);
  } else {
    $window.attachEvent("onmessage", parentScoutMessageRecieved);
  }
    
}(window));