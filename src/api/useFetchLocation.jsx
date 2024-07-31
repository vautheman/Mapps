import { useState, useEffect } from 'react';
import api from './api';

const useFetchLocation = (id) => {
  const [location, setLocation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await api.get(`/atlases/${id}?populate=*`);
        setLocation(response.data.data);
        console.log(response.data.data)
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [id]);

  return { location, loading, error };
};

export default useFetchLocation;