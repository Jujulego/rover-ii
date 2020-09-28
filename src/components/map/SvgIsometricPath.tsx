import React, { FC, useMemo } from 'react';

import { BIOMES, BiomeName } from 'src/biomes';
import { Path } from 'src/maps/path';
import { Rect } from 'src/utils/math2d';

// Types
export interface SvgIsometricPathProps {
  bbox: Rect;
  path: Path;
  biome: BiomeName;
}

// Component
const SvgIsometricPath: FC<SvgIsometricPathProps> = (props) => {
  const { bbox, path, biome: name } = props;

  // Memo
  const biome = useMemo(() => BIOMES[name], [name]);

  const d = useMemo(
    () => path.renderIsometricZone(-bbox.l, -bbox.t, biome.thickness / 64),
    [path, bbox.l, bbox.t, biome]
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

export default SvgIsometricPath;
