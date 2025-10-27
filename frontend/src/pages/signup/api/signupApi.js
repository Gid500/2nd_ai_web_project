import signupApiInstance from './signupApiInstance';

export const useSignupApi = () => {

    const signup = async (userData) => {
        try {
            const response = await signupApiInstance.post('/api/signup/register', userData);
            return response;
        } catch (error) {
            throw error;
        }
    };

    const sendVerificationEmail = async (email) => {
        try {
            const response = await signupApiInstance.post('/api/signup/send-verification', { email });
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const verifyEmailCode = async (email, code) => {
        try {
            const response = await signupApiInstance.post('/api/signup/verify-code', { email, code });
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const checkEmailDuplication = async (email) => {
        try {
            const response = await signupApiInstance.get('/api/signup/check-email', { params: { email } });
            return { isUnique: !response.data.isDuplicated };
        } catch (error) {
            throw error;
        }
    };

    const checkNicknameDuplication = async (nickname) => {
        try {
            const response = await signupApiInstance.get('/api/signup/check-nickname', { params: { nickname } });
            return { isUnique: !response.data.isDuplicated };
        } catch (error) {
            throw error;
        }
    };

    const checkIdDuplication = async (userId) => {
        try {
            const response = await signupApiInstance.get('/api/signup/check-userid', { params: { userId } });
            return { isUnique: !response.data.isDuplicated };
        } catch (error) {
            throw error;
        }
    };

    return { signup, sendVerificationEmail, verifyEmailCode, checkEmailDuplication, checkNicknameDuplication, checkIdDuplication };
};
