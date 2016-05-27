function bind(element, object, key) {
	if (typeof element == 'string') element = document.getElementById(element);

	for (let i = element.childNodes.length - 1; i >= 0; --i) element.removeChild(element.childNodes[i]);
	bind.bindings.set(element, { object, key });

	return function unbind() {
		bind.bindings.delete(element);
	};
}

function updateBound() {
	bind.bindings.forEach((data, element) => {
		let value = data.object[data.key];
		if (data.node && data.lastValue !== value) {
			element.removeChild(data.node);
			data.node = null;
		}
		if (!data.node) {
			data.node = document.createTextNode(value);
			element.appendChild(data.node);
			data.lastValue = value;
		}
	});
}

function unbindAll() {
	bind.bindings = new Map();
}

unbindAll();