import { DashboardLayout } from "@/components/dashboard-layout";
import { Outlet } from "react-router-dom";

export default function Index() {
    return (
        <>
            <DashboardLayout>
                <Outlet/>   
            </DashboardLayout>
            
        </>
    );
}