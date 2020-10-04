import React, { FC, useMemo } from 'react';
import { green, red } from '@material-ui/core/colors';

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

  const [zone, ...internals] = useMemo(() => {
    const borders = area.borders();
    console.log(...borders.map(b => b.item(0)));

    return borders.map(b => b.renderFlatZone(-bbox.l, -bbox.t));
  }, [area, bbox.l, bbox.t]);

  // Rendering
  // if (area.id !== 1) return null;

  return (
    <g id={`flat-area-${area.id}`}>
      <path
        d={zone}
        fill={biome.color + '55'}
        stroke={red[500]}
        strokeWidth={.1}
        strokeLinecap="square"
      />
      <g fill="transparent" strokeLinecap="square">
        { internals.map((int, i) => (
          <path key={i} d={int} stroke={biome.color} strokeWidth={.3} />
        )) }
      </g>
    </g>
  );
};

export default SvgFlatArea;
