import React from 'react';
import useInput from '../../common/hook/useInput';
import '../../asset/css/SignUp.css';

function SignUp() {
    const [ID, handleIDChange] = useInput('');
    const [email, handleEmailChange] = useInput('');
    const [verifyCode, handleVerifyCodeChange] = useInput('');
    const [pwd, handlePwdChange] = useInput('');
    const [confirmPwd, handleConfirmPwdChange] = useInput('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle signup logic here, e.g., API call
        console.log({ ID, email, verifyCode, pwd, confirmPwd });
        alert('Sign Up functionality not implemented yet!');
    };

    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleSubmit}>
                <h2>Sign Up</h2>

                <div className="form-group">
                    <label htmlFor="ID">ID</label>
                    <div className="form-group-flex">
                        <input name="ID" type="text" id="ID" value={ID} onChange={handleIDChange} />
                        <button type="button">중복확인</button>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <div className="form-group-flex">
                        <input name="email" type="email" id="email" value={email} onChange={handleEmailChange} />
                        <button type="button">이메일 인증</button>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="verifyCode">Verification Code</label>
                     <div className="form-group-flex">
                        <input name="verifyCode" type="text" id="verifyCode" value={verifyCode} onChange={handleVerifyCodeChange} />
                        <button type="button">코드 확인</button>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="pwd">Password</label>
                    <input name="pwd" type="password" id="pwd" value={pwd} onChange={handlePwdChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPwd">Confirm Password</label>
                    <input name="confirmPwd" type="password" id="confirmPwd" value={confirmPwd} onChange={handleConfirmPwdChange} />
                </div>

                <button type="submit" className="signup-button">Sign Up</button>
            </form>
        </div>
    );
}

export default SignUp;