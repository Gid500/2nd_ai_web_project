import { useState } from 'react';
import { requestPasswordResetCode, confirmPasswordReset } from '../api/mypageApi';
import useInput from '../../../common/hook/useInput'; // useInput 훅 임포트

const usePasswordResetForm = () => {
    const email = useInput('');
    const code = useInput('');
    const newPassword = useInput('');
    const confirmPassword = useInput('');
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleRequestCode = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await requestPasswordResetCode(email.value);
            setSuccess('Verification code sent to your email.');
            setStep(2);
        } catch (err) {
            console.error("Error requesting password reset code:", err);
            setError(err.response?.data || 'Failed to send verification code.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (newPassword.value !== confirmPassword.value) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }

        try {
            await confirmPasswordReset(email.value, code.value, newPassword.value);
            setSuccess('Password reset successfully!');
            setStep(1);
            email.setValue(''); // useInput 훅의 setValue 사용
            code.setValue('');
            newPassword.setValue('');
            confirmPassword.setValue('');
        } catch (err) {
            console.error("Error resetting password:", err);
            setError(err.response?.data || 'Failed to reset password.');
        } finally {
            setLoading(false);
        }
    };

    return {
        email,
        code,
        newPassword,
        confirmPassword,
        step,
        loading,
        error,
        success,
        handleRequestCode,
        handleResetPassword,
    };
};

export default usePasswordResetForm;
