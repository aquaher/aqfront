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
import PiIndex from "./pages/modules/produccion/informe";
import Pibitacora from "./pages/modules/produccion/informe/bitacora";
import PiMedidor from "./pages/modules/produccion/informe/medidor";
import PiVolumen from "./pages/modules/produccion/informe/volumen";
import PoVolumen from "./pages/modules/produccion/operador/volumen";
import PcIndex from "./pages/modules/produccion/control_calidad";
import Pcparametros from "./pages/modules/produccion/control_calidad/parametros";
import PiCalidad from "./pages/modules/produccion/informe/calidad";
import SIndex from "./pages/modules/sistema";
import Susuarios from "./pages/modules/sistema/usuarios";
import Saccesos from "./pages/modules/sistema/accesos";


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
                    <Route path="control_calidad" element={<PcIndex/>}>
                        <Route path="agua" element={<Pcparametros/>}/>
                    </Route>
                    <Route path="operadores" element={<PoIndex />} >
                        <Route path=":water" element={<Powater />} />
                        <Route path="volumen" element={<PoVolumen />} />
                        <Route path="bitacora" element={<Bitacora />} />
                        <Route path="medidor" element={<Medidor />} />
                    </Route>
                    <Route path="informe" element={<PiIndex />}>
                        <Route path="bitacora" element={<Pibitacora />} />
                        <Route path="medidor" element={<PiMedidor />} />
                        <Route path="volumen" element={<PiVolumen />} />
                        <Route path="agua" element={<PiCalidad/>}/>
                    </Route>
                </Route>
                <Route path="sistema" element={<SIndex/>}>
                    <Route path="usuarios" element={<Susuarios/>}/>
                    <Route path="accesos" element={<Saccesos/>}/>
                </Route>
            </Route>
            <Route path="/login" element={<Login />} />
        </Routes>
    );
}