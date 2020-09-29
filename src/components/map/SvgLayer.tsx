import React, { FC, useMemo } from 'react';

import { Layer as LayerData } from 'src/maps/layer';
import { renderAsPaths } from 'src/maps/svg';

import { useLayer } from './layer.context';
import { LayerMode } from './LayerContainer';
import SvgFlatArea from './SvgFlatArea';
import SvgIsometricArea from './SvgIsometricArea';
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
  const areas = useMemo(() => {
    let areas = Array.from(layer.areas);

    if (mode === 'isometric') {
      areas = areas.sort(
        (a, b) => BIOMES[a.biome].thickness - BIOMES[b.biome].thickness
      );
    }

    return areas;
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
  const SvgArea = mode === 'flat' ? SvgFlatArea : SvgIsometricArea;

  return (
    <svg
      width={(size.w + 1) * tileSize}
      height={(size.h + 1) * tileSize}
      viewBox={`0 0 ${size.w + 1} ${size.h + 1}`}
    >
      { areas.map(area => (
        <SvgArea key={area.id} bbox={bbox} area={area} />
      )) }
    </svg>
  );
};

export default SvgLayer;
