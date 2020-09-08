import ice from './ice';
import rock from './rock';
import sand from './sand';
import water from './water';

// Constants
export const BIOMES = {
  ice,
  rock,
  sand,
  water,
}

export type BiomeName = keyof typeof BIOMES;
export const BIOME_NAMES: BiomeName[] = [
  'water', 'ice', 'rock', 'sand'
]
