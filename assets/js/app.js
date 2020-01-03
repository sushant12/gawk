// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
import css from "../css/app.css"
import "phoenix_html"
import Peer from "simple-peer"
import socket from "./socket"
// import Contest from "./contest"

const room_id = document.getElementById('arena').dataset.roomId
let channel = socket.channel(`challenge:${room_id}`, {})
channel.join()
  .receive("ok", resp => { console.log("Joined successfully", resp) })
  .receive("error", resp => { console.log("Unable to join", resp) })

// document.getElementById('start').addEventListener("click", function() {
//   let staringContest = Contest.init(socket)
// })

// get video/voice stream
let peer;
navigator.getUserMedia({ video: true}, gotMedia, () => {})

function gotMedia (stream) {
  // debuggers
  peer = new Peer({ 
    initiator: location.hash == "#init", 
    stream: stream,
    config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:global.stun.twilio.com:3478?transport=udp' }] }
    })
  // var localVideo = document.getElementById('local-video')
  // localVideo.srcObject = stream

  peer.on('signal', data => {
    channel.push('peer-message', {
      body: JSON.stringify(data)
    })
  })

  peer.on('stream', data => {
    var remoteVideo = document.getElementById('remote-video')
    remoteVideo.srcObject = data
  })

  peer.on('close', data => {
    webgazer.end()
  })

  peer.on('error', err => {
    webgazer.end()
  })

  peer.on('connect', (data) => {
    webgazer.begin()
  })
}


channel.on('peer-message', function(data) {
  peer.signal(JSON.parse(data.body))
})