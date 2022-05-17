import CcVolumen from "@/components/informe/volumen/consolidado_volumen";
import CptVolumen from "@/components/informe/volumen/per_turn_volumen";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { useState } from "react";




export default function PiVolumen() {
    const [consolidadoVol, setConsolidadoVol] = useState(false);
    const [perTurn, setPerTurn] = useState(false);

    return (
        <Stack spacing={2}>
            <Paper sx={{ p: 2 }} elevation={10}>
                <Stack alignItems='center' pb={2}>
                    <Typography fontWeight='bold' fontSize={20}>INFORME DE VOLUMENES</Typography>
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }}
                    spacing={{ xs: 1, sm: 2, md: 4 }}>
                    <Box>
                        <Button variant='contained' onClick={()=>{
                            setConsolidadoVol(false);
                            setPerTurn(true)
                        }}>Por turno</Button>
                    </Box>
                    <Box>
                        <Button variant='contained' onClick={()=>{
                            setPerTurn(false)
                            setConsolidadoVol(true);
                        }}>Volumen total</Button>
                    </Box>
                </Stack>
            </Paper>
            {consolidadoVol ? <CcVolumen /> : null}
            {perTurn ? <CptVolumen /> : null}
        </Stack>
    );
}
/*

import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useState } from "react";
export default function PiOtro() {
    const [per_tank,setPerTank] = useState(false);
    const [totalTank,setTotalTank] = useState(false)
    const [start_date, setStarDate] = useState(Date.now());
    const [end_date, setEndDate] = useState(Date.now());
    return (
        <Stack spacing={2}>
            <Stack alignItems='center'>
                <Typography fontWeight='bold' fontSize={20}>INFORME DE VOLUMENES</Typography>
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }}
                spacing={{ xs: 1, sm: 2, md: 4 }} >
                <DatePicker
                    label="fecha inicial"
                    value={start_date}
                    onChange={(newValue) => {
                        setStarDate(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                />
                <Stack alignContent='center'>
                <Typography>hasta</Typography>
                </Stack>
                <DatePicker
                    label="fecha final"
                    value={end_date}
                    onChange={(newValue) => {
                        setEndDate(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                />
            </Stack>
            <Typography fontWeight='bold'>Selecciona una opcion para el informe</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }}
                spacing={{ xs: 1, sm: 2, md: 4 }} >
                <Button variant="contained" onClick={()=>{
                    setTotalTank(false)
                    setPerTank(true);
                }}>TANQUE POR TURNO</Button>
                <Button variant="contained" onClick={()=>{
                    setPerTank(false);
                    setTotalTank(true);
                }}>TODOS LOS TANQUES</Button>
            </Stack>
            {per_tank?<>por tanque</>:null}
            {totalTank?<>total</>:null}
        </Stack>
    );
}
*/