import React, { FC, MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

import { makeStyles } from '@material-ui/core/styles';

import { ISOMETRIC_WIDTH_FACTOR } from 'src/constants';
import { NULL_RECT, NULL_VECTOR, Rect, Vector } from 'src/utils/math2d';

import { LayerContext, LayerMode } from './layer.context';

// Styles
const useStyles = makeStyles(({ palette, transitions }) => ({
  container: {
    display: 'flex',
    height: '100%',
    width: '100%',

    backgroundColor: palette.background.default,
    overflow: 'hidden'
  },
  map: {
    position: 'relative',
    height: 0,
    width: 0,
    margin: 'auto',

    transition: transitions.create('transform', { duration: transitions.duration.complex })
  }
}));

// Props
export interface LayerContainerProps {
  center?: Vector;
  zoom?: number;
  tileSize: number;
  mode?: LayerMode;
}

// Component
const LayerContainer: FC<LayerContainerProps> = (props) => {
  const {
    center = NULL_VECTOR, zoom = 1, tileSize,
    mode = 'flat',
    children
  } = props;

  // State
  const [container, setContainer] = useState(NULL_RECT);

  // Ref
  const observerRef = useRef<ResizeObserver>();

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

  const matrix = useMemo(() => {
    const x = center.x;
    const y = center.y;

    if (mode === 'isometric') {
      const wi = ISOMETRIC_WIDTH_FACTOR;
      const z = 0;

      return `matrix(${zoom}, 0, 0, ${zoom}, ${-(x - y) * wi * tileSize * .5}, ${-(x + y + z) * tileSize * .5})`;
    }

    return `matrix(${zoom}, 0, 0, ${zoom}, ${(-x - .5) * tileSize}, ${(-y - .5) * tileSize})`;
  }, [zoom, center.x, center.y, tileSize, mode]);

  // Effects
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => observerRef.current?.disconnect();
  }, []);

  // Callbacks
  const computeMouseTile = useCallback((event: MouseEvent): Vector => {
    // Compute tile coordinates
    const pos = new Vector(event.clientX, event.clientY).sub(origin);

    if (mode === 'isometric') {
      const { x: xi, y: yi } = pos;
      const wi = ISOMETRIC_WIDTH_FACTOR;

      pos.x = yi + (xi / wi);
      pos.y = yi - (xi / wi);
    }

    pos.x = Math.floor(pos.x / tileSize);
    pos.y = Math.floor(pos.y / tileSize);

    return pos;
  }, [mode, origin, tileSize]);

  const handleContainerRef = useCallback((container: HTMLDivElement) => {
    if (!container) return;

    // Observe component size
    const obs = new ResizeObserver(entries => {
      const target = entries[0].target as HTMLDivElement;

      setContainer(new Rect(
        target.offsetTop,
        target.offsetLeft,
        target.offsetTop + target.offsetHeight,
        target.offsetLeft + target.offsetWidth,
      ));
    });

    obs.observe(container);

    // Replace old observer
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = obs;
  }, [setContainer]);

  // Render
  const styles = useStyles();

  return (
    <div ref={handleContainerRef} className={styles.container}>
      <div className={styles.map} style={{ transform: matrix }}>
        <LayerContext.Provider value={{ mode, center, container, tileSize, computeMouseTile }}>
          { children }
        </LayerContext.Provider>
      </div>
    </div>
  );
}

export default LayerContainer;
