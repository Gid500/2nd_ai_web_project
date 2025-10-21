import { useState, useCallback } from 'react';
import axios from 'axios';

const useAxios = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  });

  const request = useCallback(async (config) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance(config);
      setData(response.data);
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  }, [axiosInstance]);

  return { data, error, loading, request };
};

export default useAxios;
