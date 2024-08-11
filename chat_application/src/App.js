import './index.css';
//import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate, useParams } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import { LoginProvider } from './LoginContext';
import { ModalProvider } from './ModalContext';
import { PageProvider } from './PageContext';
import SignUp from './pages/SignUp';
import ChatRoom from './pages/ChatRoom';
import { ThemeProvider } from './context/ColorContext';

function App() {
  return (
    <LoginProvider>
      <ModalProvider>
        <PageProvider>
          <ThemeProvider>
            <Router>
              <Routes>
                <Route path="" element={<Home/>}/>
                <Route path="/channels/:id" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp/>}/>
              </Routes>
          </Router>
          </ThemeProvider>
        </PageProvider>
      </ModalProvider>
    </LoginProvider>
  )
}

export default App;
