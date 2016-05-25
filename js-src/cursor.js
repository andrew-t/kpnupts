class Cursor {
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

	bindToBlock(block) {
		this.block = block;
		this.y = block.y;
		this.game.grid.forEach((col, x) => {
			if (col.has(block))
				this.x = x;
		});
	}

	moveX(direction) {
		for (let x = this.x + direction;
				this.game.grid[x];
				x += direction)
			for (let block of this.game.grid[x])
				if (block.y >= this.y - 0.5 &&
					block.y < this.y + 0.5)
				{
					this.bindToBlock(block);
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
			this.bindToBlock(best);
	}

	display() {
		if (!this.element) {
			this.element = document.createElement('div');
			document.getElementById('cursors')
				.appendChild(this.element);
			this.element.style.width = blockPosition(1);
			this.element.style.height = blockPosition(1);
		}
		this.element.style.left = blockPosition(this.x);
		this.element.style.top = blockPosition(this.y);
	}

	destroy() {
		document.getElementById('cursors')
			.removeChild(this.element);
	}
}