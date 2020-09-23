import { createContext, useContext } from 'react';

import { NULL_SIZE, NULL_VECTOR, Size, IVector } from 'src/utils/math2d';

// Types
export interface LayerContextProps {
  center: IVector;
  containerSize: Size;
  tileSize: number;
}

// Defaults
const layerDefaults: LayerContextProps = {
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
