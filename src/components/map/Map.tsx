import React, { FC } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Tile from 'src/components/map/Tile';

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
  center?: {
    x: number,
    y: number
  }
}

// Component
const Map: FC<MapProps> = (props) => {
  const {
    center = { x: 0, y: 0 }
  } = props;

  // Render
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <div className={styles.map} style={{ transform: `translate(${-center.x * 64}px, ${center.y * 64}px)`}}>
        <Tile x={0} y={0} biome='rock' />
        <Tile x={1} y={0} biome='rock' />
        <Tile x={2} y={0} biome='rock' />
        <Tile x={0} y={1} biome='rock' />
        <Tile x={1} y={1} biome='rock' />
        <Tile x={2} y={1} biome='rock' />
        <Tile x={0} y={2} biome='rock' />
        <Tile x={1} y={2} biome='rock' />
        <Tile x={2} y={2} biome='rock' />
        <Tile x={5} y={1} biome='rock' />
      </div>
    </div>
  );
}

export default Map;
