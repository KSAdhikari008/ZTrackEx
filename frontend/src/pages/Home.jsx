import { useNavigate, Link, useLocation } from "react-router";
import { logout } from "../services/authService";
import { useAuth } from "../hooks/authHook";

function Home() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const location = useLocation();

  async function logoutUser() {
    try {
      await logout();
      setUser({ status: "unauthenticated" });
      navigate("/login", { state: {from: location}, replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }

  return (
    <div>
      <h1>HOME PAGE</h1>
      <h2>Welcome back {user.username}</h2>
      <p>{user.status}</p>
      <button onClick={logoutUser}>logout</button>
      <p></p>
      <Link to='/login'>Login</Link>
    </div>
  );
}

export default Home;
