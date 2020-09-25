import grass from './grass';
import rock from './rock';
import sand from './sand';
import water from './water';

// Constants
export const BIOMES = {
  grass,
  rock,
  sand,
  water,
};

// Types
export type BiomeName = keyof typeof BIOMES;
export type OptionalBiomeName = BiomeName | '';

// Constants
export const BIOME_NAMES: BiomeName[] = ['grass', 'rock', 'sand', 'water'];
export const OPT_BIOME_NAMES: OptionalBiomeName[] = [...BIOME_NAMES, ''];
