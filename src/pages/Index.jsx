import { DashboardLayout } from "@/components/dashboard-layout";
import { Outlet, useLocation } from "react-router-dom";

export default function Index() {
    const location = useLocation();
    return (
        <>
            Inicio
        </>
    );
}