import React, { FC, useMemo } from 'react';

import { BIOMES } from 'src/biomes';
import { Area } from 'src/maps/area';
import { Rect } from 'src/utils/math2d';
import { DIRECTIONS } from '../../constants';

// Types
export interface SvgFlatAreaProps {
  bbox: Rect;
  area: Area;
}

// Component
const SvgFlatArea: FC<SvgFlatAreaProps> = (props) => {
  const { bbox, area } = props;

  // Memo
  const biome = useMemo(() => BIOMES[area.biome], [area]);
  const { paths: [zone, ...internals], abox } = useMemo(() => {
    const [zone, ...internals] = area.borders();

    return {
      paths: [zone, ...internals].map(b => b.renderFlatZone(-bbox.l, -bbox.t)),
      abox: zone.bbox
    };
  }, [area, bbox.l, bbox.t]);

  // Rendering
  return (
    <g id={`flat-area-${area.id}`}>
      <mask id={`flat-mask-${area.id}`}>
        <path d={zone} fill="white" />
        { internals.map((int, i) => (
          <path key={i} d={int} fill="black" />
        )) }
      </mask>
      <rect
        x={abox.l} width={abox.w + 1}
        y={abox.t} height={abox.h + 1}
        mask={`url(#flat-mask-${area.id})`}
        fill={biome.color}
      />
    </g>
  );
};

export default SvgFlatArea;
