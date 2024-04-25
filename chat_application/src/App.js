import './index.css';
//import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import { LoginProvider } from './LoginContext';
import { ModalProvider } from './ModalContext';
import { PageProvider } from './PageContext';

function App() {
  return (
    <LoginProvider>
      <ModalProvider>
        <PageProvider>
          <Router>
            <Routes>
              <Route path="" element={<Home/>}/>
              <Route path="channels/:id" element={<Home />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </Router>
        </PageProvider>
      </ModalProvider>
    </LoginProvider>
  )
}

export default App;
