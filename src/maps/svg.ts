import { BiomeName } from 'src/biomes';
import Math2D, { Vector } from 'src/utils/math2d';

import { Layer } from './layer';

// Constants
const DIRECTIONS = [
  { x: 0,  y: 1  },
  { x: 1,  y: 0  },
  { x: 0,  y: -1 },
  { x: -1, y: 0  },
];

// Types
export interface LayerSvgPath {
  path: string;
  biome: BiomeName;
}

// Algorithm
export function renderAsSvgPaths(layer: Layer): LayerSvgPath[] {
  const paths: LayerSvgPath[] = [];
  layer = layer.copy();

  while (layer.tiles.length > 0) {
    const tile = layer.tiles[0];
    const path = buildPath(layer, tile.pos);

    paths.push({ path, biome: tile.biome });
  }

  return paths;
}

function buildPath(layer: Layer, start: Vector): string {
  // Initiate
  let path = `M ${start.x + .5} ${start.y + .5} Z`;
  const stack = [{ pos: start, previous: start }];

  // First tile
  const biome = layer.tile(start)?.biome;
  if (!biome) return '';

  // Algorithm
  let last: Vector = start;

  while (stack.length > 0) {
    const { pos, previous } = stack.pop()!;

    // Remove tile from layer
    if (!layer.tile(pos)) continue;
    layer.remove(pos);

    // Build path
    if (!Math2D.Vector.equals(previous, last)) {
      path = `${path} M ${previous.x + .5} ${previous.y + .5}`;
    }

    path = `${path} L ${pos.x + .5} ${pos.y + .5}`;
    last = pos;

    // Visit neighbors
    for (const dir of DIRECTIONS) {
      const p = Math2D.Vector.add(pos, dir);
      const tile = layer.tile(p);

      // Checks
      if (!tile) continue;
      if (tile.biome !== biome) continue;

      // Add to stack
      stack.push({ pos: p, previous: pos });
    }
  }

  return path;
}
