import './index.css';
//import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import { LoginProvider } from './LoginContext';
import { ModalProvider } from './ModalContext';



function App() {
  return (
    <LoginProvider>
      <ModalProvider>
        <Router>
          <Routes>
            <Route path="" element={<Home />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </ModalProvider>
    </LoginProvider>
  )
}

export default App;
