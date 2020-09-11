import React, { FC } from 'react';

import { Layer as LayerData } from 'src/maps/layer';
import { Vector } from 'src/utils/math2d';

import { useLayer } from './layer.context';
import Tile from './Tile';

// Types
export interface LayerProps {
  layer: LayerData;
  onTileClick?: (tile: Vector) => void;
}

// Component
const Layer: FC<LayerProps> = (props) => {
  const {
    layer,
    onTileClick,
  } = props;

  // Context
  const { center, containerSize, tileSize } = useLayer();

  // Render
  return (
    <>
      { layer.tiles.map(tile => (
        <Tile
          x={tile.pos.x}
          y={tile.pos.y}
          biome={tile.biome}
          onClick={onTileClick}
        />
      )) }
    </>
  );
};

export default Layer;
