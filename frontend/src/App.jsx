import { Routes, Route } from 'react-router-dom';
import Header from './common/Header';
import Intro from './pages/intro/Intro';
import Home from './pages/home/Home';
import SignIn from './pages/signin/SignIn'; // Import SignIn component
import './App.css';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signin" element={<SignIn />} /> {/* Add SignIn route */}
      </Routes>
    </>
  );
}

export default App;
