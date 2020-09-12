import ice from './ice';
import rock from './rock';
import sand from './sand';
import water from './water';

// Types
export type BiomeName = keyof typeof BIOMES;
export type OptionnalBiomeName = BiomeName | '';

// Constants
export const BIOMES = {
  ice,
  rock,
  sand,
  water,
};

export const BIOME_NAMES: BiomeName[] = ['ice', 'rock', 'sand', 'water'];
export const OPT_BIOME_NAMES: OptionnalBiomeName[] = [...BIOME_NAMES, ''];
