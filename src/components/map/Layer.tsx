import React, { ReactElement, useEffect, useMemo } from 'react';

import { Layer as LayerData, Tile as TileData } from 'src/maps/layer';
import Math2D from 'src/utils/math2d';

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
    let size = Math2D.Vector.fromSize(containerSize);
    size = Math2D.Vector.div(size, tileSize);
    size = Math2D.Vector.add(size, { x: 1, y: 1 });

    const tl = Math2D.Vector.sub(center, size);
    const br = Math2D.Vector.add(center, size);

    return Math2D.Rect.fromVectors(tl, br);
  }, [center, containerSize, tileSize]);

  const sublayer = useMemo(() => layer.sublayer(bbox), [layer, bbox]);

  // Effects
  useEffect(() => {
    console.log(`Rendering ${sublayer.tiles.length}/${layer.tiles.length} tiles`);
  });

  // Render
  return <>{ sublayer.tiles.map(children) }</>;
};

export default Layer;
