const { useState, useEffect } = React;
const { HashRouter, Routes, Route, Link, useNavigate } = ReactRouterDOM;

const App = () => {
    const [token, setToken] = useState(localStorage.getItem('token'));

    const setAuthToken = (newToken) => {
        setToken(newToken);
        localStorage.setItem('token', newToken);
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem('token');
    };

    return (
        <HashRouter>
            <div>
                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        {!token && <li><Link to="/login">Login</Link></li>}
                        {!token && <li><Link to="/signup">Signup</Link></li>}
                        {token && <li onClick={logout}><Link to="#">Logout</Link></li>}
                    </ul>
                </nav>

                <Routes>
                    <Route path="/" element={<Home token={token} />} />
                    <Route path="/login" element={<Login setAuthToken={setAuthToken} />} />
                    <Route path="/signup" element={<Signup />} />
                </Routes>
            </div>
        </HashRouter>
    );
};

const Home = ({ token }) => {
    return (
        <div>
            <h2>Home</h2>
            {token ? <p>You are logged in.</p> : <p>Please login or signup.</p>}
        </div>
    );
};

const Login = ({ setAuthToken }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/login', { userEmail: email, userPwd: password });
            setAuthToken(response.data.token);
            navigate('/');
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed!');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
            <button type="submit">Login</button>
        </form>
    );
};

const Signup = () => {
    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/signup/register', { userEmail: email, userNickname: nickname, userPwd: password, userName: userName });
            alert('Signup successful! Please login.');
            navigate('/login');
        } catch (error) {
            console.error('Signup failed:', error);
            alert('Signup failed!');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Signup</h2>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
            <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Name" required />
            <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="Nickname" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
            <button type="submit">Signup</button>
        </form>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
