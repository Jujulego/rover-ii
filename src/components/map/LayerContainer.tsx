import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

import { makeStyles } from '@material-ui/core/styles';

import { NULL_SIZE, NULL_VECTOR, Vector } from 'src/utils/math2d';

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
  const [containerSize, setContainerSize] = useState(NULL_SIZE);

  // Ref
  const observerRef = useRef<ResizeObserver>();

  // Memo
  const matrix = useMemo(() => {
    const x = center.x;
    const y = center.y;

    if (mode === 'isometric') {
      const width = tileSize * Math.tan(Math.PI / 3);
      const height = width * 64 / 132;

      return `matrix(${zoom}, 0, 0, ${zoom}, ${-(x - y + 1) * width * .5}, ${-(x + y + 1) * (height * .5 + 1)})`;
    }

    return `matrix(${zoom}, 0, 0, ${zoom}, ${(-x - .5) * tileSize}, ${(-y - .5) * tileSize})`;
  }, [zoom, center.x, center.y, tileSize, mode]);

  // Effects
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => observerRef.current?.disconnect();
  }, []);

  // Callbacks
  const handleContainerRef = useCallback((container: HTMLDivElement) => {
    if (!container) return;

    // Observe component size
    const obs = new ResizeObserver(entries => {
      const rect = entries[0].contentRect;
      setContainerSize({ w: rect.width, h: rect.height });
    });

    obs.observe(container);

    // Replace old observer
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = obs;
  }, [setContainerSize]);

  // Render
  const styles = useStyles();

  return (
    <div ref={handleContainerRef} className={styles.container}>
      <div className={styles.map} style={{ transform: matrix }}>
        <LayerContext.Provider value={{ mode, center, containerSize, tileSize }}>
          { children }
        </LayerContext.Provider>
      </div>
    </div>
  );
}

export default LayerContainer;
