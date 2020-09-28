import { Layer } from './layer';
import { BiomeName } from '../biomes';

// Class
export class Area {
  // Constructor
  constructor(
    readonly id: number,
    readonly biome: BiomeName,
    readonly layer: Layer
  ) {}

  // Methods
  *[Symbol.iterator] () {
    for (const tile of this.layer.tiles) {
      if (tile.area === this.id) yield tile;
    }
  }
}
