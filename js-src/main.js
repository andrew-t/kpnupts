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
			score: 0,
			pusherPosition: 0,
			pusherDirection: up,
			pusherStateChange: null
		};
	game.cursors = [
		new Cursor(game, 1, cursorAreaTop),
		new Cursor(game, cols - 2, cursorAreaTop)
	];
	var unbindKeys = bindKeys(game);

	function frameCalculator(now) {
		frameRequestId =
			window.requestAnimationFrame(frameCalculator);
		calculateNewFrame(game, now);
		display.drawGrid(game);
	}

	function stop() {
		window.cancelAnimationFrame(frameRequestId);
		game.cursors.forEach(cursor => cursor.destroy());
		unbindKeys();
	}

	return game;
}

var lastFrame;
function calculateNewFrame(game, now) {

	if (!lastFrame) {
		lastFrame = now;
		return;
	}
	var delta = now - lastFrame;
	if (delta > maxDeltaPerFrame)
		delta = maxDeltaPerFrame;
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
				pusherDelta = (delta / pusherSpeed) * game.pusherDirection,
				pusherBottom = game.pusherPosition + pusherRows;
			game.pusherPosition += pusherDelta;
			if (game.pusherPosition < 0) {
				// The pusher has stopped at the top
				game.pusherPosition = 0;
				stopPusher();
				game.grid.forEach(col => {
					// Create zero, one or two blocks with uneven chances.
					let blocks = (Math.random() < 0.7) + (Math.random() < 0.7);
					for (let i = 0; i < blocks; ++i)
						col.add(randomTile(-1 - i));
				});
			} else if (game.pusherPosition > pusherMotion) {
				// The pusher has stopped at the bottom
				game.pusherPosition = pusherMotion;
				stopPusher();
			}

			function stopPusher() {
				game.pusherDirection = 0;
				game.pusherStateChange = now;
				game.grid.forEach(col => {
					for (let block of col) {
						// Force all the blocks into integer positions
						block.y = Math.round(block.y);
						// Drop things off the pusher
						if (block.y > pusherBottom - 0.5)
							block.onPusher = false;
					}
				});
			}

			// Now move any blocks that are on it:
			game.grid.forEach(column => {
				for (let block of column)
					if (block.onPusher) {
						block.y += pusherDelta;
						if (game.pusherDirection == up &&
							block.y < 0)
							block.y = 0;
					} else if (block.y < pusherBottom)
						block.y = pusherBottom;
			});
		}
	}

	blocksPushEachOtherDown(game);
	
	// update lastY and delete things that have fallen off the bottom
	game.grid.forEach(column => {
		for (let block of column)
			if (block.y >= height - 0.5)
				column.delete(block);
			else
				block.lastY = block.y;
	});

	scoreLinesOfThree(game);
	game.cursors.forEach(cursor => cursor.snapToBlock());
	checkGamepad();

}

