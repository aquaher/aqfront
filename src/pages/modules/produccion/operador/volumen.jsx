import { getVolumenByTurnAndTank, putVolumenById, setRegisterVolumen } from "@/api/volumen";
import HeaderTurn from "@/components/operador/headerTurn";
import { selectTank } from "@/reducer/tank";
import { selectTurn, setTurnError } from "@/reducer/turn";
import { AlertSwal } from "@/service/sweetAlert";
import { Repeat } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Paper, Stack, Typography, TextField, Button, Select, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function PoVolumen() {
    const { turn } = useSelector(selectTurn);
    const { value } = useSelector(selectTank);
    const [isEdit, setIsEdit] = useState(false);
    const [isLoad, setLoad] = useState(true);
    const [optTank, setOptTank] = useState('TQ-1');
    const [volumen, setVolumen] = useState({
        vol: 0,
        turn: null,
        tank: null
    });

    useEffect(() => {
        (async () => {
            try {
                const res = await getVolumenByTurnAndTank({ tank_id: 1, turn_id: turn.id });
                if (res) {
                    setIsEdit(true)
                    setVolumen(res)
                }
            } catch (error) {
                setIsEdit(false)
            }
            setLoad(false);
        })()
    }, []);

    async function registrar(e) {
        setLoad(true);
        AlertSwal.fire({
            title: '¿Seguro que deseas guardar el registro de los medidores?',
            showConfirmButton: true,
            confirmButtonText: 'Aceptar',
            showLoaderOnConfirm: true,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            icon: 'question',
            preConfirm: async () => {
                try {
                    if (!isEdit) {
                        let data = { ...volumen, turn: turn, tank: value.find(r => r.name == optTank) }
                        const res = await setRegisterVolumen(data);
                        if (res) {
                            setIsEdit(true)
                            setVolumen(res)
                        }
                    } else {
                        const res = await putVolumenById(volumen)
                        if (res) {
                            setIsEdit(true)
                            setVolumen(res)
                        }
                    }
                } catch (error) {
                    
                    setIsEdit(false)
                    setVolumen({
                        vol: 0,
                        turn: null,
                        tank: null
                    })
                    AlertSwal.showValidationMessage(error);
                    
                }
            },
            allowOutsideClick: () => !AlertSwal.isLoading()
        }).then((res) => {
            if (res.isConfirmed) {
                AlertSwal.fire({
                    title: 'Su registro se proceso con éxito',
                    confirmButtonText: 'Aceptar',
                })
            }
        });
        setLoad(false)
    }

    async function reload(e) {
        setLoad(true);
        try {
            const res = await getVolumenByTurnAndTank({ tank_id: value.find(e => e.name == optTank).id, turn_id: turn.id });
            if (res) {
                setIsEdit(true)
                setVolumen(res)
            }
        } catch (error) {
            AlertSwal.fire({
                title: 'No existen datos en este tanque,¡Registralos ahora!',
                confirmButtonText: 'Aceptar',
            })
            setVolumen({
                vol: 0,
                turn: null,
                tank: null
            })
            setIsEdit(false)
        }
        
        setLoad(false);
    }
    return (
        <Stack spacing={2}>
            <HeaderTurn turn={turn} title='Medidores de Luz' />
            <Stack alignItems='center' >
                <Paper sx={{ p: 2 }} elevation={10}>
                    <Stack spacing={1} minWidth={300}>
                        <Stack alignItems='center'>
                            <Typography fontWeight='bold' fontSize={20}>Volumenes de agua por tanque</Typography>
                        </Stack>
                        <Typography fontWeight='bold'>Selecciona el tanque a registrar</Typography>
                        <Select value={optTank} onChange={e => setOptTank(e.target.value)}>
                            {value ? value.map((tanque) => <MenuItem key={tanque.id} value={tanque.name}>{tanque.name}</MenuItem>) : null}
                        </Select>
                        <LoadingButton variant='contained' loading={isLoad} startIcon={<Repeat />} onClick={reload}>
                            Cargar
                        </LoadingButton>
                    </Stack>
                </Paper>
            </Stack>
            
            <Stack alignItems='center' >
                <Paper sx={{ p: 2 }} elevation={10}>
                    <Stack spacing={1} minWidth={300}>
                        <Stack alignItems='center'>
                            <Typography fontWeight='bold' fontSize={20}>Registro de medidores</Typography>
                        </Stack>
                        <Typography fontWeight='bold'>Ingresa el volumen del tanque {optTank}</Typography>
                        <TextField value={volumen.vol} onChange={e => setVolumen({ ...volumen, vol: e.target.value })} type='number' />
                        <Stack alignItems='center'>
                            {!isEdit ?
                                <Button variant='contained' color='primary' onClick={registrar}>Registrar</Button> :
                                <Button variant='contained' color='warning' onClick={registrar}>Editar</Button>
                            }
                        </Stack>
                    </Stack>
                </Paper>
            </Stack>
        </Stack>
    );
}