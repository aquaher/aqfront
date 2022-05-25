import { getUsersFetcher, getUsersKeycloak, setUserKeycloak } from "@/api/user";
import { Edit, Password, PersonAdd, PersonAddDisabled, PersonSearch } from "@mui/icons-material";
import { Box, Button, Chip, Dialog, DialogContent, DialogTitle, FormControlLabel, FormGroup, IconButton, Paper, Skeleton, Stack, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import useSWR from "swr"

export default function Susuarios() {
    const { data, error } = useSWR('/users', getUsersKeycloak);
    const [user, setUser] = useState({
        username: '',
        enabled: false,
        emailVerified: true,
        firstName: '',
        lastName: '',
        email: '',
        groups:[],
    });
    const [open, setOpen] = useState(false);
    if (error) return <Stack>Recarga la página</Stack>
    if (!data) return (
        <>
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
        </>
    );
    async function createUser(e) {
        console.log(user)
        const prueba = await getUsersKeycloak('/users');
        console.log(prueba)
    }
    return (
        <>
            <Stack spacing={2}>
                <Paper elevation={10} sx={{ p: 2 }}>
                    <Stack spacing={2}>
                        <Box>
                            <Button startIcon={<PersonAdd />} onClick={() => setOpen(!open)} variant='contained'>Nuevo usuario</Button>
                        </Box>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Nombre de usaurio</TableCell>
                                        <TableCell>Apellidos</TableCell>
                                        <TableCell>Nombres</TableCell>
                                        <TableCell>Usuario Activo</TableCell>
                                        <TableCell>correo</TableCell>
                                        <TableCell>correo verificado</TableCell>
                                        <TableCell>Fecha de creación</TableCell>
                                        <TableCell>Opciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.map((e, idx) => (
                                        <TableRow key={idx} >
                                            <TableCell>{e.username || ''}</TableCell>
                                            <TableCell>{e.lastName || ''}</TableCell>
                                            <TableCell>{e.firstName || ''}</TableCell>
                                            <TableCell>{e.enabled?
                                            <Chip label='Activo' color='success' size="small"/>
                                            :<Chip label='Inactivo' color='error' size="small"/>}</TableCell>
                                            <TableCell>{e.email || ''}</TableCell>
                                            <TableCell>{e.emailVerified?
                                            <Chip label='Verificado' color='success' size="small"/>
                                            :<Chip label='No verificado' color='error' size="small"/>}</TableCell>
                                            <TableCell>{new Date(e.createdTimestamp).toLocaleDateString() || ''}</TableCell>
                                            <TableCell>
                                                <Stack direction='row' spacing={1}>
                                                    <Tooltip title='Editar'>
                                                        <IconButton>
                                                            <Edit color="warning"/>
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title={e.enabled?'Desactivar':'Activar'}>
                                                        <IconButton>
                                                            <PersonAddDisabled color={e.enabled?'error':'success'}/>
                                                        </IconButton>
                                                    </Tooltip>
                                                        <IconButton disabled={e.emailVerified}>
                                                            <PersonAddDisabled/>
                                                        </IconButton>
                                                    <Tooltip title="Contraseña">
                                                        <IconButton >
                                                            <Password color="primary"/>
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Ligar acceso un empleado">
                                                        <IconButton >
                                                            <PersonSearch color="info"/>
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Stack>
                </Paper>
            </Stack>
            <Dialog open={open} onClose={() => setOpen(!open)} >
                <DialogTitle>Creación de nuevo usuario</DialogTitle>
                <DialogContent>
                    <Stack spacing={1}>
                        <Typography>Nombre de usuario</Typography>
                        <TextField value={user.username} onChange={e=>setUser(prev=>({...prev,username:e.target.value}))}/>
                        <Typography>Nombres</Typography>
                        <TextField value={user.firstName} onChange={e=>setUser(prev=>({...prev,firstName:e.target.value}))}/>
                        <Typography>Apellidos</Typography>
                        <TextField value={user.lastName} onChange={e=>setUser(prev=>({...prev,lastName:e.target.value}))}/>
                        <Typography>Correo</Typography>
                        <TextField value={user.email} onChange={e=>setUser(prev=>({...prev,email:e.target.value}))} />
                        <FormGroup>
                            <FormControlLabel control={<Switch value={user.emailVerified} defaultChecked onChange={e=>setUser(user=>({...user,emailVerified:e.target.checked}))}/>} label='Verificar correo'/>
                        </FormGroup>
                        <Button variant='contained' onClick={createUser}>Guardar</Button>
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