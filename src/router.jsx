import { Navigate, Routes, Route } from "react-router-dom";
import { useSession } from "@/auth/AuthProvider";
import Login from "./pages/login";
import Index from "./pages/Index";
import Prueba from "./pages/users/prueba";
import Prueba2 from "./pages/users/prueba2";
import { DashboardLayout } from "./components/dashboard-layout";

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
                    <DashboardLayout/>
                </RequiredAuth>
            }>
                <Route path="" element={<Index/>}/>
                <Route path="produccion/operadores/purificada" element={<Prueba/>}/>
                <Route path="produccion/operadores/ultrafiltrada" element={<Prueba2/>}/>
                <Route path="produccion/operadores/generica" element={<Prueba/>}/>
            </Route>
            <Route path="/login" element={<Login/>}/>
        </Routes>
    );
}