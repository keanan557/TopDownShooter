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
			x:0,
			y:0
		}
		
		this.width = 50
		this.height = 50
	}
	
	draw(){
		ctx.fillStyle = 'red'
		ctx.fillRect(
			this.position.x,
			this.position.y,
			this.width,
			this.height
		)
	}
	update(){
		this.draw()
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y
	}
}

//Projectiles
class Projectile {
	constructor({position, velocity}){
		this.position = position
		this.velocity = velocity
		
		this.radius =3
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

const player = new Player()
const projectiles = [ ]

//game loop
function animate(){
	//player.update()
	ctx.clearRect(0,0,600, 500)
	requestAnimationFrame(animate)
	
	player.update()
	projectiles.forEach(projectile => {
		projectile.update()
	})
}

animate()

//player movement
addEventListener('keydown', ({key}) => {
	switch (key){
		case 'a':
			player.velocity.x = -5;
		    break
		case 'd':
			player.velocity.x = 5;
			
			
			break
		case 'w':
			player.velocity.y = -5;
			
			break
		case 's':
			player.velocity.y = 5;
			break
		case ' ':
			projectiles.push(
				new Projectile({
				position: {
					x: player.position.x + player.width/2, 
					y: player.position.y
				},
				velocity: {
					x:0,
					y:-2
				}
				})
			)
			break
	}
})

addEventListener('keyup', ({key}) => {
	switch (key){
		case 'a':
			player.velocity.x = 0;
		    break
		case 'd':
			player.velocity.x = 0;
			break
		case 'w':
			player.velocity.y = 0;
			break
		case 's':
			player.velocity.y = 0;
			break
	}
})
