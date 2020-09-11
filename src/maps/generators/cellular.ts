import { BIOME_NAMES, BiomeName } from 'src/biomes';
import Math2D, { Size } from 'src/utils/math2d';

import { Layer } from '../layer';

// Constants
const DIRECTIONS = [
  { x: 0,  y: 1  },
  { x: 1,  y: 0  },
  { x: 0,  y: -1 },
  { x: -1, y: 0  }
];

// Type
export type BiomesFrequencies = Record<BiomeName, number>;

// Utils
function buildFrequencies(): BiomesFrequencies {
  const freqs = {} as BiomesFrequencies;

  for (const name of BIOME_NAMES) {
    freqs[name] = 0;
  }

  return freqs;
}

// Generator
export function cellularLayer(size: Size, iterations: number, biomes: Partial<BiomesFrequencies>): Layer {
  // Compute sum and cumulated frequencies
  const cumulated = buildFrequencies();
  let sum = 0;

  for (const name of BIOME_NAMES) {
    sum += biomes[name] ?? 0;
    cumulated[name] = sum;
  }

  // Regulate frequencies
  sum = Math.max(sum, 1);

  for (const name of BIOME_NAMES) {
    cumulated[name] /= sum;
  }

  // Build matrix
  const matrix: (BiomeName | null)[][] = [];

  for (let y = 0; y < size.h; ++y) {
    matrix.push([]);

    for (let x = 0; x < size.w; ++x) {
      matrix[y].push(null);

      // Choose biome
      const random = Math.random();
      for (const name of BIOME_NAMES) {
        if (random < cumulated[name]) {
          matrix[y][x] = name;
          break;
        }
      }
    }
  }

  // Cellular algorithm
  const bbox = { t: 0, r: size.w - 1, b: size.h - 1, l: 0 };

  for (let i = 0; i < iterations; ++i) {
    for (let y = 0; y < size.h; ++y) {
      for (let x = 0; x < size.w; ++x) {
        const current = matrix[y][x];

        // Count surrounding biomes
        const biomes = buildFrequencies();
        let empty = 0;

        for (const dir of DIRECTIONS) {
          const p = Math2D.Vector.add({ x, y }, dir);
          if (!Math2D.Rect.within(p, bbox)) continue;

          const b = matrix[p.y][p.x];

          if (b) {
            biomes[b]++;
          } else {
            empty++;
          }
        }

        // Changes
        if ((current ? biomes[current] : empty) >= 2) {
          continue;
        }

        if (empty >= 3) {
          matrix[y][x] = null;
          continue;
        }

        for (const name of BIOME_NAMES) {
          if (biomes[name] >= 2) {
            matrix[y][x] = name;
            break;
          }
        }
      }
    }
  }

  return Layer.fromMatrix(matrix);
}
