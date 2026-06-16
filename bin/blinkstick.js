#!/usr/bin/env node

import BlinkStick from '../lib/BlinkStick.js';


/* The lowest non-zero brightness is 5. This is quite dim, and by testing the
smallest value that actually lights up the LED's on BlinkStick Nano is 3.

Each brightness level is about 1.75x higher than the previous level for visually
consistent changes in brightness. */

const BRIGHTNESS = [ 0, 5, 9, 15, 27, 47, 83, 145, 255 ];

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


/* Handle command-line arguments */

const args = process.argv.slice(2);

if (args.length < 1) {
   process.stderr.write(`Usage: blinkstick [LED index] <Color> ["blink"] [Brightness]\n\n`);
   process.stderr.write('LED index:  LED index starting from 0, by default use first LED\n');
   process.stderr.write(`Color:      ${Object.keys(COLOR).join(', ')}\n`);
   process.stderr.write('Brightness: 0 = off, 8 = full brightness, by default use 4\n');
   process.exit(1);
}

// Index is optional, read if number
const index = !isNaN(args[0]) ? args.shift() : 0;

// Color is mandatory
const color = args.shift();
if (!COLOR[color]) {
   process.stderr.write(`Available colors: ${Object.keys(COLOR).join(', ')}\n`);
   process.exit(1);
}

// Blink is optional
const blink = args[0] === 'blink';
if (blink)
   args.shift();

// Convert color and brightness to RGB values
const rgb = COLOR[color]?.map(n => n * BRIGHTNESS[args[0]] ?? BRIGHTNESS[4]);


/* Set LED or start blink. When blinking the process stays alive because of active
interval in the BlinkStick object. */

try {
   const bs = new BlinkStick(index);
   if (blink) {
      bs.blinkStart(...rgb);
   } else {
      await bs.set(...rgb);
      await bs.close();
   }
} catch (error) {
   process.stderr.write(`Error: ${error.message}\n`);
   process.exit(1);
}
