import React, { FC, useMemo } from 'react';

import { Layer as LayerData } from 'src/maps/layer';

import { useLayer } from './layer.context';
import SvgFlatArea from './SvgFlatArea';
import SvgIsometricArea from './SvgIsometricArea';
import { Rect, Size } from '../../utils/math2d';
import { BIOMES } from '../../biomes';

// Types
export interface SvgLayerProps {
  layer: LayerData;
}

// Component
const SvgLayer: FC<SvgLayerProps> = (props) => {
  const { layer } = props;

  // Context
  const { tileSize, mode } = useLayer();

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

  const transform = useMemo(() => {
    if (mode === 'flat') {
      return `matrix(1, 0, 0, 1, -${.5 * tileSize}, -${.5 * tileSize})`;
    } else {
      return `matrix(1, 0, 0, 1, -${size.w / 2 * tileSize}, -${1.5 * tileSize})`;
    }
  }, [mode, size, tileSize]);

  // Render
  const SvgArea = mode === 'flat' ? SvgFlatArea : SvgIsometricArea;

  return (
    <svg
      width={(size.w + 1) * tileSize}
      height={(size.h + 1) * tileSize}
      viewBox={`0 0 ${size.w + 1} ${size.h + 1}`}
      style={{ transform }}
    >
      { areas.map(area => (
        <SvgArea key={area.id} bbox={bbox} area={area} />
      )) }
    </svg>
  );
};

export default SvgLayer;
