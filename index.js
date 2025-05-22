//canvas init
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

//canvas height & width
canvas.width = 600
canvas.height = 500

//player
class Player {
  constructor(){
    this.position = {
      x: 200,
      y: 200
    }
    
    this.velocity = {
      x: 0,
      y: 0
    }
    
    this.width = 50
    this.height = 50
    this.health = 100 // Health value (out of 100)
  }
  
  draw(){
    ctx.fillStyle = 'red'
    ctx.fillRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height
    )
    
    // Draw health bar
    ctx.fillStyle = 'green'
    ctx.fillRect(
      this.position.x,
      this.position.y - 10, // Place above the player
      (this.health / 100) * this.width, // Health bar width based on health percentage
      5
    )
  }
  
  update(){
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
  
  takeDamage(amount){
    this.health = Math.max(0, this.health - amount) // Prevent health from going below 0
  }
}

//Projectiles
class Projectile {
  constructor({position, velocity}){
    this.position = position
    this.velocity = velocity
    
    this.radius = 3
  }
  
  draw(){
    ctx.beginPath()
    ctx.arc(
      this.position.x,
      this.position.y,
      this.radius,
      0,
      Math.PI * 2
    )
    ctx.fillStyle = 'blue'
    ctx.fill()
    ctx.closePath()
  }
  
  update(){
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}

// Enemy
class Enemy {
  constructor(){
    this.position = {
      x: Math.random() * canvas.width, // Random position on canvas
      y: Math.random() * canvas.height
    }
    
    this.velocity = {
      x: 0,
      y: 0
    }
    
    this.width = 50
    this.height = 50
    this.health = 100 // Health value (out of 100)
    this.color = 'green'
  }
  
  draw(){
    ctx.fillStyle = this.color
    ctx.fillRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height
    )
    
    // Draw health bar
    ctx.fillStyle = 'red'
    ctx.fillRect(
      this.position.x,
      this.position.y - 10, // Place above the enemy
      (this.health / 100) * this.width, // Health bar width based on health percentage
      5
    )
  }
  
  update(playerPosition){
    // Simple AI: Move towards the player
    const dx = playerPosition.x - this.position.x
    const dy = playerPosition.y - this.position.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    // Normalize direction
    const direction = {
      x: dx / distance,
      y: dy / distance
    }
    
    // Update velocity to move towards the player
    this.velocity.x = direction.x * 2
    this.velocity.y = direction.y * 2
    
    // Update position
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
    
    this.draw()
  }
  
  takeDamage(amount){
    this.health = Math.max(0, this.health - amount) // Prevent health from going below 0
  }
}

const player = new Player()
const projectiles = []
const enemies = [] // Array to store enemies

let mousePosition = { x: canvas.width / 2, y: canvas.height / 2 }
let gameOver = false // Track if the game is over

// Function to spawn enemies at random intervals
function spawnEnemy(){
  if (!gameOver) {
    enemies.push(new Enemy())
  }
}

// Spawn a new enemy every 3 seconds
setInterval(spawnEnemy, 3000)

// Detect if the user is on a mobile device
const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent)
if (isMobile) {
  document.querySelector('.controls').style.display = 'block' // Show controls for mobile
}

//game loop
function animate(){
  if (gameOver) {
    // Display Victory screen
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)' // Dark overlay
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    ctx.fillStyle = 'white'
    ctx.font = '40px Arial'
    ctx.fillText('You Win!', canvas.width / 2 - 100, canvas.height / 2)
    
    return // Stop game loop if the game is over
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  player.update()
  
  // Update projectiles
  projectiles.forEach(projectile => {
    projectile.update()
    
    // Check for projectile-enemy collision
    enemies.forEach(enemy => {
      const dist = Math.sqrt(
        Math.pow(projectile.position.x - enemy.position.x, 2) + 
        Math.pow(projectile.position.y - enemy.position.y, 2)
      )
      
      if (dist < projectile.radius + enemy.width / 2) { // Collision detected
        enemy.takeDamage(10) // Deal damage to enemy
        projectiles.splice(projectiles.indexOf(projectile), 1) // Remove the projectile
        
        if (enemy.health <= 0) {
          // Remove enemy if it dies
          enemies.splice(enemies.indexOf(enemy), 1)
        }
      }
    })
  })
  
  // Update enemies
  enemies.forEach(enemy => {
    if (enemy.health <= 0) {
      gameOver = true // Set the game as over when all enemies are defeated
    }
    enemy.update(player.position)
  })
  
  requestAnimationFrame(animate)
}

animate()

// Keyboard controls for PC
addEventListener('keydown', ({key}) => {
  switch (key) {
    case 'a':
      player.velocity.x = -5;
      break;
    case 'd':
      player.velocity.x = 5;
      break;
    case 'w':
      player.velocity.y = -5;
      break;
    case 's':
      player.velocity.y = 5;
      break;
    case ' ':
      // Fire a projectile
      const dx = mousePosition.x - (player.position.x + player.width / 2)
      const dy = mousePosition.y - (player.position.y + player.height / 2)
      const distance = Math.sqrt(dx * dx + dy * dy)
  
      const velocity = {
        x: dx / distance * 5,
        y: dy / distance * 5
      }

      projectiles.push(
        new Projectile({
          position: {
            x: player.position.x + player.width / 2, 
            y: player.position.y + player.height / 2
          },
          velocity: velocity
        })
      )
      break;
  }
})

addEventListener('keyup', ({key}) => {
  switch (key) {
    case 'a':
    case 'd':
      player.velocity.x = 0;
      break;
    case 'w':
    case 's':
      player.velocity.y = 0;
      break;
  }
})

// Mobile button controls for movement
document.getElementById('moveUpButton').addEventListener('click', () => {
  player.velocity.y = -5
})

document.getElementById('moveDownButton').addEventListener('click', () => {
  player.velocity.y = 5
})

document.getElementById('moveLeftButton').addEventListener('click', () => {
  player.velocity.x = -5
})

document.getElementById('moveRightButton').addEventListener('click', () => {
  player.velocity.x = 5
})

// Button control to shoot
document.getElementById('shootButton').addEventListener('click', () => {
  // Fire a projectile towards the mouse position or wherever the player is facing
  const dx = mousePosition.x - (player.position.x + player.width / 2)
  const dy = mousePosition.y - (player.position.y + player.height / 2)
  const distance = Math.sqrt(dx * dx + dy * dy)
  
  const velocity = {
    x: dx / distance * 5,
    y: dy / distance * 5
  }

  projectiles.push(
    new Projectile({
      position: {
        x: player.position.x + player.width / 2, 
        y: player.position.y + player.height / 2
      },
      velocity: velocity
    })
  )
})
