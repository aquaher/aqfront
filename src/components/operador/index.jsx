import getTank from "@/api/tank";
import { verifyTurnByUser } from "@/api/turn";
import { getUserByOperator } from "@/api/user";
import { selectTank } from "@/reducer/tank";
import { selectTurn } from "@/reducer/turn";
import { AlertSwal } from "@/service/sweetAlert";
import { Modal, Skeleton, Box, Autocomplete,TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function CoIndex() {
    const dispatch = useDispatch();
    const tank = useSelector(selectTank);
    const turn = useSelector(selectTurn);
    const [operarios, setOperarios] = useState(null);
    const [open, setOpen] = useState(true);
    useEffect(() => {
        (async () => {
            setOperarios(await getUserByOperator())
        })()
        dispatch(getTank());
        dispatch(verifyTurnByUser());
    }, [dispatch])
    
    function Register() {
        AlertSwal.fire({
            title: turn.messaje,
            html: `${<Box>
                <TextField label="Operadores"/>
            </Box>}`
        })
    }
    return (
        <>
            {tank.loading && turn.loading ? <Skeleton /> : Register()}
        </>
    );
}