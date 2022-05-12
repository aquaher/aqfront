import { useSession } from "@/auth/AuthProvider";
import CoIndex from "@/components/operador";
import Vindex from "./modules/ventas/Vindex";

export default function Index() {
    const {user} = useSession();
    return (
        <>
            
            {user.group=='/operador'?<CoIndex/>:null}
            {user.group=='/ventas'?<Vindex/>:null}
        </>
    );
}