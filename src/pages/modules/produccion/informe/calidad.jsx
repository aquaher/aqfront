import { Paper, Stack, Typography, TextField, Select, MenuItem, Button } from "@mui/material";
import { selectTank } from "@/reducer/tank";
import { Repeat } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { useState } from "react";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { getParameters } from "@/api/parameters";
import { DataGrid, GridActionsCellItem, GridToolbar, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
import { AlertSwal } from "@/service/sweetAlert";

const columns = [
    { field: 'parametro', headerName: 'Parametro', width: 150, valueGetter: (params) => `${params.row.method.name}` || '' },
    { field: 'result', headerName: 'Resultado', width: 150 },
    { field: 'unidad', headerName: 'Unidad', width: 150, valueGetter: (params) => `${params.row.method.unit.symbol || ''}` },
    { field: 'metodo', headerName: 'Método', width: 150, valueGetter: (params) => `${params.row.method.symbol}` || '' },
];

export default function PiCalidad() {
    const { value } = useSelector(selectTank);
    const [optTank, setOptTank] = useState('TQ-1');
    const [date, setDate] = useState(new Date());
    const [isLoad, setLoad] = useState(false);
    const [data, setData] = useState([]);
    const [selectionModel, setSelectionModel] = useState([]);

    async function loadParams(e) {

        setLoad(true)
        try {
            const tank_id = value.find(e => e.name == optTank).id;
            const getData = await getParameters({ date: format(date, 'yyyy-MM-dd'), tank_id: tank_id });
            if (getData.length != 0) {
                console.log(getData)
                setData(getData)
            }
        } catch (error) {
            console.log(error)
        }
        setLoad(false)
    }
    function print(e) {

    }
    const CustomToolbar = () => {
        return (
            <GridToolbarContainer>
                <Stack spacing={2} direction='row'>
                    <Button onClick={print} color='error' variant='contained' size='small'>Imprimir</Button>
                </Stack>
            </GridToolbarContainer>
        );
    }

    return (
        <Stack spacing={2}>
            <Stack alignItems='center'>
                <Paper sx={{ p: 2 }} elevation={10}>
                    <Stack spacing={2}>
                        <Stack alignItems='center'>
                            <Typography fontWeight='bold' fontSize={20}>Informe de calidad de agua</Typography>
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
                </Paper>
            </Stack>
            <Paper sx={{ p: 4 }} elevation={10}>
                <Stack alignItems='center'>
                    <Typography fontWeight='bold' fontSize={20}>Informe de calidad de agua</Typography>
                </Stack>
                <DataGrid
                    autoHeight
                    rows={data}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    onSelectionModelChange={setSelectionModel}
                    selectionModel={selectionModel}
                    components={{
                        Toolbar: CustomToolbar,
                    }}
                />

            </Paper>
        </Stack>
    );
}