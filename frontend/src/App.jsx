import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import { Routes, Route } from 'react-router'
import ProtectedRoute from './utils/ProtectedRoute';


function App() {
 
  return (
        <Routes>
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
            <Route element={<ProtectedRoute/>}>
                <Route path="/" element={<Home/>} />
            </Route>
        </Routes>
    );
}

export default App;