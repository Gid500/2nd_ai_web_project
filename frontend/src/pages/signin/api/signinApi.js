import api from '../../../common/api/api';

export const signIn = async (username, password) => {
    const response = await api.post('/api/signin', {
        username,
        password,
    });
    return response;
};
