import { useSession } from "@/auth/AuthProvider";
import CoIndex from "@/components/operador";

export default function Index() {
    const {user} = useSession();
    return (
        <>
            Inicio
            {user.group=='/operador'?<CoIndex/>:null}
        </>
    );
}