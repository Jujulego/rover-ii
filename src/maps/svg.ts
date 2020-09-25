import { BiomeName } from 'src/biomes';
import { Vector } from 'src/utils/math2d';

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
      const p = tile.pos.add(dir);
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
  let previous = start.sub(0, -1);
  let pos = start;

  do {
    // Compute "back" direction (go from pos to previous) => it will be the last evaluated
    const back = previous.sub(pos);
    const si = BUILD_DIRECTIONS.findIndex(d => back.equals(d));

    // Search for a valid next tile
    let found = false;

    for (let i = 0; i < BUILD_DIRECTIONS.length; ++i) {
      const dir = BUILD_DIRECTIONS[(si + 1 + i) % BUILD_DIRECTIONS.length];
      const next = pos.add(dir);
      const tile = biomes.tile(next);

      // Check if valid next value
      if (!tile) continue;
      if (tile.biome !== biome) continue;

      // Add to path
      found = true;
      layer.remove(next);

      if (back.equals(dir)) {
        path += ` l ${back.x * -.5} ${back.y * -.5}`;
      }

      path += ` L ${next.x + .5} ${next.y + .5}`;

      // Evolve
      previous = pos;
      pos = next;

      break;
    }

    // Single step cases
    if (!found) {
      return path + ' Z';
    }

  } while (!pos.equals(start));

  // Push to the "end" of the last tile
  const back = previous.sub(pos);
  path += ` l ${back.x * -.5} ${back.y * -.5}`;

  return path + ' Z';
}
