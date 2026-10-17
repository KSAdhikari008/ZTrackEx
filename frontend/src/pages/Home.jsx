import { Link, useNavigate } from "react-router";
import { logout } from "../services/authService";

function Home() {

  const navigate  = useNavigate();

  /* useEffect runs after the initial render. If this is a protected route, a better approach is to put the authentication check in a ProtectedRoute component or an authentication context, rather than repeating it on every page.
 */
  //  useEffect(()=>{

  //    async function authUser() {
  //       const user = await authMe();

  //    }

  //    authUser();

  //  },[]);


  async function logoutUser(){
    try{
      await logout();
      alert('user logged out');
      navigate('/login');      
    }catch(err){
      console.log(err);
    }
  }

  return (
    <>
      <h1>HOME PAGE</h1>
      <Link to="/register">Register</Link>
      <button onClick={logoutUser}>logout</button>
    </>
  );
}

export default Home;
