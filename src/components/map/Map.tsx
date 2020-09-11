import React, { FC } from 'react';

import { Layer as LayerData } from 'src/maps/layer';
import { Vector } from 'src/utils/math2d';

import Layer from './Layer';
import LayerContainer from './LayerContainer';
import Tile from './Tile';

// Types
export interface MapProps {
  layer: LayerData;
  center?: Vector;
  zoom?: number;

  onTileClick?: (position: Vector) => void;
}

// Component
const Map: FC<MapProps> = (props) => {
  const {
    layer,
    center, zoom,
    onTileClick
  } = props;

  // Render
  return (
    <LayerContainer tileSize={64} center={center} zoom={zoom}>
      <Layer layer={layer}>
        { tile => (
          <Tile key={`${tile.pos.x},${tile.pos.y}`}
            x={tile.pos.x}
            y={tile.pos.y}
            biome={tile.biome}
            onClick={onTileClick}
          />
        ) }
      </Layer>
    </LayerContainer>
  );
};

export default Map;
