import { useEffect, useState } from 'react';
import useAxios from '../../../common/hook/useAxios';

export const useAdminCheck = () => {
    const { response, error, loading, fetchData } = useAxios();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        fetchData({ url: '/api/checkSession', method: 'get' });
    }, [fetchData]);

    useEffect(() => {
        if (response && response.roleType) {
            setIsAdmin(response.roleType.toLowerCase() === 'admin');
        }
    }, [response]);

    return { isAdmin, error, loading };
};
