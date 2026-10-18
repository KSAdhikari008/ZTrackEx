import { Link, useNavigate } from "react-router";
import { logout } from "../services/authService";
import { useAuth } from "../hooks/authHook";

function Home() {

  const navigate  = useNavigate();
  const user = useAuth();

  async function logoutUser(){
    try{
      await logout();
      alert('user logged out');
      navigate('/login');      
    }catch(err){
      console.log(err);
    }
  }

  console.log(user.body);

  return (
    <>
      <h1>HOME PAGE</h1>
      <h2>Welcom back {user.body.username}</h2>
      <Link to="/register">Register</Link>
      <p>{user.status} </p>
      <button onClick={logoutUser}>logout</button>
    </>
  );
}

export default Home;
