import { Navigate, Routes, Route } from "react-router-dom";
import { useSession } from "./auth/AuthProvider";
import App from "./pages/App";
import Index from "./pages/Index";

function RequiredAuth({ children }) {
    const session = useSession();
    console.log(session)
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
            } index />
            <Route path="/login" element={<App/>}/>
        </Routes>
    );
}