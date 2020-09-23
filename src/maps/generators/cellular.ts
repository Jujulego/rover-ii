import seedrandom from 'seedrandom';

import { OPT_BIOME_NAMES, OptionnalBiomeName } from 'src/biomes';
import Math2D, { IRect, Size, Vector } from 'src/utils/math2d';

import { Layer } from '../layer';

// Constants
const DIRECTIONS = [
  { x:  0, y:  1 },
  { x:  1, y:  1 },
  { x:  1, y:  0 },
  { x:  1, y: -1 },
  { x:  0, y: -1 },
  { x: -1, y: -1 },
  { x: -1, y:  0 },
  { x: -1, y:  1 },
];

// Type
export type BiomeMatrix = OptionnalBiomeName[][];
export type BiomesFrequencies = Record<OptionnalBiomeName, number>;

export interface CellularOptions {
  seed?: string;
  iterations?: number;
  emptyBiome?: OptionnalBiomeName;
}

// Utils
function biomesFrequencies(): BiomesFrequencies {
  const freqs = {} as BiomesFrequencies;

  for (const name of OPT_BIOME_NAMES) {
    freqs[name] = 0;
  }

  return freqs;
}

// Generator
function prepareFrequencies(biomes: Partial<BiomesFrequencies>, emptyBiome: OptionnalBiomeName): BiomesFrequencies {
  // Compute cumulated frequencies
  const cumulated = biomesFrequencies();
  let sum = 0;

  for (const name of OPT_BIOME_NAMES) {
    sum += biomes[name] ?? 0;
    cumulated[name] = sum;
  }

  // Add missing empty biomes
  if (sum < 1) {
    cumulated[emptyBiome] += 1 - sum;
    sum = 1;
  }

  // Regulate frequencies
  sum = Math.max(sum, 1);

  for (const name of OPT_BIOME_NAMES) {
    cumulated[name] /= sum;
  }

  return cumulated;
}

function randomMatrix(size: Size, biomes: Partial<BiomesFrequencies>, seed: string | undefined, emptyBiome: OptionnalBiomeName): BiomeMatrix {
  // Initiate
  const frequencies = prepareFrequencies(biomes, emptyBiome);
  const matrix: BiomeMatrix = [];
  const prng = seedrandom(seed);

  // Generate
  for (let y = 0; y < size.h; ++y) {
    matrix.push([]);

    for (let x = 0; x < size.w; ++x) {
      const random = prng();

      for (const name of OPT_BIOME_NAMES) {
        if (random < frequencies[name]) {
          matrix[y].push(name);
          break;
        }
      }
    }
  }

  return matrix;
}

function evaluateSurroundings(matrix: BiomeMatrix, bbox: IRect, pos: Vector, emptyBiome: OptionnalBiomeName): BiomesFrequencies {
  // Initiate
  const biomes = biomesFrequencies();

  for (const dir of DIRECTIONS) {
    const p = pos.add(dir);

    if (Math2D.Rect.within(p, bbox)) {
      const b = matrix[p.y][p.x];
      biomes[b]++;
    } else {
      biomes[emptyBiome]++;
    }
  }

  return biomes;
}

export function cellularLayer(size: Size, biomes: Partial<BiomesFrequencies>, options: CellularOptions = {}): Layer {
  const {
    seed,
    iterations = 5,
    emptyBiome = ''
  } = options;

  // Cellular algorithm
  let matrix = randomMatrix(size, biomes, seed, emptyBiome);
  const bbox = { t: 0, r: size.w - 1, b: size.h - 1, l: 0 };

  for (let i = 0; i < iterations; ++i) {
    for (let y = 0; y < size.h; ++y) {
      for (let x = 0; x < size.w; ++x) {
        // Count surrounding biomes
        const biomes = evaluateSurroundings(matrix, bbox, new Vector(x, y), emptyBiome);

        // Changes
        for (const name of OPT_BIOME_NAMES) {
          if (biomes[name] > 4) {
            matrix[y][x] = name;
            break;
          }
        }
      }
    }
  }

  return Layer.fromMatrix(matrix);
}
