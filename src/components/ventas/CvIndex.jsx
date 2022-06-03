import { Stack } from "@mui/material";
import CcIndex from "../calidad/CcIndex";
import CvVolumen from "./CvVolumen";

export default function CvIndex(){
    return(
        <Stack spacing={2}>
            <CcIndex/>
        </Stack>
        
    );
}