import { Edit, Password, PersonAdd, PersonAddDisabled, PersonSearch } from "@mui/icons-material";
import { Box, Button, Chip, Dialog, DialogContent, DialogTitle, FormControl, FormControlLabel, FormGroup, FormLabel, IconButton, MenuItem, Paper, Select, Skeleton, Stack, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import useSWR from "swr"
import { Formik, Form, useFormik } from 'formik';
import keycloak from "@/api/keycloak";

const Formulario = ({groups}) => {
    const formik = useFormik({
        initialValues: {
            username: '',
            enabled: false,
            emailVerified: true,
            firstName: '',
            lastName: '',
            email: '',
            groups:'selecciona un grupo'
        },
        onSubmit: handleSubmit,
    });
    async function handleSubmit(value){
        let newVal = {...value,groups:[value.groups]}
        try {
            //await setUserKeycloak('/users',newVal)
            
            //const up = await getUserByUsernameKeycloak('/users',value.username);
            
            //const p = await getUsersKeycloak(`/users/${up[0].id}/groups`);
            
            ///groups/{groupId} delete
        } catch (error) {
            
        }
    }
    return (
        <form onSubmit={formik.handleSubmit}>
            <Typography>Nombre de usaurio</Typography>
            <TextField
                id="username"
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
            />
            <Typography>Nombres</Typography>
            <TextField
                id="firstName"
                name="firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange}
            />
            <Typography>Apellidos</Typography>
            <TextField
                id="lastName"
                name="lastName"
                value={formik.values.lastName}
                onChange={formik.handleChange}
            />
            <Typography>Corre electrónico</Typography>
            <TextField
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
            />
            <Typography>Corre electrónico</Typography>
            <Select id="groups" name="groups" value={formik.values.groups} onChange={formik.handleChange}>
                <MenuItem value={'selecciona un grupo'}>selecciona un grupo</MenuItem>
                {groups.map((d,idx)=><MenuItem value={d.name} key={idx}>{d.name}</MenuItem>)}
            </Select>
            <FormGroup>
                <FormControlLabel control={<Switch id="enabled" name="enabled" value={formik.values.enabled} onChange={formik.handleChange}/>} label='Verificar correo'/>
            </FormGroup>
            <Button variant="contained" type="submit">
                Guardar
            </Button>
        </form>
    );
}

export default function Susuarios() {
    const { data: users, error } = useSWR('/users', keycloak.get);
    const { data,error:err } = useSWR({url:'/groups',data:{params:{clientId:import.meta.env.VITE_CLIENT_ID}}}, keycloak.getBy);
    const [group, setGroup] = useState('selecciona un grupo');

    console.log(data)
    //realmRoles
    
    const [open, setOpen] = useState(false);
    if (error) return <Stack>Recarga la página</Stack>
    if (!users) return (
        <>
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
        </>
    );


    async function createUser(e) {

        
        //const prueba = await getUsersKeycloak('/users');
        //console.log(prueba)
    }

//delete /users/{id}
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
                                    {users.map((e, idx) => (
                                        <TableRow key={idx} >
                                            <TableCell>{e.username || ''}</TableCell>
                                            <TableCell>{e.lastName || ''}</TableCell>
                                            <TableCell>{e.firstName || ''}</TableCell>
                                            <TableCell>{e.enabled ?
                                                <Chip label='Activo' color='success' size="small" />
                                                : <Chip label='Inactivo' color='error' size="small" />}</TableCell>
                                            <TableCell>{e.email || ''}</TableCell>
                                            <TableCell>{e.emailVerified ?
                                                <Chip label='Verificado' color='success' size="small" />
                                                : <Chip label='No verificado' color='error' size="small" />}</TableCell>
                                            <TableCell>{new Date(e.createdTimestamp).toLocaleDateString() || ''}</TableCell>
                                            <TableCell>
                                                <Stack direction='row' spacing={1}>
                                                    <Tooltip title='Editar'>
                                                        <IconButton>
                                                            <Edit color="warning" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title={e.enabled ? 'Desactivar' : 'Activar'}>
                                                        <IconButton>
                                                            <PersonAddDisabled color={e.enabled ? 'error' : 'success'} />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <IconButton disabled={e.emailVerified}>
                                                        <PersonAddDisabled />
                                                    </IconButton>
                                                    <Tooltip title="Contraseña">
                                                        <IconButton >
                                                            <Password color="primary" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Ligar acceso un empleado">
                                                        <IconButton onClick={async(v)=>{
                                                            try {
                                                                
                                                                //await deleteUsersKeycloak(`/users/${e.id}`);
                                                            } catch (error) {
                                                                
                                                            }
                                                            
                                                        }}>
                                                            <PersonSearch color="info" />
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
                        
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    );
}
/*
<Typography>Nombre de usuario</Typography>
                        <TextField value={user.username} onChange={e=>setUser(prev=>({...prev,username:e.target.value}))}/>
                        <Typography>Nombres</Typography>
                        <TextField value={user.firstName} onChange={e=>setUser(prev=>({...prev,firstName:e.target.value}))}/>
                        <Typography>Apellidos</Typography>
                        <TextField value={user.lastName} onChange={e=>setUser(prev=>({...prev,lastName:e.target.value}))}/>
                        <Typography>Correo</Typography>
                        <TextField value={user.email} onChange={e=>setUser(prev=>({...prev,email:e.target.value}))} />
                        <Typography>Grupo</Typography>
                        <Select value={group} onChange={(e)=>setGroup(e.target.value)}>
                            <MenuItem value={'selecciona un grupo'}>selecciona un grupo</MenuItem>
                            {groups.map((d,idx)=><MenuItem value={d.name} key={idx}>{d.name}</MenuItem>)}
                        </Select>
                        <FormGroup>
                            <FormControlLabel control={<Switch value={user.emailVerified} defaultChecked onChange={e=>setUser(user=>({...user,emailVerified:e.target.checked}))}/>} label='Verificar correo'/>
                        </FormGroup>
                        <Button variant='contained' onClick={createUser}>Guardar</Button>
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