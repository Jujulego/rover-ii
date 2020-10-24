import React, { FC, MouseEvent, useCallback, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { BIOMES } from 'src/biomes';
import { ISOMETRIC_THICKNESS, ISOMETRIC_WIDTH_FACTOR } from 'src/constants';
import { Area } from 'src/maps/area';
import { Layer as LayerData } from 'src/maps/layer';
import { Rect, Size, Vector } from 'src/utils/math2d';

import { useLayer } from './layer.context';
import SvgFlatArea from './SvgFlatArea';
import SvgIsometricArea from './SvgIsometricArea';
import SvgIsometricSide from './SvgIsometricSide';

// Types
export interface SvgLayerProps {
  layer: LayerData;
  onTileClick?: (position: Vector) => void;
}

// Styles
const useStyles = makeStyles(({ transitions }) => ({
  layer: {
    transition: transitions.create('transform', { duration: transitions.duration.complex })
  }
}));

// Component
const SvgLayer: FC<SvgLayerProps> = (props) => {
  const { layer, onTileClick } = props;

  // Context
  const { center, mode, tileSize, computeMouseCoord } = useLayer();

  // Memo
  const { bbox, size } = useMemo(() => {
    const bbox = layer.bbox;
    const size = bbox.size;

    if (mode === 'flat') {
      return { bbox, size };
    } else {
      const w = (size.w + 1) * ISOMETRIC_WIDTH_FACTOR;
      const h = size.h + 1;

      return {
        bbox: new Rect(-1, -w / 2, h, w / 2),
        size: new Size(w - 1, h)
      }
    }
  }, [layer, mode]);

  const transform = useMemo(() => {
    if (mode === 'flat') {
      return `matrix(1, 0, 0, 1, -${.5 * tileSize}, -${.5 * tileSize})`;
    } else {
      const tile = layer.tile(center);
      const z = tile ? BIOMES[tile.biome].thickness * ISOMETRIC_THICKNESS : 0;

      return `matrix(1, 0, 0, 1, -${(size.w + 1) / 2 * tileSize}, -${(1.5 - z) * tileSize})`;
    }
  }, [center, layer, mode, size, tileSize]);

  const [areas, floor] = useMemo(() => {
    if (mode === 'isometric') {
      const areas: Area[] = [];
      const floor: Area[] = [];

      for (const area of layer.areas) {
        const biome = BIOMES[area.biome];

        if (biome.thickness === 0) {
          floor.push(area);
        } else {
          areas.push(area);
        }
      }

      return [areas, floor];
    }

    return [layer.areas, []];
  }, [layer, mode]);

  // Callbacks
  const handleClick = useCallback((event: MouseEvent) => {
    // Emit event
    if (onTileClick) {
      onTileClick(computeMouseCoord(event));
    }
  }, [onTileClick, computeMouseCoord]);

  // Render
  const styles = useStyles();
  const SvgArea = mode === 'flat' ? SvgFlatArea : SvgIsometricArea;

  return (
    <svg className={styles.layer}
      width={(size.w + 1) * tileSize}
      height={(size.h + 1) * tileSize}
      viewBox={`0 0 ${size.w + 1} ${size.h + 1}`}
      style={{ transform }}
      onClick={handleClick}
    >
      { floor.map(area => (
        <SvgArea key={area.id} bbox={bbox} area={area} />
      )) }
      { mode === 'isometric' && areas.map(area => (
        <SvgIsometricSide key={area.id} bbox={bbox} area={area} />
      )) }
      { areas.map(area => (
        <SvgArea key={area.id} bbox={bbox} area={area} />
      )) }
    </svg>
  );
};

export default SvgLayer;
