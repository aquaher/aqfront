import getTank from "@/api/tank";
import { Stack,Box } from "@mui/material";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { Outlet } from "react-router-dom";

export default function PIndex() {
    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(getTank())
    },[dispatch])
    return (
        <Box p={2}>
            <Outlet />
        </Box>
    );
}