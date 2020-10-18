import React, { FC, useMemo } from 'react';

import { BIOMES } from 'src/biomes';
import { DIRECTIONS, ISOMETRIC_THICKNESS, ISOMETRIC_WIDTH_FACTOR } from 'src/constants';
import { Area } from 'src/maps/area';
import { Rect } from 'src/utils/math2d';

// Types
export interface SvgIsometricSideProps {
  bbox: Rect;
  area: Area;
}

// Component
const SvgIsometricSide: FC<SvgIsometricSideProps> = (props) => {
  const { bbox, area } = props;

  // Memo
  const biome = useMemo(() => BIOMES[area.biome], [area]);

  const rights = useMemo(() => {
    const w = ISOMETRIC_WIDTH_FACTOR * .5;
    const z = biome.thickness * ISOMETRIC_THICKNESS;

    return area.isometricSide(DIRECTIONS.RIGHT)
      .reduce((p, r) => p +
        `M ${(r.l - r.t + 1) * w - bbox.l} ${(r.l + r.t + 1) * .5 - bbox.t - z} ` +
        `v ${z} ` +
        `L ${(r.r - r.b) * w - bbox.l} ${(r.r + r.b + 2) * .5 - bbox.t}` +
        `v ${-z} ` +
        `Z`, ''
      );
  }, [area, biome, bbox]);

  const bottoms = useMemo(() => {
    const w = ISOMETRIC_WIDTH_FACTOR * .5;
    const z = biome.thickness * ISOMETRIC_THICKNESS;

    return area.isometricSide(DIRECTIONS.BOTTOM)
      .reduce((p, r) => p +
        `M ${(r.l - r.t - 1) * w - bbox.l} ${(r.l + r.t + 1) * .5 - bbox.t - z} ` +
        `v ${z} ` +
        `L ${(r.r - r.b) * w - bbox.l} ${(r.r + r.b + 2) * .5 - bbox.t}` +
        `v ${-z} ` +
        `Z`, ''
      );
  }, [area, biome, bbox]);

  // Rendering
  return (
    <g id={`iso-side-${area.id}`}>
      <path d={rights} fill={biome.colors.shadow2} />
      <path d={bottoms} fill={biome.colors.shadow1} />
    </g>
  );
};

export default SvgIsometricSide;
