// GlobeRotation.js

export const spinGlobe = (map, spinEnabled, userInteracting) => {
    const secondsPerRevolution = 240;
    const maxSpinZoom = 5;
    const slowSpinZoom = 3;

    
    const spin = () => {
      const zoom = map.getZoom();
      if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
        let distancePerSecond = 360 / secondsPerRevolution;
        if (zoom > slowSpinZoom) {
          const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
          distancePerSecond *= zoomDif;
        }
        const center = map.getCenter();
        center.lng -= distancePerSecond;
        map.easeTo({ center, duration: 1000, easing: (n) => n });
      }
    };
    
    map.on('mousedown', () => {
      userInteracting = true;
    });
    map.on('dragstart', () => {
      userInteracting = true;
    });
    map.on('moveend', () => {
      spin();
    });

    map.on('zoomstart', () => {
      userInteracting = true
    })
    
    spin();
  };
  