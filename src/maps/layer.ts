import { BiomeName, OptionalBiomeName } from 'src/biomes';

import { BST } from 'src/utils/bst';
import { NULL_RECT, Rect, Vector, VectorOrderMode } from 'src/utils/math2d';
import { Area } from './area';

// Constants
const AREA_DIRECTIONS = [
  { x:  0, y: -1 },
  { x: -1, y:  0 },
  { x:  0, y:  1 },
  { x:  1, y:  0 },
];

// Types
export interface InputTile {
  pos: Vector;
  biome: BiomeName;
}

export interface Tile extends InputTile {
  area: number;
}

export interface LayerOptions {
  compareMode?: VectorOrderMode
}

interface InputArea {
  id: number;
  biome: BiomeName;
}

interface AreaData extends InputArea {
  id: number;
  biome: BiomeName;
  tileCount: number;
}

// Class
export class Layer {
  // Attributes
  readonly areas: Area[] = [];
  readonly tiles: BST<Tile, Vector>;

  private _bbox = NULL_RECT;
  private readonly options: LayerOptions;

  // Constructor
  private constructor(tiles: BST<Tile, Vector>, areas: InputArea[], options: LayerOptions = {}) {
    this.options = options;
    this.areas = areas.map(area => new Area(area.id, area.biome, this));
    this.tiles = tiles;

    // Preparations
    this.computeBBox();
  }

  // Static methods
  private static computeAreas(tiles: BST<Tile, Vector>): InputArea[] {
    const pile: Tile[] = [];

    // Areas
    let nextArea = 0;
    const areas = new Map<number, AreaData>();

    // First tile
    const tile = tiles.item(0);

    tile.area = ++nextArea;
    areas.set(tile.area, { id: tile.area, biome: tile.biome, tileCount: 1 });

    pile.unshift(tile);

    // BFS
    while (pile.length > 0) {
      const [tile] = pile.splice(0, 1);

      if (!tile.area) continue;

      for (const dir of AREA_DIRECTIONS) {
        const p = tile.pos.add(dir);
        const t = tiles.find(p);

        if (!t) { // Don't exists !
          continue;
        }

        if (!t.area) { // no area yet
          if (t.biome === tile.biome) {
            t.area = tile.area;
            areas.get(t.area)!.tileCount++;
          } else {
            t.area = ++nextArea;
            areas.set(t.area, { id: t.area, biome: t.biome, tileCount: 1 });
          }

          pile.unshift(t);
        } else if (t.area !== tile.area && t.biome === tile.biome) { // got an area and same biome => must be same area
          if (tile.area < t.area) {
            areas.get(t.area)!.tileCount--;
            areas.get(tile.area)!.tileCount++;

            t.area = tile.area;
            pile.unshift(t);
          } else if (t.area < tile.area) {
            areas.get(t.area)!.tileCount++;
            areas.get(tile.area)!.tileCount--;

            tile.area = t.area;
            pile.unshift(tile);
          }
        }
      }
    }

    // Filter areas
    const result: InputArea[] = [];

    for (const [,area] of areas) {
      if (area.tileCount !== 0) {
        result.push(area);
      }
    }

    return result;
  }

  static fromArray(tiles: InputTile[], options: LayerOptions = {}) {
    const bst = BST.fromArray(
      tiles.map(t => ({ ...t, area: 0 })),
      t => t.pos,
      (a, b) => a.compare(b, options.compareMode || 'xy')
    );

    const areas = this.computeAreas(bst);
    return new Layer(bst, areas, options);
  }

  static fromMatrix(matrix: OptionalBiomeName[][], options: LayerOptions = {}): Layer {
    const tiles: InputTile[] = [];

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
  private computeBBox() {
    // Compute bbox
    const bbox = {
      t: Infinity,
      r: -Infinity,
      b: -Infinity,
      l: Infinity
    };

    for (const tile of this.tiles) {
      bbox.t = Math.min(bbox.t, tile.pos.y);
      bbox.l = Math.min(bbox.l, tile.pos.x);
      bbox.b = Math.max(bbox.b, tile.pos.y);
      bbox.r = Math.max(bbox.r, tile.pos.x);
    }

    this._bbox = new Rect(bbox);
  }

  // - accessing
  indexOfTile(pos: Vector): number {
    return this.tiles.indexOf(pos);
  }

  tile(pos: Vector): Tile | null {
    const i = this.indexOfTile(pos);
    return i > -1 ? this.tiles.item(i) : null;
  }

  // - modifying
  add(pos: Vector, biome: BiomeName) {
    // Get tile
    let tile = this.tiles.find(pos);

    // Add tile if not exists
    if (!tile) {
      tile = this.tiles.insert({ pos, biome, area: 0 });
    } else {
      tile.biome = biome;
    }

    // TODO: Fix area (old if same biome in surroundings, else a new one + propagate modification (bridge case !))

    // Update bbox
    this._bbox.t = Math.min(this._bbox.t, pos.y);
    this._bbox.l = Math.min(this._bbox.l, pos.x);
    this._bbox.b = Math.max(this._bbox.b, pos.y);
    this._bbox.r = Math.max(this._bbox.r, pos.x);
  }

  remove(pos: Vector) {
    this.tiles.remove(pos);
  }

  // - utils
  copy(): Layer {
    return new Layer(BST.copy(this.tiles), this.areas.map(area => ({ id: area.id, biome: area.biome })), this.options);
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
