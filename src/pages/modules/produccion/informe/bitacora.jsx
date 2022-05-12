import { getRegisterBitacoraByMonth } from "@/api/bitacora";
import { Edit, Repeat } from "@mui/icons-material";
import { Box, Button, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridToolbar, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { months } from "@/constant/utils";
import { LoadingButton } from "@mui/lab";
import { AlertSwal } from "@/service/sweetAlert";

const columns = [
    { field: 'fecha', headerName: 'Fecha', width: 150, valueGetter: (params) => `${new Date(params.row.turn.start_date).toLocaleDateString()}` || '' },
    { field: 'operator', headerName: 'Operador', width: 170, valueGetter: (params) => `${params.row.turn.user.username || ''}` },
    { field: 'start_time', headerName: 'Hora de inicio', width: 150 },
    { field: 'end_time', headerName: 'Hora de finalización', width: 150 },
    { field: 'section', headerName: 'Sección', width: 170 },
    { field: 'event', headerName: 'Evento', width: 170, valueGetter: (params) => `${params.row.event.name || ''}` },
    { field: 'description', headerName: 'Descripción', width: 250 },
    {
        field: 'actions',
        type: 'actions',
        width: 80,
        getActions: (params) => [
            <GridActionsCellItem
                icon={<Edit color='warning' />}
                label="Editar"
                onClick={e => console.log(params.row)}
            />,
        ]
    }

];
export default function Pibitacora() {
    const now = new Date();
    const [date, setDate] = useState(months[now.getMonth()]);
    const [data, setData] = useState();
    const [selectionModel, setSelectionModel] = useState([]);
    const [isLoad, setLoad] = useState(true);
    useEffect(() => {
        (async () => {
            try {
                const res = await getRegisterBitacoraByMonth({ number: now.getMonth() + 1 });
                setLoad(false)
                if (res) {
                    setData(res)
                }
            } catch (error) {
                setData([])
                setLoad(false)
            }

        })()
    }, []);

    async function reloadData() {
        setLoad(true)
        try {
            const res = await getRegisterBitacoraByMonth({ number: months.findIndex(e => e == date) + 1 })

            if (res) {
                setData(res);
            }else{
                setData([]);
                AlertSwal.fire({
                    title:'Lo sentimos no hay datos registrados en este mes',
                    icon:'error'
                });
            }
        } catch (error) {
            setData([]);
            AlertSwal.fire({
                title:'Lo sentimos no hay datos registrados en este mes',
                icon:'error'
            });
        }
        setLoad(false)
    }
    function edit(e) {
        if (selectionModel.length != 0) {
            selectionModel.map(idx => {
                console.log('Elimina el elemento', data[idx - 1])
            })
        }
    }
    const CustomToolbar = () => {
        return (
            <GridToolbarContainer>
                <Stack spacing={2} direction='row'>
                    <Button disabled={selectionModel.length == 0} onClick={edit} color='error' variant='contained' size='small'>Eliminar</Button>
                    <GridToolbarExport variant='contained' />
                </Stack>
            </GridToolbarContainer>
        );
    }
    return (
        <Stack spacing={2}>
            <Paper sx={{ p: 4 }} elevation={10}>
                <Stack alignItems='center' pb={2}>
                    <Typography fontWeight='bold' fontSize={20}>INFORME DE BITÁCORA</Typography>
                </Stack>
                <Stack spacing={2}>
                    <Box>
                        <Typography fontWeight='bold' fontSize={18}>Selecciona el mes:</Typography>
                        <Select value={date} onChange={e => setDate(e.target.value)}>
                            {months.map((mes, idx) => <MenuItem key={idx} value={mes}>{mes}</MenuItem>)}
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
                        checkboxSelection
                        onSelectionModelChange={setSelectionModel}
                        selectionModel={selectionModel}
                        components={{
                            Toolbar: CustomToolbar,
                        }}
                    /> : null}
                </Stack>
            </Paper>
        </Stack>
    );
}