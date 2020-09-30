import React, { FC, useMemo } from 'react';
import { red } from '@material-ui/core/colors';

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

  const zone = useMemo(() => {
    return area.border().renderFlatZone(-bbox.l, -bbox.t)
  }, [area, bbox.l, bbox.t]);

  const points = useMemo(() => {
    const tiles = area.borderTiles();
    const border = area.border();
    let path = '';

    for (const tile of tiles) {
      //if (border.indexOf(tile.pos) !== -1) continue;
      path = `${path} M ${tile.pos.x - bbox.l + .5} ${tile.pos.y - bbox.t + .5} Z`;
    }

    return path;
  }, [area, bbox.l, bbox.t]);

  // Rendering
  return (
    <g>
      <path
        d={zone}
        fill={biome.color + '55'}
        stroke={red[500]}
        strokeWidth={.1}
        strokeLinecap="square"
      />
      <g fill="transparent" strokeLinecap="square">
        <path d={points} stroke={biome.color} strokeWidth={.2} />
      </g>
    </g>
  );
};

export default SvgFlatArea;
