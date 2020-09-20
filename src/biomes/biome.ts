import { Image } from 'src/utils/image';

// Class
export class Biome {
  // Attributes
  color: string;
  flat: Image;
  isometric: Image;

  // Constructor
  constructor(color: string, floor: string, isometric: string) {
    this.color = color;
    this.flat = Image.fromDataUrl(floor);
    this.isometric = Image.fromDataUrl(isometric);
  }
}
