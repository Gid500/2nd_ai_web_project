import { Routes, Route } from 'react-router-dom';
import Header from './common/Header';
import Intro from './pages/intro/Intro';
import Home from './pages/home/Home';
import './App.css';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
