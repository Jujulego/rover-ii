import { DIRECTIONS } from 'src/constants';
import { BiomeName } from 'src/biomes';
import { IVector, Vector } from 'src/utils/math2d';

import { Layer } from './layer';
import { Path } from './path';
import { TileSet } from './types';

// Constants
const EXT_DIRECTIONS = [
  DIRECTIONS.BOTTOM,
  DIRECTIONS.RIGHT,
  DIRECTIONS.TOP,
  DIRECTIONS.LEFT,
];

const INT_DIRECTIONS = [
  DIRECTIONS.TOP,
  DIRECTIONS.LEFT,
  DIRECTIONS.BOTTOM,
  DIRECTIONS.RIGHT,
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
  private borderWalker(start: Vector, tiles: TileSet, directions: IVector[]): Path {
    const path = new Path();

    // Simple cases
    if (tiles.length === 0) return path;
    if (tiles.length === 1) {
      path.push(tiles.item(0).pos);

      return path;
    }

    // Follow tiles
    let previous = start.add(directions[0]);
    let pos = start;

    while (true) {
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

      // End
      if (pos.equals(start)) {
        // Compute last and check if next exists and is not included in path
        const back = previous.sub(pos);
        const i = directions.findIndex(d => back.equals(d));

        const dir = directions[(i + 1) % directions.length];
        const next = pos.add(dir);

        if (!tiles.find(next)) break;
        if (path.indexOf(next) !== -1) break;
      }
    }

    return path;
  }

  border(): Path {
    const tiles = this.borderTiles();
    return this.borderWalker(tiles.item(0).pos, tiles, EXT_DIRECTIONS);
  }

  borders(): Path[] {
    const tiles = this.borderTiles();
    const borders: Path[] = [];

    // External border
    borders.push(this.borderWalker(tiles.item(0).pos, tiles, EXT_DIRECTIONS));
    let missing = tiles.filter(t => borders[0].indexOf(t.pos) === -1);

    // Internal borders
    while (missing.length > 0) {
      const border = this.borderWalker(missing.item(0).pos, tiles, INT_DIRECTIONS);
      borders.push(border);

      missing = missing.filter(t => border.indexOf(t.pos) === -1);
    }

    return borders;
  }
}
