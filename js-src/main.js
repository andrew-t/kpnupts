function startGame() {
	// Initialise
	var grid = [];
	for (let i = 0; i < cols; ++i)
		grid.push(new Set());
	// Pre-populate pusher
	grid.forEach(col => {
		for (let y = 0; y < pusherRows; ++y)
			col.add(randomTile(y));
	});

	var frameRequestId =
			window.requestAnimationFrame(frameCalculator),
		game = {
			grid,
			stop,
			pusherPosition: 0,
			pusherDirection: 0,
			pusherStateChange: null
		};

	function frameCalculator(now) {
		frameRequestId =
			window.requestAnimationFrame(frameCalculator);
		calculateNewFrame(game, now);
		display.drawGrid(game);
	}

	function stop() {
		window.cancelAnimationFrame(frameRequestId)
	}

	return game;
}

function randomTile(y) {
	return {
		colour: randomElement(colours),
		symbol: randomElement(symbols),
		y,
		oldY: y,
		onPusher: true
	};
}

function blocksPushEachOtherDown(game) {
	game.grid.forEach(col => {
		for (let a of col)
			for (let b of col)
				if (a.lastY < b.y && a.lastY > b.y)
					b.y = a.y + 1;
	})
}

var lastFrame;
function calculateNewFrame(game, now) {

	if (!lastFrame) {
		lastFrame = now;
		return;
	}
	var delta = now - lastFrame;
	lastFrame = now;

	if (!game.pusherStateChange)
		game.pusherStateChange = now;
	else {
		// The easy case first: the pusher is stationary:
		if (!game.pusherDirection) {
			// The ony thing we care about is how long ago it stopped:
			if (now - game.pusherStateChange >= pusherPause) {
				game.pusherDirection =
					(game.pusherPosition == 0) ? down : up;
				game.pusherStateChange = now;
			}
		} else {
			// Now we need to work out where it is:
			let oldPosition = game.pusherPosition,
				pusherDelta = (delta / pusherSpeed) * game.pusherDirection;
			game.pusherPosition += pusherDelta;
			if (game.pusherPosition < 0) {
				game.pusherPosition = 0;
				game.pusherDirection = 0;
				game.pusherStateChange = now;
			} else if (game.pusherPosition > pusherMotion) {
				game.pusherPosition = pusherMotion;
				game.pusherDirection = 0;
				game.pusherStateChange = now;
			}

			// Now move any blocks that are on it:
			let pusherBottom = game.pusherPosition + pusherRows - 0.5;
			game.grid.forEach(column => {
				for (let block of column) {
					block.y += pusherDelta;
					if (block.y > pusherBottom)
						block.onPusher = false;
				}
			});
		}
	}

	blocksPushEachOtherDown(game);

}

