
navigator.getWebcam = (navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia);

var peer = new Peer(
  {
    key: 'nmdiy6orqc9pb9' ,
    debug: 3,
    config: { 
      'iceServers': [
        {url: 'stun:stun.l.google.com:19302'},
        {url: 'stun:stun1.l.google.com:19302'},
        {url: 'turn:numb.viagenie.ca', username: 'webrtc@live.com', credential: 'muazkh'}
      ] 
    }
  }
);

peer.on('open', function() {
  $('#my-id').text(peer.id);
});

peer.on('call', function(call){
  //Answer Automatically
  call.answer(window.localStream);
  step3(call);
});

//Click handlers setup
$(function() {
  $('#make-call').click(function(){
    // Initiate the call
    var call = peer.call($('#callto-id').val(), window.localStream);
    step3(call);
  });

  $('#end-call').click(function() {
    window.existingCall.close();
    step2();
  });

  //Retry if getUserMedia fails
  $('#step1-retry').click(function() {
    $('#step1-error').hide();
    step1();
  });

  step1();
})

function step1() {
  // Get Audio/Video Stream
  navigator.getWebcam({audio: false, video: true}, function(stream) {
    $('#my-video').prop('src', URL.createObjectURL(stream));
    
    window.localStream = stream;
    step2();
  }, function() {$('step1-error').show(); });
}

function step2() { //Adjust the UI
  $('#step1, #step3').hide();
  $('#step2').show();
}

function step3(call) {
  // Hang up on an existing call if present
  if(window.existingCall) {
    window.existingCall.close();
  }

  //Wait for stream on the call, then setup peer video
  call.on('stream', function(stream) {
    $('#their-video').prop('src', URL.createObjectURL(stream));
  });

  window.existingCall = call;

  $('#step1, #step2').hide();
  $('#step3').show();
}
