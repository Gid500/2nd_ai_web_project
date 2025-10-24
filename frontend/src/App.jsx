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
        <Route path="/Cat" element={<Cat />} />
        <Route path="/Dog" element={<Dog />} />
      </Routes>
    </>
  );
}

export default App;
