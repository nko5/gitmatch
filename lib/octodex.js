'use strict';

var octodex = [
  "https://octodex.github.com/images/gracehoppertocat.jpg",
  "https://octodex.github.com/images/filmtocat.png",
  "https://octodex.github.com/images/jetpacktocat.png",
  "https://octodex.github.com/images/minertocat.png",
  "https://octodex.github.com/mountietocat",
  "https://octodex.github.com/images/saketocat.png"
];

var randomOctoDex = function() {
  return octodex[Math.floor(Math.random()*octodex.length)];
}

module.exports = randomOctoDex;
