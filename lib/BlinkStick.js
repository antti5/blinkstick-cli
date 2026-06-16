import { HIDAsync as Device, devices } from 'node-hid';

class BlinkStick {

   #device;
   #bs;
   #index;
   #interval;
   #timeout;

   constructor(index = 0) {
      this.#device = devices()?.find(({ product }) => product.startsWith('BlinkStick'));
      if (!this.#device)
         throw new Error('No BlinkStick found');
      if (!this.#device.path)
         throw new Error('BlinkStick does not have path');
      this.#index = index;
   }

   async #open() {
      this.#bs = await Device.open(this.#device.path);
   }

   async close() {
      await this.#bs.close();
   }

   async set(r, g, b) {
      if (!this.#bs)
         await this.#open();
      await this.#bs.sendFeatureReport(Buffer.from([
         5,
         0,
         this.#index,
         r, g, b
      ]));
   }

   async off() {
      await this.set(0, 0, 0);
   }

   async blinkOnce(r, g, b, length) {
      await this.set(r, g, b);
      await new Promise(res => setTimeout(res, length));
      await this.off();
   }

   blinkStart(r, g, b, { duration = Infinity, interval = 1000, ratio = 0.5 } = {}) {
      if (ratio <= 0 || ratio >= 1)
         throw new Error('Blink ratio must be greater than 0 and smaller than 1');

      clearInterval(this.#interval);
      clearTimeout(this.#timeout);

      this.blinkOnce(r, g, b, ratio * interval);
      this.#interval = setInterval(
         () => this.blinkOnce(r, g, b, ratio * interval),
         interval
      );
      if (duration < Infinity)
         this.#timeout = setTimeout(() => {
            clearInterval(this.#interval);
            this.off();
         }, duration);
   }

   async blinkStop() {
      clearInterval(this.#interval);
      clearTimeout(this.#timeout);
      await this.off();
   }
}

export default BlinkStick;
