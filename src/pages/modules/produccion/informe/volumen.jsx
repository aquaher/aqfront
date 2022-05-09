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
    const [data, setData] = useState();
    const [isLoad, setIsLoad] = useState(true);
    const [selectionModel, setSelectionModel] = useState([]);
    const { value } = useSelector(selectTank);
    const [selecTank, setSelectTank] = useState(value[0].name);
    const [graficaData, setGraficaData] = useState();
    const [selectTypoGrafica, setTypoGrafica] = useState(typo_grafica[0]);
    useEffect(() => {
        (async () => {
            const res = await getVolumensByMonthAndTurn({ month: now.getMonth() + 1, turn: turno, tank_name: selecTank })
            setIsLoad(false);
            if (res) {
                setData(res)
            }
        })()
    }, []);
    async function reloadData(e) {
        try {
            setIsLoad(true);
            const res = await getVolumensByMonthAndTurn({ month: months.findIndex(e => e == date)+1, turn: turno, tank_name: selecTank })
            setIsLoad(false);
            if (res) {
                console.log(res)
                const labels = res.map(e => `${new Date(e.turn.start_date).toLocaleDateString()}`);
                setGraficaData({
                    labels,
                    datasets: [
                        {
                            label: res[0].tank.water,
                            data: res.map((e) => e.vol),
                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        }
                    ],
                })
                setData(res)

            }
        } catch (error) {
            setIsLoad(false);
        }

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
                    <Box>
                        <Typography fontWeight='bold' fontSize={18}>Selecciona el tanque:</Typography>
                        <Select value={selecTank} onChange={e => setSelectTank(e.target.value)}>
                            {value.map((tank, idx) => <MenuItem key={idx} value={tank.name}>{tank.name}</MenuItem>)}
                        </Select>
                    </Box>
                    <Box>
                        <LoadingButton
                            loading={isLoad}
                            startIcon={<Repeat />}
                            variant='contained'
                            color='primary'
                            onClick={reloadData}>Cargar registros</LoadingButton>
                    </Box>
                    {data ? <DataGrid
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
                    ></DataGrid> : null}
                </Stack>
            </Paper>
            <Paper sx={{ p: 4 }} elevation={10}>
                <Stack spacing={2}>
                    <Box>
                        <Typography fontWeight='bold' fontSize={18}>Tipo de gráfica:</Typography>
                        <Select value={selectTypoGrafica} onChange={e => setTypoGrafica(e.target.value)}>
                            {typo_grafica.map(val => <MenuItem key={val} value={val}>{val}</MenuItem>)}
                        </Select>
                    </Box>
                </Stack>
                {graficaData?<ChartJs title='Volumen Vs Tiempo' data={graficaData} type={selectTypoGrafica} />:null}
            </Paper>
        </Stack>
    );
}