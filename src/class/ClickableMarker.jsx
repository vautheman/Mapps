import mapboxgl from "mapbox-gl";
import { rotateAroundMarker, stopRotation } from "../components/MakerRotation";

// Ajoutez la classe ClickableMarker
class ClickableMarker extends mapboxgl.Marker {
  constructor(el) {
    super(el);
    this._map = null;
    this._handleClick = null;
  }

  // Set the map instance to use for animations
  setMap(map) {
    this._map = map;
    return this;
  }

  // new method onClick, sets _handleClick to a function you pass in
  onClick(handleClick) {
    this._handleClick = handleClick;
    return this;
  }

  // Override _onMapClick to include custom click behavior
  _onMapClick(e) {
    const targetElement = e.originalEvent.target;
    const element = this._element;
    element.classList.remove('marker-active');
    stopRotation()

    if (this._handleClick && (targetElement === element || element.contains(targetElement))) { 
      this._handleClick();
      this.addClassName('marker-active');
    }
  }

  // Expose a method to trigger the zoom and rotation animation
  markerAnimation(location) {
    if (!this._map) return;
    rotateAroundMarker(this._map, [location.attributes.longitude, location.attributes.latitude]);
  }
}

export default ClickableMarker;
