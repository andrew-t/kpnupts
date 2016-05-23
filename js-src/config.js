// Game board dimensions, etc:
var cols = 7,
	pusherRows = 4,
	pusherMotion = 2,
	plateRows = 10,
	height = pusherRows + pusherMotion + plateRows,

	up = -1,
	down = 1,

	blockSize = 5,
	blockUnit = 'vh',

	pusherSpeed = 1000, // ms/tile
	pusherPause = 1000, // ms at extremes
	pusherPeriod = (pusherSpeed * pusherMotion + pusherPause) * 2,

	tileChance = .75,

	colours = [
		{ hex: '#bbb' },
		{ hex: '#00f' },
		{ hex: '#80c' }
	],
	symbols = [
		{ slug: 'p' },
		{ slug: '+' },
		{ slug: 'k' },
		{ slug: 'robot' },
		{ slug: 'star' },
		{ slug: 'question' },
		{ slug: 'triforce' },
		{ slug: 'infinity' },
		{ slug: 'teapot' },
		{ slug: 'cupcake' }
		// More?
	];