import { DIRECTIONS } from 'src/constants';
import { BiomeName } from 'src/biomes';
import { BST } from 'src/utils/bst';
import { Vector } from 'src/utils/math2d';

import { Layer, Tile } from './layer';
import { Path } from './path';

// Class
export class Area {
  // Constructor
  constructor(
    readonly id: number,
    readonly biome: BiomeName,
    readonly layer: Layer
  ) {}

  // Methods
  *[Symbol.iterator]() {
    for (const tile of this.layer.tiles) {
      if (tile.area === this.id) yield tile;
    }
  }

  borderTiles(): BST<Tile, Vector> {
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

  border(): Path {
    // Get borders
    const tiles = this.borderTiles();

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
    let previous = start.add(DIRECTIONS.BOTTOM);
    let pos = start;

    do {
      // Add to path
      path.push(pos);

      // Compute "back" direction (go from pos to previous) => it will be the last evaluated direction
      const back = previous.sub(pos);
      const si = DIRECTIONS.BASICS.findIndex(d => back.equals(d));

      // Search for a valid next tile
      for (let i = 0; i < DIRECTIONS.BASICS.length; ++i) {
        const dir = DIRECTIONS.BASICS[(si + 1 + i) % DIRECTIONS.BASICS.length];
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
}
