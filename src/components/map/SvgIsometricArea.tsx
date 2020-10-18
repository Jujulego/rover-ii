import React, { FC, useMemo } from 'react';

import { BIOMES } from 'src/biomes';
import { ISOMETRIC_THICKNESS, ISOMETRIC_WIDTH_FACTOR } from 'src/constants';
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
  const { paths: [zone, ...internals], abox } = useMemo(() => {
    const [zone, ...internals] = area.borders();

    const abox = zone.bbox;
    const w = ISOMETRIC_WIDTH_FACTOR * .5;
    const h = .5;
    const z = biome.thickness * ISOMETRIC_THICKNESS;

    return {
      paths: [zone, ...internals].map(b => b.renderIsometricZone(0, 0, z)),
      abox: new Rect(
        (abox.t + abox.l) * h - z,
        (abox.l - abox.b - 1) * w,
        (abox.b + abox.r) * h + 1 - z,
        (abox.r - abox.t + 1) * w
      )
    };
  }, [area, biome]);

  // Rendering
  return (
    <g id={`iso-area-${area.id}`} transform={`matrix(1, 0, 0, 1, ${-bbox.l}, ${-bbox.t})`}>
      <mask id={`iso-mask-${area.id}`}>
        <path d={zone} fill="white" />
        { internals.map((int, i) => (
          <path key={i} d={int} fill="black" />
        )) }
      </mask>

      <rect
        x={abox.l} width={abox.w}
        y={abox.t} height={abox.h}
        mask={`url(#iso-mask-${area.id})`}
        fill={biome.color}
      />
    </g>
  );
};

export default SvgIsometricArea;
