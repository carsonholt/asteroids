// Player class
export default class Player {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.ship = new Image();
		this.ship.src = "img/ship.jpg"
	}


	update(deltaT) {
		this.y += dir * deltaT;
	}

	render(context) {
		context.drawImage(this.ship, this.x, this.y);
	}

	rotate(context) {
		context.translate(x + this.width / 2, y + this.height / 2);
		context.rotate(this.angle * Math.PI / 180);
		context.drawImage(this.ship, this.x, this.y, this.width, this.height,
                        -this.width / 2, -this.height / 2, this.width, this.height);
	}
}

/*
// Player class
export default function Player(x, y) {
	this.x = x;
	this.y = y;
	this.ship = new Image();
	this.ship.src = "img/ship.jpg"
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
	context.drawImage(this.ship, this.x, this.y);
}

Player.prototype.rotate = function(context) {
	context.translate(x + this.width / 2, y + this.height / 2);
	context.rotate(this.angle * Math.PI / 180);
	context.drawImage(this.ship, this.x, this.y, this.width, this.height,
                        -this.width / 2, -this.height / 2, this.width, this.height);
}
*/