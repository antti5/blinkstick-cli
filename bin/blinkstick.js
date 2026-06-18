#!/usr/bin/env node

import BlinkStick from '../lib/BlinkStick.js';
import cmdLineArgs from '@antti5/cmd-line-args';


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

const args = cmdLineArgs(
   'blinkstick',
   'CLI utility for BlinkStick smart LED controllers',
   [
      {
         name: 'color',
         mandatory: true,
         defaultOption: true
      },
      {
         name: 'brightness',
         description: 'Brightness from 0 to 8 (default = 4)',
         type: value => value >= 0 && value <= 8 ? Number(value) : null,
         defaultValue: 4
      },
      {
         name: 'index',
         description: 'LED index (default = 0)',
         type: value => value >= 0 ? Number(value) : null,
         defaultValue: 0
      },
      {
         name: 'blink',
         description: 'Start blinking (ctrl-C to stop)',
         type: Boolean
      }
   ]
)

if (args.color.toLowerCase() in COLOR === false) {
   process.stderr.write(`Available colors: ${Object.keys(COLOR).join(', ')}\n`);
   process.exit(1);
}

// Convert color and brightness to RGB values
const rgb = COLOR[args.color.toLowerCase()].map(n => n * BRIGHTNESS[args.brightness]);


/* Set LED or start blink. When blinking the process stays alive because of active
interval in the BlinkStick object. */

try {
   const bs = new BlinkStick(args.index);
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
