import React, { FC } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Tile from 'src/components/map/Tile';

import { Layer } from 'src/maps/layer';
import { NULL_VECTOR, Vector } from 'src/utils/math2d';

// Styles
const useStyles = makeStyles({
  container: {
    display: 'flex',
    height: '100%',
    width: '100%',
    overflow: 'hidden'
  },
  map: {
    position: 'relative',

    margin: 'auto'
  }
});

// Props
export interface MapProps {
  center?: Vector;
  layer: Layer;
}

// Component
const Map: FC<MapProps> = (props) => {
  const {
    center = NULL_VECTOR,
    layer
  } = props;

  // Render
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <div className={styles.map} style={{ transform: `translate(${-center.x * 64}px, ${center.y * 64}px)`}}>
        { layer.tiles.map((tile, i) => (
          <Tile key={i} x={tile.pos.x} y={tile.pos.y} biome={tile.biome} />
        )) }
      </div>
    </div>
  );
}

export default Map;
