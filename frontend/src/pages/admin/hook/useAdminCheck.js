import { useAuth } from '../../../common/hook/useAuth';

export const useAdminCheck = () => {
    const { isAdmin, loading } = useAuth();
    return { isAdmin, loading };
};