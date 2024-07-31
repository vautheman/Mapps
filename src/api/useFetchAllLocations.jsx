import { useState, useEffect } from 'react';
import api from './api';

const useFetchAllLocations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await api.get('/atlases?populate=*');
        setLocations(response.data.data);
        console.log(response.data.data)
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  return { locations, loading, error };
};

export default useFetchAllLocations;