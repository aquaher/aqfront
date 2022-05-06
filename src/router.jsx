import { Navigate, Routes, Route } from "react-router-dom";
import { useSession } from "@/auth/AuthProvider";
import Login from "./pages/login";
import Index from "./pages/Index";
import { DashboardLayout } from "./components/dashboard-layout";
import PIndex from "./pages/modules/produccion";
import PoIndex from "./pages/modules/produccion/operador";
import Powater from "./pages/modules/produccion/operador/water";
import Bitacora from "./pages/modules/produccion/operador/bitacora";
import Medidor from "./pages/modules/produccion/operador/medidor";

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
                    <DashboardLayout />
                </RequiredAuth>
            }>
                <Route path="" element={<Index />} />
                <Route path="produccion" element={<PIndex />}>
                    <Route path="operadores" element={<PoIndex />} >
                        <Route path=":water" element={<Powater />} />
                        <Route path="bitacora" element={<Bitacora />} />
                        <Route path="medidor" element={<Medidor />} />
                    </Route>
                </Route>
            </Route>
            <Route path="/login" element={<Login />} />
        </Routes>
    );
}