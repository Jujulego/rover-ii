import { DIRECTIONS } from 'src/constants';
import { BiomeName } from 'src/biomes';
import { IVector, Vector } from 'src/utils/math2d';

import { Layer } from './layer';
import { Path } from './path';
import { TileSet } from './types';

// Constants
const EXT_DIRECTIONS = [
  DIRECTIONS.TOP,
  DIRECTIONS.LEFT,
  DIRECTIONS.BOTTOM,
  DIRECTIONS.RIGHT
];

const INT_DIRECTIONS = [
  DIRECTIONS.LEFT,
  DIRECTIONS.TOP,
  DIRECTIONS.RIGHT,
  DIRECTIONS.BOTTOM
];

// Class
export class Area {
  // Constructor
  constructor(
    readonly id: number,
    readonly biome: BiomeName,
    readonly layer: Layer
  ) {}

  // Methods
  // - tiles
  tiles(): TileSet {
    return this.layer.tiles.filter(tile => tile.area === this.id);
  }

  borderTiles(): TileSet {
    return this.layer.tiles.filter(tile => {
      // Must be in the area
      if (tile.area !== this.id) return false;

      // Count surroundings
      let same = 0;

      for (const dir of DIRECTIONS.ALL) {
        const p = tile.pos.add(dir);
        const t = this.layer.tile(p);

        if (t?.biome === tile.biome) {
          ++same;
        }
      }

      return same < 8;
    });
  }

  // - borders
  private borderWalker(tiles: TileSet, directions: IVector[]): Path {
    // Simple cases
    if (tiles.length === 0) return new Path();
    if (tiles.length === 1) {
      const path = new Path();
      path.push(tiles.item(0).pos);

      return path;
    }

    // Initiate
    const path = new Path();
    const start = tiles.item(0).pos;

    // Follow tiles
    let previous = start.add(Vector.mul(directions[0], -1));
    let pos = start;

    do {
      // Add to path
      path.push(pos);

      // Compute "back" direction (go from pos to previous) => it will be the last evaluated direction
      const back = previous.sub(pos);
      const si = directions.findIndex(d => back.equals(d));

      // Search for a valid next tile
      for (let i = 0; i < directions.length; ++i) {
        const dir = directions[(si + 1 + i) % directions.length];
        const next = pos.add(dir);

        // Check it exists
        if (!tiles.find(next)) continue;

        // Evolve
        previous = pos;
        pos = next;

        break;
      }
    } while (!pos.equals(start));

    return path;
  }

  externalBorder(): Path {
    const tiles = this.borderTiles();
    return this.borderWalker(tiles, EXT_DIRECTIONS);
  }

  borders(): Path[] {
    let tiles = this.borderTiles();
    const borders: Path[] = [];

    // External border
    borders.push(this.borderWalker(tiles, EXT_DIRECTIONS));
    tiles = tiles.filter(t => borders[0].indexOf(t.pos) === -1);

    // Internal borders
    while (tiles.length > 0) {
      const border = this.borderWalker(tiles, INT_DIRECTIONS);
      borders.push(border);

      tiles = tiles.filter(t => border.indexOf(t.pos) === -1);
    }

    return borders;
  }
}
