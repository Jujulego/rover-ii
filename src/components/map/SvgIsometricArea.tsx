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
      <path
        d={zone}
        fill={biome.color}
        stroke={red[500]}
        strokeWidth={.1}
        strokeLinecap="square"
      />
      <g fill="transparent" strokeLinecap="square">
        { internals.map((int, i) => (
          <path key={i} d={int} stroke={purple[500]} strokeWidth={.3} />
        )) }
      </g>
    </g>
  );
};

export default SvgIsometricArea;
