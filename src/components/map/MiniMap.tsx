import React, { FC } from 'react';

import { Layer as LayerData} from 'src/maps/layer';

import LayerContainer, { LayerContainerProps } from './LayerContainer';
import SvgLayer from './SvgLayer';

// Constants
const SIZE = 6;

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

  // Render
  return (
    <LayerContainer {...container} tileSize={SIZE}>
      <SvgLayer layer={layer} />
    </LayerContainer>
  )
};

export default MiniMap;
