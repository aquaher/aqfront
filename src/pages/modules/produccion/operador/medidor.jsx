import { getMedidoresByTurnId, putRegisterMedidores, setRegisterMedidores } from "@/api/medidores";
import HeaderTurn from "@/components/operador/headerTurn";
import { selectTurn } from "@/reducer/turn";
import { AlertSwal } from "@/service/sweetAlert";
import { Paper, Stack, Typography, TextField, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Medidor() {
    const { turn } = useSelector(selectTurn)
    const [edit, setEdit] = useState(false);
    const [medidores, setMedidores] = useState({
        measurement_time: '',
        measurement_channel: 0,
        reading_kwh_1: 0,
        reading_kvarh_8: 0,
        reading_kwh_13: 0,
        reading_kvarh_14: 0,
        turn: turn
    });

    useEffect(() => {
        (async () => {
            const res = await getMedidoresByTurnId({ turn_id: turn.id })
            

            if(res){
                setEdit(true)
                setMedidores({
                    ...res
                })
            }
            /*setEdit(res == null)
            setMedidores({
                ...res
            })*/
        })()
    }, []);

    function registrar() {
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
                    let res=null;
                    if (!edit) {
                        res = await setRegisterMedidores(medidores);
                        if (!res) {
                            throw new Error('Lo sentimos algo paso');
                        }
                    } else {
                        res = await putRegisterMedidores(medidores);
                        if (!res) {
                            throw new Error('Lo sentimos algo paso');
                        }
                    }
                    setEdit(true);
                    setMedidores({...res})
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

                })
            }
        });
    }
    return (
        <Stack spacing={2}>
            <HeaderTurn turn={turn} title={'Turno de registro de medidores'} />
            <Stack alignItems='center' >
                <Paper sx={{ p: 2 }} elevation={10} >
                    <Stack width={300} spacing={1}>
                        <Stack alignItems='center'>
                            <Typography fontWeight='bold' fontSize={20}>Registro de medidores de luz</Typography>
                        </Stack>
                        <TextField value={medidores.measurement_time} type='time' onChange={e => setMedidores({ ...medidores, measurement_time: e.target.value })}></TextField>
                        <Typography fontWeight='bold'>Medicion canal</Typography>
                        <TextField value={medidores.measurement_channel} onChange={e => setMedidores({ ...medidores, measurement_channel: e.target.value })}></TextField>
                        <Typography fontWeight='bold'>Lectura kwh 1 </Typography>
                        <TextField value={medidores.reading_kwh_1} onChange={e => setMedidores({ ...medidores, reading_kwh_1: e.target.value })} ></TextField>
                        <Typography fontWeight='bold'>Lectura kvarh 8 </Typography>
                        <TextField value={medidores.reading_kvarh_8} onChange={e => setMedidores({ ...medidores, reading_kvarh_8: e.target.value })} ></TextField>
                        <Typography fontWeight='bold'>Lectura kwh 13 </Typography>
                        <TextField value={medidores.reading_kwh_13} onChange={e => setMedidores({ ...medidores, reading_kwh_13: e.target.value })} ></TextField>
                        <Typography fontWeight='bold'>Lectura kvarh 14 </Typography>
                        <TextField value={medidores.reading_kvarh_14} onChange={e => setMedidores({ ...medidores, reading_kvarh_14: e.target.value })} ></TextField>
                        <Stack alignItems='center' >
                            {!edit ?
                                <Button variant='contained' color="primary" onClick={registrar}>Guardar</Button> :
                                <Button variant='contained' color='secondary' onClick={registrar}>Editar</Button>}
                        </Stack>
                    </Stack>
                </Paper>
            </Stack>
        </Stack>
    );
}