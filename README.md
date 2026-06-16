# Node.js CLI utility for BlinkStick smart LED controllers

This is a minimal CLI utility for controlling smart LEDs such as the BlinkStick Nano: https://www.blinkstick.com/products/blinkstick-nano

I created this for personal needs due to the official `blinkstick-cli` package not working with recent Linux distributions.
The only dependency for this package is the `node-hid` library.

You can run the utility with `npx blinkstick` or if you install globally with just `blinkstick`.

I have tested this with BlinkStick Nano, however it should work with other models just as well.

## Usage

Turn on a LED: `blinkstick red`

Turn on a LED other than the first one: `blinkstick 1 red` (indexing starts from 0)

Turn off a LED: `blinkstick off`

Blink a LED: `blinkstick red blink` (stop by terminating the program with e.g. ctrl-C)

Possible colors: **red**, **yellow**, **green**, **cyan**, **blue**, **magenta**, **white**

## Adjusting brightness

You can append a brightness setting from 1 to 8 to any of the commands listed above.

For example: `blinkstick blue 8` (for maximum brightness)

The lowest brightness 1 is very dim, and it is possible that it does not even turn on the LED on all BlinkStick models. 8 sets the LED to its maximum brightness.

## BlinkStick class

Actual control of the device takes place from the `BlinkStick` class under the `lib` directory. Depending on your needs, you may find this class useful by itself.

The class allows better control of the blink pattern, as you can adjust the blink interval and blink duration. The CLI utility always uses 1-second interval where the LED is turned on for 500 ms and then off for 500 ms.
