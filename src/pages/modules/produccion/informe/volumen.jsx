import { getVolumensByMonthAndTurn } from "@/api/volumen";
import ChartJs from "@/components/chart";
import { months, typo_grafica } from "@/constant/utils";
import { selectTank } from "@/reducer/tank";
import { Repeat } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, Button, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridToolbar, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HexColorPicker } from "react-colorful";
import { AlertSwal } from "@/service/sweetAlert";

const turn = [1, 2, 3]
const columns = [
    { field: 'fecha', headerName: 'Fecha', width: 150, valueGetter: (params) => `${new Date(params.row.turn.start_date).toLocaleDateString()}` || '' },
    { field: 'tanque_name', headerName: 'Tanque', width: 170, valueGetter: (params) => `${params.row.tank.name || ''}` },
    { field: 'tanque_type', headerName: 'Tipo de agua', width: 170, valueGetter: (params) => `${params.row.tank.water || ''}` },
    { field: 'vol', headerName: 'Volumen', width: 170 }
];

export default function PiVolumen() {
    const now = new Date();
    const [turno, setTurno] = useState(turn[0]);
    const [date, setDate] = useState(months[now.getMonth()]);
    const [data, setData] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const [selectionModel, setSelectionModel] = useState([]);
    const { value } = useSelector(selectTank);
    const [selecTank, setSelectTank] = useState('TQ-1');
    const [graficaData, setGraficaData] = useState([]);
    const [selectTypoGrafica, setTypoGrafica] = useState(typo_grafica[0]);
    const [color, setColor] = useState("#aabbcc");

    async function reloadData(e) {
        
        try {
            setIsLoad(true);
            if (graficaData.length == 0) {
                AlertSwal.fire({
                    title: `¿Estas seguro que deseas cargar los volumenes de ${selecTank}?`,
                    showConfirmButton: true,
                    confirmButtonText: 'Aceptar',
                    showLoaderOnConfirm: true,
                    showCancelButton: true,
                    cancelButtonText: 'Cancelar',
                    icon: 'question',
                    preConfirm: async () => {
                        const res = await getVolumensByMonthAndTurn({ month: months.findIndex(e => e == date) + 1, turn: turno, tank_name: selecTank })
                        if (res.length != 0) {
                            const labels = res.map(e => `${new Date(e.turn.start_date).toLocaleDateString()}`);
                            setData(res)
                            setGraficaData({
                                labels,
                                datasets: [
                                    {
                                        label: `${res[0].tank.name} ${res[0].tank.water}`,
                                        data: res.map((e) => e.vol),
                                        backgroundColor: color,
                                    }
                                ],
                            })

                        } else {
                            AlertSwal.fire({
                                title: `¡Lo sentimos, no existen registros en este mes !`,
                                icon: 'info',
                            })
                        }
                    },
                    allowOutsideClick: () => !AlertSwal.isLoading()
                })
            } else {
                if(turno==data[0].turn.turn){
                    AlertSwal.fire({
                        title: `¿Estas seguro que deseas añadir los volumenes de ${selecTank}?`,
                        showConfirmButton: true,
                        confirmButtonText: 'Aceptar',
                        showLoaderOnConfirm: true,
                        showCancelButton: true,
                        cancelButtonText: 'Cancelar',
                        icon: 'question',
                        preConfirm: async () => {
                            const res = await getVolumensByMonthAndTurn({ month: months.findIndex(e => e == date) + 1, turn: turno, tank_name: selecTank })
                            if (res.length != 0) {
                                const labels = res.map(e => `${new Date(e.turn.start_date).toLocaleDateString()}`);
                                setData([...data, ...res])
                                setGraficaData({
                                    labels,
                                    datasets: [
                                        ...graficaData.datasets,
                                        {
                                            label: `${res[0].tank.name} ${res[0].tank.water}`,
                                            data: res.map((e) => e.vol),
                                            backgroundColor: color,
                                        }
                                    ],
                                })
    
                            } else {
                                AlertSwal.fire({
                                    title: `¡Lo sentimos, no existen registros!`,
                                    icon: 'info',
                                })
                            }
                        },
                        allowOutsideClick: () => !AlertSwal.isLoading()
                    })
                }else{
                    AlertSwal.fire({
                        title: `Estas a punto de cargar la información del turno ${turno},¿Deseas continuar?`,
                        showConfirmButton: true,
                        confirmButtonText: 'Aceptar',
                        showLoaderOnConfirm: true,
                        showCancelButton: true,
                        cancelButtonText: 'Cancelar',
                        icon: 'question',
                        preConfirm: async () => {
                            setData([])
                            setGraficaData([])
                        },
                        allowOutsideClick: () => !AlertSwal.isLoading()
                    }).then(co=>{
                        if(co.isConfirmed){
                            AlertSwal.fire({
                                title: `¡Todo esta listo para cargues los datos!`,
                                icon: 'info',
                            })
                        }
                    })
                } 
            }
        } catch (error) {

        }
        setIsLoad(false);

    }

    const CustomToolbar = () => {
        return (

            <GridToolbarContainer>
                <GridToolbarExport variant='contained' />
            </GridToolbarContainer>
        );
    }
    return (
        <Stack spacing={2}>
            <Paper sx={{ p: 4 }} elevation={10}>
                <Stack alignItems='center' pb={2}>
                    <Typography fontWeight='bold' fontSize={20}>INFORME DE VOLUMENES POR TURNO</Typography>
                </Stack>
                <Stack spacing={2}>
                    <Box>
                        <Typography fontWeight='bold' fontSize={18}>Selecciona el Turno:</Typography>
                        <Select value={turno} onChange={e => setTurno(e.target.value)}>
                            {turn.map(val => <MenuItem key={val} value={val}>{val}</MenuItem>)}
                        </Select>
                    </Box>
                    <Box>
                        <Typography fontWeight='bold' fontSize={18}>Selecciona el Mes:</Typography>
                        <Select value={date} onChange={e => setDate(e.target.value)}>
                            {months.map((mes, idx) => <MenuItem key={idx} value={mes}>{mes}</MenuItem>)}
                        </Select>
                    </Box>
                    {value ? <Box>
                        <Typography fontWeight='bold' fontSize={18}>Selecciona el tanque:</Typography>
                        <Select value={selecTank} onChange={e => setSelectTank(e.target.value)}>
                            {value.map((tank, idx) => <MenuItem key={idx} value={tank.name}>{tank.name} {tank.water}</MenuItem>)}
                        </Select>

                    </Box> : null}
                    {value ? <>
                        <Typography fontWeight='bold' fontSize={18}>Selecciona el color:</Typography>
                        <HexColorPicker color={color} onChange={setColor} />
                    </> : null}
                    <Box>
                        <Typography fontWeight='bold' fontSize={18}>Selecciona el tanque:</Typography>
                    </Box>
                    <Box>
                        <LoadingButton
                            loading={isLoad}
                            startIcon={<Repeat />}
                            variant='contained'
                            color='primary'
                            onClick={reloadData}>Cargar registros</LoadingButton>
                    </Box>
                    <DataGrid
                        autoHeight
                        rows={data}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        onSelectionModelChange={setSelectionModel}
                        selectionModel={selectionModel}
                        components={{
                            Toolbar: CustomToolbar,
                        }}
                    ></DataGrid>
                </Stack>
            </Paper>
            {graficaData.length != 0 ?
                <Paper sx={{ p: 4 }} elevation={10}>
                    <Stack spacing={2}>
                        <Box>
                            <Typography fontWeight='bold' fontSize={18}>Tipo de gráfica:</Typography>
                            <Select value={selectTypoGrafica} onChange={e => setTypoGrafica(e.target.value)}>
                                {typo_grafica.map(val => <MenuItem key={val} value={val}>{val}</MenuItem>)}
                            </Select>
                        </Box>
                    </Stack>
                    <ChartJs title='Volumen Vs Tiempo' data={graficaData} type={selectTypoGrafica} />
                </Paper> : null}
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