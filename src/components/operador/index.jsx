import { getTurnById,registerTurn,endTurnAndCreate } from "@/api/turn";
import { getUserByOperator } from "@/api/user";
import { useAuth, useSession } from "@/auth/AuthProvider";
import { selectTurn} from "@/reducer/turn";
import { Save } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Skeleton, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, Select, MenuItem, Stack, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AlertSwal } from "@/service/sweetAlert";

export default function CoIndex() {
    const { user } = useSession()
    const dispatch = useDispatch();
    const turn = useSelector(selectTurn);
    const [operarios, setOperarios] = useState([]);
    const [optOperador, setOptOperador] = useState('Selecciona aquí');
    const {signOut} = useAuth();
    //TODO valida que si no existe el start date que registre el incio de turno 
    //TODO valida que si existe start_date no haga nada mas y pueda usar el sistemas
    //TODO VALIDA QUE si otro usuari ingresa no pueda hacer nada si el no esta activo
    useEffect(() => {
        
        (async () => {
            setOperarios(await getUserByOperator());
        })()
        if (!turn.user) {
            dispatch(getTurnById({ id: user.sub }));
        }

    }, [dispatch])
    async function finalizeTurn(e) {
        if(optOperador=='Selecciona aquí'){
            AlertSwal.fire({
                title:'Tienes que seleccionar un operador'
            })
        }else {
            try {
                const nextOp = operarios.find(el=>el.username == optOperador);
                
                await endTurnAndCreate({turn_id:turn.turn.id,user_id:nextOp.id});
                AlertSwal.fire({
                    title:'Finalizando el turno',
                    confirmButtonText:'Salir',
                    text:'¡Saludos, nos veremos mañana!',
                    preConfirm:async()=>{
                        await signOut();
                    }
                })
                
            } catch (error) {
                
            }
        }        
    }
    if (turn.loading) return <Skeleton />;
    return (
        <>
            <Stack alignItems='center' justifyContent='center'>
                <Paper elevation={10} sx={{ p: 2 }}>
                    <Stack spacing={2}>
                        <Typography fontSize={18} fontWeight='bold'>Selecciona el operador a pasar el turno</Typography>

                        <Select value={optOperador || ''} onChange={(e) => setOptOperador(e.target.value)}>
                            <MenuItem value='Selecciona aquí' >Selecciona aquí</MenuItem>
                            {operarios.map((v, idx) => <MenuItem value={v.username} key={idx}>{v.username}</MenuItem>)}
                        </Select>
                        <Button onClick={finalizeTurn} variant='contained' color='error'>Finalizar el Turno</Button>
                    </Stack>
                </Paper>
            </Stack>
            {turn.turn.user?<ModalRegister turn={turn.turn} user={user}/>:<ModalNoTurn/>}
        </>
    );
}
//TODO: HACER QUE registre el turno 
function ModalNoTurn(){
    const {signOut} = useAuth();
    const [open, setOpen] = useState(true);
    return(
        <Dialog open={open}>
            <DialogTitle>Tu turno no esta habilitado</DialogTitle>
            <DialogContent>
                <Typography>Lo sentimos verifica que el operador con turno haya finalizado</Typography>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color='error' onClick={async()=>await signOut()}>Salir</Button>
            </DialogActions>
        </Dialog>
    );
}
function ModalRegister({ turn,user }) {
    const [open, setOpen] = useState(true);
    const [saveTurn, setSaveTurn] = useState(false);
    const [selectOp, setSelectOp] = useState(turn);
    const [start_date,setStartDate] = useState(new Date());
    const {signOut} = useAuth();
    const dispatch = useDispatch();
    async function registerOp(e) {
        setSaveTurn(true)
        try {
            dispatch(registerTurn({turn_id:turn.id,user_id:user.sub}))
        } catch (error) {
            
        }
        setSaveTurn(false)
    }
    return (
        <Dialog open={open}>
            <DialogTitle>Registro de turno</DialogTitle>
            <DialogContent>
                <Box>
                    <Stack direction='row' spacing={1}>
                        <Typography>Turno número:</Typography>
                        <Typography fontWeight='bold'>{selectOp.turn}</Typography>
                    </Stack>
                    <Stack direction='row'  spacing={1}>
                        <Typography>Fecha de inicio:</Typography>
                        <Typography fontWeight='bold'>{turn.start_date}</Typography>
                    </Stack>
                    <Stack direction='row'  spacing={1}>
                        <Typography>Nombre del operador:</Typography>
                        <Typography fontWeight='bold'>{user.name}</Typography>
                    </Stack>
                </Box>
            </DialogContent>
            <DialogActions>
                {user.preferred_username == turn.user.username?
                turn.start_date?
                    <Button variant="contained" color='error' onClick={()=>setOpen(false)}>
                    Cerrar
                    </Button>:
                    <LoadingButton loading={saveTurn} startIcon={<Save/>} variant="contained" color='primary' onClick={registerOp}>
                        Registrar el turno
                    </LoadingButton>:
                <Button variant="contained" color='error' onClick={async()=>await signOut()}>Salir</Button>}
            </DialogActions>
        </Dialog>
    )
}