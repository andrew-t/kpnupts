function bindKeys(game) {
	document.addEventListener('keydown', listener);
	return function unbind() {
		document.removeEventListener('keydown', listener);
	};

	function listener(e) {
		switch (e.keyCode) {
			case 37: // Left
				game.cursors[0].moveX(-1);
				break;
			case 38: // Up
				game.cursors[0].moveY(-1);
				break;
			case 39: // Right
				game.cursors[0].moveX(1);
				break;
			case 40: // Down
				game.cursors[0].moveY(1);
				break;
			case 65: // A
				game.cursors[1].moveX(-1);
				break;
			case 87: // W
				game.cursors[1].moveY(-1);
				break;
			case 68: // S
				game.cursors[1].moveX(1);
				break;
			case 83: // D
				game.cursors[1].moveY(1);
				break;
			default:
				return;
		}
		e.preventDefault();
	}
}
