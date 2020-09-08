import { Image } from 'src/utils/image';

// Class
export class Biome {
  // Attributes
  color: string;
  floor: Image;

  // Constructor
  constructor(color: string, floor: string) {
    this.color = color;
    this.floor = Image.fromDataUrl(floor);
  }
}
