
/**
  * Parent Scout v1.0
  * --------------
  * Add this script file into the parent window,
  * and append the iFrame's id to it in a query:
  * script src="parent-scout-1.0.js?id=250-200-dcs.if"
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
  
  // Get iFrame ID from script src
  const $script = document.currentScript || [].find.call(document.scripts, function(s) {
          return /parent-scout(\?.*)?$/.test(s.src);
        });
  if (typeof $script === typeof undefined) return;
  const ID = $script.getAttribute('id') || $script.src.replace(/.*id=([a-zA-Z0-9-_:.]+).*/, "$1");
  
  // No iFrame ID? Stop.
  if (!ID) return;// void console.error('Parent-scout: Missing iFrame ID', $script);
  
  // Find iFrame
  var $iFrame = document.getElementById(ID);
  
  // No iFrame? Stop.
  if (!$iFrame) return; //return void console.error('Parent-scout: Missing iFrame element', '#' + ID);
  
  // Get document and document element
  var $document = document,
      $documentElement = $document.documentElement,
      sender = 'parentScout';
  
  // Send window size to iFrame
  function resize(e) {
    $iFrame.contentWindow.postMessage({
      sender: sender,
      type: 'resize',
      size: {
        outerWidth: $window.outerWidth,
        innerWidth: $window.innerWidth,
        outerHeight: $window.outerHeight,
        innerHeight: $window.innerHeight
      }
    }, '*');
  };
  $window.addEventListener('resize', resize);
  resize();
  
  // Send window scroll to iFrame
  function scroll(e) {
    $iFrame.contentWindow.postMessage({
      sender: sender,
      type: 'scroll',
      scroll: {
        left: ($window.pageXOffset || $documentElement.scrollLeft) - ($documentElement.clientLeft || 0),
        top: ($window.pageYOffset || $documentElement.scrollTop)  - ($documentElement.clientTop || 0)
      }
    }, '*');
  };
  $window.addEventListener('scroll', scroll);
  scroll();
  
  // Rest of messages for iOS only
  if (!(!!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform))) return;
  
  // Set allow attribute
  $iFrame.setAttribute('allow', 'camera;microphone;gyroscope;accelerometer;');
  
  // Send device orientation data to iFrame
  //     with 8th Wall Web support
  $window.addEventListener('deviceorientation', function(e) {
    const deviceOrientation = {
      alpha: e.alpha,
      beta: e.beta,
      gamma: e.gamma
    };
    $iFrame.contentWindow.postMessage({
      sender: sender,
      type: 'deviceOrientation',
      deviceOrientation8w: deviceOrientation,
      deviceOrientation: deviceOrientation
    }, '*');
  });
  
  // Send orientation change data to iFrame
  //     with 8th Wall Web support
  $window.addEventListener('orientationchange', function(e) {
    $iFrame.contentWindow.postMessage({
      sender: sender,
      type: 'orientationChange',
      orientation: e.orientation,
      orientation8w: e.orientation
    }, '*');
  });
  
  // Send device motion data to iFrame
  //     with 8th Wall Web support
  $window.addEventListener('devicemotion', function(e){
    const deviceMotion = {
      acceleration: {
        x: e.acceleration.x,
        y: e.acceleration.y,
        z: e.acceleration.z
      },
      accelerationIncludingGravity: {
        x: e.accelerationIncludingGravity.x,
        y: e.accelerationIncludingGravity.y,
        z: e.accelerationIncludingGravity.z
      },
      rotationRate: {
        alpha: e.rotationRate.alpha,
        beta: e.rotationRate.beta,
        gamma: e.rotationRate.gamma
      }
    };
    $iFrame.contentWindow.postMessage({
      sender: sender,
      type: 'deviceMotion',
      deviceMotion8w: deviceMotion,
      deviceMotion: deviceMotion
    }, '*');
  });
  
  // /end
    
}(window));