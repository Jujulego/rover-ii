import React, { FC, useCallback, useMemo } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import { BIOMES, BiomeName } from 'src/biomes';
import { Vector } from 'src/utils/math2d';
import { useLayer } from './layer.context';

// Styles
const useStyles = makeStyles({
  tile: {
    position: 'absolute'
  },
  floor: {
    width: '102%'
  }
});

// Types
export interface IsometricTileProps {
  x: number; y: number;
  biome: BiomeName;
  onClick?: (position: Vector) => void;
}

// Component
const IsometricTile: FC<IsometricTileProps> = (props) => {
  // Props
  const {
    x, y,
    biome,
    onClick
  } = props;

  // Context
  const { tileSize: size } = useLayer();

  // Memo
  const { height, width, thickness } = useMemo(() => {
    const width = size * Math.tan(Math.PI / 3);
    const height = width * 64 / 132;
    const thickness = width * BIOMES[biome].thickness / 132;

    return { height, width, thickness };
  }, [size, biome]);

  const style = useMemo(() => ({
    height: height,
    width:  width,
    left:   (x - y) * width * .5,
    top:    (x + y) * (height * .5 + 1) - thickness,
    zIndex: x + y
  }), [x, y, width, height, thickness]);

  // Callbacks
  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(new Vector(x, y));
    }
  }, [onClick, x, y]);

  // Render
  const styles = useStyles();

  return (
    <div
      className={styles.tile} style={style}
      onClick={handleClick}
    >
      <img className={styles.floor} src={BIOMES[biome].isometric.url} alt={biome} />
    </div>
  );
};

export default IsometricTile;
