import React, { FC, useCallback, useState } from 'react';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';

import { Layer } from 'src/maps/layer';

import Map from './map/Map';
import MiniMap from './map/MiniMap';

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
    height: 100,
    width: 100,

    borderRadius: 50,
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
  layer: Layer;
  className?: string;
}

// Component
const Navigator: FC<NavigatorProps> = (props) => {
  const {
    layer,
    className
  } = props;

  // State
  const [center, setCenter] = useState({ x: 0, y: 0 });
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
        <Map
          center={center} layer={layer}
          onTileClick={setCenter}
        />
      </div>

      <div
        className={clsx(styles.miniMap, { open: openMiniMap })}
        onClick={handleToggleMiniMap}
      >
        <MiniMap center={center} layer={layer} />
      </div>
    </div>
  );
};

export default Navigator;
