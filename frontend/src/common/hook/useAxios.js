import { useState } from 'react';
import api from '../../pages/signin/api/api'; // Import the configured axios instance

const useAxios = () => {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchData = async (params) => {
        setLoading(true);
        try {
            const result = await api.request(params); // Use the configured api instance
            setResponse(result.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return { response, error, loading, fetchData };
};

export default useAxios;