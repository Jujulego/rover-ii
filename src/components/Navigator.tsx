import React, { FC, useCallback, useState } from 'react';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';

import { Layer as LayerData } from 'src/maps/layer';
import { Vector } from 'src/utils/math2d';

import Map from './map/Map';
import MiniMap from './map/MiniMap';
import MouseCoordinates from './map/MouseCoordinates';

// Styles
const useStyle = makeStyles(({ spacing, shadows, transitions }) => ({
  container: {
    position: 'relative'
  },
  map: {
    height: '100%'
  },
  miniMap: {
    position: 'absolute',
    top: spacing(2),
    right: spacing(2),
    zIndex: 10,
    height: 150,
    width: 150,

    borderRadius: 75,
    boxShadow: shadows[2],
    cursor: 'pointer',
    overflow: 'hidden',

    transition: transitions.create(
      ['top', 'right', 'height', 'width', 'border-radius'],
      { duration: transitions.duration.standard * 2 }
    ),

    '&.open': {
      top: 0,
      right: 0,
      width: '100%',
      height: '100%',
      borderRadius: 0
    }
  }
}));

// Types
export interface NavigatorProps {
  layer: LayerData;
  className?: string;
}

// Component
const Navigator: FC<NavigatorProps> = (props) => {
  const {
    layer,
    className
  } = props;

  // State
  const [center, setCenter] = useState(new Vector(0, 0));
  const [openMiniMap, setOpenMiniMap] = useState(false);

  // Callbacks
  const handleToggleMiniMap = useCallback(
    () => setOpenMiniMap(open => !open),
    [setOpenMiniMap]
  );

  // Render
  const styles = useStyle();

  return (
    <div className={clsx(styles.container, className)}>
      <div className={styles.map}>
        <Map layer={layer} center={center} onTileClick={setCenter} mode="isometric">
          <MouseCoordinates />
        </Map>
      </div>

      <div
        className={clsx(styles.miniMap, { open: openMiniMap })}
        onClick={handleToggleMiniMap}
      >
        <MiniMap layer={layer} center={center} />
      </div>
    </div>
  );
};

export default Navigator;
