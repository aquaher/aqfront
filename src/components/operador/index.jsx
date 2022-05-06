import { verifyTurnByUser } from "@/api/turn";
import getTank  from "@/api/tank";
import { getUserByOperator, registerOperator } from "@/api/user";
import { useSession } from "@/auth/AuthProvider";
import { selectTurn, setTurn } from "@/reducer/turn";
import { Save } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Skeleton, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, Select, MenuItem,Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEvents } from "@/api/utils";

export default function CoIndex() {
    const dispatch = useDispatch();
    const turn = useSelector(selectTurn);
    const [operarios, setOperarios] = useState([]);
    useEffect(() => {
        (async () => {
            setOperarios(await getUserByOperator())
        })()
        dispatch(verifyTurnByUser());
        dispatch(getTank())
        dispatch(getEvents())
    }, [dispatch])
    return (
        <>
            {turn.loading?<Skeleton /> : <ModalRegister turn={turn.turn} messaje={turn.messaje} operador={operarios}/>}
        </>
    );
}
function ModalRegister({ turn,messaje,operador }) {
    const [open, setOpen] = useState(true);
    const [saveTurn, setSaveTurn] = useState(false);
    const [selectOp,setSelectOp] = useState(turn);
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