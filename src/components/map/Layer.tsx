import React, { ReactElement, useMemo } from 'react';

import { Layer as LayerData, Tile as TileData } from 'src/maps/layer';
import { Rect, Vector } from 'src/utils/math2d';

import { useLayer } from './layer.context';

// Types
export interface LayerProps {
  layer: LayerData;
  children: (tile: TileData) => ReactElement;
}

// Component
const Layer = (props: LayerProps): ReactElement => {
  const { layer, children } = props;

  // Context
  const { center, containerSize, tileSize } = useLayer();

  // Memos
  const bbox = useMemo(() => {
    let size = Vector.fromSize(containerSize);
    size = size.div(tileSize);
    size = size.add(1, 1);

    const tl = center.sub(size);
    const br = center.add(size);

    return Rect.fromVectors(tl, br);
  }, [center, containerSize, tileSize]);

  const sublayer = useMemo(() => layer.sublayer(bbox), [layer, bbox]);

  // Render
  return <>{ sublayer.tiles.map(children) }</>;
};

export default Layer;
