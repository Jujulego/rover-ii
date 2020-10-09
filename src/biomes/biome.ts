import { Image } from 'src/utils/image';

// Types
export interface BiomeColors {
  main: string;
  shadow1: string;
  shadow2: string;
}

export interface BiomeOptions {
  colors: BiomeColors;
  thickness: number;
  texture: string;
}

// Class
export class Biome {
  // Attributes
  readonly colors: BiomeColors;
  readonly thickness: number;

  readonly flat: Image;

  // Constructor
  constructor(opts: BiomeOptions) {
    this.colors = opts.colors;
    this.thickness = opts.thickness;

    this.flat = Image.fromDataUrl(opts.texture);
  }

  // Properties
  get color() {
    return this.colors.main;
  }
}
