// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
import css from "../css/app.css"

// webpack automatically bundles all modules in your
// entry points. Those entry points can be configured
// in "webpack.config.js".
//
// Import dependencies
//
import "phoenix_html"

// Import local files
//
// Local files can be imported directly using relative paths, for example:
import socket from "./socket"
import Challenge from "./challenge"
// import Call from "./call"

let channel = socket.channel("challenge:lobby", {})
channel.join()
  .receive("ok", resp => { console.log("Joined successfully", resp) })
  .receive("error", resp => { console.log("Unable to join", resp) })


function pushPeerMessage(type, content) {
  channel.push('peer-message', {
    body: JSON.stringify({
      type,
      content,
    }),
  });
}

// Challenge.init(channel)
const mediaConstraints = { video: true }
const servers = {
  iceServer: [{
    urls: 'stun:stun.stunprotocol.org'
  }]
}

let peerConnection = new RTCPeerConnection(servers)
const localVideo = document.getElementById('local-video')
const remoteVideo = document.getElementById('remote-video')
let mylocalStream

navigator.mediaDevices.getUserMedia(mediaConstraints)
  .then(localStream => {
    mylocalStream = localStream
    localStream.getTracks().forEach( track => { peerConnection.addTrack(track, localStream) })
    localVideo.srcObject = localStream
  })

peerConnection.onicecandidate = (event) => {
  if (!!event.candidate) {
    pushPeerMessage('ice-candidate', event.candidate);
  }
}

peerConnection.ontrack = (event) => {
  debugger
  if (remoteVideo.srcObject) return
  remoteVideo.srcObject = event.streams[0]
}

peerConnection.oniceconnectionstatechange = handleICEConnectionStateChangeEvent;
peerConnection.onicegatheringstatechange = handleICEGatheringStateChangeEvent;
peerConnection.onsignalingstatechange = handleSignalingStateChangeEvent;
// peerConnection.onnegotiationneeded = handleNegotiationNeededEvent;
// peerConnection.ontrack = handleTrackEvent;

function handleICEConnectionStateChangeEvent(event) {
  log("*** ICE connection state changed to " + peerConnection.iceConnectionState);

  switch(peerConnection.iceConnectionState) {
    case "closed":
    case "failed":
    case "disconnected":
      closeVideoCall();
      break;
  }
}

function handleICEGatheringStateChangeEvent(event) {
  log("*** ICE gathering state changed to: " + peerConnection.iceGatheringState);
}

function handleSignalingStateChangeEvent(event) {
  log("*** WebRTC signaling state changed to: " + peerConnection.signalingState);
  switch(peerConnection.signalingState) {
    case "closed":
      closeVideoCall();
      break;
  }
}



peerConnection.createOffer()
  .then(offer => {
    return peerConnection.setLocalDescription(offer)
  })
  .then(function() {
    pushPeerMessage('video-offer', peerConnection.localDescription)
  })




function handleIceCandidate(event) {
  if (!!event.candidate) {
    pushPeerMessage('ice-candidate', event.candidate);
  }
}

function receiveRemote(offer) {
  let remoteDescription = new RTCSessionDescription(offer);
  peerConnection.setRemoteDescription(remoteDescription);
}

function answerCall(offer) {
  receiveRemote(offer)
  peerConnection.createAnswer()
    .then(function(answer) {
      return peerConnection.setLocalDescription(answer)
    })
    .then(function(){
      pushPeerMessage('video-answer', peerConnection.localDescription)
    })
}

function log() {
  console.log(...arguments);
}

channel.on('peer-message', payload => {
  const message = JSON.parse(payload.body)
  switch (message.type) {
    case 'video-offer':
      log('offered: ', message.content);
      answerCall(message.content);
      break;
    case 'video-answer':
      log('answered: ', message.content);
      receiveRemote(message.content);
      break;
    case 'ice-candidate':
      log('candidate: ', message.content);
      let candidate = new RTCIceCandidate(message.content);
      peerConnection
        .addIceCandidate(candidate)
        .catch(reportError('adding and ice candidate'));
      break;
    case 'disconnect':
      disconnect();
      break;
    default:
      reportError('unhandled message type')(message.type);
  }
})