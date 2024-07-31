import { RiDeleteBin2Line } from "@remixicon/react";
import useFetchLocation from "../api/useFetchLocation";
import SwiperMarker from "./SwiperMarker";
import deleteMarker from "../api/RemoveLocation";
import { removeMarker } from "../utils/mapUtils";

const DetailsMaker = ({ id, markerRefs, map }) => {
  const { location, loading, error } = useFetchLocation(id);
  
  const handleDelete = async () => {
    const refId = id;
    const isConfirmed = window.confirm("Êtes-vous sûr de vouloir supprimer ce marker ?");
    if (!isConfirmed) return; // Si l'utilisateur annule, on ne fait rien
    try {
      removeMarker(refId, markerRefs, map)
      await deleteMarker(id, location);
    } catch (error) {
      console.error('Erreur lors de la suppression du marker:', error);
    }
  };

  if (loading) {
    return console.log('chargement');
  }

  // Afficher le message d'erreur s'il y a une erreur
  if (error) {
    return console.log(`Erreur: ${error.message}`)
  }

  // S'assurer que les données sont disponibles avant de tenter de les afficher
  if (!location || !location.attributes) {
    return null;
  }

  return (
    <div>
      <header className="mb-2">
        <h3 className="text-2xl font-bold">{location.attributes.name}</h3>
        <h4>{location.attributes.place_formatted}</h4>
      </header>

      {location.attributes.images.data &&
        <SwiperMarker images={location.attributes.images.data}/>
      }

      
      <p className="text-sm leading-4">
        {location.attributes.description}
      </p>

      <div className="bg-white p-2 rounded-md w-fit text-black hover:bg-red-100 hover:text-red-700 mt-5 transition-all duration-75 cursor-pointer" onClick={handleDelete}>
        <p className="flex gap-2 items-center font-medium"><RiDeleteBin2Line size={20} /> Supprimer</p>
      </div>
    </div>
  );
};

export default DetailsMaker;
