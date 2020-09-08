import { BiomeName } from 'src/biomes';

import { Math2D, Vector, VectorCompareMode } from 'src/utils/math2d';
import { sfind } from 'src/utils/sfind';

// Types
export interface Tile {
  pos: Vector;
  biome: BiomeName;
}

export interface LayerOptions {
  compareMode?: VectorCompareMode
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

  static generate(height: number, width: number, biome: BiomeName): Layer {
    const tiles: Tile[] = [];

    for (let y = 0; y < height; ++y) {
      for (let x = 0; x < width; ++x) {
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
    return Math2D.compare(a, b, this.options.compareMode || 'xy');
  }

  private sortTiles() {
    this.tiles.sort((a, b) => this.compareVector(a.pos, b.pos));
  }

  get(pos: Vector): Tile | null {
    return sfind(this.tiles, (tile) => this.compareVector(tile.pos, pos)) || null;
  }

  // Properties
  get bbox() {
    return {
      t: Math.min(...this.tiles.map(t => t.pos.y)),
      r: Math.max(...this.tiles.map(t => t.pos.x)),
      b: Math.max(...this.tiles.map(t => t.pos.y)),
      l: Math.min(...this.tiles.map(t => t.pos.x))
    }
  }
}
