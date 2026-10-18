import { useNavigate } from "react-router";
import { logout } from "../services/authService";
import { useAuth } from "../hooks/authHook";

function Home() {

  const navigate  = useNavigate();
  const {user, setUser} = useAuth();

  async function logoutUser(){
    try{
      await logout();
      alert('user logged out');
      setUser({status: 'loading'});
      navigate('/login');      
    }catch(err){
      console.log(err);
    }
  }

  console.log(user);

  return (
    <>
      <h1>HOME PAGE</h1>
      <h2>Welcom back {user.username}</h2>
      <p>{user.status} </p>
      <button onClick={logoutUser}>logout</button>
      {/* <Link to="/register">Register</Link> */}
    </>
  );
}

export default Home;
