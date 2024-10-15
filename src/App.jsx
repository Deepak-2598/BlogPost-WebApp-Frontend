import Login from './components/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/login.css'
import Editor from './components/BlogPostHome';
import Preview from './components/Preview';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path='/home'element={<Editor/>} ></Route>
        <Route path='/preview'element={<Preview />} ></Route>
      </Routes>
    </Router>

  );
}

export default App;
