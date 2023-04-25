import { Paper, Stack, Typography, TextField, Select, MenuItem, Button, Dialog, DialogContent, DialogActions, DialogTitle, Grid, Box, Table, TableHead, TableCell, TableBody, TableRow, TableFooter, TableContainer } from "@mui/material";
import { selectTank } from "@/reducer/tank";
import { Repeat } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { forwardRef, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { getParameters } from "@/api/parameters";
import { DataGrid, GridActionsCellItem, GridToolbar, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
import { AlertSwal } from "@/service/sweetAlert";
import ReactToPrint from "react-to-print";
import g_heredia from '@/assets/img/g_heredia.png';
import aquaher from '@/assets/img/l_aquaher.png';

const columns = [
    { field: 'parametro', headerName: 'Parametro', width: 150, valueGetter: (params) => `${params.row.method.name}` || '' },
    { field: 'result', headerName: 'Resultado', width: 150 },
    { field: 'unidad', headerName: 'Unidad', width: 150, valueGetter: (params) => `${params.row.method.unit.symbol || ''}` },
    { field: 'metodo', headerName: 'Método', width: 150, valueGetter: (params) => `${params.row.method.symbol}` || '' },
];

export default function CcIndex() {
    const { value } = useSelector(selectTank);
    const [optTank, setOptTank] = useState('TQ-1');
    const [date, setDate] = useState(new Date());
    const [isLoad, setLoad] = useState(false);
    const [data, setData] = useState([]);
    const [selectionModel, setSelectionModel] = useState([]);
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    async function loadParams(e) {

        setLoad(true)
        try {
            const tank_id = value.find(e => e.name == optTank).id;
            const getData = await getParameters({ date: format(date, 'yyyy-MM-dd'), tank_id: tank_id });
            if (getData.length != 0) {
                setData(getData)
            }else{
                setData([])
                AlertSwal.fire({
                    title:'Lo sentimos no hay datos registrados en este dia',
                    icon:'error'
                });
            }
        } catch (error) {
            
        }
        setLoad(false)
    }
    function print(e) {
        if (data.length != 0) {
            setOpen(true)
        } else {
            AlertSwal.fire({
                title: 'No existen datos',
                icon: 'error'
            })
        }

    }
    const CustomToolbar = () => {
        return (
            <GridToolbarContainer>
                <Stack spacing={2} direction='row'>
                    <Button onClick={print} color='secondary' variant='contained' size='small'>Imprimir reporte</Button>
                    <GridToolbarExport variant='contained'/>
                </Stack>
            </GridToolbarContainer>
        );
    }


    return (
        <>
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
            <Dialog open={open} onClose={() => setOpen(false)} scroll='paper'>
                <DialogContent>
                    <Stack spacing={2}>
                        <ComponentPrint data={data} ref={ref} />
                        <Stack>
                            <Stack alignItems='center'>
                                <ReactToPrint trigger={() => <Button onClick={print} color='primary' variant='contained' size='small'>Imprimir parametros</Button>}
                                    content={() => ref.current}></ReactToPrint>
                            </Stack>
                        </Stack>
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    );
}

const ComponentPrint = forwardRef((props, ref) => {
    const { data } = props
    return (

        <Stack alignItems='center' ref={ref}>
            <Stack sx={{ border: 2, p: 2, mt: 2.5, width: 600, position: 'relative' }} >
                <Box
                    component="img"
                    sx={{
                        height: 100,
                        width: 120,
                        position: 'absolute',
                        top: 15,
                        right: 10
                    }}
                    alt="The house from the offer."
                    src={g_heredia}
                />
                <Box
                    component="img"
                    sx={{
                        height: 100,
                        width: 120,
                        position: 'absolute',
                        top: 15,
                        left: 10
                    }}
                    alt="The house from the offer."
                    src={aquaher}
                />
                <Stack sx={{ pb: 1 }}>
                    <Stack alignItems='center'>
                        <Typography fontWeight='bold' fontSize={20}>Informe de calidad de agua</Typography>
                        <Typography fontSize={14}>“AQUAHER S.A.”</Typography>
                        <Typography fontSize={14}>Dir: Sitio Buenos Aires S/N (Frente a la toma de agua EPAM)</Typography>
                        <Typography fontSize={14}>e-mail: aquaher@outlook.com</Typography>
                    </Stack>
                    <Stack bgcolor="#9c9c9c">
                        <Typography fontSize={16} fontWeight='bold' textAlign='center'>CERTIFICADO DE CALIDAD</Typography>
                    </Stack>
                    <Stack bgcolor="#dbdbdb" mt={1}>
                        <Stack direction='row' spacing={2}>
                            <Stack  >
                                <Typography>Fecha:</Typography>
                                <Typography>Lucar de Muestreo:</Typography>
                                <Typography>Descripción:</Typography>
                            </Stack>
                            <Stack  >
                                <Typography>{data[0].quality.date}</Typography>
                                <Typography>{data[0].tank.name}</Typography>
                                <Typography fontWeight='bold'>{data[0].tank.water}</Typography>
                            </Stack>
                            <Stack >
                                <Typography fontWeight='bold'>LOTE: {data[0].quality.lote}</Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                    <TableContainer>
                        <Table sx={{ mt: 1, minWidth: 350 }} size="small" >

                            <TableHead>
                                <TableRow>
                                    <TableCell>PARÁMETRO</TableCell>
                                    <TableCell>RESULTADO</TableCell>
                                    <TableCell>UNIDAD</TableCell>
                                    <TableCell>MÉTODO</TableCell>
                                </TableRow>

                            </TableHead>
                            <TableBody>
                                {data.map((p, key) => {
                                    return (
                                        <TableRow key={key}>
                                            <TableCell>{p.method.name || ''}</TableCell>
                                            <TableCell>{p.result || ''}</TableCell>
                                            <TableCell>{p.method.unit.symbol || ''}</TableCell>
                                            <TableCell>{p.method.symbol || ''}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Stack>
                <Stack>
                    <Typography fontSize={8}>
                        *AQUAHER S.A no se responsabiliza por la variación de los parámetros del agua en tanqueros que no correspondan a la compañía de transporte HEREDIATRANS S.A, debido a que no se
                        conoce el estado interno de los mismos.
                    </Typography>
                    <Typography fontSize={8}>
                        *El muestreo, manejo y conservación se realiza según establece la NTE INEN 2169
                    </Typography>
                </Stack>
                <Stack direction='row' justifyContent='space-between' mt={2}>
                    <Stack>
                        <Typography fontWeight='bold'>
                            Ing. Qca. Veronica Vinces
                        </Typography>
                        <Typography fontWeight='bold'>
                            Control de Calidad
                        </Typography>
                    </Stack>
                    <Stack>
                        <Typography fontWeight='bold'>
                            Ing.Qca. Jenniffer Rizzo
                        </Typography>
                        <Typography fontWeight='bold'>
                            Jefe de Producción
                        </Typography>
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    );
})
