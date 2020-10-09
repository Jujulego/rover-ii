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

  // Rendering
  const w = ISOMETRIC_WIDTH_FACTOR * .5;
  const z = biome.thickness * ISOMETRIC_THICKNESS;

  return (
    <g id={`iso-side-${area.id}`} transform={`matrix(1, 0, 0, 1, ${-bbox.l}, ${-bbox.t})`}>
      <g fill='red'>
        { useMemo(() => area.isometricSide(DIRECTIONS.RIGHT), [area])
          .map((r, i) => (
            <path key={i} d={
              `M ${(r.l - r.t + 1) * w} ${(r.l + r.t + 1) * .5 - z} ` +
              `v ${z} ` +
              `L ${(r.r - r.b) * w} ${(r.r + r.b + 2) * .5}` +
              `v ${-z} ` +
              `Z`
            } />
          ))
        }
      </g>

      <g fill='purple'>
        { useMemo(() => area.isometricSide(DIRECTIONS.BOTTOM), [area])
          .map((r, i) => (
            <path key={i} d={
              `M ${(r.l - r.t - 1) * w} ${(r.l + r.t + 1) * .5 - z} ` +
              `v ${z} ` +
              `L ${(r.r - r.b) * w} ${(r.r + r.b + 2) * .5}` +
              `v ${-z} ` +
              `Z`
            } />
          ))
        }
      </g>
    </g>
  );
};

export default SvgIsometricSide;
