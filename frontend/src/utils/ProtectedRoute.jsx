import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/authHook";

function ProtectedRoute() {
 
    const user = useAuth();
  
    if(user.status === 'loading'){
        return <p>Checking authentication...</p>
    }

    if(user.status === 'authenticattion failed'){
        return <Navigate to="/login" />
    }

  return (
    <Outlet/>
  );
}

export default ProtectedRoute;