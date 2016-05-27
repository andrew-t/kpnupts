// Game board dimensions, etc:
var cols = 5,
    pusherRows = 4,
    pusherMotion = 2,
    plateRows = 10,
    preblockRows = 2,
    cursorAreaTop = pusherRows + pusherMotion,
    height = pusherRows + pusherMotion + plateRows,
    lineLength = 3,
    lineScore = 1,
    noLineScore = new Set(['k']),
    // no points for KKK
colourScore = 2,
    tileChance = 0.6,
    allowedDrops = 20,
    up = -1,
    down = 1,
    blockSize = 98 / height,
    blockUnit = 'vmin',
    blockDieTime = 300,
    // milliseconds

pusherSpeed = 1000,
    // milliseconds per tile
pusherPause = 3000,
    // milliseconds at extremes
pusherPeriod = (pusherSpeed * pusherMotion + pusherPause) * 2,
    swapDelay = 1500,
    // milliseconds
swapCursors = false,
    swapTimerClasses = 3,
    maxDeltaPerFrame = 250,
    // milliseconds
yEpsilon = 0.05,
    colours = [{ slug: 'blue' }, { slug: 'purple' }, { slug: 'grey' }],
    symbols = [{ slug: 'p' }, { slug: 'plus' }, { slug: 'k' }, { slug: 'robot' }, { slug: 'star' }, { slug: 'question' }, { slug: 'triforce' }, { slug: 'infinity' }, { slug: 'teapot' }, { slug: 'cupcake' }],
    defaultFlightTime = 300; // milliseconds