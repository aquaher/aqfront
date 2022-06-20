import { bitacora, setRegisterBitacora } from "@/api/bitacora";
import HeaderTurn from "@/components/operador/headerTurn";
import { selectEvents } from "@/reducer/events";
import { selectTurn } from "@/reducer/turn";
import { AlertSwal } from "@/service/sweetAlert";
import { Visibility } from "@mui/icons-material";
import { Box, Paper, Stack, Typography, Input, TextareaAutosize, TextField, Select, MenuItem, Button, Skeleton, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TablePagination, Dialog, DialogContent, DialogContentText } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import useSWR from "swr";

const Registros = () => {
    const { data, error } = useSWR('/rangue', bitacora.get)
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
    const ViewDesc=({desc})=>{
        const [open,setOpen]=useState(false);
        return(
            <>
            
            <Button startIcon={<Visibility/>} onClick={() =>setOpen(true)}>Ver descripción</Button>
            <Dialog
                open={open}
                onClose={()=>setOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <DialogContent>

                <Box>
                    <DialogContentText  id="modal-modal-description" sx={{ mt: 2 }}>
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
                                        <ViewDesc desc={value.description}/> 
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

export default function Bitacora() {
    const { turn, loading } = useSelector(selectTurn);
    const { event } = useSelector(selectEvents);
    const [bitacora, setBitacora] = useState({
        description: '',
        start_time: '',
        end_time: '',
        section: '',
        event: null,
        turn: turn
    });
    const [select, setSelect] = useState();
    const evSelection = useMemo(() => event.find(e => e.name == select), [select])

    function registrar(e) {
        AlertSwal.fire({
            title: '¿Seguro que deseas guardar el registro en la bitacora?',
            showConfirmButton: true,
            confirmButtonText: 'Aceptar',
            showLoaderOnConfirm: true,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            icon: 'question',
            preConfirm: async () => {
                try {
                    const register = await setRegisterBitacora({ ...bitacora, event: evSelection })
                    if (!register) {
                        throw new Error('Lo sentimos algo paso');
                    }
                } catch (error) {
                    AlertSwal.showValidationMessage(error);
                }
            },
            allowOutsideClick: () => !AlertSwal.isLoading()
        }).then((res) => {
            if (res.isConfirmed) {
                AlertSwal.fire({
                    title: 'Su registro se proceso con éxito',
                    confirmButtonText: 'Aceptar',
                    preConfirm: () => {
                        setBitacora({
                            description: '',
                            start_time: '',
                            end_time: '',
                            section: '',
                            event: null,
                            turn: turn
                        });
                    }
                })
            }
        });
    }
    if (loading) return (
        <>
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
        </>
    )
    return (
        <Stack spacing={2}>
            <HeaderTurn turn={turn} title={`Bitácora de ${turn.user.username}`} />
            <Stack alignItems='center' >
                <Paper sx={{ p: 2 }} elevation={10}>
                    <Stack spacing={1} width={300}>
                        <Stack alignItems='center'>
                            <Typography fontWeight='bold' fontSize={20}>Registro de bitácora</Typography>
                        </Stack>
                        <Typography fontWeight='bold'>Descripción</Typography>
                        <TextField value={bitacora.description} onChange={e => setBitacora({ ...bitacora, description: e.target.value })}
                            fullWidth
                            multiline
                            InputProps={{
                                inputComponent: TextareaAutosize,
                                rows: 3
                            }}></TextField>
                        <Typography fontWeight='bold'>Hora de inicio</Typography>
                        <TextField value={bitacora.start_time} onChange={e => setBitacora({ ...bitacora, start_time: e.target.value })} type='time' />
                        <Typography fontWeight='bold'>Hora de finalización</Typography>
                        <TextField value={bitacora.end_time} onChange={e => setBitacora({ ...bitacora, end_time: e.target.value })} type='time' />
                        <Typography fontWeight='bold'>Evento</Typography>
                        <Select value={select ? select : 'Selecciona el evento'} onChange={e => setSelect(e.target.value)}>
                            <MenuItem value='Selecciona el evento'>Selecciona el evento</MenuItem>
                            {event.map((ev, idx) => <MenuItem key={idx} value={ev.name}>{ev.name}</MenuItem>)}
                        </Select>
                        <Typography fontWeight='bold'>Sección</Typography>
                        <TextField value={bitacora.section} onChange={e => setBitacora({ ...bitacora, section: e.target.value })} />
                        <Stack alignItems='center'>
                            <Button variant='contained' color='primary' onClick={registrar}>Registrar</Button>
                        </Stack>
                    </Stack>
                </Paper>
            </Stack>
            <Stack alignItems='center' spacing={2}>
                <Paper>
                    <Registros />
                </Paper>
            </Stack>
        </Stack>
    );
}