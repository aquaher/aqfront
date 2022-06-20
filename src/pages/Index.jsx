import { useSession } from "@/auth/AuthProvider";
import CoIndex from "@/components/operador";
import CvVolumen from "@/components/ventas/CvVolumen";
import { Stack } from "@mui/material";
import { useEffect } from "react";
import Vindex from "./modules/ventas/Vindex";
import { useDispatch } from "react-redux";
import { getEvents } from "@/api/utils";

export default function Index() {
    const {user} = useSession();
    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(getEvents());
    });
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