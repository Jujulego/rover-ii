import seedrandom from 'seedrandom';

import { OPT_BIOME_NAMES, OptionalBiomeName } from 'src/biomes';
import { Rect, ISize, Vector } from 'src/utils/math2d';

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
export type BiomeMatrix = OptionalBiomeName[][];
export type BiomesFrequencies = Record<OptionalBiomeName, number>;

export interface CellularOptions {
  seed?: string;
  iterations?: number;
  emptyBiome?: OptionalBiomeName;
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
function prepareFrequencies(biomes: Partial<BiomesFrequencies>, emptyBiome: OptionalBiomeName): BiomesFrequencies {
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

function randomMatrix(size: ISize, biomes: Partial<BiomesFrequencies>, seed: string | undefined, emptyBiome: OptionalBiomeName): BiomeMatrix {
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

function evaluateSurroundings(matrix: BiomeMatrix, bbox: Rect, pos: Vector, emptyBiome: OptionalBiomeName): BiomesFrequencies {
  // Initiate
  const biomes = biomesFrequencies();

  for (const dir of DIRECTIONS) {
    const p = pos.add(dir);

    if (p.within(bbox)) {
      const b = matrix[p.y][p.x];
      biomes[b]++;
    } else {
      biomes[emptyBiome]++;
    }
  }

  return biomes;
}

export function cellularLayer(size: ISize, biomes: Partial<BiomesFrequencies>, options: CellularOptions = {}): Layer {
  const {
    seed,
    iterations = 5,
    emptyBiome = ''
  } = options;

  // Cellular algorithm
  let matrix = randomMatrix(size, biomes, seed, emptyBiome);
  const bbox = new Rect(0, 0, size.h - 1, size.w - 1);

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
