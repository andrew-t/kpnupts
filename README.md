# kpnupts
A block-matching game for a wedding OBVIOUSLY

[Paul](http://www.twitter.com/apaultaylor) and [Katie](http://www.katiesteckles.co.uk) are getting married, and [the website for the wedding](http://www.kpnupts.com) has a nice design with little shapes based on their names and interests. [Mark](http://markstaylor.uk/) said there should be a block-matching game with these symbols, and this is that game.

It was obvious it had to be a two-player co-op game because this is a wedding and because I have been playing too much [Lovers In A Dangerous Spacetime](http://www.loversinadangerousspacetime.com/); the periodic swapping of blocks was Paul's addition. The 2p machine mechanic was my addition, based on Paul and Katie's inexplicable shared love of 2p machines. I suppose you might know these machines by another name, especially if you live somewhere without a local currency unit named "2p". They are [these things](https://youtu.be/tdcVehd9NBI?t=38s).

Ideally the game should speed up over time, but at the moment it does not. If you want an easier or harder game, you can edit the values in [[js-src/config.js]] and rebuild.

## Building

It should be as simple as

    npm install
    npm run build

but if not, it's a Babel compile form ES6. I've not bothered with all of the changes, just the ones that recent browsers need. I haven't tested it in anything but recent Firefox and Chrome.

Note that the generated files *are* committed in the `gh-pages` branch.
