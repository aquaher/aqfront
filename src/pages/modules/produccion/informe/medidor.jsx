import { medidor } from "@/api/medidores";
import { months } from "@/constant/utils";
import { AlertSwal } from "@/service/sweetAlert";
import { Repeat } from "@mui/icons-material";
import { Paper, Stack, Box, Typography, Select, MenuItem, Button, TextField } from "@mui/material";
import { DataGrid, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { format } from "date-fns";
import {  useState } from "react";

const columns = [
    { field: 'turno', headerName: 'Fecha', width: 150, valueGetter: (params) => `${params.row.turn.turn}` || '' },
    { field: 'fecha', headerName: 'Tanque', width: 170, valueGetter: (params) => `${new Date(params.row.turn.start_date).toLocaleDateString() || ''}` },
    { field: 'operador', headerName: 'Operador', width: 170, valueGetter: (params) => `${params.row.turn.user.username || ''}` },
    { field: 'measurement_channel', headerName: 'Canal', width: 170 },
    { field: 'measurement_time', headerName: 'Hora', width: 170 },
    { field: 'reading_kvarh_8', headerName: 'Kvarh 8', width: 170 },
    { field: 'reading_kvarh_14', headerName: 'Kvarh 14', width: 170 },
    { field: 'reading_kwh_1', headerName: 'Kwh 1', width: 170 },
    { field: 'reading_kwh_13', headerName: 'Kwh 13', width: 170 }
];

export default function PiMedidor() {
    const now = new Date();
    const [data, setData] = useState([]);
    const [selectionModel, setSelectionModel] = useState([]);
    const [start_date, setStartDate] = useState(new Date());
    const [end_date, setEndDate] = useState(new Date());

    async function reloadData() {
        AlertSwal.fire({
            title: '¿Seguro que deseas cargar los registros de los medidores?',
            showConfirmButton: true,
            confirmButtonText: 'Aceptar',
            showLoaderOnConfirm: true,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            icon: 'question',
            preConfirm: async () => {
                try {
                    let start = format(start_date,'yyyy-MM-dd')
                    let end = format(end_date,'yyyy-MM-dd')
                    const register = await medidor.get({url:'/rangue',data:{params:{startDate:start,endDate:end}}})
                    if (register) {
                        setData(register)
                    }else{
                        setData([])
                    }
                } catch (error) {
                    AlertSwal.showValidationMessage(error);
                }
            },
            allowOutsideClick: () => !AlertSwal.isLoading()
        }).then((res) => {
            if (res.isConfirmed) {
                AlertSwal.fire({
                    title: 'Se cargaron los datos con éxito',
                    confirmButtonText: 'Aceptar',
                    icon:'success'
                })
            }
        });
    }

    const CustomToolbar = () => {
        return (
            <GridToolbarContainer>
                {data.length!=0?<GridToolbarExport variant='contained' />:null}
            </GridToolbarContainer>
        );
    }

    return (
        <Stack spacing={2}>
            <Paper sx={{ p: 4 }} elevation={10}>
                <Stack spacing={2}>
                    <Stack alignItems='center' >
                        <Typography fontWeight='bold' fontSize={20}>INFORME DE MEDIDORES DE LUZ</Typography>
                    </Stack>
                    <Stack spacing={1}>
                    <Typography fontWeight='bold' fontSize={18}>Selecciona el Rango:</Typography>
                        <Box>
                            <DesktopDatePicker
                                label="Selecciona la fecha"
                                inputFormat="MM/dd/yyyy"
                                value={start_date}
                                onChange={e => setStartDate(e)}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </Box>
                        <Typography>Hasta</Typography>
                        <Box>
                            <DesktopDatePicker
                                label="Selecciona la fecha"
                                inputFormat="MM/dd/yyyy"
                                value={end_date}
                                onChange={e => setEndDate(e)}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </Box>
                    </Stack>

                    <Box>
                        <Button
                            startIcon={<Repeat />}
                            variant='contained'
                            color='primary'
                            onClick={reloadData}>Cargar registros</Button>
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
        </Stack>
    );
}