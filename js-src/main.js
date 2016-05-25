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
		let pushed = true;
		while (pushed) {
			pushed = false;
			for (let a of col)
				for (let b of col) {
					let oldA = a.lastY + 1,
						newA = a.y + 1;
					// Top block moved down...
					if (((oldA <= b.y && newA > b.y) ||
					// Bottom block tried to move up
						(b.lastY >= newA && b.y < newA) ||
					// Just to make sure, bottom block is inside top
						(b.y < newA && b.y > a.y)) &&
					// Oh! And don't move blocks to where they already are
						(b.y != newA)) {
							b.y = newA;
							pushed = true;
					}
				}
		}
	})
}

function scoreLinesOfThree(game) {

	var grid = [];
	game.grid.forEach((col, x) => {
		grid[x] = [];
		for (let block of col)
			if (block.y >= 0)
				grid[x][~~block.y] = block;
	});
	var blocksToRemove = new Set();

	// vertical lines
	grid.forEach(col => {
		for (let y = 0; y <= height - lineLength; ++y) {
			let line = [];
			for (let i = 0; i < lineLength; ++i)
				line.push(col[y + i]);
			testAndRemoveLine(line, 1);
		}
	});
	// horizontal lines
	for (let y = 0; y < height; ++y)
		for (let x = 0; x <= grid.length - lineLength; ++x) {
			let line = [];
			for (let i = 0; i < lineLength; ++i)
				line.push(grid[x + i][y]);
			testAndRemoveLine(line, 0);
		}

	for (let block of blocksToRemove)
		game.grid.forEach(col => col.delete(block));

	function testAndRemoveLine(line, dy) {
		if (!line[0])
			return;
		let colourMatch = true;
		for (let i = 1; i < line.length; ++i) {
			if (!line[i] ||
				(line[i].symbol.slug != line[0].symbol.slug) ||
				(line[i].y < line[0].y + (dy * i) - yEpsilon) ||
				(line[i].y > line[0].y + (dy * i) + yEpsilon))
				return;
			if (line[i].colour.slug != line[0].colour.slug)
				colourMatch = false;
		}
		// It's a line!
		line.forEach(block => blocksToRemove.add(block));
		game.score += lineScore;
		if (colourMatch)
			game.score += colourScore;
	}
}

function yEquals(block, y) {
	return (block.y >= y - yEpsilon) &&
		(block.y <= y + yEpsilon);
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

}

