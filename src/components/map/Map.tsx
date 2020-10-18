import React, { FC } from 'react';

import { Layer as LayerData } from 'src/maps/layer';
import { Vector } from 'src/utils/math2d';

import { LayerMode } from './layer.context';
import LayerContainer from './LayerContainer';
import SvgLayer from './SvgLayer';

// Types
export interface MapProps {
  layer: LayerData;
  center?: Vector;
  zoom?: number;
  mode?: LayerMode;

  onTileClick?: (position: Vector) => void;
}

// Component
const Map: FC<MapProps> = (props) => {
  const {
    layer,
    center, zoom, mode = 'isometric',
    onTileClick
  } = props;

  // Render
  return (
    <LayerContainer tileSize={64} center={center} zoom={zoom} mode={mode}>
      <SvgLayer layer={layer} onTileClick={onTileClick} />
    </LayerContainer>
  );
};

export default Map;
