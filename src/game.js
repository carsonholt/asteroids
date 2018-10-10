// Asteroids, by Carson Holt
import * as Vector from './vector';
//import Player from './player';

// screen dimensions
const WIDTH = 900
const HEIGHT = 600

// Create the canvas and context
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
canvas.height = HEIGHT;
canvas.width = WIDTH;
document.body.appendChild(canvas);

// Game variables
var start = null;
var currentInput = {
  space: false,
  left: false,
  right: false,
  up: false,
  down: false,
  w: false
}
var priorInput = {
  space: false,
  left: false,
  right: false,
  up: false,
  down: false,
  w: false
}

var lives = 3;
var score = 0;
var level = 0;

var numAst = 5; // number of asteroids to start level

// Velocities and positions for each direction
var x = 360;
var y = 300;

var dir = {x: 0, y:0}; // direction vector
var vel = {x: 0, y:0}; // velocity vector
var speed = 0.1;
const MAX_SPEED = 2;
// images
var player = new Player(360, 300);
player.x = x;
player.y = y;
//player.load('img/ship.jpg');
var ship; // image of ship
var asteroidImg;

// arrays
var lasers = [];
var asteroids = [];

// sounds
var astSnd = new Audio("snd/Hit_Hurt2.wav");
var shipSnd = new Audio("snd/Hit_Hurt.wav");
var shootSnd = new Audio("snd/Laser_Shoot4.wav");

/** @function handleKeydown
  * Event handler for keydown events
  * @param {KeyEvent} event - the keydown event
  */
function handleKeydown(event) {
  switch(event.key) {
    case ' ':
	  //console.log('fire?', currentInput, priorInput);
      currentInput.space = true;
      break;
	case 'ArrowLeft':
      currentInput.left = true;
      break;
	case 'ArrowRight':
      currentInput.right = true;
      break;
	case 'ArrowUp':
	  //console.log('up?', currentInput, priorInput);
	  currentInput.up = true;
	  break;
	case 'ArrowDown':
	  currentInput.down = true;
	  break;
	case 'w':
	  currentInput.w = true;
	  break;
  }
  event.preventDefault();
}
// Attach keyup event handler to the window
window.addEventListener('keydown', handleKeydown);

/** @function handleKeyup
  * Event handler for keyup events
  * @param {KeyEvent} event - the keyup event
  */
function handleKeyup(event) {
  switch(event.key) {
    case ' ':
    console.log('no fire?', currentInput, priorInput);
      currentInput.space = false;
      break;
    case 'ArrowLeft':
      currentInput.left = false;
      break;
    case 'ArrowRight':
      currentInput.right = false;
      break;
	case 'ArrowUp':
	  currentInput.up = false;
	  break;
	case 'ArrowDown':
	  currentInput.down = false;
	  break;
	case 'w':
	  currentInput.w = false;
	  break;
  }
}
// Attach keyup event handler to the window
console.log("Add listener");
window.addEventListener('keyup', handleKeyup);
 
/** @function wrap
  * takes an object and wraps to other side of screen if necessary
  */
function wrap(obj) {
	if (obj.x >= 600) {		
		obj.x %= 600;
	} else if (obj.x < 0) {
		obj.x += 600;
	}
	if (obj.y >= HEIGHT) {
		obj.y %= (HEIGHT);
	} else if (obj.y < 0){
		obj.y += (HEIGHT);
	}
}

/** @function detectCollision
  * takes two objects and checks for overlap
  * @param a and b - two objects
  */
function detectCollision(a, b) {
	if ((a.x >= b.x && a.x < b.x + b.width) && (a.y >= b.y && a.y < b.y + b.height)) {
		console.log('collision detected');
		console.log(a.constructor.name);
		console.log(b.constructor.name);
		return true;
	} else {
		return false;
	}
}

// render a number of asteroids
function startLevel() {
	level++;
	numAst += 2;
	
	while (asteroids.length < numAst) {
		console.log("asteroid length: " + asteroids.length);
		var randX = Math.random() * WIDTH;
		var randY = Math.random() * (HEIGHT);
		if ((randX < (310) || randX > (410)) || (randY < HEIGHT/2 - 50 || randY > HEIGHT/2)) {
			var randVx = Math.random() * 0.5 - 0.25;
			var randVy = Math.random() * 0.5 - 0.25;
			var randM = Math.random() * 40 + 20;
			asteroids.push(new Asteroid(randX, randY, {x:randVx, y:randVy}, randM));
			console.log("New asteroid at: (" + randX + ", " + randY + ") with speed (" + randVx + ", " + randVy + ") and mass " + randM);
		}
	}
}

/** displayInfo
  *	draws each life, displays current level, displays score
  * param context - the context being drawn on
  */
function displayInfo() {
	ctx.fillStyle = '#FFFFFF';
	ctx.font = '16px Times New Roman';
	for (var i = 0; i < lives; i++) {
		ctx.drawImage(player.ship, 800 + (i*20), 90, 15, 20);
		ctx.fillText("Lives: ", 750, 100);
	}
	ctx.fillText("Level: " + level, 750, 130);
	ctx.fillText("Score: " + score, 750, 160);
	ctx.fillText("Controls", 750, 240);
	ctx.fillText("Arrow keys to move", 750, 270);
	ctx.fillText("Space to shoot", 750, 300);
	ctx.fillText("W to warp", 750, 330);
	return;
}

function render(elapsedTime) {
	ctx.clearRect(0, 0, WIDTH, HEIGHT);
	ctx.fillStyle = "#000000";
	ctx.fillRect(0,0,WIDTH,HEIGHT);
	ctx.strokeStyle = "#FFFFFF";
	ctx.beginPath();
	ctx.moveTo(720, 0);
	ctx.lineTo(720, HEIGHT);
	ctx.stroke();
	displayInfo();
	player.render(ctx);
	//player.rotate(ctx);
	asteroids.forEach(function(asteroid) {
		//console.log("Asteroid: " + asteroid);
		asteroid.render(ctx);
	});
	lasers.forEach(function(laser) {
		laser.render(ctx);
	});
}

/** update game state
 */
function update(elapsedTime) {	
	Vector.normalize(vel);
	asteroids.forEach(function(asteroid) {
		asteroid.update(elapsedTime);
		if (detectCollision(player, asteroid)) {
			lives--;
			player.x = 360;
			player.y = HEIGHT/2;
			shipSnd.play();
			return;
		}
	});
	
	lasers.forEach(function(laser, index) {
		laser.update(elapsedTime);
		if ((laser.x < 0 || laser.x >= 720) || (laser.y < 0 || laser.y >= HEIGHT)) {
			lasers.splice(index,1);
		}
		asteroids.forEach(function(asteroid, jndex) {
			console.log("asteroid height: " + asteroid.height);
			if (detectCollision(laser, asteroid)) {
				console.log("asteroid hit");
				if (asteroid.m > 25) {
					asteroid.split(laser);
					score += 10;
				} else {
					score += Math.round(asteroid.m);
				}
				asteroids.splice(jndex, 1);
				lasers.splice(index, 1);
			}
			for (var i = 0; i < asteroids.length - i; i++) {
				if (Math.abs(asteroid.x - asteroids[i].x) < 100 && Math.abs(asteroid.y - asteroids[i].y) < 100) {				
					if (detectCollision(asteroid, asteroids[i])  && asteroid != asteroids[i]) {
						asteroid.split(laser);
						asteroids[i].split(laser);
						asteroids.splice(jndex, 1);
						asteroids.splice(i, 1);
						lasers.splice(index, 1);
						astSnd.play();
					}
				}
			}
		});
	});
	player.update(elapsedTime, currentInput, priorInput);
	//wrap(player); // wrap to other side of screen
}

function loop(timestamp) {
	if(!start) start = timestamp;
	var elapsedTime = timestamp - start;
	start = timestamp;
	//console.log("loop");
	if (asteroids.length == 0) {
		startLevel();
	}
	update(elapsedTime);
	render(elapsedTime);
	if (lives < 1) 
	{ 
		//gameOver(); 
		return;
	}
	copyInput();
	window.requestAnimationFrame(loop);
}

// Start the game loop
//console.log("START THE GAME!");
window.requestAnimationFrame(loop);

/** @function copyInput
  * Copies the current input into the previous input
  */
function copyInput() {
  priorInput = JSON.parse(JSON.stringify(currentInput));
}

// Player class
class Player {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.angle = 0;
		this.ship = new Image();
		this.ship.src = "img/ship.jpg";
		//ship = this.ship;
		this.width = 30;
		this.height = 40;
		this.velocity = {x:0, y:0};
		console.log("Player: (" + this.x + ", " + this.y + ")");
	}

	update(deltaT, currentInput, priorInput) {
		var facing = Vector.rotate({x:0, y:-1}, this.angle);
		//console.log("Facing x: " + facing.x);
		if (currentInput.space && !priorInput.space) {
			// fire laser
			lasers.push(new Laser(this.x, this.y, {x:facing.x, y:facing.y}));
			console.log("laser fired");
			shootSnd.play();
		}
		if (currentInput.up) {
			this.velocity = Vector.add(this.velocity, facing);
			//this.velocity += .02;
			if (Vector.magnitude(this.velocity) > MAX_SPEED) {
				this.velocity = Vector.scalar(Vector.normalize(this.velocity), MAX_SPEED);
			}
			//console.log("y: " + y);
		}
		if (currentInput.down) {
			this.velocity = Vector.add(this.velocity, Vector.invert(facing));
			//this.velocity -= .02;
			if (Vector.magnitude(this.velocity) > MAX_SPEED) {
				this.velocity = Vector.scalar(Vector.normalize(this.velocity), MAX_SPEED);
			}
			//console.log("y: " + y);
		}
		if (currentInput.left) {
			this.angle -= 1;
			//console.log(x);
		}
		if (currentInput.right) {
			this.angle += 1;
			//console.log(x);		
		}
		if (currentInput.w && !priorInput.w) {
			this.x = Math.random() * WIDTH;
			this.y = Math.random() * (HEIGHT);
			return;
		}
		var temp = Vector.add(this, this.velocity);
		this.x = temp.x;
		this.y = temp.y;
		wrap(this);
	}

	render(context) {
		//console.log("(x, y): " + this.x + ", " + this.y);
		context.save();		
		context.translate(this.x, this.y);
		context.rotate(this.angle * Math.PI / 180);
		context.drawImage(this.ship, - 15, - 20);
		//console.log("Draw image: " + this.ship.src + " at " + this.x + ", " + this.y);
		context.restore();
	}

	/*rotate(context) {
		context.translate(x + this.width / 2, y + this.height / 2);
		context.rotate(this.angle * Math.PI / 180);
		context.drawImage(this.ship, this.x, this.y, this.width, this.height,
                        -this.width / 2, -this.height / 2, this.width, this.height);
	}*/
}

class Asteroid {
	constructor(x, y, v, m) {
		this.x = x;
		this.y = y;
		this.v = v;
		this.m = m;
		this.asteroidImg = new Image();
		this.asteroidImg.src = "img/asteroid.jpg";
		this.width = m;
		this.height = m;
	}
	
	render(context) {
		context.drawImage(this.asteroidImg, this.x, this.y, Math.round(this.m), Math.round(this.m));
	}
	
	update(deltaT) {
		this.x += this.v.x * deltaT;
		this.y += this.v.y * deltaT;
		wrap(this);
	}
	
	split(laser) {
		asteroids.push(new Asteroid(this.x, this.y, Vector.perpendicular(this.v), this.m/Math.sqrt(2)));
		asteroids.push(new Asteroid(this.x, this.y, Vector.invert(Vector.perpendicular(this.v)), this.m/Math.sqrt(2)));
	}
}
/*function Asteroid(x, y, v, m) {
	this.x = x;
	this.y = y;
	this.v = v;
	this.m = m;
	this.asteroidImg = new Image();
	this.asteroidImg.src = "img/asteroid.jpg";
}

Asteroid.prototype.render = function(context) {
	context.drawImage(this.asteroidImg, this.x, this.y, Math.round(this.m), Math.round(this.m));
}

Asteroid.prototype.split = function() {
	asteroids.push(new Asteroid(x, y, v, m/Math.sqrt(2)));
	asteroids.push(new Asteroid(x, y, v, m/Math.sqrt(2)));
}*/

// Laser class
function Laser(x, y, v) {
	this.x = x;
	this.y = y;
	this.v = {x:player.velocity.x, y:player.velocity.y};
	console.log("Laser created at: (" + this.x + ", " + this.y +")");
	console.log(lasers.length);
}

Laser.prototype.update = function(deltaT) {
	this.x += deltaT * this.v.x;
	this.y += deltaT * this.v.y;
}

Laser.prototype.render = function(context) {
	//context.beginPath();
	context.strokeStyle = "#FF0000";
	context.beginPath();
	context.moveTo(this.x, this.y);
	context.lineTo(this.x+(10*Math.sin(player.angle)), this.y+(10*Math.cos(player.angle)));
	context.stroke();
}