import { Image } from 'src/utils/image';

// Class
export class Biome {
  // Attributes
  color: string;
  thickness: number;

  flat: Image;
  isometric: Image;

  // Constructor
  constructor(color: string, thickness: number, floor: string, isometric: string) {
    this.color = color;
    this.thickness = thickness;

    this.flat = Image.fromDataUrl(floor);
    this.isometric = Image.fromDataUrl(isometric);
  }
}
