import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

import { makeStyles } from '@material-ui/core/styles';

import { NULL_VECTOR, Vector } from 'src/utils/math2d';

import { LayerContext } from './layer.context';

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
}

// Component
const LayerContainer: FC<LayerContainerProps> = (props) => {
  const {
    center = NULL_VECTOR, zoom = 1, tileSize,
    children
  } = props;

  // State
  const [containerSize, setContainerSize] = useState({ w: 1000, h: 200 });

  // Ref
  const observerRef = useRef<ResizeObserver>();

  // Memo
  const matrix = useMemo(
    () => `matrix(${zoom}, 0, 0, ${zoom}, ${(-center.x - .5) * tileSize}, ${(-center.y - .5) * tileSize})`,
    [zoom, center.x, center.y, tileSize]
  );

  // Effects
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => observerRef.current?.disconnect();
  }, []);

  // Callbacks
  const handleContainerRef = useCallback((container: HTMLDivElement) => {
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
        <LayerContext.Provider value={{ center, containerSize, tileSize }}>
          { children }
        </LayerContext.Provider>
      </div>
    </div>
  );
}

export default LayerContainer;
