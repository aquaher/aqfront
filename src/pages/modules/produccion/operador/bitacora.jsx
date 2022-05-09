import { setRegisterBitacora } from "@/api/bitacora";
import HeaderTurn from "@/components/operador/headerTurn";
import { selectEvents } from "@/reducer/events";
import { selectTurn } from "@/reducer/turn";
import { AlertSwal } from "@/service/sweetAlert";
import { Box, Paper, Stack, Typography, Input, TextareaAutosize, TextField, Select, MenuItem, Button } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

export default function Bitacora() {
    const { turn } = useSelector(selectTurn);
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
    const evSelection = useMemo(()=>event.find(e=>e.name==select),[select])

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
    return (
        <Stack spacing={2}>
            <HeaderTurn turn={turn} title={`Bitácora de ${turn.operador}`}/>
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
                        <Select value={select?select:'Selecciona el evento'} onChange={e => setSelect(e.target.value)}>
                            <MenuItem value='Selecciona el evento'>Selecciona el evento</MenuItem>
                            {event.map((ev, idx) => <MenuItem key={idx} value={ev.name}>{ev.name}</MenuItem>)}
                        </Select>
                        <Typography fontWeight='bold'>Sección</Typography>
                        <TextField value={bitacora.section} onChange={e=>setBitacora({...bitacora,section:e.target.value})}/>
                        <Stack alignItems='center'>
                            <Button variant='contained' color='primary' onClick={registrar}>Registrar</Button>
                        </Stack>
                    </Stack>
                </Paper>
            </Stack>

        </Stack>
    );
}