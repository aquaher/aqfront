import { selectTank } from "@/reducer/tank";
import { Repeat } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Paper, Stack, Typography, TextField, Box, Select, MenuItem } from "@mui/material";
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { useState } from "react";
import { useSelector } from "react-redux";
import { getParameters} from "@/api/parameters";

export default function Pcparametros() {
    const { value } = useSelector(selectTank);
    const [optTank, setOptTank] = useState('TQ-1');
    const [date, setDate] = useState(new Date());
    const [isLoad, setLoad] = useState(false);
    const [data, setData] = useState();
    const [isUpdate, setIsUpdate] = useState(false);
    async function loadParams(e) {
        const tank = value.find(e=>e.name == optTank);
        setLoad(true)
        //const getData = await getParameters({date:date,tank:tank.id});
    }
    return (
        <Stack spacing={2}>
            <Stack alignItems='center' >
                <Paper sx={{ p: 2 }} elevation={10}>
                    <Stack spacing={2}>
                        <Stack alignItems='center'>
                            <Typography fontWeight='bold' fontSize={20}>Registro de Parámetros del agua</Typography>
                        </Stack>
                        <Typography fontWeight='bold'>Selecciona la fecha y tanque</Typography>

                            <DesktopDatePicker
                                label="Selecciona la fecha"
                                inputFormat="MM/dd/yyyy"
                                value={date}
                                onChange={e => setDate(e)}
                                renderInput={(params) => <TextField {...params} />}
                            />


                            <Select value={optTank} onChange={e => setOptTank(e.target.value)}>
                                {value ? value.map((tanque) => <MenuItem key={tanque.id} value={tanque.name}>{tanque.name} - {tanque.water}</MenuItem>) : null}
                            </Select>

                        <Stack alignItems='center'>
                            <LoadingButton
                                loading={isLoad}
                                startIcon={<Repeat />}
                                variant='contained'
                                color='primary'
                                onClick={loadParams}>Cargar Parametros</LoadingButton>
                        </Stack>
                    </Stack>
                    <Paper sx={{ p: 2 }} elevation={10}>
                        <Stack spacing={2}>

                        </Stack>
                    </Paper>
                </Paper>
            </Stack >
        </Stack >
    );
}