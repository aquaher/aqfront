import getTank from "@/api/tank";
import { Stack,Box } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";

import { Outlet } from "react-router-dom";

export default function PIndex() {
    const dispatch = useDispatch();
    useState(()=>{
        dispatch(getTank())
    },[dispatch])
    return (
        <Box p={2}>
            <Outlet />
        </Box>
    );
}