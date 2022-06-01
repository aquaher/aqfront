import { water } from "@/api/water";
import { selectTank } from "@/reducer/tank";
import { AlertSwal } from "@/service/sweetAlert";
import { Grid, MenuItem, Paper, Select, Stack, Typography,TextField, Button } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { format } from "date-fns";
import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { useSelector } from "react-redux";

export default function PiProduccion() {
    const [start_date, setStartDate] = useState(new Date());
    const [end_date, setEndDate] = useState(new Date());
    const {value} = useSelector(selectTank)
    const [selection,setSelection] = useState('TODOS');
    const [vol,setVol] = useState([0]);
    //const [color,setColor] = useState('#94bfa');
    function onClickLoad(e){
        AlertSwal.fire({
            title:'¿Estas seguro de cargar el volumen total producido?',
            showConfirmButton: true,
            confirmButtonText: 'Aceptar',
            showLoaderOnConfirm: true,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            icon: 'question',
            preConfirm: async () => {
                try {
                    if(selection=='TODOS'){
                        const data = await water.getBy({url:'/rangue/todos',data:{params:{startDate:format(start_date,'yyyy-MM-dd'),endDate:format(end_date,'yyyy-MM-dd')}}});
                        if(data){
                            setVol(data.map(e=>e.total_produced))
                        }else{
                            setVol([0])
                        }
                    }else{
                        const tankID = value.find(e=>e.name==selection).id
                        const data = await water.getBy({url:'/rangue',data:{params:{tankId:tankID,startDate:format(start_date,'yyyy-MM-dd'),endDate:format(end_date,'yyyy-MM-dd')}}});
                        if(data){
                            setVol(data.map(e=>e.total_produced))
                        }else{
                            setVol([0])
                        }
                    }
                } catch (error) {
                    AlertSwal.showValidationMessage(error);
                }
                
            },
            allowOutsideClick: () => !AlertSwal.isLoading()
        }).then(q=>{

        })
    }
    return (
        <Stack alignItems='center'  direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 1, sm: 2, md: 4 }}>
            <Paper sx={{p:2}} elevation={10}>
                <Stack spacing={1} alignItems='center'>
                    <Stack alignItems='center' pb={2}>
                        <Typography fontWeight='bold' fontSize={20}>INFORME DE PRODUCCIÓN</Typography>
                    </Stack>
                    <Stack  spacing={1}>
                                <Typography fontWeight='bold'>Selecciona el tanque</Typography>
                                <Select value={selection} onChange={e => setSelection(e.target.value)} sx={{maxWidth:250}}>
                                    <MenuItem value={'TODOS'}>TODOS</MenuItem>
                                    {value.map((tank, idx) => <MenuItem key={idx} value={tank.name}>{tank.name} {tank.water}</MenuItem>)}
                                </Select>
                            </Stack>
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
                    <Stack alignItems='center' pb={2}>
                        <Button onClick={onClickLoad} variant='contained'>Cargar</Button>
                    </Stack>
                </Stack>
            </Paper>
            <Paper sx={{p:2}} elevation={10}>
                <Stack alignItems='center'>
                    <Typography fontSize={40} fontWeight='bold'>Total producido</Typography>
                    <Typography fontSize={54} fontWeight='bold'>{vol.reduce((a,b)=>a+b,0)}</Typography>
                </Stack>
            </Paper>
        </Stack>
    )
}
/**
 <Grid item xs={4} sm={6} md={3}>
                            <Stack alignItems='center' spacing={1}>
                                <Typography fontWeight='bold' fontSize={18}>Selecciona el color</Typography>
                                <HexColorPicker color={color} onChange={setColor} />
                            </Stack>
                        </Grid>
 */