import { useAuth } from '../../../common/hook/AuthProvider';

export const useAdminCheck = () => {
    const { isAdmin, loading } = useAuth();
    return { isAdmin, loading };
};