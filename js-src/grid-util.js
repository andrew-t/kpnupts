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