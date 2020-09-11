import React, { FC, useMemo } from 'react';

import { BIOMES } from 'src/biomes';
import { Layer as LayerData } from 'src/maps/layer';

import { useLayer } from './layer.context';
import Layer from './Layer';

// Types
export interface SvgLayerProps {
  layer: LayerData;
}

// Component
const SvgLayer: FC<SvgLayerProps> = (props) => {
  const { layer } = props;

  // Context
  const { tileSize } = useLayer();

  // Memo
  const bbox = useMemo(() => layer.bbox, [layer]);

  // Render
  return (
    <svg
      height={(bbox.b - bbox.t + 1) * tileSize}
      width={(bbox.r - bbox.l + 1) * tileSize}
      viewBox={`${bbox.l} ${bbox.t} ${bbox.r + 1} ${bbox.b + 1}`}
    >
      <Layer layer={layer}>
        { tile => (
          <rect
            key={`${tile.pos.x},${tile.pos.y}`}
            x={tile.pos.x}
            y={tile.pos.y}
            width={1}
            height={1}
            fill={`#${BIOMES[tile.biome].color}`}
          />
        ) }
      </Layer>
    </svg>
  );
};

export default SvgLayer;
