import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "./api";
import HeartMarker from "../components/markers/HeartMarker";
import CampingMarker from "../components/markers/CampingMarker";
import ParcMarker from "../components/markers/ParcMarker";
import photoPaysage from '/paysage.webp'
import { addMarker, simulateMarkerClick } from "../utils/mapUtils";
import useFetchLocation from "./useFetchLocation";
import DragAndDropUploader from "../components/DragAndDropUploader";

// eslint-disable-next-line react/prop-types
const PostLocation = ({ newLocation, markerRefs, mapInstanceRef, setMarkerSelected }) => {
  const [name, setName] = useState(newLocation.properties.name);
  const [coordinates, setCoordinates] = useState([
    newLocation.properties.coordinates.latitude,
    newLocation.properties.coordinates.longitude,
  ]);
  const [type, setType] = useState("heart");
  const [youtube, setYoutube] = useState("");
  const [placeFormatted, setPlaceFormatted] = useState(
    newLocation.properties.place_formatted
  );
  const [description, setDescription] = useState('')
  const [photos, setPhotos] = useState([]);

  /* const handleFileChange = (event) => {
    setPhotos(event.target.files);
  }; */

  const handleFilesAdded = (files) => {
    setPhotos(files);
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value)
  }

  useEffect(() => {
    console.log(type);
  }), [type];

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Upload des photos
      let photoIds = [];
      if (photos.length > 0) {
        // Upload des photos
        photoIds = await Promise.all(
          photos.map(async (photo) => {
            const formData = new FormData();
            formData.append("files", photo);

            const response = await api.post("/upload", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            return response.data[0].id; // Récupère l'ID du fichier uploadé
          })
        );
      }

      // Ajouter le marker
      const res = await api.post("/atlases", {
        data: {
          name: name,
          latitude: coordinates[0],
          longitude: coordinates[1],
          images: photoIds.length > 0 ? photoIds : null,
          type: type,
          description: description,
          place_formatted: placeFormatted,
        },
      });

      
      if (res.status === 200) {
        console.log("Marker ajouté avec succès");
        const newMarkerId = res.data.data.id
        const markerDetails = await api.get(`/atlases/${newMarkerId}?populate=*`)
        console.log(markerDetails.data);
        addMarker(markerDetails.data.data, markerRefs, mapInstanceRef, setMarkerSelected)
        simulateMarkerClick(newMarkerId, markerRefs, mapInstanceRef, setMarkerSelected)
      }
      
    } catch (error) {
      console.error("Erreur lors de l'ajout du marker:", error);
      alert("Erreur lors de l'ajout du marker");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mt-5 mb-3">Ajouter un Nouveau Marker</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <div className="flex gap-2">
            <label>
              <input
                type="radio"
                value="heart"
                checked={type === "heart"}
                onChange={handleTypeChange}
                className="hidden"
              />
              <HeartMarker size={32} />
            </label>
            <label>
              <input
                type="radio"
                value="camping"
                checked={type === "star"}
                onChange={handleTypeChange}
                className="hidden"
              />
              <CampingMarker size={32} />
            </label>
            <label>
              <input
                type="radio"
                value="parc"
                checked={type === "pin"}
                onChange={handleTypeChange}
                className="hidden"
              />
              <ParcMarker size={32} />
            </label>
            <label>
              <input
                type="radio"
                value="image"
                checked={type === "pin"}
                onChange={handleTypeChange}
                className="hidden"
              />
              <div className="w-10 p-[2px] aspect-square rounded-full border-2 border-white cursor-pointer">
                <img className="w-full h-full rounded-full aspect-square object-cover" src={photoPaysage} alt="" />
              </div>
            </label>
          </div>
        </div>
        {
            type === 'image' && <DragAndDropUploader onFilesAdded={handleFilesAdded} />
        }
        <label className="block mt-5 mb-2" htmlFor="description">Description :</label>
        <textarea onChange={handleDescriptionChange} className="w-full h-20 rounded-md px-3 py-1 bg-white/70 border-2 border-white" id="description" placeholder={`Décrivez ${name}`}></textarea>
        <button className="w-full bg-white shadow-sm text-black rounded-md p-2 mt-5" type="submit">Ajouter Marker</button>
      </form>
    </div>
  );
};

export default PostLocation;