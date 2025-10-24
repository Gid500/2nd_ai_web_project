import { Routes, Route } from 'react-router-dom';
import Header from './common/Header';
import Intro from './pages/intro/Intro';
import Cat from './pages/home/cat';
import Dog from './pages/home/dog';
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
