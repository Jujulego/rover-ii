import { BiomeName } from 'src/biomes';
import { ISize, Vector } from 'src/utils/math2d';

import { Layer, Tile } from '../layer';

// Generator
export function simpleLayer(size: ISize, biome: BiomeName): Layer {
  const tiles: Tile[] = [];

  for (let y = 0; y < size.h; ++y) {
    for (let x = 0; x < size.w; ++x) {
      if (biome) {
        tiles.push({
          pos: new Vector(x, y),
          biome
        });
      }
    }
  }

  return new Layer(tiles);
}
