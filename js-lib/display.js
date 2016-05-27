var display = function () {

	var boardElement, pusherElement, swapTimerElement, swapFillerElement;

	return {
		drawGrid
	};

	function drawGrid(game) {

		if (!boardElement) {
			boardElement = document.getElementById('grid');
			let realBoard = document.getElementById('board');
			realBoard.style.height = blockPosition(height);
			realBoard.style.width = blockPosition(cols);
		}
		if (!swapFillerElement) {
			swapTimerElement = document.getElementById('swap-timer');
			swapFillerElement = document.getElementById('swap-filler');
		}
		if (!pusherElement) {
			pusherElement = document.getElementById('pusher');
			pusherElement.style.width = blockPosition(cols);
			pusherElement.style.height = blockPosition(pusherRows + pusherMotion);
		}

		let allChildren = new Set();
		for (let i = 0; i < boardElement.children.length; ++i) {
			if (!boardElement.children[i].classList.contains('die')) allChildren.add(boardElement.children[i]);
		}

		game.grid.forEach((column, x) => {
			column.forEach(block => {
				if (!block) return;
				block.x = x;

				let el = block.element;
				if (!el) {
					el = block.element = document.createElement('div');
					el.classList.add(block.symbol.slug);
					el.classList.add(block.colour.slug);
					el.style.width = el.style.height = blockPosition(1);
					el.style.backgroundColor = block.colour.hex;
					boardElement.appendChild(el);
				}

				drawSprite(block);
				el.classList[block.onPusher ? 'add' : 'remove']('pusher');

				allChildren.delete(el);
			});
		});

		allChildren.forEach(child => {
			child.classList.add('die');
			setTimeout(() => {
				boardElement.removeChild(child);
			}, blockDieTime);
		});

		pusherElement.style.top = blockPosition(game.pusherPosition - pusherMotion);

		updateBound();

		// TODO - this is hacky
		if (game.swaps !== undefined) {
			swapTimerElement.classList.remove('swap-' + (game.swaps - 1) % swapTimerClasses);
			swapTimerElement.classList.add('swap-' + game.swaps % swapTimerClasses);
			swapFillerElement.style.width = (Date.now() - game.lastSwap) * 100 / swapDelay + '%';
		}

		game.cursors.forEach(cursor => cursor.display());
	}
}();