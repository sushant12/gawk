let Call = {
  init() {
    let mediaConstraints = {
      video: true
    }
    let mylocalStream;

    navigator.mediaDevices.getUserMedia(mediaConstraints)
      .then(function(localStream) {
        mylocalStream = localStream
        document.getElementById('local-video').srcObject = localStream
        // localStream.getTracks().forEach(track => myPeerConnection.addTrack(track, localStream))
      })

    const servers = {
      iceServer: [{
        urls: 'stun:stun.stunprotocol.org'
      }]
    }
    debugger
    let localPeerConnection = new RTCPeerConnection(servers)
    let remotePeerConnection = new RTCPeerConnection(servers)

    localPeerConnection.addEventListener('icecandidate', this.handleConnection);
    localPeerConnection.addEventListener(
    'iceconnectionstatechange', this.handleConnectionChange);

    remotePeerConnection.addEventListener('icecandidate', this.handleConnection);
    remotePeerConnection.addEventListener(
      'iceconnectionstatechange', this.handleConnectionChange);
    remotePeerConnection.addEventListener('addstream', this.gotRemoteMediaStream);

  // Add local stream to connection and create offer to connect.
  localPeerConnection.addStream(mylocalStream);
  localPeerConnection.createOffer({ offerToReceiveVideo: 1 })
    .then(createdOffer)

  },
  createPeerConnection() {
    debugger
  },
  handleNegotationNeededEvent(localPeerConnection) {
    localPeerConnection.createOffer()
      .then(offer => {
        return localPeerConnection.setLocalDescription(offer)
      })
      .then(() => {
        sendToServer({
          type: 'video-offer',
          sdp: localPeerConnection.localDescription
        })
      })
  }
}

export default Call