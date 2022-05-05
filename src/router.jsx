import { Navigate, Routes, Route } from "react-router-dom";
import { useSession } from "@/auth/AuthProvider";
import Login from "./pages/login";
import Index from "./pages/Index";
import { DashboardLayout } from "./components/dashboard-layout";
import PIndex from "./pages/modules/produccion";
import PoIndex from "./pages/modules/produccion/operador";
import Powater from "./pages/modules/produccion/operador/water";

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
                    </Route>
                </Route>
            </Route>
            <Route path="/login" element={<Login />} />
        </Routes>
    );
}