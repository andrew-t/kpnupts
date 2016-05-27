function randomInt(n) {
	return Math.floor(Math.random() * n);
}

function randomElement(array) {
	return array[randomInt(array.length)];
}