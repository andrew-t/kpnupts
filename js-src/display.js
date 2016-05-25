var display = (function() {

	var boardElement,
		pusherElement,
		scoreElement, scoreNode, lastScore;

	return {
		drawGrid
	};

	function drawGrid(game) {

		if (!boardElement)
			boardElement = document.getElementById('grid');
		if (!pusherElement) {
			pusherElement = document.getElementById('pusher');
			pusherElement.style.width = blockPosition(cols);
			pusherElement.style.height = blockPosition(pusherRows + pusherMotion);
		}
		if (!scoreElement)
			scoreElement = document.getElementById('score');

		let allChildren = new Set();
		for (let i = 0; i < boardElement.children.length; ++i)
			allChildren.add(boardElement.children[i]);

		game.grid.forEach((column, x) => {
			column.forEach(block => {
				if (!block) return;

				let el = block.element;
				if (!el) {
					el = block.element =
						document.createElement('div');
					el.classList.add(block.symbol.slug);
					el.classList.add(block.colour.slug);
					el.style.backgroundColor = block.colour.hex;
					boardElement.appendChild(el);
				}

				el.style.top = blockPosition(block.y);
				el.style.left = blockPosition(x);
				el.style.width = el.style.height = blockPosition(1);
				el.classList[block.onPusher ? 'add' : 'remove']('pusher');

				allChildren.delete(el);
			});
		});

		for (let child of allChildren)
			boardElement.removeChild(child);

		pusherElement.style.top = blockPosition(game.pusherPosition - pusherMotion);

		if (scoreNode && (lastScore !== game.score)) {
			scoreElement.removeChild(scoreNode);
			scoreNode = null;
		}
		if (!scoreNode) {
			scoreNode = document.createTextNode(game.score);
			scoreElement.appendChild(scoreNode);
			lastScore = game.score;
		}

		game.cursors.forEach(cursor => cursor.display());
	}

})();

function blockPosition(val) {
	return (val * blockSize) + blockUnit;
}