import React, { FC, useMemo } from 'react';

import { Layer as LayerData } from 'src/maps/layer';
import { IVector } from 'src/utils/math2d';

import Layer from './Layer';
import LayerContainer, { LayerMode } from './LayerContainer';
import FlatTile from './FlatTile';
import IsometricTile from './IsometricTile';

// Types
export interface MapProps {
  layer: LayerData;
  center?: IVector;
  zoom?: number;
  mode?: LayerMode

  onTileClick?: (position: IVector) => void;
}

// Component
const Map: FC<MapProps> = (props) => {
  const {
    layer,
    center, zoom, mode = 'isometric',
    onTileClick
  } = props;

  // Memo
  const Tile = useMemo(() => mode === 'isometric' ? IsometricTile : FlatTile, [mode]);

  // Render
  return (
    <LayerContainer tileSize={64} center={center} zoom={zoom} mode={mode}>
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
