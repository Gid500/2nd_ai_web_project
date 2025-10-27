import { Routes, Route } from 'react-router-dom';
import Header from './common/Header';
import Intro from './pages/intro/Intro';
import SignIn from './pages/signin/SignIn';
import Cat from './pages/home/cat';
import Dog from './pages/home/dog';
import './App.css';
import SignUp from './pages/signup/SignUp';
import Comm from './pages/comm/Comm';
import Error403 from './pages/error/Error403';
import Error404 from './pages/error/Error404';
import AdminRouteWrapper from './common/components/AdminRouteWrapper';
import Explain from './pages/explain/Explain';
import Mypage from './pages/mypage/Mypage';
import CareAccoount from './pages/mypage/CareAccount';
import ProtectedRoute from './common/components/ProtectedRoute';


function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/cat" element={<Cat />} />
        <Route path="/dog" element={<Dog />} />
        <Route path='/admin' element={<AdminRouteWrapper />} />
        <Route path="/explain" element={<Explain/>} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/comm" element={<Comm/>} />
        <Route path="/comm/:postId" element={<Comm/>} /> {/* 게시글 상세 */}


        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          
          <Route path="/comm/:postId/edit" element={<Comm/>} /> {/* 게시글 수정 */}
          <Route path="/mypage" element={<Mypage/>} />
          <Route path="/care" element={<CareAccoount />} />

        </Route>

        <Route path="/403" element={<Error403 />} />
        <Route path="*" element={<Error404 />} /> {/* Catch-all for 404 errors */}
      </Routes>
    </>
  );
}

export default App;
