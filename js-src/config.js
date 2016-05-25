// Game board dimensions, etc:
var cols = 7,
	pusherRows = 4,
	pusherMotion = 2,
	plateRows = 10,
	cursorAreaTop = pusherRows + pusherMotion,
	height = pusherRows + pusherMotion + plateRows,

	lineLength = 3,
	lineScore = 1,
	noLoneScore = new Set([ 'k' ]), // no points for KKK
	colourScore = 2,

	up = -1,
	down = 1,

	blockSize = 5,
	blockUnit = 'vh',

	pusherSpeed = 1000, // milliseconds per tile
	pusherPause = 1000, // milliseconds at extremes
	pusherPeriod = (pusherSpeed * pusherMotion + pusherPause) * 2,

	maxDeltaPerFrame = 250, // milliseconds
	yEpsilon = 0.05,

	tileChance = .75,

	colours = [
		{ slug: 'blue' },
		{ slug: 'purple' },
		{ slug: 'grey' }
	],
	symbols = [
		{ slug: 'p' },
		{ slug: 'plus' },
		{ slug: 'k' },
		{ slug: 'robot' },
		{ slug: 'star' },
		{ slug: 'question' },
		{ slug: 'triforce' },
		{ slug: 'infinity' },
		{ slug: 'teapot' },
		{ slug: 'cupcake' }
	];