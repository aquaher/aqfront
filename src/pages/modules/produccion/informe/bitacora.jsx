import { bitacora, getRegisterBitacoraByMonth } from "@/api/bitacora";
import { Edit, Repeat, ViewAgenda, Visibility } from "@mui/icons-material";
import { Box, Button, MenuItem, Dialog, Paper, DialogContent, DialogContentText, Select, Skeleton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridToolbar, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { months } from "@/constant/utils";
import { LoadingButton } from "@mui/lab";
import { AlertSwal } from "@/service/sweetAlert";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { format } from "date-fns";
import useSWR from "swr";

const columns = [
    { field: 'fecha', headerName: 'Fecha', width: 150, valueGetter: (params) => `${new Date(params.row.turn.start_date).toLocaleDateString()}` || '' },
    { field: 'operator', headerName: 'Operador', width: 170, valueGetter: (params) => `${params.row.turn.user.username || ''}` },
    { field: 'start_time', headerName: 'Hora de inicio', width: 150 },
    { field: 'end_time', headerName: 'Hora de finalización', width: 150 },
    { field: 'section', headerName: 'Sección' },
    { field: 'event', headerName: 'Evento', width: 170, valueGetter: (params) => `${params.row.event.name || ''}` },
    { field: 'description', headerName: 'Descripción', width: 250 }
];
export default function Pibitacora() {
    const now = new Date();
    const [data, setData] = useState([]);
    const [selectionModel, setSelectionModel] = useState([]);
    const [start_date, setStartDate] = useState(new Date());
    const [end_date, setEndDate] = useState(new Date());

    return (
        <Stack spacing={2}>
            <Paper sx={{ p: 4 }} elevation={10}>
                <Stack alignItems='center' pb={2}>
                    <Typography fontWeight='bold' fontSize={20}>INFORME DE BITÁCORA</Typography>
                </Stack>
                <Stack spacing={2}>
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

                    <Registros start={format(start_date, 'yyyy-MM-dd')} end={format(end_date, 'yyyy-MM-dd')} />
                </Stack>
            </Paper>
        </Stack>
    );
}

const Registros = ({ start, end }) => {

    const { data, error } = useSWR({ url: '/rangue/defined', data: { params: { startDate: start, endDate: end } } }, bitacora.getByData)
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    if (error) return <Stack>Lo sentimos ocurrio un error</Stack>
    if (!data) return <Skeleton />

    const ViewDesc = ({ desc }) => {
        const [open, setOpen] = useState(false);
        return (
            <>
                <Button startIcon={<Visibility />} onClick={() => setOpen(true)}>Ver descripción</Button>

                <Dialog
                    open={open}
                    onClose={() => setOpen(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <DialogContent>

                        <Box>
                            <DialogContentText id="modal-modal-description" sx={{ mt: 2 }}>
                                {desc}
                            </DialogContentText >
                        </Box>
                    </DialogContent>

                </Dialog>
            </>

        );
    }
    return (
        <Stack>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table sx={{ minWidth: 450 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Turno</TableCell>
                            <TableCell>Usuario</TableCell>
                            <TableCell>Fecha</TableCell>
                            <TableCell>Hora de inicio</TableCell>
                            <TableCell>Descripción</TableCell>
                            <TableCell>Evento</TableCell>
                            <TableCell>Sección</TableCell>
                            <TableCell>Hora de finalización</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((value, idx) => {

                            return (
                                <TableRow key={idx}>
                                    <TableCell>{value.turn.turn}</TableCell>
                                    <TableCell>{value.turn.user.username}</TableCell>
                                    <TableCell>{new Date(value.turn.start_date).toLocaleDateString()}</TableCell>
                                    <TableCell>{value.start_time}</TableCell>
                                    <TableCell>
                                        <ViewDesc desc={value.description} />
                                    </TableCell>
                                    <TableCell>{value.event.name}</TableCell>
                                    <TableCell>{value.section}</TableCell>
                                    <TableCell>{value.end_time}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                labelRowsPerPage='Filas por página'
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}>
            </TablePagination>
        </Stack>
    );
}