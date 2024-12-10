import authentication from "@/api/auth";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
    const [session, setSession] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingInitial, setLoadingInitial] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (error) setError(null);
    }, [location.pathname])

    useEffect(() => {
        /**api getCurrentUser */
        (async()=>{
            try {
                const user = await authentication.refresh_session();
                if(user){
                    setError(null)
                    setSession(user)
                    navigate('/')
                }
            } catch (error) {
                setError(error)
            }finally{
                setLoadingInitial(false); 
            }
        })()
        
    }, [])

    async function signIn(username, password) {
        setIsLoading(true);
        try {
            const data = await authentication.login(username, password);
            if (data) {
                setError(null)
                setSession(data);
                navigate('/')
            }
            
        } catch (error) {
            setError(error)
        } finally {
            setIsLoading(false)
        }

    }
    async function signOut() {
        try {
            await authentication.logout();
            navigate('/login');
        } catch (error) {
            
        }
        
    }

    const value = useMemo(() => ({
        session, isLoading, loadingInitial, signIn, signOut, error
    }), [session, isLoading, error])

    return (<AuthContext.Provider value={value}>{!loadingInitial && children}</AuthContext.Provider>)
}

function useAuth() {
    return useContext(AuthContext);
}

function useSession() {
    const { session } = useContext(AuthContext);
    return session;
}
export {
    useAuth,
    useSession,
    AuthProvider
}