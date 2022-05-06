import Hwater from "@/components/operador/hwater";
import { selectTank } from "@/reducer/tank";
import { Grid, Paper, Stack, Typography, Box, Input, Button } from "@mui/material";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectTurn } from "@/reducer/turn";

export default function Powater() {
    const { turn } = useSelector(selectTurn);
    const { value } = useSelector(selectTank)
    const { water } = useParams();
    const tipo = water.startsWith("gene") ? 'GENÉRICA' : water.toUpperCase();
    const tank = value.filter(e => e.water == `AGUA ${tipo}`);
    return (
        <Stack spacing={2}>
            <Stack direction='row' justifyContent='center'>
                <Paper sx={{ p: 2, width: 300 }} elevation={10}>
                    <Stack alignItems='center'>
                        <Typography fontWeight='bold' fontSize={20}>Agua {water}</Typography>
                    </Stack>
                    <Stack>
                        <Typography fontWeight='bold'>Turno: {turn.turn}</Typography>
                        <Typography fontWeight='bold'>Operador:</Typography>
                        <Input disabled value={turn.operador}></Input>
                        <Typography fontWeight='bold'>Inicio de turno:</Typography>
                        <Input disabled value={turn.start_date}></Input>
                        <Typography fontWeight='bold'>Fin de turno:</Typography>
                        <Input disabled value={turn.end_date}></Input>
                    </Stack>
                </Paper>
            </Stack>
            <Box>
                <Stack  justifyContent='center' direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 2 }}>
                    {tank.map((tanque, idx) => {
                        return (

                                <Paper sx={{ p: 2 }} elevation={10} key={idx}>
                                    <Stack alignItems='center'>
                                        <Typography fontWeight='bold' fontSize={20}>Registro para el tanque {tanque.name}</Typography>
                                    </Stack>
                                    <Hwater tanque={tanque} turn={turn} />
                                </Paper>

                        );
                    })}
                </Stack>
            </Box>
        </Stack>

    );
}