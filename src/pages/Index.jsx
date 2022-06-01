import { useSession } from "@/auth/AuthProvider";
import CoIndex from "@/components/operador";
import Vindex from "./modules/ventas/Vindex";

export default function Index() {
    const {user} = useSession();
    console.log(user)
    console.log(user.group)
    console.log(user.group=="/admin")
    return (
        <>
            {user.group.map(e=>{
                if(e=='/operador'){
                    return <CoIndex/>;
                }
                if(e=='/ventas'){
                    return <Vindex/>;
                }
                return null;
            })}
        </>
    );
}