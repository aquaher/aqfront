import { Stack,Box } from "@mui/material";

import { Outlet } from "react-router-dom";

export default function PIndex() {
    return (
        <Box p={2}>
            <Outlet />
        </Box>
    );
}