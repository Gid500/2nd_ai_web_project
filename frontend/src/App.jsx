import './App.css';
import { Route, Routes } from 'react-router-dom';
import Header from './common/Header';
import Menubar from './common/Menubar';
import Footer from './common/Footer';
import Home from './pages/home/Home';
import SignUp from './pages/signup/SignUp';
import SignIn from './pages/signin/SignIn';
import About from './pages/about/About';
import Posts from './pages/posts/Posts';
import PostDetail from './pages/posts/components/PostDetail';
import WritePost from './pages/posts/components/WritePost';
import NotFound from './pages/error/NotFound';
import Forbidden from './pages/error/Forbidden';
import FindPassword from "./pages/signin/FindPassword";
import { AuthProvider } from './context/AuthContext'; // AuthProvider import

function App() {
  return (
    <AuthProvider> {/* AuthProvider로 전체 애플리케이션 감싸기 */}
      <div className="App-container">
        <Header/>
        <Menubar/>

        <main>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/posts' element={<Posts/>}/>
            <Route path='/posts/write' element={<WritePost />}/>
            <Route path='/posts/:id' element={<PostDetail/>}/>
            <Route path='/signUp' element={<SignUp/>}/>
            <Route path='/signIn' element={<SignIn/>}/>
            <Route path='/about' element={<About/>}/>
            <Route path='/forbidden' element={<Forbidden/>}/>
            <Route path='/*' element={<NotFound/>}/>
            <Route path='password/reset' element={<FindPassword />}/>
          </Routes>
        </main>

        <Footer/>
      </div>
    </AuthProvider>
  );
}

export default App;
