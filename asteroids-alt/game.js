// Asteroids, by Carson Holt
//import * as Vector from './vector';

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
var level = 1;

var numAst = 5; // number of asteroids to start level

// Velocities and positions for each direction
var x = 0;
var y = 0;
var dir = {x: 0, y:0}; // direction vector
var vel = {x: 0, y:0}; // velocity vector
//var ang = {x:0, y:0} // angle vector
// images
var player = new Player(WIDTH/2, HEIGHT/2);
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
	  console.log('fire?', currentInput, priorInput);
      currentInput.space = true;
      break;
	case 'ArrowLeft':
	  console.log('left');
      currentInput.left = true;
      break;
	case 'ArrowRight':
      currentInput.right = true;
      break;
	case 'ArrowUp':
	  console.log('up?', currentInput, priorInput);
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
	case 65:
    case 37:
      currentInput.left = false;
      break;
	case 68:
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
	obj.x %= WIDTH;
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
		var randX = Math.random() * WIDTH;
		var randY = Math.random() * HEIGHT;
		if ((randX < WIDTH/2 - 50 && randX > WIDTH/2 + 50) && (randY < HEIGHT/2 - 50 && randY > HEIGHT/2 + 50)) {
			var randVx = Math.random() * 10 - 5;
			var randVy = Math.random() * 10 - 5;
			var randM = Math.random() * 40 + 20;
			asteroids.push(randX, randY, {x:randVx, y:randVy}, randM);
			//asteroids.render(ctx);
		}
	}
}

function render(elapsedTime) {
	ctx.clearRect(0, 0, WIDTH, HEIGHT);
	ctx.fillStyle = "#000000";
	ctx.fillRect(0,0,WIDTH,HEIGHT);
	player.load('img/ship.jpg');
	player.render(ctx);
	asteroids.forEach(function(asteroid) {
		asteroid.render(ctx);
	});
}

/**
 *
 */
function update(elapsedTime) {
	if (currentInput.space && !priorInput.space) {
		// fire laser
		lasers.push(new Laser(player.x+15, player.y, 10));
		console.log("laser fired");
	}
	if (currentInput.up) {
		console.log(player.y);
		dir = {x: 0, y:-1}
		player.y += dir * elapsedTime;
		console.log(player.y);
	}
	if (currentInput.down) {
		dir = {x: 0, y:1}
		player.y += dir * elapsedTime;
		console.log(player.y);
	}
	if (currentInput.left) {
		player.rotate(ctx);
		console.log(player.x);
	}
	if (currentInput.right) {
		player.rotate(ctx);
		console.log(player.x);		
	}
	
	asteroids.forEach(function(asteroid) {
		asteroid.update(elapsedTime);
		if (detectCollision(asteroid, player)) {
			life--;
			player.x = WIDTH/2;
			player.y = HEIGHT/2;
			return;
		}
		if ((asteroid.x < 1 || asteroid.x > WIDTH) || (asteroid.y < 1 || asteroid.y > HEIGHT)) {
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
				delete asteroid.x;
			}
		});
	});
	player.update();
	wrap(player); // wrap to other side of screen
}

function loop(timestamp) {
	if(!start) start = timestamp;
	var elapsedTime = timestamp - start;
	start = timestamp;
	console.log("loop");
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

// Player class
function Player(x, y) {
	this.x = x;
	this.y = y;
}

Player.prototype.load = function(pathname) {
	ship = new Image();
	ship.src = "img/ship.jpg"
	//player.width = 40;
	//player.height = 30;
}

Player.prototype.update = function(deltaT) {
	this.y += dir * deltaT;
}

Player.prototype.render = function(context) {
	context.drawImage(ship, this.x, this.y);
}

Player.prototype.rotate = function(context) {
	context.translate(x + this.width / 2, y + this.height / 2);
	context.rotate(this.angle * Math.PI / 180);
	ctx.drawImage(this.img, this.x, this.y, this.width, this.height,
                        -this.width / 2, -this.height / 2, this.width, this.height);
}
/** @function copyInput
  * Copies the current input into the previous input
  */
function copyInput() {
  priorInput = JSON.parse(JSON.stringify(currentInput));
}

function Asteroid(x, y, v, m) {
	this.x = x;
	this.y = y;
	this.v = v;
	this.m = m;
}

Asteroid.prototype.load = function(context) {
	asteroidImg = new Image();
	ship.src = "img/asteroid.jpg";
}

Asteroid.prototype.render = function(context) {
	context.drawImage(asteroidImg, this.x, this.y, mass, mass);
}

Asteroid.prototype.split = function() {
	asteroids.push(new Asteroid(x, y, v, mass/Math.sqrt(2)));
	asteroids.push(new Asteroid(x, y, v, mass/Math.sqrt(2)));
}

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
// Vector class

function add(a, b) {
  return {
    x: a.x + b.x,
    y: a.y + b.y
  }
}

function subtract(a, b) {
  return {
    x: a.x - b.x,
    y: a.y - b.y
  }
}

function dotProduct(a, b) {
  return a.x * b.x + a.y + b.y;
}

function magnitude(a) {
  return Math.sqrt(a.x * a.x + a.y * a.y);
}

function normalize(a) {
  var mag = magnitude(a);
  return {
    x: a.x / mag,
    y: a.y / mag
  }
}

function perpendicular(a) {
  return {
    x: -a.y,
    y: a.x
  }
}