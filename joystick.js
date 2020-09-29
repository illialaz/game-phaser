const { Board, Joystick } = require('johnny-five')
const board = new Board()

board.on('ready', () => {
  const joystick = new Joystick({
    pins: ['A0', 'A1']
  })

  const WebSocket = require('ws')
  const wss = new WebSocket.Server({ port: 8085 })

  wss.on('connection', ws => {
    ws.on('message', message => {
      console.log(`Received message => ${message}`)
    })
    
    joystick.on('change', function() {
      if (this.x > 0.5) {
        console.log('->')
        ws.send('right')
      }
      if (this.x < -0.5) {
        console.log('<-')
        ws.send('left')
      }
      if (this.x > -0.5 && this.x < 0.5 ) {
        console.log('still')
        ws.send('still')
      }
      if (this.y > 0.5) {
        console.log('down')
      }
      if (this.y < -0.5) {
        console.log('up')
        ws.send('jump')
      }
    })
  })
})
