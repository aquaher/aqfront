import { Navigate, Routes, Route } from "react-router-dom";
import { useSession } from "@/auth/AuthProvider";
import Login from "./pages/login";
import Index from "./pages/Index";
import Prueba from "./pages/users/prueba";

function RequiredAuth({ children }) {
    const session = useSession();
    if (!session) return <Navigate to='/login' replace />
    return children;
}

export function Navigation() {

    return (
        <Routes>
            <Route path="/" element={
                <RequiredAuth>
                    <Index />
                </RequiredAuth>
            }>
               <Route path="dashboard" element={<Prueba/>}></Route>
            </Route>
            <Route path="/login" element={<Login/>}/>
        </Routes>
    );
}