import { BiomeName } from 'src/biomes';
import Math2D, { Vector } from 'src/utils/math2d';

import { Layer, Tile } from './layer';

// Constants
const FILTER_DIRECTIONS = [
  { x:  1, y:  0 },
  { x:  1, y:  1 },
  { x:  0, y:  1 },
  { x: -1, y:  1 },
  { x: -1, y:  0 },
  { x: -1, y: -1 },
  { x:  0, y: -1 },
  { x:  1, y: -1 },
];

const BUILD_DIRECTIONS = [
  { x:  0, y: -1 },
  { x: -1, y:  0 },
  { x:  0, y:  1 },
  { x:  1, y:  0 },
];

// Types
export interface LayerSvgPath {
  path: string;
  biome: BiomeName;
}

// Algorithm
export function renderAsSvgPaths(layer: Layer): LayerSvgPath[] {
  const paths: LayerSvgPath[] = [];
  layer = filterTiles(layer);

  while (layer.tiles.length > 0) {
    const tile = layer.tiles[0];
    const path = buildPath(layer, tile.pos);

    paths.push({ path, biome: tile.biome });
  }

  return paths;
}

function filterTiles(layer: Layer): Layer {
  const tiles: Tile[] = [];

  for (const tile of layer.tiles) {
    let same = 0;

    for (const dir of FILTER_DIRECTIONS) {
      const p = Math2D.Vector.add(tile.pos, dir);
      const t = layer.tile(p);

      if (t?.biome === tile.biome) {
        ++same;
      }
    }

    if (same < 8) {
      tiles.push(tile);
    }
  }

  return new Layer(tiles);
}

function buildPath(layer: Layer, start: Vector): string {
  // Prepare layer
  const biomes = layer.copy();

  // First tile
  const biome = biomes.tile(start)?.biome;
  if (!biome) return '';

  let path = `M ${start.x + .5} ${start.y + .5}`;
  layer.remove(start);

  // Initiate
  let previous = Math2D.Vector.sub(start, { x: 0, y: -1 });
  let pos = start;

  do {
    // Compute "back" direction (go from pos to previous) => it will be the last evaluated
    const back = Math2D.Vector.sub(previous, pos);
    const si = BUILD_DIRECTIONS.findIndex(d => Math2D.Vector.equals(d, back));

    // Search for a valid next tile
    let found = false;

    for (let i = 0; i < BUILD_DIRECTIONS.length; ++i) {
      const dir = BUILD_DIRECTIONS[(si + 1 + i) % BUILD_DIRECTIONS.length];
      const next = Math2D.Vector.add(pos, dir);
      const tile = biomes.tile(next);

      // Check if valid next value
      if (!tile) continue;
      if (tile.biome !== biome) continue;

      // Add to path
      found = true;
      layer.remove(next);

      if (Math2D.Vector.equals(dir, back)) {
        path += ` l ${back.x * -.5} ${back.y * -.5}`;
      }

      path += ` L ${next.x + .5} ${next.y + .5}`;

      // Evolve
      previous = pos;
      pos = next;

      break;
    }

    // Single step cases
    if (!found) break;
  } while (!Math2D.Vector.equals(pos, start));

  return path + ' Z';
}
