import { createContext, MouseEvent, useContext } from 'react';

import { NULL_VECTOR, Vector, NULL_RECT, Rect } from 'src/utils/math2d';

// Types
export type LayerMode = 'flat' | 'isometric';

export interface LayerContextProps {
  mode: LayerMode;
  center: Vector;
  container: Rect;
  tileSize: number;
  computeMouseTile: (event: MouseEvent) => Vector;
}

// Defaults
const layerDefaults: LayerContextProps = {
  mode: 'flat',
  center: NULL_VECTOR,
  container: NULL_RECT,
  tileSize: 0,
  computeMouseTile: () => NULL_VECTOR
};

// Context
export const LayerContext = createContext(layerDefaults);

// Hook
export function useLayer(): LayerContextProps {
  return useContext<LayerContextProps>(LayerContext);
}
