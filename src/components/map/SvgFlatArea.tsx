import React, { FC, useMemo } from 'react';

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

  const d = useMemo(
    () => area.border().renderFlatZone(-bbox.l, -bbox.t),
    [area, bbox.l, bbox.t]
  );

  return (
    <path
      d={d}
      fill={biome.color + '55'}
    />
  );
};

export default SvgFlatArea;
