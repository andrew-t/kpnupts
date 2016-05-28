function bindGamepad(game) {
	checkGamepad.game = game;
	return function unbind() {
		checkGamepad.game = null;
	};
}

function checkGamepad() {
	if (!checkGamepad.game) return;
	var gamepads = navigator.getGamepads ? navigator.getGamepads() : navigator.webkitGetGamepads ? navigator.webkitGetGamepads : [];
	if (gamepads[0]) {
		control(0, 0, 0);
		control(1, 0, 2);
	}
	if (gamepads[1]) control(1, 1, 0);

	function control(player, pad, stick) {
		var gamepad = gamepads[pad];
		if (!gamepad) return;
		var upDown = gamepad.axes[stick + 1],
		    leftRight = gamepad.axes[stick];
		if (!upDown || !leftRight) return;
		var cursor = checkGamepad.game.cursors[player];
		if (upDown < -stickDeadZone) deaden(stickDeadTime, player + ',' + pad + ',' + stick + ',up', () => cursor.moveY(-1));else if (upDown > stickDeadZone) deaden(stickDeadTime, player + ',' + pad + ',' + stick + ',down', () => cursor.moveY(1));
		if (leftRight < -stickDeadZone) deaden(stickDeadTime, player + ',' + pad + ',' + stick + ',left', () => cursor.moveX(-1));else if (leftRight > stickDeadZone) deaden(stickDeadTime, player + ',' + pad + ',' + stick + ',right', () => cursor.moveX(1));
	}
}

function deaden(time, hash, callback) {
	var last = deaden.times.get(hash),
	    now = Date.now();
	if (!last || now - last > time) {
		callback();
		deaden.times.set(hash, now);
	}
}
deaden.times = new Map();