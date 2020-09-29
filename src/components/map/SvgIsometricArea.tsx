import React, { FC, useMemo } from 'react';

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

  const d = useMemo(
    () => area.border().renderIsometricZone(-bbox.l, -bbox.t, biome.thickness / 64),
    [area, bbox.l, bbox.t, biome]
  );

  return (
    <path
      d={d}
      fill={biome.color}
      stroke="red"
      strokeLinecap="square"
      strokeWidth={.1}
    />
  );
};

export default SvgIsometricArea;
