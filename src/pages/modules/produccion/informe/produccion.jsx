import { water } from "@/api/water";
import { selectTank } from "@/reducer/tank";
import { AlertSwal } from "@/service/sweetAlert";
import { Grid, MenuItem, Paper, Select, Stack, Typography, TextField, Button } from "@mui/material";
import { DataGrid, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { format } from "date-fns";
import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { useSelector } from "react-redux";

const columns = [
    { field: 'turno', headerName: 'Fecha', width: 150, valueGetter: (params) => `${params.row.turn.turn}` || '' },
    { field: 'fecha', headerName: 'Tanque', width: 170, valueGetter: (params) => `${new Date(params.row.turn.start_date).toLocaleDateString() || ''}` },
    { field: 'operador', headerName: 'Operador', width: 170, valueGetter: (params) => `${params.row.turn.user.username || ''}` },
    { field: 'tanque', headerName: 'Tanque', width: 170, valueGetter: (params) => `${params.row.tank.name}` },
    { field: 'agua', headerName: 'Agua', width: 170, valueGetter: (params) => `${params.row.tank.water}` },
    { field: 'start_vol', headerName: 'Volumen inicial', width: 170 },
    { field: 'end_vol', headerName: 'Volumen final', width: 170 },
    { field: 'dispatch', headerName: 'despachado', width: 170 },
    { field: 'backwash', headerName: 'Retrolavado', width: 170 },
    { field: 'total_produced', headerName: 'Total producido', width: 170 }
];

export default function PiProduccion() {
    const [start_date, setStartDate] = useState(new Date());
    const [end_date, setEndDate] = useState(new Date());
    const { value } = useSelector(selectTank)
    const [selection, setSelection] = useState('TODOS');
    const [vol, setVol] = useState([0]);
    const [totalWater,setTotalWater] = useState([])
    const [selectionModel, setSelectionModel] = useState([]);
    //const [color,setColor] = useState('#94bfa');
    function onClickLoad(e) {
        AlertSwal.fire({
            title: '¿Estas seguro de cargar el volumen total producido?',
            showConfirmButton: true,
            confirmButtonText: 'Aceptar',
            showLoaderOnConfirm: true,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            icon: 'question',
            preConfirm: async () => {
                try {
                    if (selection == 'TODOS') {
                        const data = await water.getBy({ url: '/rangue/todos', data: { params: { startDate: format(start_date, 'yyyy-MM-dd'), endDate: format(end_date, 'yyyy-MM-dd') } } });
                        if (data) {
                            setTotalWater(data)
                            setVol(data.map(e => e.total_produced))
                        } else {
                            setTotalWater([]);
                            setVol([0])
                        }
                    } else {
                        const tankID = value.find(e => e.name == selection).id
                        const data = await water.getBy({ url: '/rangue', data: { params: { tankId: tankID, startDate: format(start_date, 'yyyy-MM-dd'), endDate: format(end_date, 'yyyy-MM-dd') } } });
                        if (data) {
                            setTotalWater(data)
                            setVol(data.map(e => e.total_produced))
                        } else {
                            setTotalWater([])
                            setVol([0])
                        }
                    }
                } catch (error) {
                    AlertSwal.showValidationMessage(error);
                }

            },
            allowOutsideClick: () => !AlertSwal.isLoading()
        }).then(q => {

        })
    }

    const CustomToolbar = () => {
        return (
            <GridToolbarContainer>
                {totalWater.length!=0?<GridToolbarExport variant='contained' />:null}
            </GridToolbarContainer>
        );
    }

    return (
        <Stack spacing={2}>
            <Stack alignItems='center' direction={{ xs: 'column', sm: 'row' }}
                spacing={{ xs: 1, sm: 2, md: 4 }}>
                <Paper sx={{ p: 2 }} elevation={10}>
                    <Stack spacing={1} alignItems='center'>
                        <Stack alignItems='center' pb={2}>
                            <Typography fontWeight='bold' fontSize={20}>INFORME DE PRODUCCIÓN</Typography>
                        </Stack>
                        <Stack spacing={1}>
                            <Typography fontWeight='bold'>Selecciona el tanque</Typography>
                            <Select value={selection} onChange={e => setSelection(e.target.value)} sx={{ maxWidth: 250 }}>
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
                <Paper sx={{ p: 2 }} elevation={10}>
                    <Stack alignItems='center'>
                        <Typography fontSize={40} fontWeight='bold'>Total producido</Typography>
                        <Typography fontSize={54} fontWeight='bold'>{vol.reduce((a, b) => a + b, 0)}</Typography>
                    </Stack>
                </Paper>
            </Stack>
            <Stack>
                    <Paper elevation={10} sx={{p:2}}>
                        <Stack>
                            <DataGrid 
                                autoHeight
                                rows={totalWater}
                                columns={columns}
                                pageSize={5}
                                rowsPerPageOptions={[5]}
                                onSelectionModelChange={setSelectionModel}
                                selectionModel={selectionModel}
                                components={{
                                    Toolbar: CustomToolbar,
                                }}
                            />
                        </Stack>
                    </Paper>
            </Stack>
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