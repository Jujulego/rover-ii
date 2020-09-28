import React, { FC, useMemo } from 'react';

import { BIOMES, BiomeName } from 'src/biomes';
import { Path } from 'src/maps/path';
import { Rect } from 'src/utils/math2d';

// Types
export interface SvgFlatPathProps {
  bbox: Rect;
  path: Path;
  biome: BiomeName;
}

// Component
const SvgFlatPath: FC<SvgFlatPathProps> = (props) => {
  const { bbox, path, biome: name } = props;

  // Memo
  const biome = useMemo(() => BIOMES[name], [name]);

  const d = useMemo(
    () => path.renderFlatZone(-bbox.l, -bbox.t),
    [path, bbox.l, bbox.t]
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

export default SvgFlatPath;
