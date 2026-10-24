import { useAuth } from "../hooks/authHook";
import { Link } from "react-router";
import { logout } from "../services/authService";


function Navbar() {
 
  const {user, setUser} = useAuth(); 

   async function handleLogout() {
    try {
      await logout();
      setUser({ status: "unauthenticated" });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }
 
  return (
    <nav className=" rounded bg-zinc-900 flex justify-between px-3 py-2 md:flex-1  ">
        <div className="left-section   ">
            <p className=" text-sm text-zinc-200">Good Morning</p>
            <h2 className=" text-md " >{user.username}</h2>
        </div>
        <div className="right-section">
            <button onClick={handleLogout}>logout</button>
            <Link to="/login " >Login</Link>
            <button className="  ">Profile</button>
        </div>
    </nav>
  );
}

export default Navbar;