import { BiomeName } from 'src/biomes';
import { ISize, Vector } from 'src/utils/math2d';

import { InputTile, Layer } from '../layer';

// Generator
export function simpleLayer(size: ISize, biome: BiomeName): Layer {
  const tiles: InputTile[] = [];

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

  return Layer.fromArray(tiles);
}
