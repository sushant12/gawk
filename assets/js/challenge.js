let Challenge = {
  init(socket) {
    let channel = socket.channel("challenge:lobby", {})
    channel.join()
    this.listenForClick(channel)
  },

  listenForClick(channel) {
    document.getElementById('start').addEventListener('click', (e) => {
      e.preventDefault()
      channel.push('message', {body: 'hello world'})
    })

    channel.on('message', payload => {
      let remote = document.getElementById('test-div')
      remote.innerHTML = payload.body
    })
  }
}

export default Challenge
