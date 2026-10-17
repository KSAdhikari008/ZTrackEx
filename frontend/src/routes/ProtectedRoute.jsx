import { useEffect, useState } from "react";
import { authMe } from "../services/authService";
import { Navigate, Outlet } from "react-router";

function ProtectedRoute() {
 
    const [status, setStatus] = useState({status: 'loading', user: null});

    useEffect(()=>{
        
        async function authenticateUser() {

            try {
                const user = await authMe();
                setStatus({status:'authenticated', user});
            } catch (err) {
                console.log(err.response?.data?.message);
                setStatus({status:'not authenticated', user:null});        
            }
            
        }

        authenticateUser();
      
    
    });
 
    if(status.status === 'loading'){
        return <p>Checking authentication...</p>
    }

    if(status.status === 'not authenticated'){
        return <Navigate to="/login" />
    }

  return (
    <Outlet/>
  );
}

export default ProtectedRoute;