import authentication from "@/api/auth";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authenticated } from "../service/auth";

const AuthContext = createContext(null);

function AuthProvider({children}){
    const [session,setSession] = useState();
    const [error,setError] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [loadingInitial, setLoadingInitial] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(()=>{
        if(error) setError(null);
    },[location.pathname])

    useEffect(()=>{
        /**api getCurrentUser */
        setLoadingInitial(false);
    },[])

    function signIn(username,password){
        setIsLoading(true);
        authentication.login(username,password)
        .then((data)=>{
            setSession(data)
        })
        .catch(err=>setError(err))
        .finally(()=>setIsLoading(false));
    }
    function signUp(){
        authentication.logout().then(()=>setSession(undefined));
    }

    const value = useMemo(()=>({
        session,isLoading,loadingInitial,signIn,signUp,error
    },[session, isLoading, error]))

    return(<AuthContext.Provider value={value}>{!loadingInitial&&children}</AuthContext.Provider>)
}

function useAuth(){
    return useContext(AuthContext);
}

function useSession(){
    const {session} = useContext(AuthContext);
    return session;
}
export {
    useAuth,
    useSession,
    AuthProvider
}