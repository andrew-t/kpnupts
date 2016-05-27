function swapTilesIfNeeded(game) {

	if (!game.lastSwap) {
		game.lastSwap = game.startTime;
		game.swaps = 0;
	}

	var now = Date.now();

	game.since = now - game.lastSwap;
	if (game.since >= swapDelay) {
		// swap
		if (swapCursors) {
			swapCursorProp('x');
			swapCursorProp('y');
		} else {
			// swap cursor block associations
			swapCursorProp('block');
		}
		// swap block positions
		game.cursors.forEach(cursor => {
			if (cursor.block) {
				game.grid.forEach(col => col.delete(cursor.block));
				flyTo(cursor.block, cursor.x, cursor.y, 150);
				cursor.block.lastY = cursor.block.y;
				game.grid[cursor.block.x].add(cursor.block);
			}
		});

		++game.swaps;
		game.lastSwap = now;
	}

	function swapCursorProp(key) {
		swapProp(game.cursors[0], game.cursors[1], key);
	}
}

function swapProp(a, b, key) {
	let temp = a[key];
	a[key] = b[key];
	b[key] = temp;
}