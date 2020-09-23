import { BiomeName, OptionnalBiomeName } from 'src/biomes';

import Math2D, { NULL_RECT, Rect, IVector, VectorOrderMode } from 'src/utils/math2d';
import { sindexOf } from 'src/utils/sfind';

// Types
export interface Tile {
  pos: IVector;
  biome: BiomeName;
}

export interface LayerOptions {
  compareMode?: VectorOrderMode
}

// Class
export class Layer {
  // Attributes
  readonly tiles: Tile[];

  private _bbox = NULL_RECT;
  private options: LayerOptions;

  // Constructor
  constructor(tiles: Tile[], options: LayerOptions = {}) {
    this.tiles = tiles;
    this.options = options;

    this.setupLayer();
  }

  // Static methods
  static fromMatrix(matrix: OptionnalBiomeName[][]): Layer {
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

  // Methods
  private compareVector(a: IVector, b: IVector): number {
    return Math2D.Vector.compare(a, b, this.options.compareMode || 'xy');
  }

  private setupLayer() {
    // Sort tiles
    this.tiles.sort((a, b) => this.compareVector(a.pos, b.pos));

    // Compute bbox
    const bbox = {
      t: Infinity,
      r: -Infinity,
      b: -Infinity,
      l: Infinity
    };

    for (const tile of this.tiles) {
      bbox.t = Math.min(bbox.t, tile.pos.y);
      bbox.r = Math.max(bbox.r, tile.pos.x);
      bbox.b = Math.max(bbox.b, tile.pos.y);
      bbox.l = Math.min(bbox.l, tile.pos.x);
    }

    this._bbox = bbox;
  }

  indexOfTile(pos: IVector): number {
    return sindexOf(this.tiles, (tile) => this.compareVector(tile.pos, pos));
  }

  tile(pos: IVector): Tile | null {
    const i = this.indexOfTile(pos);
    return i > -1 ? this.tiles[i] : null;
  }

  remove(pos: IVector) {
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
    return this._bbox;
  }
}
