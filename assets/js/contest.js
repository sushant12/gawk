// import Peer from "simple-peer"

// let Contest = {
//   init(socket) {
//     const room_id = document.getElementById('arena').dataset.roomId
//     let channel = socket.channel(`challenge:${room_id}`, {})
//     channel.join()
//       .receive("ok", resp => { console.log("Joined successfully", resp) })
//       .receive("error", resp => { console.log("Unable to join", resp) })
//     // this.listenForClick(channel)
//   },

//   // listenForClick(channel) {
//   //   document.getElementById('start').addEventListener('click', (e) => {
//   //     e.preventDefault()
//   //     channel.push('message', {body: 'hello world'})
//   //   })

//   //   channel.on('message', payload => {
//   //     let remote = document.getElementById('test-div')
//   //     remote.innerHTML = payload.body
//   //   })
//   // }
// }

// export default Contest
