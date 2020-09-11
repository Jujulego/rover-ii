import React, { FC, useMemo } from 'react';

import { BIOMES } from 'src/biomes';
import { Layer as LayerData} from 'src/maps/layer';

import Layer from './Layer';
import LayerContainer, { LayerContainerProps } from './LayerContainer';

// Constants
const SIZE = 8;

// Props
export interface MiniMapProps extends Omit<LayerContainerProps, 'tileSize'> {
  layer: LayerData;
}

// Component
const MiniMap: FC<MiniMapProps> = (props) => {
  const {
    layer,
    ...container
  } = props;

  // Memo
  const bbox = useMemo(() => layer.bbox, [layer]);

  // Render
  return (
    <LayerContainer {...container} tileSize={SIZE}>
      <svg
        height={(bbox.b - bbox.t + 1) * SIZE}
        width={(bbox.r - bbox.l + 1) * SIZE}
        viewBox={`${bbox.l * SIZE} ${bbox.t * SIZE} ${(bbox.r + 1) * SIZE} ${(bbox.b + 1) * SIZE}`}
      >
        <Layer layer={layer}>
          { tile => (
            <rect
              key={`${tile.pos.x} ${tile.pos.y}`}
              x={tile.pos.x * SIZE}
              y={tile.pos.y * SIZE}
              width={SIZE}
              height={SIZE}
              fill={`#${BIOMES[tile.biome].color}`}
            />
          ) }
        </Layer>
      </svg>
    </LayerContainer>
  )
};

export default MiniMap;
