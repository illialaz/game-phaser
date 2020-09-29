import Phaser from 'phaser'

let player
let cursors
let connection

function preload() {
  this.load.image('ground', 'assets/ground.png')
  this.load.image('island', 'assets/island.png')
  this.load.image('star', 'assets/star.png')
  this.load.spritesheet('player', 'assets/player.png', {
    frameWidth: 32,
    frameHeight: 48
  })
}

function create() {
  let platforms = this.physics.add.staticGroup()
  player = this.physics.add.sprite(380, 500, 'player')
  cursors = this.input.keyboard.createCursorKeys()
  let stars = this.physics.add.group()
  let score = 0
  let scoreText = this.add.text(16, 16, 'Stars: 0', {
    fontSize: '32px',
    fill: '#000'
  })

  platforms.create(400, 588, 'ground')
  platforms.create(600, 450, 'island')
  platforms.create( 50, 250, 'island')
  platforms.create(650, 220, 'island')
  platforms.create(250, 520, 'island')
  platforms.create(250, 320, 'island')

  stars.create(22, 0, 'star')
  stars.create(122, 0, 'star')
  stars.create(222, 0, 'star')
  stars.create(322, 0, 'star')
  stars.create(422, 0, 'star')
  stars.create(522, 0, 'star')
  stars.create(622, 0, 'star')
  stars.create(722, 0, 'star')

  this.physics.add.collider(stars, platforms)

  player.setBounce(0.2)
  player.setCollideWorldBounds(true)
  this.physics.add.collider(player, platforms)

  this.physics.add.overlap(player, stars, (player, star) => {
    star.disableBody(true, true)
    score += 1
    scoreText.setText('Stars: ' + score)
  }, null, this)

  this.anims.create({
    key: 'still',
    frames: [{ key: 'player', frame: 4 }],
    frameRate: 20
  })
  
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  })
  
  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  })

  const url = 'ws://localhost:8085'
  connection = new WebSocket(url)

  connection.onerror = error => {
    console.error(error)
  }
}

function update() {
  connection.onmessage = e => {
    if (e.data === 'left') {
      player.setVelocityX(-160)
      player.anims.play('left')
    }
    if (e.data === 'right') {
      player.setVelocityX(160)
      player.anims.play('right')
    }
    if (e.data === 'still') {
      player.setVelocityX(0)
      player.anims.play('still')
    }
    if (e.data === 'jump' && player.body.touching.down) {
      player.setVelocityY(-330)
    }
  }
}

const config = {
  width: 800,
  height: 600,
  backgroundColor: 0xffffff,
  scene: {
    preload,
    create,
    update
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  }
}

const game = new Phaser.Game(config)
