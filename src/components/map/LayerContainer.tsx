import React, { FC, useMemo } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import { NULL_VECTOR, Vector } from 'src/utils/math2d';

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
  size: number;
}

// Component
const LayerContainer: FC<LayerContainerProps> = (props) => {
  const {
    center = NULL_VECTOR, zoom = 1, size,
    children
  } = props;

  // Memo
  const matrix = useMemo(
    () => `matrix(${zoom}, 0, 0, ${zoom}, ${(-center.x - .5) * size}, ${(-center.y - .5) * size})`,
    [zoom, center.x, center.y, size]
  )

  // Render
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <div className={styles.map} style={{ transform: matrix }}>
        { children }
      </div>
    </div>
  );
}

export default LayerContainer;
