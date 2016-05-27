var currentGame;

document.addEventListener('keydown', e => {
	switch (e.keyCode) {
		case 32: // Space
			if (!currentGame || !currentGame.ongoing)
				currentGame = startGame();
			break;
		case 27: // Escape
			if (currentGame && currentGame.ongoing)
				currentGame.stop();
			break;
	}
	e.preventDefault();
});
