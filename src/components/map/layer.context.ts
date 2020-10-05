import { createContext, useContext } from 'react';

import { NULL_SIZE, NULL_VECTOR, ISize, Vector } from 'src/utils/math2d';

// Types
export type LayerMode = 'flat' | 'isometric';

export interface LayerContextProps {
  mode: LayerMode;
  center: Vector;
  containerSize: ISize;
  tileSize: number;
}

// Defaults
const layerDefaults: LayerContextProps = {
  mode: 'flat',
  center: NULL_VECTOR,
  containerSize: NULL_SIZE,
  tileSize: 0
};

// Context
export const LayerContext = createContext(layerDefaults);

// Hook
export function useLayer(): LayerContextProps {
  return useContext<LayerContextProps>(LayerContext);
}
