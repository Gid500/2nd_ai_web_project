import React from 'react';
import useInput from '../../common/hook/useInput';
import '../../asset/css/SignIn.css';

function SignIn() {
    const [IdOrEmail, handleIdOrEmailChange] = useInput('');
    const [Pwd, handlePwdChange] = useInput('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle signin logic here, e.g., API call
        console.log({ IdOrEmail, Pwd });
        alert('Sign In functionality not implemented yet!');
    };

    return (
        <div className="signin-container">
            <form className="signin-form" onSubmit={handleSubmit}>
                <h2>Sign In</h2>
                <div className="form-group">
                    <label htmlFor="IdOrEmail">ID or Email</label>
                    <input name="IdOrEmail" type="text" id="IdOrEmail" value={IdOrEmail} onChange={handleIdOrEmailChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="Pwd">Password</label>
                    <input name="Pwd" type="password" id="Pwd" value={Pwd} onChange={handlePwdChange} />
                </div>
                <button type="submit" className="signin-button">Login</button>
            </form>
        </div>
    );
}

export default SignIn;