import { Routes, Route } from 'react-router-dom';
import Header from './common/Header';
import Intro from './pages/intro/Intro';
import SignIn from './pages/signin/SignIn';
import Cat from './pages/home/cat';
import Dog from './pages/home/dog';
import './App.css';
import Admin from './pages/admin/Admin';
import SignUp from './pages/signup/SignUp';
import Comm from './pages/comm/Comm';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/cat" element={<Cat />} />
        <Route path="/dog" element={<Dog />} />
        <Route path='/admin' element={<Admin />} />
        <Route path="/comm" element={<Comm/>} />

        <Route path="/signin" element={<SignIn />} /> {/* Add SignIn route */}
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </>
  );
}

export default App;
