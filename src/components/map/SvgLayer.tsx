import React, { FC, useMemo } from 'react';

import { BIOMES } from 'src/biomes';
import { Layer as LayerData } from 'src/maps/layer';
import { renderAsSvgPaths } from 'src/maps/svg';

import { useLayer } from './layer.context';

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
  const paths = useMemo(() => renderAsSvgPaths(layer), [layer]);

  // Render
  const bbox = layer.bbox;

  return (
    <svg
      height={(bbox.b - bbox.t + 1) * tileSize}
      width={(bbox.r - bbox.l + 1) * tileSize}
      viewBox={`${bbox.l} ${bbox.t} ${bbox.r + 1} ${bbox.b + 1}`}
    >
      { paths.map((path, i) => (
        <path key={i}
          d={path.path}
          fill={BIOMES[path.biome].color}
          stroke="red"
          strokeLinecap="square"
          strokeWidth={.1}
        />
      )) }
    </svg>
  );
};

export default SvgLayer;
