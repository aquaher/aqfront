import { useDispatch } from "react-redux";
import getTank from "@/api/tank";
import CvIndex from "@/components/ventas/CvIndex";
import { useEffect } from "react";

export default function Vindex(){
    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(getTank())
    },[dispatch])
    return (
        <CvIndex/>
    )
}