import React, { FC, useMemo } from 'react';

import { Layer as LayerData } from 'src/maps/layer';
import { renderAsPaths } from 'src/maps/svg';

import { useLayer } from './layer.context';
import { LayerMode } from './LayerContainer';
import SvgFlatPath from './SvgFlatPath';
import SvgIsometricPath from './SvgIsometricPath';
import { Rect, Size } from '../../utils/math2d';
import { BIOMES } from '../../biomes';

// Types
export interface SvgLayerProps {
  layer: LayerData;
  mode: LayerMode;
}

// Component
const SvgLayer: FC<SvgLayerProps> = (props) => {
  const { layer, mode } = props;

  // Context
  const { tileSize } = useLayer();

  // Memo
  const paths = useMemo(() => {
    let paths = renderAsPaths(layer);

    if (mode === 'isometric') {
      paths = paths.sort(
        (a, b) => BIOMES[a.biome].thickness - BIOMES[b.biome].thickness
      );
    }

    return paths;
  }, [layer, mode]);

  const { bbox, size } = useMemo(() => {
    const bbox = layer.bbox;
    const size = bbox.size;

    if (mode === 'flat') {
      return { bbox, size };
    } else {
      const w = (size.w + 1) * Math.tan(Math.PI / 3);
      const h = size.h + 1;

      return {
        bbox: new Rect(-1, -w / 2, h, w / 2),
        size: new Size(w, h)
      }
    }
  }, [layer, mode]);

  // Render
  const SvgPath = mode === 'flat' ? SvgFlatPath : SvgIsometricPath;

  return (
    <svg
      width={(size.w + 1) * tileSize}
      height={(size.h + 1) * tileSize}
      viewBox={`0 0 ${size.w + 1} ${size.h + 1}`}
    >
      { paths.map((path, i) => (
        <SvgPath key={i} bbox={bbox} path={path.path} biome={path.biome} />
      )) }
    </svg>
  );
};

export default SvgLayer;
