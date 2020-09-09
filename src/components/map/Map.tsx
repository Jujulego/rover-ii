import React, { FC } from 'react';

import { Vector } from 'src/utils/math2d';
import { Layer } from 'src/maps/layer';

import LayerContainer, { LayerContainerProps } from './LayerContainer';
import Tile from './Tile';

// Props
export interface MapProps extends Omit<LayerContainerProps, 'size'> {
  layer: Layer;
  onTileClick?: (tile: Vector) => void;
}

// Component
const Map: FC<MapProps> = (props) => {
  const {
    layer,
    onTileClick,
    ...container
  } = props;

  // Render
  return (
    <LayerContainer {...container} size={64}>
      { layer.tiles.map(tile => (
        <Tile key={`${tile.pos.x} ${tile.pos.y}`}
          x={tile.pos.x}
          y={tile.pos.y}
          h={64} w={64}
          biome={tile.biome}
          onClick={onTileClick}
        />
      )) }
    </LayerContainer>
  );
}

export default Map;
