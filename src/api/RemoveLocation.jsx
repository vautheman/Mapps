import axios from 'axios';
import api from './api';

const getMarkerImages = async (markerId) => {
  try {
    const response = await api.get(`/atlases/${markerId}?populate=images`);
    if (response.status === 200) {
      return response.data.data.attributes.images.data.map(img => img.id); // Retourne les IDs des images
    } else {
      console.error('Erreur lors de la récupération des images du marker:', response.status);
      return [];
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des images du marker:', error);
    throw error; // Lance l'erreur pour pouvoir la gérer ailleurs
  }
};

const deleteImage = async (imageId) => {
  try {
    const response = await api.delete(`/upload/files/${imageId}`);
    if (response.status === 200) {
      /* console.log('Image supprimée avec succès'); */
    } else {
      /* console.error('Erreur lors de la suppression de l\'image:', response.status); */
    }
  } catch (error) {
    /* console.error('Erreur lors de la suppression de l\'image:', error);
    throw error; // Lance l'erreur pour pouvoir la gérer ailleurs */
  }
};

const deleteMarker = async (markerId, location) => {
  try {
    if(!location.attributes.images.data === null) {
      // Obtenir les images associées au marker
      const imageIds = await getMarkerImages(markerId);
      
      // Supprimer chaque image associée
      await Promise.all(imageIds.map(imgId => deleteImage(imgId)));
    }

    // Remplacez 'atlases' par le nom de votre modèle si nécessaire
    const response = await api.delete(`/atlases/${markerId}`);
    
    if (response.status === 200) {
      console.log('Marker supprimé avec succès');
      return response.data; // Retourne les données de la réponse si nécessaire
    } else {
      console.error('Erreur lors de la suppression du marker:', response.status);
      return null;
    }
  } catch (error) {
    console.error('Erreur lors de la suppression du marker:', error);
    throw error; // Lance l'erreur pour pouvoir la gérer ailleurs
  }
};

export default deleteMarker