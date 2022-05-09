import { getVerifyWaterByTurn, putRegisterWater, setRegisterWater } from "@/api/water";
import { AlertSwal } from "@/service/sweetAlert";
import { Button, Skeleton, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

export default function Hwater({ tanque, turn }) {
    const model = {
        start_vol: 0,
        end_vol: 0,
        dispatch: 0,
        backwash: 0,
        total_produced: 0,
        tank: tanque,
        turn: turn
    };
    const [loadVerify, setLoadVerify] = useState(true)
    const [edit, setEdit] = useState(false);
    const [data, setData] = useState({...model});
    const total_produced = useMemo(() =>
        parseInt(data.start_vol) - parseInt(data.end_vol) + parseInt(data.dispatch)
        , [
            data.start_vol,
            data.end_vol,
            data.dispatch
        ])
    useEffect(() => {
        
        (async () => {
            setData({...model})
            
            const res = await getVerifyWaterByTurn({ tank_id: tanque.id, turn_id: turn.id })
            setLoadVerify(false);
            if(res){
                setEdit(true);
                setData({
                    start_vol: res.start_vol ,
                    end_vol: res.end_vol ,
                    dispatch: res.dispatch ,
                    backwash: res.backwash ,
                });
            }else{
                setEdit(false);
            }
            
        })()

    }, [tanque.name]);
    async function setRegistro(e) {
        if (data.start_vol != 0) {
            AlertSwal.fire({
                title: '¿Seguro que deseas guardar el registro?',
                showConfirmButton: true,
                confirmButtonText: 'Aceptar',
                showLoaderOnConfirm: true,
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                icon: 'question',
                preConfirm: async () => {
                    try {
                        let res = null;
                        if(!edit){
                            console.log('regis')
                            res = await setRegisterWater({ ...data, total_produced: total_produced });
                        }else{
                            console.log('edit')
                            res = await putRegisterWater({ ...data, total_produced: total_produced });
                        }
                        setEdit(true);
                        setData({...res})
                    } catch (error) {
                        AlertSwal.showValidationMessage('Lo sentimos ocurrio un error');
                    }
                },
                allowOutsideClick: () => !AlertSwal.isLoading(),
            }).then((res) => {
                if (res.isConfirmed) {
                    AlertSwal.fire({
                        title: 'Su registro se proceso con éxito',
                        confirmButtonText: 'Aceptar',
                    })
                }
            });
        } else {
            AlertSwal.fire({
                title: 'Debe llenar el registro',
                confirmButtonText: 'Aceptar',
            })
        }

    }
    if (loadVerify) return <Skeleton />;
    return (
        <Stack pt={2} pb={2} spacing={2}>
            <Typography fontWeight='bold'>Volumen inicial</Typography>
            <TextField variant="outlined" value={data.start_vol} onChange={e => setData({ ...data, start_vol: e.target.value })} type='number'></TextField>
            <Typography fontWeight='bold'>Volumen final</Typography>
            <TextField variant="outlined" value={data.end_vol} onChange={e => setData({ ...data, end_vol: e.target.value })} type='number'></TextField>
            <Typography fontWeight='bold'>Despacho</Typography>
            <TextField variant="outlined" value={data.dispatch} onChange={e => setData({ ...data, dispatch: e.target.value })} type='number'></TextField>
            {tanque.water != 'AGUA PURIFICADA' ? <>
                <Typography fontWeight='bold'>Retrolavado</Typography>
                <TextField variant="outlined" value={data.backwash} onChange={e => setData({ ...data, backwash: e.target.value })} type='number'></TextField>
            </> : null}
            <Typography fontWeight='bold'>Produccion</Typography>
            <TextField variant="outlined" value={total_produced}></TextField>
            <Stack alignItems='center'>
                {!edit ?
                    <Button variant='contained' color="primary" onClick={setRegistro}>Guadar</Button> :
                    <Button variant='contained' color='secondary' onClick={setRegistro}>Editar</Button>}
            </Stack>
        </Stack>
    );
}