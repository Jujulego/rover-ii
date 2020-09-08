import React, { FC } from 'react';

import { Layer, Tile as TileData } from 'src/maps/layer';

import LayerContainer, { LayerContainerProps } from './LayerContainer';
import Tile from './Tile';

// Props
export interface MapProps extends Omit<LayerContainerProps, 'size'> {
  layer: Layer;
  onTileClick?: (tile: TileData) => void;
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
      { layer.tiles.map((tile, i) => (
        <Tile key={`${tile.pos.x} ${tile.pos.y}`}
          x={tile.pos.x}
          y={tile.pos.y}
          h={64} w={64}
          biome={tile.biome}
          onClick={onTileClick && (() => onTileClick(tile))}
        />
      )) }
    </LayerContainer>
  );
}

export default Map;
