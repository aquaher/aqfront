import { selectEvents } from "@/reducer/events";
import { selectTurn } from "@/reducer/turn";
import { Box, Paper, Stack, Typography,Input } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Bitacora() {
    const { turn } = useSelector(selectTurn);
    const {event} = useSelector(selectEvents);
    const [bitacora, setBitacora] = useState({
        description: '',
        start_time: '',
        end_time: '',
        section: '',
        event:null,
        turn:turn
    });

    return (
        <Stack spacing={2}>
            <Stack alignItems='center'>
                <Paper sx={{ p: 2 }} elevation={10}>
                    <Stack alignItems='center'>
                        <Typography fontWeight='bold' fontSize={20}>Bitacora de {turn.operador}</Typography>
                    </Stack>
                    <Stack>
                        <Typography fontWeight='bold'>Turno: {turn.turn}</Typography>
                        <Typography fontWeight='bold'>Inicio de turno:</Typography>
                        <Input disabled value={turn.start_date}></Input>
                        <Typography fontWeight='bold'>Fin de turno:</Typography>
                        <Input disabled value={turn.end_date}></Input>
                    </Stack>
                </Paper>
            </Stack>
            <Stack alignItems='center' >
                <Paper sx={{ p: 2 }} elevation={10}>
                    <Stack alignItems='center'>
                        <Typography fontWeight='bold' fontSize={20}>Registro de bitacora</Typography>
                    </Stack>
                </Paper>
            </Stack>

        </Stack>
    );
}