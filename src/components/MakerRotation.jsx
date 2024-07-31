// MarkerRotation.js

let animationFrameId = null;
let isAnimating = false;

export const rotateAroundMarker = (map, markerPosition, zoomLevel = 15.5, pitch = 75, rotationSpeed = 0.05) => {
  let angle = map.getBearing();

  const rotateCamera = () => {
    if (isAnimating) {
      map.rotateTo(angle, { duration: 0 });
      angle = (angle + rotationSpeed) % 360;
      animationFrameId = requestAnimationFrame(rotateCamera);
    }
  };

  // Stop any previous animation
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  map.flyTo({
    center: markerPosition,
    zoom: zoomLevel,
    pitch: pitch,
    essential: true,
    duration: 3000
  });

  // Commencer la rotation une fois le zoom terminé
  setTimeout(() => {
    isAnimating = true;
    rotateCamera();
  }, 3000);
};

export const stopRotation = () => {
  isAnimating = false;
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
};
