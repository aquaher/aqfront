import Hwater from "@/components/operador/hwater";
import { selectTank } from "@/reducer/tank";
import { Grid, Paper, Stack, Typography, Box, Input, Button } from "@mui/material";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectTurn } from "@/reducer/turn";
import HeaderTurn from "@/components/operador/headerTurn";

export default function Powater() {
    const { turn } = useSelector(selectTurn);
    const { value } = useSelector(selectTank)
    const { water } = useParams();
    const tipo = water.startsWith("gene") ? 'GENÉRICA' : water.toUpperCase();
    const tank = value.filter(e => e.water == `AGUA ${tipo}`);
    return (
        <Stack spacing={2}>
            <HeaderTurn turn={turn} title={`Agua ${tipo}`} />
            <Box>
                <Stack justifyContent='center' direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 2 }}>
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