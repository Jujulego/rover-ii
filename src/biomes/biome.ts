import { Image } from 'src/utils/image';

// Class
export class Biome {
  // Attributes
  floor: Image;

  // Constructor
  constructor(floor: string) {
    this.floor = Image.fromDataUrl(floor);
  }
}
