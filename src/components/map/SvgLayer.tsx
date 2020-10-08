import React, { FC, MouseEvent, useCallback, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { BIOMES } from 'src/biomes';
import { ISOMETRIC_MAX_THICKNESS, ISOMETRIC_WIDTH_FACTOR } from 'src/constants';
import { Layer as LayerData } from 'src/maps/layer';
import { Rect, Size, Vector } from 'src/utils/math2d';

import { useLayer } from './layer.context';
import SvgFlatArea from './SvgFlatArea';
import SvgIsometricArea from './SvgIsometricArea';

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
  const { center, container, mode, tileSize } = useLayer();

  // Memo
  const origin = useMemo(() => {
    let rc = center.mul(tileSize);

    if (mode === 'isometric') {
      const { x, y } = rc.add(tileSize * .5, tileSize * .5);
      const wi = ISOMETRIC_WIDTH_FACTOR;
      const z = tileSize;

      rc.x = (x - y) * wi * .5;
      rc.y = (x + y) * .5 - z;
    } else {
      rc = rc.add(tileSize, tileSize);
    }

    return container.tl
      .add(Vector.fromSize(container.size).div(2))
      .sub(rc);
  }, [center, container, mode, tileSize]);

  const areas = useMemo(() => {
    let areas = Array.from(layer.areas);

    if (mode === 'isometric') {
      areas = areas.sort(
        (a, b) => BIOMES[a.biome].thickness - BIOMES[b.biome].thickness
      );
    }

    return areas;
  }, [layer, mode]);

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
      const z = tile ? BIOMES[tile.biome].thickness / ISOMETRIC_MAX_THICKNESS : 0;

      return `matrix(1, 0, 0, 1, -${(size.w + 1) / 2 * tileSize}, -${(1.5 - z) * tileSize})`;
    }
  }, [center, layer, mode, size, tileSize]);

  // Callbacks
  const handleClick = useCallback((event: MouseEvent) => {
    // Compute tile coordinates
    let pos = new Vector(event.clientX, event.clientY).sub(origin);

    if (mode === 'isometric') {
      const { x: xi, y: yi } = pos;
      const wi = ISOMETRIC_WIDTH_FACTOR;

      pos.x = yi + (xi / wi);
      pos.y = yi - (xi / wi);
    }

    pos.x = Math.floor(pos.x / tileSize);
    pos.y = Math.floor(pos.y / tileSize);

    // Emit event
    if (onTileClick) {
      onTileClick(pos);
    }
  }, [mode, onTileClick, origin, tileSize]);

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
      { areas.map(area => (
        <SvgArea key={area.id} bbox={bbox} area={area} />
      )) }
    </svg>
  );
};

export default SvgLayer;
