import getTank from "@/api/tank";
import { verifyTurnByUser } from "@/api/turn";
import { getUserByOperator, registerOperator } from "@/api/user";
import { useSession } from "@/auth/AuthProvider";
import { selectTank } from "@/reducer/tank";
import { selectTurn, setTurn } from "@/reducer/turn";
import { AlertSwal } from "@/service/sweetAlert";
import { Save } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Skeleton, Box, Autocomplete, TextField, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, Stack, DialogActions, Button, Select, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function CoIndex() {
    const { user } = useSession();
    const dispatch = useDispatch();
    const tank = useSelector(selectTank);
    const { turn, messaje } = useSelector(selectTurn);
    const [operarios, setOperarios] = useState([]);
    const [open, setOpen] = useState(true);
    const [saveTurn, setSaveTurn] = useState(false);
    const [selectOp, setSelectOp] = useState(turn);
    const [inputValue, setInputValue] = useState('');
    useEffect(() => {
        (async () => {
            setOperarios(await getUserByOperator())
        })()
        dispatch(getTank());
        dispatch(verifyTurnByUser());
    }, [dispatch])
    const asd = [
        {
            num: '',
            asd: 1
        }
    ]
    const ModalRegister = () => (
        <Dialog open={open}>
            <DialogTitle>{messaje}</DialogTitle>
            <DialogContent>
                <Box>
                    <Stack direction='row'>
                        <Typography>Turno número: </Typography>
                        <Typography fontWeight='bold'>{turn.turn}</Typography>
                    </Stack>
                    <Stack direction='row'>
                        <Typography>Fecha de inicio: </Typography>
                        <Typography fontWeight='bold'>{turn.start_date}</Typography>
                    </Stack>
                    <Stack direction='row'>
                        <Typography>Fecha de finalización: </Typography>
                        <Typography fontWeight='bold'>{turn.end_date}</Typography>
                    </Stack>
                    <Stack mt={2}>
                        <Select 
                            disabled={turn.operador?true:false}
                            value={turn.operador==user.name?selectOp.operador||turn.operador:"Selecciona el operador"}
                            onChange={v => setSelectOp({...turn,operador:v.target.value})}
                            
                        >
                            <MenuItem value="Selecciona el operador">Selecciona el operador</MenuItem>
                            {operarios.map(v=><MenuItem value={v.username} key={v.id}>{v.username}</MenuItem>)}
                        </Select>
                    </Stack>
                </Box>
            </DialogContent>
            <DialogActions>

                <LoadingButton
                    disabled={turn.operador?true:false}
                    loading={saveTurn}
                    startIcon={<Save />}
                    loadingPosition="start"
                    variant="contained"
                    color="success"
                    onClick={registerOp}>Registrar turno</LoadingButton>
                {user.name == turn.operador ? <Button variant="outlined" color="error" disabled={!turn.operador} onClick={()=>setOpen(!open)}>Cerrar</Button> : null}
            </DialogActions>
        </Dialog>
    )
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
        <>
            {tank.loading && turn.loading && !operarios ? <Skeleton /> : ModalRegister()}
        </>
    );
}