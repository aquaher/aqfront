import { selectTank } from "@/reducer/tank";
import { Box, Grid, Stack, TextField, Typography, Select, MenuItem, Button, Paper, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { typo_grafica } from "@/constant/utils";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { HexColorPicker } from "react-colorful";
import { AlertSwal } from "@/service/sweetAlert";
import { LoadingButton } from "@mui/lab";
import { Repeat } from "@mui/icons-material";
import { format } from "date-fns";
import { getVolByTurnAndRangueDate, getVolByTurnAndRangueDateAndTurn, getVolByTurnAndRangueDateAndTurnAndTank } from "@/api/volumen";
import { DataGrid, GridActionsCellItem, GridToolbar, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
import ChartJs from "@/components/chart";

const turn = [1, 2, 3]
const columns = [
    { field: 'fecha', headerName: 'Fecha', width: 150, valueGetter: (params) => `${new Date(params.row.turn.start_date).toLocaleDateString()}` || '' },
    { field: 'turno', headerName: 'Turno', width: 170, valueGetter: (params) => `${params.row.turn.turn || ''}` },
    { field: 'operador', headerName: 'Operador', width: 170, valueGetter: (params) => `${params.row.turn.user.username || ''}` },
    { field: 'tanque_name', headerName: 'Tanque', width: 170, valueGetter: (params) => `${params.row.tank.name || ''}` },
    { field: 'tanque_type', headerName: 'Tipo de agua', width: 170, valueGetter: (params) => `${params.row.tank.water || ''}` },
    { field: 'vol', headerName: 'Volumen', width: 170 }
];
const CustomToolbar = () => {
    return (

        <GridToolbarContainer>
            <GridToolbarExport variant='contained' />
        </GridToolbarContainer>
    );
}

export default function PiVolumen() {
    const [turno, setTurno] = useState('TODOS');
    const [start_date, setStartDate] = useState(new Date());
    const [end_date, setEndDate] = useState(new Date());
    const { value } = useSelector(selectTank);
    const [selection, setSelection] = useState('TODOS');
    const [color, setColor] = useState("#aabbcc");

    const [isLoad, setIsLoad] = useState(false);
    const [graficaData, setGraficaData] = useState([]);
    const [data, setData] = useState([]);

    const [selectTypoGrafica, setTypoGrafica] = useState(typo_grafica[0]);

    async function reloadData(e) {
        setIsLoad(true);
        const isoStartDate = format(start_date, 'yyyy-MM-dd') + 'T' + '00:00:00';
        const isoEndDate = format(end_date, 'yyyy-MM-dd') + 'T' + '23:59:59';
        const tank_id = value.find(e => e.name == selection)
        try {
            if (turno != 'TODOS' && selection != 'TODOS') {
                normal(isoStartDate, isoEndDate, tank_id);
            } else {
                AlertSwal.fire({
                    title: `¿Estas seguro que deseas cargar los volumenes?`,
                    showConfirmButton: true,
                    confirmButtonText: 'Aceptar',
                    showLoaderOnConfirm: true,
                    showCancelButton: true,
                    cancelButtonText: 'Cancelar',
                    icon: 'question',
                    preConfirm: async () => {
                        setData([])
                        setGraficaData([])
                        if (turno == 'TODOS' && selection == 'TODOS') {
                            const res = await getVolByTurnAndRangueDate({ start_date: isoStartDate, end_date: isoEndDate })
                            if (res.length != 0) {
                                setData(res)
                                let sets = [];
                                let labels = '';
                                value.map((tq, idx) => {
                                    const v = res.filter(e => e.tank.id == tq.id);

                                    if (v.length != 0) {

                                        labels = v.map(e => `${new Date(e.turn.start_date).toLocaleDateString()}`);
                                        if (idx == 0) {
                                            sets = [{
                                                label: `${v[0].tank.name} ${v[0].tank.water}`,
                                                data: v.map((e) => e.vol),
                                                backgroundColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
                                            }]
                                        } else {
                                            sets = [
                                                ...sets,
                                                {
                                                    label: `${v[0].tank.name} ${v[0].tank.water}`,
                                                    data: v.map((e) => e.vol),
                                                    backgroundColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
                                                }
                                            ]

                                        }

                                    }
                                })
                                setGraficaData({
                                    labels,
                                    datasets: sets
                                })
                            } else {
                                AlertSwal.fire({
                                    title: `¡Lo sentimos, no existen registros en estas fechas !`,
                                    icon: 'info',
                                })
                            }
                        } else if (turno != 'TODOS' && selection == 'TODOS') {
                            const res = await getVolByTurnAndRangueDateAndTurn({ start_date: isoStartDate, end_date: isoEndDate, turn: turno })
                            if (res.length != 0) {
                                setData(res)
                                let sets = [];
                                let labels = '';
                                value.map((tq, idx) => {
                                    const v = res.filter(e => e.tank.id == tq.id);

                                    if (v.length != 0) {

                                        labels = v.map(e => `${new Date(e.turn.start_date).toLocaleDateString()}`);
                                        if (idx == 0) {
                                            sets = [{
                                                label: `${v[0].tank.name} ${v[0].tank.water}`,
                                                data: v.map((e) => e.vol),
                                                backgroundColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
                                            }]
                                        } else {
                                            sets = [
                                                ...sets,
                                                {
                                                    label: `${v[0].tank.name} ${v[0].tank.water}`,
                                                    data: v.map((e) => e.vol),
                                                    backgroundColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
                                                }
                                            ]

                                        }

                                    }
                                })
                                setGraficaData({
                                    labels,
                                    datasets: sets
                                })
                            } else {
                                AlertSwal.fire({
                                    title: `¡Lo sentimos, no existen registros en estas fechas !`,
                                    icon: 'info',
                                })
                            }

                        }
                    },
                    allowOutsideClick: () => !AlertSwal.isLoading()
                });
            }
        } catch (error) {

            setIsLoad(false);
        }
        setIsLoad(false);

    }

    function normal(isoStartDate, isoEndDate, tank_id) {
        if (graficaData.length == 0) {
            AlertSwal.fire({
                title: `¿Estas seguro que deseas cargar los volumenes?`,
                showConfirmButton: true,
                confirmButtonText: 'Aceptar',
                showLoaderOnConfirm: true,
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                icon: 'question',
                preConfirm: async () => {
                    const res = await getVolByTurnAndRangueDateAndTurnAndTank({ start_date: isoStartDate, end_date: isoEndDate, turn: turno, tank_id: tank_id.id })
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
                            title: `¡Lo sentimos, no existen registros en estas fechas !`,
                            icon: 'info',
                        })
                    }
                },
                allowOutsideClick: () => !AlertSwal.isLoading()
            });
        } else {
            if (turno == data[0].turn.turn) {
                AlertSwal.fire({
                    title: `¿Estas seguro que deseas añadir los volumenes de ${tank_id.name} - ${tank_id.water}?`,
                    showConfirmButton: true,
                    confirmButtonText: 'Aceptar',
                    showLoaderOnConfirm: true,
                    showCancelButton: true,
                    cancelButtonText: 'Cancelar',
                    icon: 'question',
                    preConfirm: async () => {
                        const res = await getVolByTurnAndRangueDateAndTurnAndTank({ start_date: isoStartDate, end_date: isoEndDate, turn: turno, tank_id: tank_id.id })
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
            } else {
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
                }).then(co => {
                    if (co.isConfirmed) {
                        AlertSwal.fire({
                            title: `¡Todo esta listo para cargues los datos!`,
                            icon: 'info',
                        })
                    }
                })
            }
        }
    }

    return (
        <Stack>
            <Paper sx={{ p: 2 }} elevation={10}>
                <Stack spacing={2}>
                    <Stack alignItems='center' pb={2}>
                        <Typography fontWeight='bold' fontSize={20}>INFORME DE VOLUMENES</Typography>
                    </Stack>


                    <Grid container spacing={1} columns={{ xs: 4, sm: 12, md: 12 }}>
                        <Grid item xs={4} sm={6} md={3}>
                            <Stack alignItems='center' spacing={1}>
                                <Typography fontWeight='bold'>Selecciona el Turno</Typography>
                                <Select value={turno} onChange={e => setTurno(e.target.value)}>
                                    <MenuItem value={'TODOS'}>TODOS</MenuItem>
                                    {turn.map(val => <MenuItem key={val} value={val}>{val}</MenuItem>)}
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
                                <Typography fontWeight='bold'>Selecciona el tanque</Typography>
                                <Select value={selection} onChange={e => setSelection(e.target.value)} sx={{ maxWidth: 250 }}>
                                    <MenuItem value={'TODOS'}>TODOS</MenuItem>
                                    {value.map((tank, idx) => <MenuItem key={idx} value={tank.name}>{tank.name} {tank.water}</MenuItem>)}
                                </Select>
                            </Stack>
                        </Grid>
                        <Grid item xs={4} sm={6} md={3}>
                            <Stack alignItems='center' spacing={1}>
                                <Typography fontWeight='bold' fontSize={18}>Selecciona el color</Typography>
                                <HexColorPicker color={color} onChange={setColor} />
                            </Stack>
                        </Grid>
                    </Grid>
                    <Stack alignItems='center' spacing={1}>

                        <LoadingButton
                            loading={isLoad}
                            startIcon={<Repeat />}
                            variant='contained'
                            color='primary'
                            onClick={reloadData}>Cargar registros</LoadingButton>
                        <Button variant='contained'
                            color='warning' onClick={() => {
                                setData([]);
                                setGraficaData([]);
                            }}>Limpiar gráfica</Button>
                    </Stack>

                    <DataGrid
                        autoHeight
                        rows={data}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        components={{
                            Toolbar: CustomToolbar,
                        }}
                    ></DataGrid>
                    {graficaData.length != 0 ?
                        <>
                            <Stack spacing={2}>
                                <Box>
                                    <Typography fontWeight='bold' fontSize={18}>Tipo de gráfica:</Typography>
                                    <Select value={selectTypoGrafica} onChange={e => setTypoGrafica(e.target.value)}>
                                        {typo_grafica.map(val => <MenuItem key={val} value={val}>{val}</MenuItem>)}
                                    </Select>
                                </Box>
                            </Stack>
                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                spacing={{ xs: 1, sm: 2, md: 4 }}
                            >
                                {graficaData.datasets.map((el, key) => {
                                    return (<GenerateSelector item={el} items={graficaData} setItem={setGraficaData} idx={key} key={key} />);
                                })}
                            </Stack>
                            <ChartJs title='Volumen Vs Tiempo' data={graficaData} type={selectTypoGrafica} />
                        </>
                        : null}
                </Stack>
            </Paper>
        </Stack>
    );
}
const GenerateSelector = ({ item, items, setItem, idx }) => {
    const [color, setColor] = useState(item.backgroundColor);
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button variant='outlined' startIcon={
                <Box height={25} width={25} sx={{ background: color }}></Box>
            } onClick={() => setOpen(true)}>{item.label.split(" ")[0]}</Button>
            <Dialog open={open} onClose={() => setOpen(!open)}>
                <DialogTitle>
                    <Typography fontWeight='bold'>Selecciona el color para tu gráfica</Typography>
                </DialogTitle>
                <DialogContent>
                    <Stack alignItems='center'>
                        <HexColorPicker color={color} onChange={setColor} />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        let update = items.datasets.map(e => {
                            if (e.backgroundColor == item.backgroundColor) {
                                return {
                                    ...e,
                                    backgroundColor: color
                                }
                            }
                            return e;
                        })
                        let newValue = {
                            ...items,
                            datasets: update
                        }
                        setItem(newValue);
                        setOpen(false);
                    }}>Seleccionar</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}