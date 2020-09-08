import hole from './hole';
import ice from './ice';
import rock from './rock';
import sand from './sand';

// Constants
export const BIOMES = {
  hole,
  ice,
  rock,
  sand
}

export type BiomeName = keyof typeof BIOMES;
export const BIOME_NAMES: BiomeName[] = [
  'hole', 'ice', 'rock', 'sand'
]
