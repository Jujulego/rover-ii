import { createContext, useContext } from 'react';

import { NULL_VECTOR, Vector, NULL_RECT, Rect } from 'src/utils/math2d';

// Types
export type LayerMode = 'flat' | 'isometric';

export interface LayerContextProps {
  mode: LayerMode;
  center: Vector;
  container: Rect;
  tileSize: number;
}

// Defaults
const layerDefaults: LayerContextProps = {
  mode: 'flat',
  center: NULL_VECTOR,
  container: NULL_RECT,
  tileSize: 0
};

// Context
export const LayerContext = createContext(layerDefaults);

// Hook
export function useLayer(): LayerContextProps {
  return useContext<LayerContextProps>(LayerContext);
}
