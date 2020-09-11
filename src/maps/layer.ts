import { BiomeName } from 'src/biomes';

import Math2D, { Rect, Size, Vector, VectorOrderMode } from 'src/utils/math2d';
import { sfind, sindexOf } from 'src/utils/sfind';

// Types
export interface Tile {
  pos: Vector;
  biome: BiomeName;
}

export interface LayerOptions {
  compareMode?: VectorOrderMode
}

// Class
export class Layer {
  // Attributes
  readonly tiles: Tile[];
  private options: LayerOptions;

  // Constructor
  constructor(tiles: Tile[], options: LayerOptions = {}) {
    this.tiles = tiles;
    this.options = options;

    this.sortTiles();
  }

  // Static methods
  static fromMatrix(matrix: (BiomeName | null)[][]): Layer {
    const tiles: Tile[] = [];

    for (let y = 0; y < matrix.length; ++y) {
      const line = matrix[y];

      for (let x = 0; x < line.length; ++x) {
        const biome = line[x];

        if (biome) {
          tiles.push({
            pos: { x, y },
            biome
          });
        }
      }
    }

    return new Layer(tiles);
  }

  static generate(size: Size, biome: BiomeName): Layer {
    const tiles: Tile[] = [];

    for (let y = 0; y < size.h; ++y) {
      for (let x = 0; x < size.w; ++x) {
        if (biome) {
          tiles.push({
            pos: { x, y },
            biome
          });
        }
      }
    }

    return new Layer(tiles);
  }

  // Methods
  private compareVector(a: Vector, b: Vector): number {
    return Math2D.Vector.compare(a, b, this.options.compareMode || 'xy');
  }

  private sortTiles() {
    this.tiles.sort((a, b) => this.compareVector(a.pos, b.pos));
  }

  indexOfTile(pos: Vector): number {
    return sindexOf(this.tiles, (tile) => this.compareVector(tile.pos, pos));
  }

  tile(pos: Vector): Tile | null {
    const i = this.indexOfTile(pos);
    return i > -1 ? this.tiles[i] : null;
  }

  remove(pos: Vector) {
    const i = this.indexOfTile(pos);
    if (i > -1) this.tiles.splice(i, 1);
  }

  copy(): Layer {
    const tiles: Tile[] = [];

    for (const tile of this.tiles) {
      tiles.push(tile);
    }

    return new Layer(tiles);
  }

  sublayer(bbox: Rect): Layer {
    // Simple cases
    if (Math2D.Rect.within(this.bbox, bbox)) return this;

    // Compute sublayer
    const tiles: Tile[] = [];

    for (const tile of this.tiles) {
      if (Math2D.Rect.within(tile.pos, bbox)) {
        tiles.push(tile);
      }
    }

    return new Layer(tiles);
  }

  // Properties
  get bbox(): Rect {
    return {
      t: Math.min(...this.tiles.map(t => t.pos.y)),
      r: Math.max(...this.tiles.map(t => t.pos.x)),
      b: Math.max(...this.tiles.map(t => t.pos.y)),
      l: Math.min(...this.tiles.map(t => t.pos.x))
    }
  }
}
