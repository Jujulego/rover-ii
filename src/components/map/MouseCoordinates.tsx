import React, { FC, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { makeStyles } from '@material-ui/core/styles';

import { NULL_VECTOR, Vector } from 'src/utils/math2d';

import { useLayer } from './layer.context';

// Styles
const useStyle = makeStyles(({ spacing }) => ({
  coordinates: {
    position: 'fixed',
    top: spacing(1),
    left: spacing(1),
  }
}));

// Component
const MouseCoordinates: FC = () => {
  // Context
  const { computeMouseCoord } = useLayer();

  // State
  const [pos, setPos] = useState<Vector>(NULL_VECTOR);

  // Effect
  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      setPos(computeMouseCoord(event));
    };

    document.addEventListener('mousemove', handleMove);

    return () => {
      document.removeEventListener('mousemove', handleMove);
    }
  }, [computeMouseCoord]);

  // Rendering
  const styles = useStyle();

  return createPortal(
    <div className={styles.coordinates}>
      ({ pos.x },{ pos.y })
    </div>,
    document.body
  );
};

export default MouseCoordinates;
