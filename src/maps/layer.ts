import { BiomeName, OptionalBiomeName } from 'src/biomes';

import { BST } from 'src/utils/bst';
import { NULL_RECT, Rect, Vector, VectorOrderMode } from 'src/utils/math2d';

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
  readonly tiles: BST<Tile, Vector>;

  private _bbox = NULL_RECT;
  private readonly options: LayerOptions;

  // Constructor
  private constructor(tiles: BST<Tile, Vector>, options: LayerOptions = {}) {
    this.options = options;
    this.tiles = tiles;

    this.setupLayer();
  }

  // Static methods
  static fromArray(tiles: Tile[], options: LayerOptions = {}) {
    const bst = BST.fromArray(tiles, t => t.pos, (a, b) => a.compare(b, options.compareMode || 'xy'));
    return new Layer(bst, options);
  }

  static fromMatrix(matrix: OptionalBiomeName[][], options: LayerOptions = {}): Layer {
    const tiles: Tile[] = [];

    for (let y = 0; y < matrix.length; ++y) {
      const line = matrix[y];

      for (let x = 0; x < line.length; ++x) {
        const biome = line[x];

        if (biome) {
          tiles.push({
            pos: new Vector(x, y),
            biome
          });
        }
      }
    }

    return Layer.fromArray(tiles, options);
  }

  // Methods
  private setupLayer() {
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

    this._bbox = new Rect(bbox);
  }

  indexOfTile(pos: Vector): number {
    return this.tiles.indexOf(pos);
  }

  tile(pos: Vector): Tile | null {
    const i = this.indexOfTile(pos);
    return i > -1 ? this.tiles.item(i) : null;
  }

  remove(pos: Vector) {
    this.tiles.remove(pos);
  }

  copy(): Layer {
    return new Layer(BST.copy(this.tiles), this.options);
  }

  sublayer(bbox: Rect): Layer {
    // Simple cases
    if (this.bbox.within(bbox)) return this;

    // Compute sublayer
    const tiles: Tile[] = [];

    for (const tile of this.tiles) {
      if (tile.pos.within(bbox)) {
        tiles.push(tile);
      }
    }

    return Layer.fromArray(tiles);
  }

  // Properties
  get bbox(): Rect {
    return this._bbox;
  }
}
