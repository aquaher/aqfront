import { getMedidoresByMonth } from "@/api/medidores";
import { months } from "@/constant/utils";
import { Repeat } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Paper, Stack,Box,Typography,Select,MenuItem } from "@mui/material";
import { DataGrid, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

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
    const [date, setDate] = useState(months[now.getMonth()]);
    const [isLoad,setLoad] = useState(true);
    const [data,setData] = useState();
    const [selectionModel, setSelectionModel] = useState([]);

    useEffect(()=>{
        (async()=>{
            const res = await getMedidoresByMonth({number:now.getMonth()})
            setLoad(false)
            if(res){
                setData(res);
            }
        })()
    },[])
    async function reloadData(){
        const res = await getMedidoresByMonth({number:months.findIndex(e => e == date)+1})
        setLoad(false)
        if(res){
            setData(res);
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
                <Stack spacing={2}>
                    <Stack alignItems='center' >
                        <Typography fontWeight='bold' fontSize={20}>INFORME DE MEDIDORES DE LUZ</Typography>
                    </Stack>
                    <Box>
                        <Typography fontWeight='bold' fontSize={18}>Selecciona el Mes:</Typography>
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