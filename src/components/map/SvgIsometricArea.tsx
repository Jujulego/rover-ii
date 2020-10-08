import React, { FC, useMemo } from 'react';
import { purple, red } from '@material-ui/core/colors';

import { BIOMES } from 'src/biomes';
import { Area } from 'src/maps/area';
import { Rect } from 'src/utils/math2d';

// Types
export interface SvgIsometricAreaProps {
  bbox: Rect;
  area: Area;
}

// Component
const SvgIsometricArea: FC<SvgIsometricAreaProps> = (props) => {
  const { bbox, area } = props;

  // Memo
  const biome = useMemo(() => BIOMES[area.biome], [area]);

  const [zone, ...internals] = useMemo(() => {
    return area.borders().map(b => b.renderIsometricZone(-bbox.l, -bbox.t, biome.thickness / 64));
  }, [area, biome, bbox.l, bbox.t]);

  return (
    <g id={`iso-area-${area.id}`}>
      <mask id={`iso-mask-${area.id}`}>
        <path d={zone} fill="white" />
        { internals.map((int, i) => (
          <path key={`i${i}`} d={int} fill="black" />
        )) }
      </mask>
      <rect x={0} y={0} width={bbox.r - bbox.l + 1} height={bbox.b - bbox.t + 1} mask={`url(#iso-mask-${area.id})`} fill={biome.color} />
    </g>
  );
};

export default SvgIsometricArea;
