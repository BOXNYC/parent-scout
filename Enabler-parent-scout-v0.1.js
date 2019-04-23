
/**
 * @fileoverview Implementation of parent-scout component.
 * @author joe@box.biz (Joseph Weitzel)
 */

(function(){
  
  var version = '0.1';
  
  if (typeof Enabler === 'undefined') return console.error('Enabler undefined.');
  
  Enabler.parentScout = function(version, iFrameIDFormat) {
    version = version || '0.1';
    iFrameIDFormat = iFrameIDFormat || '{{ dartAssetId }}.if';
    const dartAssetID = this.getDartAssetId() || '',
          iFrameID = iFrameIDFormat.replace(/\{\{\s*dartAssetId\s*\}\}/gi, dartAssetID),
          scriptSrc = this.getUrl('parent-scout-v' + version + '.js') + '?id=' + (iFrameID == '.if' ? 'iframe' : iFrameID),
          script = '(function(){ \
            var script = document.createElement("script"); \
            script.setAttribute("type", "text/javascript"); \
            script.setAttribute("src", "' + scriptSrc + '"); \
            var heads = document.getElementsByTagName("head"); \
            if (heads && heads.length) heads[0].appendChild(script); \
          }());';
    try {
      parent.eval(script);
    } catch(e) {
      this.invokeExternalJsFunction(script);
    };
  };
  
  if (parent === window) return console.error('Not in an iFrame, ignore script.');
  
  function enablerInitHandler() {
    Enabler.parentScout(version);
    Enabler.removeEventListener(studio.events.StudioEvent.INIT, enablerInitHandler);
  };
  
  if (Enabler.isInitialized()) {
    enablerInitHandler();
  } else {
    Enabler.addEventListener(studio.events.StudioEvent.INIT, enablerInitHandler);
  };
  
}());