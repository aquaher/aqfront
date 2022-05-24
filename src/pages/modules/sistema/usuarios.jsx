import { getUsersFetcher } from "@/api/user";
import { PersonAdd } from "@mui/icons-material";
import { Box, Button, Dialog, DialogContent, DialogTitle, Paper, Skeleton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { useState } from "react";
import useSWR from "swr"



export default function Susuarios() {
    const { data, error } = useSWR('/', getUsersFetcher);
    const [user, setUser] = useState({});
    const [open,setOpen] = useState(false);
    if (error) return <Stack>failed to load</Stack>
    if (!data) return (
        <>
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
        </>
    );
    async function createUser(){

    }
    return (
        <>
            <Stack spacing={2}>
                <Paper elevation={10} sx={{ p: 2 }}>
                    <Stack spacing={2}>
                        <Box>
                            <Button startIcon={<PersonAdd/>} onClick={()=>setOpen(!open)}  variant='contained'>Nuevo usuario</Button>
                        </Box>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Apellidos</TableCell>
                                        <TableCell>Nombres</TableCell>
                                        <TableCell>correo</TableCell>
                                        <TableCell>Opciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.map(e => (
                                        <TableRow>
                                            <TableCell>{e.username}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Stack>
                </Paper>
            </Stack>
            <Dialog open={open} onClose={()=>setOpen(!open)} >
                <DialogTitle>Creación de nuevo usuario</DialogTitle>
                <DialogContent>
                    <Stack spacing={1}>
                    <Typography>Nombre de usuario</Typography>
                    <TextField/>
                    <Typography>Nombres</Typography>
                    <TextField/>
                    <Typography>Apellidos</Typography>
                    <TextField/>
                    <Typography>Correo</Typography>
                    <TextField/>
                    <Button variant='contained'>Guardar</Button>
                    </Stack>
                    
                </DialogContent>
            </Dialog>
        </>
    );
}
/*

{
        "createdTimestamp": 1588880747548,
        "username": "Strange",
        "enabled": true,
        "totp": false,
        "emailVerified": true,
        "firstName": "Stephen",
        "lastName": "Strange",
        "email": "drstranger@marvel.com",
        "disableableCredentialTypes": [],
        "requiredActions": [],
        "notBefore": 0,
        "access": {
            "manageGroupMembership": true,
            "view": true,
            "mapRoles": true,
            "impersonate": true,
            "manage": true
        },
        "realmRoles": [	"mb-user" ]
    }
*/