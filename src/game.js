// Asteroids, by Carson Holt
import * as Vector from './vector';
//import Player from './player';

// screen dimensions
const WIDTH = 720
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
var x = WIDTH/2;
var y = HEIGHT/2;

var dir = {x: 0, y:0}; // direction vector
var vel = {x: 0, y:0}; // velocity vector
var speed = 0.001;

// images
var player = new Player(WIDTH/2, HEIGHT/2);
player.x = x;
player.y = y;
//player.load('img/ship.jpg');
var ship; // image of ship
var asteroidImg;

// arrays
var lasers = [];
var asteroids = [];

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
    case 37:
      currentInput.left = false;
      break;
    case 39:
      currentInput.right = false;
      break;
	case 38:
	  currentInput.up = false;
	  break;
	case 40:
	  currentInput.down = false;
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
	if (obj.x < 0 || obj.x >= WIDTH) {
		obj.x %= WIDTH;
	}
	obj.y %= HEIGHT;
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

	while (asteroids.length < numAst) {
		console.log("asteroid length: " + asteroids.length);
		var randX = Math.random() * WIDTH;
		var randY = Math.random() * HEIGHT;
		if ((randX < (WIDTH/2 - 50) || randX > (WIDTH/2 + 50)) || (randY < HEIGHT/2 - 50 || randY > HEIGHT/2 + 50)) {
			var randVx = Math.random() * 2 - 1;
			var randVy = Math.random() * 2 - 1;
			var randM = Math.random() * 40 + 20;
			asteroids.push(new Asteroid(randX, randY, {x:randVx, y:randVy}, randM));
			console.log("New asteroid at: (" + randX + ", " + randY + ") with speed (" + randVx + ", " + randVy + ") and mass " + randM);
			//i++;
		}
	}
}

function render(elapsedTime) {
	ctx.clearRect(0, 0, WIDTH, HEIGHT);
	ctx.fillStyle = "#000000";
	ctx.fillRect(0,0,WIDTH,HEIGHT);
	player.render(ctx);
	//player.rotate(ctx);
	asteroids.forEach(function(asteroid) {
		//console.log("Asteroid: " + asteroid);
		asteroid.render(ctx);
	});
}

/**
 *
 */
function update(elapsedTime) {
	if (currentInput.space && !priorInput.space) {
		// fire laser
		lasers.push(new Laser(x+15, y, 10));
		console.log("laser fired");
	}
	if (currentInput.up) {
		//console.log(player.y);
		vel = Vector.add(vel, {x: 0, y:-1});
		y += vel.y * elapsedTime * speed;
		console.log("y: " + y);
	}
	if (currentInput.down) {
		vel = Vector.add(vel, {x: 0, y:1});
		y += vel.y * elapsedTime * speed;
		console.log("y: " + y);
	}
	if (currentInput.left) {
		//player.rotate(ctx);
		console.log(x);
	}
	if (currentInput.right) {
		//player.rotate(ctx);
		console.log(x);		
	}
	
	asteroids.forEach(function(asteroid) {
		asteroid.update(elapsedTime);
		if (detectCollision(asteroid, player)) {
			lives--;
			player.x = WIDTH/2;
			player.y = HEIGHT/2;
			return;
		}
		if ((asteroid.x < 10 || asteroid.x > WIDTH) || (asteroid.y < 1 || asteroid.y > HEIGHT)) {
			wrap(asteroid);
		}
	});
	
	lasers.forEach(function(laser) {
		laser.update(elapsedTime);
		if ((laser.x < 0 || laser.x >= WIDTH) || (laser.y < 0 || laser.y >= HEIGHT)) {
			lasers.splice(index,1);
		}
		asteroids.forEach(function(asteroid) {
			if (detectCollision(laser, asteroid)) {
				asteroid.split();
				//delete asteroid.x;
			}
		});
	});
	player.update(elapsedTime);
	wrap(player); // wrap to other side of screen
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
		console.log("Player: (" + this.x + ", " + this.y + ")");
	}

	update(deltaT) {
		this.x += vel.x * deltaT;
		this.y += vel.y * deltaT;
	}

	render(context) {
		//console.log("(x, y): " + this.x + ", " + this.y);
		context.save();
		context.rotate(this.angle * Math.PI / 180);
		context.translate(this.x, this.y);
		context.drawImage(this.ship, this.x, this.y);
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
	}
	
	render(context) {
		context.drawImage(this.asteroidImg, this.x, this.y, Math.round(this.m), Math.round(this.m));
	}
	
	update(deltaT) {
		this.x += this.v.x * deltaT;
		this.y += this.v.y * deltaT;
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
function Laser(x, y, l) {
	this.x = x;
	this.y = y;
	this.l = l;
}

Laser.prototype.update = function(deltaT) {
	this.x += 0.2 * dir;
	this.y += 0.2 * dir;
}

Laser.prototype.render = function(deltaT) {
	context.beginPath();
	context.fillStyle = "#FFFFFF";
	context.beginPath();
	context.moveTo(x, y);
	context.lineTo(x+l, y+l);
	context.stroke();
}