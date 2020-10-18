import { DIRECTIONS } from 'src/constants';
import { BiomeName, BIOMES } from 'src/biomes';
import { IVector, Rect, Vector } from 'src/utils/math2d';

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
        if (path.contains(next)) break;
      }
    }

    return path;
  }

  borders(): Path[] {
    const tiles = this.borderTiles();
    const borders: Path[] = [];

    // External border
    borders.push(this.borderWalker(tiles.item(0).pos, tiles, EXT_DIRECTIONS));
    let missing = tiles.filter(t => !borders[0].contains(t.pos));

    // Internal borders
    while (missing.length > 0) {
      const border = this.borderWalker(missing.item(0).pos, tiles, INT_DIRECTIONS);
      borders.push(border);

      missing = missing.filter(t => !border.contains(t.pos));
    }

    return borders;
  }

  // - sides
  isometricSide(dir: IVector): Rect[] {
    const biome = BIOMES[this.biome];

    // Simple cases
    if (biome.thickness === 0) return [];

    // Extract tiles
    const tiles = this.layer.tiles.filter(tile => {
      // Must be in the area
      if (tile.area !== this.id) return false;

      const p = tile.pos.add(dir);
      const t = this.layer.tile(p);

      return !t || (t.area !== this.id && biome.thickness > BIOMES[t.biome].thickness);
    });

    // Build rects
    const walk = dir.x === 0 ? DIRECTIONS.LEFT : DIRECTIONS.TOP;
    const rects: Rect[] = [];

    while (tiles.length > 0) {
      let { pos } = tiles.item(0);

      // Remove tile & create rect
      tiles.remove(pos);
      const rect = Rect.fromVectorSize(pos, 0, 0);

      // Walk !
      while (true) {
        pos = pos.add(walk);
        const t = tiles.find(pos);

        if (t) {
          // Remove tile & add to rect
          tiles.remove(pos);

          if (dir.x === 0) {
            rect.l = Math.min(rect.l, pos.x);
          } else if (dir.y === 0) {
            rect.t = Math.min(rect.t, pos.y);
          }
        } else {
          break;
        }
      }

      // Add rect
      rects.push(rect);
    }

    return rects;
  }
}
