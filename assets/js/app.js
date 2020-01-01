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
import Peer from "simple-peer"
// Import local files
//
// Local files can be imported directly using relative paths, for example:
import socket from "./socket"
// import Challenge from "./challenge"
// import Call from "./call"

const room_id = document.getElementById('arena').dataset.roomId
let channel = socket.channel(`challenge:${room_id}`, {})
channel.join()
  .receive("ok", resp => { console.log("Joined successfully", resp) })
  .receive("error", resp => { console.log("Unable to join", resp) })

// get video/voice stream
let peer;
navigator.getUserMedia({ video: true}, gotMedia, () => {})

function gotMedia (stream) {
  peer = new Peer({ 
    initiator: location.hash == "#init", 
    stream: stream,
    config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:global.stun.twilio.com:3478?transport=udp' }] }
    })
  var localVideo = document.getElementById('local-video')
  localVideo.srcObject = stream

  peer.on('signal', data => {
    channel.push('peer-message', {
      body: JSON.stringify(data)
    })
  })

  peer.on('stream', data => {
    var remoteVideo = document.getElementById('remote-video')
    remoteVideo.srcObject = data
  })
}

channel.on('peer-message', function(data) {
  peer.signal(JSON.parse(data.body))
})
