import HeaderTurn from "@/components/operador/headerTurn";
import {selectTurn} from "@/reducer/turn";
import {AlertSwal} from "@/service/sweetAlert";
import {Paper, Stack, Typography, TextField, Button, Select, MenuItem} from "@mui/material";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {getUsers} from "@/api/user";
import {setRegisterAblandada} from "@/api/ablandamiento";

export default function PoAblandamiento() {
    const {turn} = useSelector(selectTurn);
    const [users, setUsers] = useState([]);
    const [ablandamiento, setAblandamiento] = useState({
        dateTime: null,

        bomba1: "",
        bomba2: "",

        caudalA1: "",
        caudalA2: "",
        caudalA3: "",
        caudalA4: "",

        presionA1: "",
        presionA2: "",
        presionA3: "",
        presionA4: "",

        durezaA1: "",
        durezaA1Gotas: "",
        durezaA2: "",
        durezaA2Gotas: "",
        durezaA3: "",
        durezaA3Gotas: "",
        durezaA4: "",
        durezaA4Gotas: "",

        volumenTK3: "",
        volumenTK4: "",

        userOp: null,
        userAyu: null
    });

    const hours = Array.from({length: 12}, (_, i) => {
        const hour = i * 2;
        return `${hour < 10 ? '0' + hour : hour}:00`; // Formato HH:mm
    });

    const fetchUsers = async () => {
        const list_users = await getUsers();
        if (list_users) {
            setUsers(list_users);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    async function registrar(e) {
        AlertSwal.fire({
            title: '¿Seguro que deseas guardar el registro de ablandamiento de agua?',
            showConfirmButton: true,
            confirmButtonText: 'Aceptar',
            showLoaderOnConfirm: true,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            icon: 'question',
            preConfirm: async () => {
                try {
                    if (!ablandamiento.dateTime) {
                        throw new Error("Ingrese una hora");
                    }
                    if(!ablandamiento.userOp){
                        throw new Error("Seleccione un operario");
                    }
                    const currentDate = new Date();
                    const [hours, minutes] = ablandamiento.dateTime.split(':');
                    const year = currentDate.getFullYear();
                    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
                    const day = String(currentDate.getDate()).padStart(2, '0');
                    const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}:00`;
                    const data = {...ablandamiento, dateTime: formattedDateTime};
                    const res = await setRegisterAblandada(data);
                    setAblandamiento(res)
                } catch (error) {
                    AlertSwal.showValidationMessage(error);

                }
            },
            allowOutsideClick: () => !AlertSwal.isLoading()
        }).then((res) => {
            if (res.isConfirmed) {
                AlertSwal.fire({
                    title: 'Su registro se proceso con éxito',
                    confirmButtonText: 'Aceptar',
                })
                setAblandamiento({
                    dateTime: null,

                    bomba1: "",
                    bomba2: "",

                    caudalA1: "",
                    caudalA2: "",
                    caudalA3: "",
                    caudalA4: "",

                    presionA1: "",
                    presionA2: "",
                    presionA3: "",
                    presionA4: "",

                    durezaA1: "",
                    durezaA1Gotas: "",
                    durezaA2: "",
                    durezaA2Gotas: "",
                    durezaA3: "",
                    durezaA3Gotas: "",
                    durezaA4: "",
                    durezaA4Gotas: "",

                    volumenTK3: "",
                    volumenTK4: "",

                    userOp: null,
                    userAyu: null
                })
            }
        });
    }

    return (
        <Stack spacing={2}>
            <HeaderTurn turn={turn} title='Ablandamiento de agua'/>

            <Stack justifyContent='center' direction={{xs: 'column', sm: 'row'}} spacing={{xs: 1, sm: 2, md: 2}}>
                <Paper sx={{p: 2}} elevation={10}>
                    <Stack spacing={1} minWidth={300} maxWidth={300}>
                        <Stack alignItems='center'>
                            <Typography fontWeight='bold' fontSize={20}>Registro de ablandamiento</Typography>
                        </Stack>
                        <Typography fontWeight='bold'>Hora de inicio</Typography>
                        <Select
                            value={ablandamiento.dateTime || ''}
                            onChange={e => {
                                setAblandamiento({...ablandamiento, dateTime: e.target.value})
                            }}
                            displayEmpty
                        >
                            <MenuItem value="" disabled>Selecciona una hora</MenuItem>
                            {hours.map((time, index) => (
                                <MenuItem key={index} value={time}>
                                    {time}
                                </MenuItem>
                            ))}
                        </Select>

                        <Stack alignItems='center'>
                            <Typography fontWeight='bold' fontSize={17}>Bomba alimentación</Typography>
                            <Typography fontWeight='bold' fontSize={10}>AMPERAJE (A) NOMINAL 35AMP</Typography>
                        </Stack>
                        <Stack justifyContent='center' direction={{xs: 'column', sm: 'row'}}
                               spacing={{xs: 1, sm: 2, md: 2}}>
                            <Stack>
                                <Typography fontWeight='bold'>Bomba1</Typography>
                                <TextField value={ablandamiento.bomba1}
                                           onChange={e => setAblandamiento({...ablandamiento, bomba1: e.target.value})}
                                           type='number'/>
                            </Stack>
                            <Stack>
                                <Typography fontWeight='bold'>Bomba2</Typography>
                                <TextField value={ablandamiento.bomba2}
                                           onChange={e => setAblandamiento({...ablandamiento, bomba2: e.target.value})}
                                           type='number'/>
                            </Stack>
                        </Stack>

                        <Stack alignItems='center'>
                            <Typography fontWeight='bold' fontSize={17}>Caudal</Typography>
                            <Typography fontWeight='bold' fontSize={10}>ABLANDADORES (m3/h)</Typography>
                        </Stack>

                        <Stack justifyContent='center' direction={{xs: 'column', sm: 'row'}}
                               spacing={{xs: 1, sm: 2, md: 2}}>
                            <Stack>
                                <Typography fontWeight='bold'>A1</Typography>
                                <TextField value={ablandamiento.caudalA1}
                                           onChange={e => setAblandamiento({
                                               ...ablandamiento,
                                               caudalA1: e.target.value
                                           })}
                                           type='number'/>
                            </Stack>
                            <Stack>
                                <Typography fontWeight='bold'>A2</Typography>
                                <TextField value={ablandamiento.caudalA2}
                                           onChange={e => setAblandamiento({
                                               ...ablandamiento,
                                               caudalA2: e.target.value
                                           })}
                                           type='number'/>
                            </Stack>
                        </Stack>

                        <Stack justifyContent='center' direction={{xs: 'column', sm: 'row'}}
                               spacing={{xs: 1, sm: 2, md: 2}}>
                            <Stack>
                                <Typography fontWeight='bold'>A3</Typography>
                                <TextField value={ablandamiento.caudalA3}
                                           onChange={e => setAblandamiento({
                                               ...ablandamiento,
                                               caudalA3: e.target.value
                                           })}
                                           type='number'/>
                            </Stack>
                            <Stack>
                                <Typography fontWeight='bold'>A4</Typography>
                                <TextField value={ablandamiento.caudalA4}
                                           onChange={e => setAblandamiento({
                                               ...ablandamiento,
                                               caudalA4: e.target.value
                                           })}
                                           type='number'/>
                            </Stack>
                        </Stack>

                        <Stack alignItems='center'>
                            <Typography fontWeight='bold' fontSize={17}>Presión</Typography>
                            <Typography fontWeight='bold' fontSize={10}>ENTRADA ABLANDADORES (PSI)</Typography>
                        </Stack>
                        <Stack justifyContent='center' direction={{xs: 'column', sm: 'row'}}
                               spacing={{xs: 1, sm: 2, md: 2}}>
                            <Stack>
                                <Typography fontWeight='bold'>A1</Typography>
                                <TextField value={ablandamiento.presionA1}
                                           onChange={e => setAblandamiento({
                                               ...ablandamiento,
                                               presionA1: e.target.value
                                           })}
                                           type='number'/>
                            </Stack>
                            <Stack>
                                <Typography fontWeight='bold'>A2</Typography>
                                <TextField value={ablandamiento.presionA2}
                                           onChange={e => setAblandamiento({
                                               ...ablandamiento,
                                               presionA2: e.target.value
                                           })}
                                           type='number'/>
                            </Stack>
                        </Stack>

                        <Stack justifyContent='center' direction={{xs: 'column', sm: 'row'}}
                               spacing={{xs: 1, sm: 2, md: 2}}>
                            <Stack>
                                <Typography fontWeight='bold'>A3</Typography>
                                <TextField value={ablandamiento.presionA3}
                                           onChange={e => setAblandamiento({
                                               ...ablandamiento,
                                               presionA3: e.target.value
                                           })}
                                           type='number'/>
                            </Stack>
                            <Stack>
                                <Typography fontWeight='bold'>A4</Typography>
                                <TextField value={ablandamiento.presionA4}
                                           onChange={e => setAblandamiento({
                                               ...ablandamiento,
                                               presionA4: e.target.value
                                           })}
                                           type='number'/>
                            </Stack>
                        </Stack>
                    </Stack>
                </Paper>
                <Paper sx={{p: 2}} elevation={10}>
                    <Stack spacing={1} minWidth={300} maxWidth={300}>


                        <Stack alignItems='center'>
                            <Typography fontWeight='bold' fontSize={17}>Dureza total salida</Typography>
                            <Typography fontWeight='bold' fontSize={10}>(mg/L)</Typography>
                        </Stack>
                        <Stack justifyContent='center' direction={{xs: 'column', sm: 'row'}}
                               spacing={{xs: 1, sm: 2, md: 2}}>
                            <Stack>
                                <Typography fontWeight='bold'>A1</Typography>
                                <TextField value={ablandamiento.durezaA1}
                                           onChange={e => setAblandamiento({
                                               ...ablandamiento,
                                               durezaA1: e.target.value
                                           })}
                                           type='number'/>
                            </Stack>
                            <Stack>
                                <Typography fontWeight='bold'>GOTAS</Typography>
                                <TextField value={ablandamiento.durezaA1Gotas}
                                           onChange={e => setAblandamiento({
                                               ...ablandamiento,
                                               durezaA1Gotas: e.target.value
                                           })}
                                           type='number'/>
                            </Stack>
                        </Stack>

                        <Stack justifyContent='center' direction={{xs: 'column', sm: 'row'}}
                               spacing={{xs: 1, sm: 2, md: 2}}>
                            <Stack>
                                <Typography fontWeight='bold'>A2</Typography>
                                <TextField value={ablandamiento.durezaA2}
                                           onChange={e => setAblandamiento({
                                               ...ablandamiento,
                                               durezaA2: e.target.value
                                           })}
                                           type='number'/>
                            </Stack>
                            <Stack>
                                <Typography fontWeight='bold'>GOTAS</Typography>
                                <TextField value={ablandamiento.durezaA2Gotas}
                                           onChange={e => setAblandamiento({
                                               ...ablandamiento,
                                               durezaA2Gotas: e.target.value
                                           })}
                                           type='number'/>
                            </Stack>
                        </Stack>

                        <Stack justifyContent='center' direction={{xs: 'column', sm: 'row'}}
                               spacing={{xs: 1, sm: 2, md: 2}}>
                            <Stack>
                                <Typography fontWeight='bold'>A3</Typography>
                                <TextField value={ablandamiento.durezaA3}
                                           onChange={e => setAblandamiento({
                                               ...ablandamiento,
                                               durezaA3: e.target.value
                                           })}
                                           type='number'/>
                            </Stack>
                            <Stack>
                                <Typography fontWeight='bold'>GOTAS</Typography>
                                <TextField value={ablandamiento.durezaA3Gotas}
                                           onChange={e => setAblandamiento({
                                               ...ablandamiento,
                                               durezaA3Gotas: e.target.value
                                           })}
                                           type='number'/>
                            </Stack>
                        </Stack>

                        <Stack justifyContent='center' direction={{xs: 'column', sm: 'row'}}
                               spacing={{xs: 1, sm: 2, md: 2}}>
                            <Stack>
                                <Typography fontWeight='bold'>A4</Typography>
                                <TextField value={ablandamiento.durezaA4}
                                           onChange={e => setAblandamiento({
                                               ...ablandamiento,
                                               durezaA4: e.target.value
                                           })}
                                           type='number'/>
                            </Stack>
                            <Stack>
                                <Typography fontWeight='bold'>GOTAS</Typography>
                                <TextField value={ablandamiento.durezaA4Gotas}
                                           onChange={e => setAblandamiento({
                                               ...ablandamiento,
                                               durezaA4Gotas: e.target.value
                                           })}
                                           type='number'/>
                            </Stack>
                        </Stack>

                        <Stack alignItems='center'>
                            <Typography fontWeight='bold' fontSize={17}>Volumen en tanques M3</Typography>
                        </Stack>

                        <Stack justifyContent='center' direction={{xs: 'column', sm: 'row'}}
                               spacing={{xs: 1, sm: 2, md: 2}}>
                            <Stack>
                                <Typography fontWeight='bold'>TK#3</Typography>
                                <TextField value={ablandamiento.volumenTK3}
                                           onChange={e => setAblandamiento({
                                               ...ablandamiento,
                                               volumenTK3: e.target.value
                                           })}
                                           type='number'/>
                            </Stack>
                            <Stack>
                                <Typography fontWeight='bold'>TK#4</Typography>
                                <TextField value={ablandamiento.volumenTK4}
                                           onChange={e => setAblandamiento({
                                               ...ablandamiento,
                                               volumenTK4: e.target.value
                                           })}
                                           type='number'/>
                            </Stack>
                        </Stack>

                        <Stack alignItems='center'>
                            <Typography fontWeight='bold' fontSize={17}>Operario</Typography>
                        </Stack>

                        <Select
                            value={ablandamiento.userOp ? ablandamiento.userOp.id : ''}
                            onChange={e => {
                                const selectedUser = users.find(user => user.id === e.target.value);
                                setAblandamiento({...ablandamiento, userOp: selectedUser});
                            }}
                            displayEmpty
                        >
                            <MenuItem value="" disabled>Selecciona un usuario</MenuItem>
                            {users.map((user, index) => (
                                <MenuItem key={index} value={user.id}>
                                    {user.username}
                                </MenuItem>
                            ))}
                        </Select>

                        <Stack alignItems='center'>
                            <Typography fontWeight='bold' fontSize={17}>Ayudante</Typography>
                        </Stack>

                        <Select
                            value={ablandamiento.userAyu ? ablandamiento.userAyu.id : ''}
                            onChange={e => {
                                const selectedUser = users.find(user => user.id === e.target.value);
                                setAblandamiento({...ablandamiento, userAyu: selectedUser});
                            }}
                            displayEmpty
                        >
                            <MenuItem value="" disabled>Selecciona un usuario</MenuItem>
                            {users.map((user, index) => (
                                <MenuItem key={index} value={user.id}>
                                    {user.username}
                                </MenuItem>
                            ))}
                        </Select>

                        <Stack alignItems='center'>
                            <Button variant='contained' color='primary' onClick={registrar}>Registrar</Button>
                        </Stack>
                    </Stack>
                </Paper>
            </Stack>
        </Stack>
    );
}