import React, { FC } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import { NULL_VECTOR, Vector } from 'src/utils/math2d';

// Styles
const useStyles = makeStyles(({ palette }) => ({
  container: {
    height: '100%',
    width: '100%',

    backgroundColor: palette.background.default,
    overflow: 'hidden'
  },
  map: {
    position: 'relative'
  }
}));

// Props
export interface LayerContainerProps {
  center?: Vector;
  size: number;
}

// Component
const LayerContainer: FC<LayerContainerProps> = (props) => {
  const {
    center = NULL_VECTOR, size,
    children
  } = props;

  // Render
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <div className={styles.map} style={{ transform: `translate(${(-center.x - .5) * size}px, ${(-center.y - .5) * size}px)`}}>
        { children }
      </div>
    </div>
  );
}

export default LayerContainer;
