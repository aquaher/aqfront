import { selectTank } from "@/reducer/tank";
import { Grid, MenuItem, Paper, Select, Stack, Typography,TextField } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { useSelector } from "react-redux";

const turn = [1, 2, 3]

export default function PiProduccion() {
    const [turno,setTurn] = useState('TODOS');
    const [start_date, setStartDate] = useState(new Date());
    const [end_date, setEndDate] = useState(new Date());
    const {value} = useSelector(selectTank)
    const [selection,setSelection] = useState('TODOS');
    const [color,setColor] = useState('#94bfa')
    return (
        <Stack >
            <Paper sx={{p:2}} elevation={10}>
                <Stack spacing={1}>
                    <Stack alignItems='center' pb={2}>
                        <Typography fontWeight='bold' fontSize={20}>INFORME DE PRODUCCIÓN</Typography>
                    </Stack>
                    <Grid container spacing={1} columns={{ xs: 4, sm: 12, md: 12 }}>
                        <Grid item xs={4} sm={6} md={3}>
                            <Stack alignItems='center' spacing={1}>
                                <Typography fontWeight='bold'>Selecciona el Turno</Typography>
                                <SelectionTurn turno={turno} setTurn={setTurn}/>
                            </Stack>
                        </Grid>
                        <Grid item xs={4} sm={6} md={3}>
                            <Stack alignItems='center' spacing={1}>
                                <Typography fontWeight='bold'>Selecciona el tanque</Typography>
                                <Select value={selection} onChange={e => setSelection(e.target.value)} sx={{maxWidth:250}}>
                                    <MenuItem value={'TODOS'}>TODOS</MenuItem>
                                    {value.map((tank, idx) => <MenuItem key={idx} value={tank.name}>{tank.name} {tank.water}</MenuItem>)}
                                </Select>
                            </Stack>
                        </Grid>
                        <Grid item xs={4} sm={6} md={3}>
                            <Stack alignItems='center' spacing={1}>
                            <Typography fontWeight='bold'>Selecciona el rango de fecha</Typography>
                                <DesktopDatePicker
                                    label="Fecha de inicio"
                                    inputFormat="MM/dd/yyyy"
                                    value={start_date}
                                    onChange={e => setStartDate(e)}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                                <Typography>hasta</Typography>
                                <DesktopDatePicker
                                    label="Fecha final"
                                    inputFormat="MM/dd/yyyy"
                                    value={end_date}
                                    onChange={e => setEndDate(e)}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={4} sm={6} md={3}>
                            <Stack alignItems='center' spacing={1}>
                                <Typography fontWeight='bold' fontSize={18}>Selecciona el color</Typography>
                                <HexColorPicker color={color} onChange={setColor} />
                            </Stack>
                        </Grid>
                    </Grid>
                </Stack>
            </Paper>
        </Stack>
    )
}
function SelectionTurn({turno,setTurn}){
    return(
        <Select value={turno} onChange={e=>setTurn(e.target.value)}>
            <MenuItem value={'TODOS'}>TODOS</MenuItem>
            {turn.map((e,idx)=><MenuItem key={idx} value={e}>{e}</MenuItem>)}
        </Select>
    );
}