import { getTurnById } from "@/api/turn";
import { getUserByOperator, registerOperator } from "@/api/user";
import { useSession } from "@/auth/AuthProvider";
import { selectTurn, setTurn } from "@/reducer/turn";
import { Save } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Skeleton, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, Select, MenuItem, Stack, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEvents } from "@/api/utils";

export default function CoIndex() {
    const { user } = useSession()
    const dispatch = useDispatch();
    const turn = useSelector(selectTurn);
    const [operarios, setOperarios] = useState([]);
    const [optOperador, setOptOperador] = useState();
    //TODO valida que si no existe el start date que registre el incio de turno 
    //TODO valida que si existe start_date no haga nada mas y pueda usar el sistemas
    //TODO VALIDA QUE si otro usuari ingresa no pueda hacer nada si el no esta activo
    useEffect(() => {
        if (!turn.user) {
            (async () => {
                setOperarios(await getUserByOperator());
            })()
            console.log(user)
            dispatch(getTurnById({ id: user.sub }));
            dispatch(getEvents());
        }

    }, [dispatch])
    function finalizeTurn(e) { }
    if (turn.loading) return <Skeleton />;
    return (
        <>
            <Stack alignItems='center' justifyContent='center'>

                <Paper elevation={10} sx={{ p: 2 }}>
                    <Stack spacing={2}>
                        <Typography fontSize={18} fontWeight='bold'>Selecciona el operador a pasar el turno</Typography>

                        <Select value={optOperador || ''} onChange={(e) => setOptOperador(e.target.value)}>
                            {operarios.map((v, idx) => <MenuItem value={v.username} key={idx}>{v.username}</MenuItem>)}
                        </Select>
                        <Button onClick={finalizeTurn} variant='contained' color='error'>Finalizar el Turno</Button>
                    </Stack>
                </Paper>
            </Stack>
        </>
    );
}
//TODO: HACER QUE registre el turno 
function ModalRegister({ turn, messaje, operador }) {
    const [open, setOpen] = useState(true);
    const [saveTurn, setSaveTurn] = useState(false);
    const [selectOp, setSelectOp] = useState(turn);
    const { user } = useSession();
    const dispatch = useDispatch();
    async function registerOp(e) {
        setSaveTurn(true)

        if (selectOp.operador) {
            const data = await registerOperator(selectOp)
            dispatch(setTurn(data))
        } else {
            console.error('registra el turno')
        }
        setSaveTurn(false)
        //const data = registerOp(turn)
    }
    return (
        <Dialog open={open}>
            <DialogTitle>{messaje}</DialogTitle>
            <DialogContent>
                <Box>
                    <Stack direction='row'>
                        <Typography>Turno número: </Typography>
                        <Typography fontWeight='bold'>{selectOp.turn}</Typography>
                    </Stack>
                    <Stack direction='row'>
                        <Typography>Fecha de inicio: </Typography>
                        <Typography fontWeight='bold'>{selectOp.start_date}</Typography>
                    </Stack>
                    <Stack direction='row'>
                        <Typography>Fecha de finalización: </Typography>
                        <Typography fontWeight='bold'>{selectOp.end_date}</Typography>
                    </Stack>
                    <Stack mt={2}>
                        <Select
                            disabled={turn.operador ? true : false}
                            value={selectOp.operador ? selectOp.operador : "Selecciona el operador"}
                            onChange={(v) => setSelectOp({ ...selectOp, operador: v.target.value })}
                        >
                            <MenuItem value="Selecciona el operador">Selecciona el operador</MenuItem>
                            {operador.map(v => <MenuItem value={v.username} key={v.id}>{v.username}</MenuItem>)}
                        </Select>
                    </Stack>
                </Box>
            </DialogContent>
            <DialogActions>

                <LoadingButton
                    disabled={turn.operador ? true : false}
                    loading={saveTurn}
                    startIcon={<Save />}
                    loadingPosition="start"
                    variant="contained"
                    color="success"
                    onClick={registerOp}>Registrar turno</LoadingButton>
                {user.name == turn.operador ? <Button variant="outlined" color="error" disabled={!turn.operador} onClick={() => setOpen(!open)}>Cerrar</Button> : null}
            </DialogActions>
        </Dialog>
    )
}