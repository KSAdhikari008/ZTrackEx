import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import { Routes, Route } from 'react-router'
import ProtectedRoute from './utils/ProtectedRoute';
import Expenses from './pages/Expenses';
import ServerError from './pages/ServerError';
import NotFound from './pages/NotFound';


function App() {
 
  return (
        <Routes>
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
            <Route element={<ProtectedRoute/>}>
                <Route path="/" element={<Home/>} />
                <Route path="/expenses" element={<Expenses/>} />
            </Route>
            <Route path='/serverError' element={<ServerError/>} />
            <Route path='*' element={<NotFound/>}/>
        </Routes>
    );
}

export default App;