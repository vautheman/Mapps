import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";

import { SearchBox } from "@mapbox/search-js-react";
import useFetchAllLocations from "./api/useFetchAllLocations";
import DetailsMaker from "./components/DetailsMaker";
import { spinGlobe } from "./components/GlobeRotation";
import { RiMoonLine, RiSettings4Line, RiSunLine } from "@remixicon/react";
import Story from "./components/sidebar/Story";
import { addMarker } from "./utils/mapUtils";
import List from "./components/sidebar/List";
import PostLocation from "./api/PostLocation";

const App = () => {

  const mapContainerRef = useRef();
  const mapInstanceRef = useRef();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const { locations, loading, error } = useFetchAllLocations();
  const [userCoordinates, setUserCoordinates] = useState(null);
  const [searchResult, setSearchResult] = useState(null);

  const markerRefs = useRef({}); // Référence pour stocker les marqueurs par ID
  const [markerSelected, setMarkerSelected] = useState(null)
  // Rotation globe
  const [userInteracting] = useState(false);
  const [spinEnabled] = useState(true);
  // Time set
  const [time, setTime] = useState('day');
  const [darkMode, setDarkMode] = useState(() => {
    localStorage.getItem('darkMode') === false
  })

  // Dark Mode
  useEffect(() => {
    // Sauvegardez la préférence dans le local storage
    localStorage.setItem('darkMode', darkMode);
    // Ajoutez ou retirez la classe 'dark' sur le body
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Utiliser l'API Geolocation pour obtenir les coordonnées de l'utilisateur
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserCoordinates([longitude, latitude]);
        },
        (error) => {
          console.error("Error obtaining geolocation", error);
          // Fallback coordinates if geolocation fails
          setUserCoordinates([-74.5, 40]);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      // Fallback coordinates if geolocation is not supported
      setUserCoordinates([-74.5, 40]);
    }
  }, []);

  useEffect(() => {
    if (!userCoordinates) return;
    
    // Token access mapbox api
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN_PUBLIC;
    
    // Instance de la carte
    mapInstanceRef.current = new mapboxgl.Map({
      container: mapContainerRef.current, // container ID
      center: userCoordinates, // starting position [lng, lat]
      zoom: 2.5, // starting zoom
      minZoom: 2,
      language: 'fr',
      antialias: true,
    })
    .addControl(new mapboxgl.NavigationControl())

    // Spin Globe Fonction
    spinGlobe(mapInstanceRef.current, spinEnabled, userInteracting);


    // Click on map instance
    mapInstanceRef.current.on("click", (e) => {
      e.preventDefault()
      setMarkerSelected(null)
      setSearchResult('')
    })

    // 3D Buildings
    mapInstanceRef.current.on('style.load', () => {
        const layers = mapInstanceRef.current.getStyle().layers;
        const labelLayer = layers.find(
            (layer) => layer.type === 'symbol' && layer.layout['text-field']
        );

        if (!labelLayer) {
          return;
        }

        const labelLayerId = labelLayer.id;

        mapInstanceRef.current.addLayer(
            {
                id: 'add-3d-buildings',
                source: 'composite',
                'source-layer': 'building',
                filter: ['==', 'extrude', 'true'],
                type: 'fill-extrusion',
                minzoom: 15,
                paint: {
                    'fill-extrusion-color': '#aaa',
                    'fill-extrusion-height': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        15,
                        0,
                        15.05,
                        ['get', 'height']
                    ],
                    'fill-extrusion-base': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        15,
                        0,
                        15.05,
                        ['get', 'min_height']
                    ],
                    'fill-extrusion-opacity': 0.6
                }
            },
            labelLayerId
        );
    });

    // On map instance is loaded ?
    mapInstanceRef.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => mapInstanceRef.current.remove();
  }, [userCoordinates, spinEnabled, userInteracting]);

  useEffect(() => {
    if(mapLoaded && time) {
        mapInstanceRef.current.setConfigProperty('basemap', 'lightPreset', time)
    }
  }), [time]

  /* GET DATA API */
  // Markers
  useEffect(() => {
    if (loading || error || !mapInstanceRef.current) return;
    locations.forEach(location => {
      addMarker(location, markerRefs, mapInstanceRef, setMarkerSelected)
    });

  }, [locations, loading, error]);


  return (
    <>
      <div className="absolute top-5 left-5 bottom-5 z-20 w-80 flex flex-col justify-between gap-5">
        <SearchBox
            accessToken={mapboxgl.accessToken}
            map={mapInstanceRef.current}
            mapboxgl={mapboxgl}
            value={null}
            placeholder="Rechercher"
            options={{
            language: "fr",
            /* country: "FR", */
            }}
            onChange={(d) => {
                setInputValue(d);
            }}
            marker
            onRetrieve={(res) => {
              console.log('Retrieved result:', res);
              setSearchResult(res)
            }}
        />

        <div className="flex-1 overflow-y-auto">
          <div className="backdrop-blur-md bg-white/50 dark:bg-slate-800/50 dark:text-white rounded-md p-3 overflow-x-hidden">
            {searchResult &&
              <div>
                <h3 className="text-2xl font-bold">{searchResult.features[0].properties.name}</h3>
                <h4>{searchResult.features[0].properties.place_formatted}</h4>
                <p>{searchResult.features[0].geometry.coordinates[0]}, {searchResult.features[0].geometry.coordinates[1]}</p>
                <PostLocation newLocation={searchResult.features[0]} markerRefs={markerRefs} mapInstanceRef={mapInstanceRef} setMarkerSelected={setMarkerSelected} />
              </div>
            }

            {
              markerSelected && 
              <DetailsMaker id={markerSelected} markerRefs={markerRefs} map={mapInstanceRef} />
            }

            {
              !markerSelected && !searchResult &&
              <>
                <Story locations={locations} markerRefs={markerRefs} map={mapInstanceRef} setMarkerSelected={setMarkerSelected} />
                <List locations={locations} markerRefs={markerRefs} map={mapInstanceRef} setMarkerSelected={setMarkerSelected} />
              </>
            }
          </div>
        </div>

        <div className="flex gap-2">
          <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-md aspect-square w-12 flex items-center justify-center rounded-md">
            <RiSettings4Line className="dark:fill-white" />
          </div>
          <div onClick={() => (setTime((time) => time === 'day' ? 'dusk' : 'day'), setDarkMode(darkMode => !darkMode))} className="bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 hover:dark:bg-slate-800 backdrop-blur-md transition-all duration-100 aspect-square w-12 flex items-center justify-center rounded-md cursor-pointer">
            {
              !darkMode ? <RiSunLine className="dark:fill-white" /> : <RiMoonLine className="dark:fill-white" />
            }
          </div>
        </div>
      </div>
      <div ref={mapContainerRef} className="map-container w-screen h-screen" />
    </>
  );
};

export default App;
