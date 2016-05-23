function startGame() {
	// Initialise
	var grid = [];
	for (let i = 0; i < cols; ++i)
		grid.push([]);
	// Pre-populate pusher
	grid.forEach(col => {
		for (let y = 0; y < pusherRows; ++y)
			col.push(randomTile());
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

function randomTile() {
	return {
		colour: randomElement(colours),
		symbol: randomElement(symbols),
		yOffset: 0,
		onPusher: true
	};
}

function blocksPushEachOtherDown(game) {
	game.grid.forEach(col => {
		let lastBlock = col[0];
		for (let y = 1; y < height; ++y) {
			let block = col[y];
			if (block && lastBlock &&
				lastBlock.yOffset > block.yOffset)
					block.yOffset = lastBlock.yOffset;
			lastBlock = block;
		}
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

			let pusherWholeBlockMoves = ~~game.pusherPosition - ~~oldPosition,
				pusherOffsetMove = pusherDelta - pusherWholeBlockMoves;

			// Now move any blocks that are on it:
			game.grid.forEach(column => {
				for (let i = 0; i < pusherWholeBlockMoves; ++i) {
					// This is how new blocks appear:
					let displacedTile =
							(Math.random() > tileChance)
								? null
								: randomTile(),
						y = 0;
					while (true) {
						let pusherBottom = ~~game.pusherPosition + pusherRows;

						let currentTile = column[y];
						column[y] = displacedTile;
						displacedTile = currentTile;
						currentTile = column[y];

						if (++y > pusherBottom) {
							if (currentTile)
								currentTile.onPusher = false;
							if (!displacedTile)
								break;
						}

					}
				}
			});
			game.grid.forEach(column => {
				column.forEach(block => {
					if (block !== null &&
						block !== undefined &&
						block.onPusher)
						block.yOffset += pusherOffsetMove;
				});
			});
		}
	}

	blocksPushEachOtherDown(game);

}

