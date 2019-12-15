let Call = {
  init() {
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

    peerConnection.ontrack = (event) => {
      if (remoteVideo.srcObject) return;
      debugger
      remoteVideo.srcObject = event.streams[0];
    }

    navigator.mediaDevices.getUserMedia(mediaConstraints)
      .then(localStream => {
        mylocalStream = localStream
        localStream.getTracks().forEach( track => { peerConnection.addTrack(track, localStream) })
        localVideo.srcObject = localStream
      })
  }
}

export default Call