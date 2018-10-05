// Asteroids, by Carson Holt
import * as Vector from './vector';

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

// Velocities for each direction
var x;
var y;
var vx = 0;
var vy = 0;

var player = new Player(WIDTH/2, HEIGHT/2);
var ship; // image of ship

/** @function handleKeydown
  * Event handler for keydown events
  * @param {KeyEvent} event - the keydown event
  */
function handleKeydown(event) {
  switch(event.key) {
    case ' ':
    console.log('fire?', currentInput, priorInput)
      currentInput.space = true;
      break;
    case 'ArrowLeft':
      currentInput.left = true;
      break;
    case 'ArrowRight':
      currentInput.right = true;
      break;
	case 'ArrowUp':
	  currentInput.up = true;
	  break;
	case 'ArrowDown':
	  currentInput.down = true;
	  break;
  }
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
    console.log('no fire?', currentInput, priorInput)
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
  }
}
// Attach keyup event handler to the window
window.addEventListener('keyup', handleKeyup);

function wrap(obj) {
	if (obj.x >= WIDTH) {
		obj.x -= WIDTH;
	} else if (x < 0) {
		obj.x += WIDTH;
	}
	if (obj.y >= HEIGHT) {
		obj.y -= HEIGHT;
	} else if (y < 0) {
		obj.y += HEIGHT;
	}
}

function render(elapsedTime) {
	ctx.clearRect(0, 0, WIDTH, HEIGHT);
	ctx.fillStyle = "#000000";
	ctx.fillRect(0,0,WIDTH,HEIGHT);
	player.load('img/ship.jpg');
	player.render(ctx);
}

function update(elapsedTime) {
	if (currentInput.space && !priorInput.space) {
		// fire bullet
		//bullets.push(new Bullet(1, player.x+20, player.y, 2));
	}
}

function loop(timestamp) {
	if(!start) start = timestamp;
	var elapsedTime = timestamp - start;
	start = timestamp;
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

Player.prototype.render = function(context) {
	context.drawImage(ship, this.x, this.y);
}

/** @function copyInput
  * Copies the current input into the previous input
  */
function copyInput() {
  priorInput = JSON.parse(JSON.stringify(currentInput));
}

function Asteroid(x, y, v, mass) {
	this.x = x;
	this.y = y;
}

function Bullet(x, y, r) {
	this.x = x;
	this.y = y;
	this.r = r;
}

Bullet.prototype.update = function(deltaT) {
	
}