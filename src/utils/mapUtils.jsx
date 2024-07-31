// utils/mapUtils.js

import { renderToStaticMarkup } from "react-dom/server";
import ClickableMarker from "../class/ClickableMarker";
import HeartMarker from "../components/markers/HeartMarker";
import ImageMarker from "../components/markers/ImageMarker";
import ParcMarker from "../components/markers/ParcMarker";
import CampingMarker from "../components/markers/CampingMarker";

export const simulateMarkerClick = (id, markerRefs, mapInstanceRef, setMarkerSelected) => {
    const marker = markerRefs.current[id];
    if (marker && mapInstanceRef.current) {
      marker._onMapClick({
        originalEvent: { target: marker.getElement() }
      });
      setMarkerSelected(id);
    }
};

export const addMarker = (location, markerRefs, mapInstanceRef, setMarkerSelected) => {
  
    console.log('addMarker location :')
    console.log(location)

    const el = document.createElement('div');
    let markerHTML = ''; // stock les marqueurs

    switch (location.attributes.type) {
      case 'image' : {
        el.className = 'z-10'
        markerHTML = renderToStaticMarkup(<ImageMarker location={location} />)

        const marker = new ClickableMarker(el)
          .setLngLat([location.attributes.longitude, location.attributes.latitude])
          .onClick(() => {setMarkerSelected(location.id), marker.markerAnimation(location)})
          .addTo(mapInstanceRef.current);

        markerRefs.current[location.id] = marker;
        
        break
      }
      case 'heart' : {
        markerHTML = renderToStaticMarkup(<HeartMarker location={location} size={15} />)

        const marker = new ClickableMarker(el)
          .setLngLat([location.attributes.longitude, location.attributes.latitude])
          .onClick(() => {setMarkerSelected(location.id), marker.markerAnimation(location)})
          .addTo(mapInstanceRef.current)

        markerRefs.current[location.id] = marker;

        break
      }

      case 'parc' : {
        markerHTML = renderToStaticMarkup(<ParcMarker location={location} size={15} />)

        const marker = new ClickableMarker(el)
          .setLngLat([location.attributes.longitude, location.attributes.latitude])
          .onClick(() => {setMarkerSelected(location.id), marker.markerAnimation(location)})
          .addTo(mapInstanceRef.current)

        markerRefs.current[location.id] = marker;

        break
      }

      case 'camping' : {
        markerHTML = renderToStaticMarkup(<CampingMarker location={location} size={15} />)

        const marker = new ClickableMarker(el)
          .setLngLat([location.attributes.longitude, location.attributes.latitude])
          .onClick(() => {setMarkerSelected(location.id), marker.markerAnimation(location)})
          .addTo(mapInstanceRef.current)

        markerRefs.current[location.id] = marker;

        break
      }
      default : {
        new ClickableMarker()
          .setLngLat([location.attributes.longitude, location.attributes.latitude])
          .addTo(mapInstanceRef.current);
      }
    }

    el.innerHTML = markerHTML;
};

export const removeMarker = (id, markerRefs, mapInstanceRef) => {
  const marker = markerRefs.current[id];
  if (marker) {
    if (mapInstanceRef.current) {
      console.log(marker)
      marker.remove(); // Retire le marqueur de la carte
      delete markerRefs.current[id]; // Supprime la référence du marqueur
    } else console.warn('Instance de la carte non disponible');
  } else console.warn('Marker non trouvé sur la carte:', id);
};