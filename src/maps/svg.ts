import { BiomeName } from 'src/biomes';
import Math2D, { Vector } from 'src/utils/math2d';

import { Layer } from './layer';

// Constants
const DIRECTIONS = [
  { x: 0,  y: 1  },
  { x: 1,  y: 0  },
  { x: 0,  y: -1 },
  { x: -1, y: 0  }
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
    const path = buildPath(layer, tile.pos, tile.biome);

    paths.push({ path, biome: tile.biome });
  }

  return paths;
}

function buildPath(layer: Layer, pos: Vector, biome: BiomeName): string {
  // Get tile and check it's biome
  const tile = layer.tile(pos);
  if (!tile || tile.biome !== biome) return '';

  // Remove tile from layer
  layer.remove(pos);

  // Build path
  let path = '';

  for (const dir of DIRECTIONS) {
    const part = buildPath(layer, Math2D.Vector.add(pos, dir), biome);

    if (part !== '') {
      path = `${path} ${part} L ${pos.x + .5} ${pos.y + .5}`.trimStart();
    }
  }

  if (!path.startsWith('M')) {
    path = `M ${pos.x + .5} ${pos.y + .5} ${path}`;
  }

  return path;
}
