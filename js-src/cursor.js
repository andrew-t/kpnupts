class GameCursor {
	constructor(game, x, y) {
		this.game = game;
		this.x = x;
		this.y = y;
		this.snapToBlock();
	}

	snapToBlock() {
		if (this.block) {
			let foundOne = false;
			this.game.grid.forEach((col, x) => {
				if (col.has(this.block))
					foundOne = true;
			});
			if (foundOne)
				this.y = this.block.y;
			else this.block = null;
		} else for (let block of this.game.grid[this.x])
			if (block.y > this.y - yEpsilon &&
				block.y < this.y + yEpsilon)
				this.block = block;
	}

	bindToBlock(block, fly) {
		this.block = block;
		var newX;
		this.game.grid.forEach((col, x) => {
			if (col.has(block))
				newX = x;
		});
		if (fly)
			flyTo(this, newX, block.y, 150);
		else {
			this.x = newX;
			this.y = block.y;
		}
	}

	moveX(direction) {
		for (let x = this.x + direction;
				this.game.grid[x];
				x += direction)
			for (let block of this.game.grid[x])
				if (block.y >= this.y - 0.5 &&
					block.y < this.y + 0.5)
				{
					this.bindToBlock(block, true);
					return;
				}
	}

	moveY(direction) {
		let best = null;
		for (let block of this.game.grid[this.x]) {
			if (block.onPusher ||
				block == this.game.cursors[0].block ||
				block == this.game.cursors[1].block)
				continue;
			let y = (block.y - this.y) * direction;
			if (y < 0)
				continue;
			if (!best || best.y * direction > block.y * direction)
				best = block;
		}
		if (best)
			this.bindToBlock(best, true);
	}

	display() {
		if (!this.element) {
			this.element = document.createElement('div');
			document.getElementById('cursors')
				.appendChild(this.element);
			this.element.style.width = blockPosition(1);
			this.element.style.height = blockPosition(1);
		}
		drawSprite(this);
	}

	destroy() {
		document.getElementById('cursors')
			.removeChild(this.element);
	}
}