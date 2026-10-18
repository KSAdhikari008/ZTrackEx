import { useEffect } from "react";
import { AuthContext } from "./authContext";
import { authMe } from "../services/authService";
import { useState } from "react";

export function AuthProvider({children}){

    const [user, setUser] = useState({status: 'loading', body: null});

    useEffect(()=>{
    
        async function authen() {

            try{
                const response = await authMe();
                const body = response.data.user;
                setUser({status: "authenticated", ...body});
            }catch(err){
                if(err.response){
                    console.log(err.response?.data?.message);
                    setUser({status: 'authentication failed'})
                }else{
                    console.log(err);
                }
            }
        }
        authen();
    
    },[]);



    return <AuthContext.Provider value={{user, setUser}}>{children}</AuthContext.Provider>
}

