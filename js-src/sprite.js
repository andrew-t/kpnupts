function flyTo(sprite, x, y, length) {
	let start = (sprite.flight || sprite);
	sprite.flight = {
		x: start.x,
		y: start.y,
		startX: start.x,
		startY: start.y,
		startTime: Date.now(),
		length: length || defaultFlightTime
	};
	sprite.x = x;
	sprite.y = y;
}

function drawSprite(sprite) {
	if (sprite.flight) {
		let now = Date.now(),
			flightTime = now - sprite.flight.startTime,
			fraction = flightTime / sprite.flight.length;
		if (fraction >= 1)
			sprite.flight = null;
		else {
			sprite.flight.x = sprite.flight.startX +
				(sprite.x - sprite.flight.startX) * fraction;
			sprite.flight.y = sprite.flight.startY +
				(sprite.y - sprite.flight.startY) * fraction;
			sprite.element.style.left = blockPosition(sprite.flight.x);
			sprite.element.style.top = blockPosition(sprite.flight.y);
		}
	} 
	if (!sprite.flight) {
		sprite.element.style.left = blockPosition(sprite.x);
		sprite.element.style.top = blockPosition(sprite.y);
	}
}

function blockPosition(val) {
	return (val * blockSize) + blockUnit;
}