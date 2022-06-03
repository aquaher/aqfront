import { useSession } from "@/auth/AuthProvider";
import CoIndex from "@/components/operador";
import CvVolumen from "@/components/ventas/CvVolumen";
import { Stack } from "@mui/material";
import Vindex from "./modules/ventas/Vindex";

export default function Index() {
    const {user} = useSession();
    console.log(user)
    console.log(user.group)
    console.log(user.group=="/admin")
    return (
        <Stack spacing={2}>
            {user.group.map(e=>{
                if(e=='/operador'){
                    return <CoIndex/>;
                }
                if(e=='/despachador'){
                    return <CvVolumen/>
                }
                if(e=='/ventas'){
                    return <Vindex/>;
                }
                
                return null;
            })}
        </Stack>
    );
}