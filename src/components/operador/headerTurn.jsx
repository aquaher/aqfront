import { Paper, Stack, TextField, Typography } from "@mui/material";

export default function HeaderTurn({ turn,title }) {
    return (
        <Stack alignItems='center'>
            <Paper sx={{ p: 2 }} elevation={10}>
                <Stack alignItems='center'>
                    <Typography fontWeight='bold' fontSize={20}>{title}</Typography>
                </Stack>
                <Stack>
                    <Typography fontWeight='bold'>Turno: {turn.turn}</Typography>
                    <Typography fontWeight='bold'>Inicio de turno:</Typography>
                    <TextField disabled value={turn.start_date}></TextField>
                    <Typography fontWeight='bold'>Fin de turno:</Typography>
                    <TextField disabled value={turn.end_date}></TextField>
                </Stack>
            </Paper>
        </Stack>
    );
}