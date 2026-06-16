#!/usr/bin/env node

import BlinkStick from '../lib/BlinkStick.js';

const COLOR = {
   off:     [0, 0, 0],
   red:     [1, 0, 0],
   yellow:  [1, 1, 0],
   green:   [0, 1, 0],
   cyan:    [0, 1, 1],
   blue:    [0, 0, 1],
   magenta: [1, 0, 1],
   white:   [1, 1, 1]
};

/* The lowest non-zero brightness is 5. This is quite dim, and by testing the
smallest value that actually lights up the LED's on BlinkStick Nano is 3.

Each brightness level is about 1.75x higher than the previous level for visually
consistent changes in brightness. */

const BRIGHTNESS = [ 0, 5, 9, 15, 27, 47, 83, 145, 255 ];

const args = process.argv.slice(2);

if (args.length < 1) {
   process.stderr.write(`Usage: blink <color> [brightness 0..${BRIGHTNESS.length - 1}] [index] ["blink"]\n`);
   process.exit(1);
}

if (args[0] in COLOR === false) {
   process.stderr.write('Available colors: ' + Object.keys(COLOR).join(', ') + '\n');
   process.exit(1);
}

const color = COLOR[args[0]].map(n => n * BRIGHTNESS[args[1] ?? 4]);

try {
   const bs = new BlinkStick(args[2] ?? 0);
   if (args[3] === 'blink') {
      bs.blinkStart(...color);
   } else {
      await bs.set(...color);
      await bs.close();
      process.exit(0);
   }
} catch (error) {
   process.stderr.write(`Error: ${error.message}\n`);
   process.exit(1);
}
