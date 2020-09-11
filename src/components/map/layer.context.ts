import { createContext, useContext } from 'react';

import { NULL_VECTOR, Vector } from 'src/utils/math2d';

// Types
export interface LayerContextProps {
  center: Vector;
  containerSize: { w: number, h: number };
}

// Defaults
const layerDefaults: LayerContextProps = {
  center: NULL_VECTOR,
  containerSize: { w: 0, h: 0 }
};

// Context
export const LayerContext = createContext(layerDefaults);

// Hook
export function useLayer(): LayerContextProps {
  return useContext<LayerContextProps>(LayerContext);
}
