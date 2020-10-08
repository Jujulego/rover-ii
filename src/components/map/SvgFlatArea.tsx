import React, { FC, useMemo } from 'react';
import { green, purple, red } from '@material-ui/core/colors';

import { BIOMES } from 'src/biomes';
import { Area } from 'src/maps/area';
import { Rect } from 'src/utils/math2d';

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

  const [zone, ...internals] = useMemo(
    () => area.borders().map(b => b.renderFlatZone(-bbox.l, -bbox.t)),
    [area, bbox.l, bbox.t]
  );

  // Rendering
  return (
    <g id={`flat-area-${area.id}`}>
      <mask id={`flat-mask-${area.id}`}>
        <path d={zone} fill="white" />
        { internals.map((int, i) => (
          <path key={`i${i}`} d={int} fill="black" />
        )) }
      </mask>
      <rect x={0} y={0} width={bbox.r - bbox.l + 1} height={bbox.b - bbox.t + 1} mask={`url(#flat-mask-${area.id})`} fill={biome.color} />
    </g>
  );
};

export default SvgFlatArea;
