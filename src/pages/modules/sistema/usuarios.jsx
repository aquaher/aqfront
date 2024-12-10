import {listAcces, postCreatePermission, deletePermission} from "@/api/access";
import {getListMenu} from "@/api/menu";
import {getUsers, postUser, deleteUser, editUser, editUserPw} from "@/api/user";
import {AlertSwal} from "@/service/sweetAlert";
import {
    Edit,
    Password,
    PersonAdd,
    PersonRemove,
    PersonSearch, Refresh
} from "@mui/icons-material";
import {
    Paper,
    Skeleton,
    Stack,
    Table,
    TableCell,
    TableHead,
    TableRow,
    TableBody,
    TableContainer,
    IconButton,
    Tooltip,
    Checkbox,
    TablePagination,
    Box,
    Typography,
    Button,
    DialogTitle,
    DialogContent,
    Dialog,
    TextField,
    MenuItem,
    TableSortLabel, Fab
} from "@mui/material";
import {useEffect, useState} from "react";
import {useFormik} from "formik";

export default function Susuarios() {
    const [users, setUsers] = useState();
    const [menu, setMenu] = useState([]);
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [user, setUser] = useState();
    const [oldAcces, setOldAccess] = useState([]);
    const [openCreate, setOpenCreate] = useState(false);
    const [openPw, setOpenPw] = useState(false);
    const [openPermision, setOpenPermision] = useState(false);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = menu.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };
    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - menu.length) : 0;

    const fetchData = async () => {
        const menu_list = await getListMenu();
        if (menu_list) {
            setMenu(menu_list);
        }
        const list_users = await getUsers();
        if (list_users) {
            setUsers(list_users);
        }
    };

    const delUser = async (username, id) => {
        AlertSwal.fire({
            title: `¿Estas seguro de eliminar el usuario ${username}?`,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar',
            showLoaderOnConfirm: true,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            icon: 'question',
            preConfirm: async () => {
                try {
                    await deleteUser(id);
                } catch (error) {
                    AlertSwal.showValidationMessage(error);
                }
            },
            allowOutsideClick: () => !AlertSwal.isLoading()
        }).then(res => {
            if (res.isConfirmed) {
                AlertSwal.fire({
                    title: `El usuario ${username} elimino con éxito`,
                    confirmButtonText: 'Aceptar'
                })
                fetchData();
            }
        })
    }

    const handlePasswordSubmit = async (values) => {
        if (user) {
            try {
                if(values.password!="") {
                    user.password = values.password;
                    await editUserPw(user.id, user);
                    AlertSwal.fire({
                        title: 'Contraseña actualizada con éxito',
                        icon: 'success'
                    });
                    setOpenPw(false);
                } else{
                    AlertSwal.fire({
                        title: "Contraseña vacia",
                        icon: 'error'
                    })
                }
            } catch (error) {
                AlertSwal.fire({
                    title: 'Error al actualizar la contraseña',
                    text: error.message,
                    icon: 'error'
                });
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    async function getPermission(e, user) {
        const acceso = await listAcces({user_id: user.id});
        if (acceso) {
            let per = [];
            acceso.map(value => per.push(value.menu.id));
            setOldAccess(acceso)
            setSelected(per);
            setUser(user)
        }
    }

    async function postPermission(e) {
        if (!user) {
            AlertSwal.fire({
                title: 'Debes seleccionar un usuario',
                icon: 'error'
            })
        } else {
            AlertSwal.fire({
                title: `¿Estas seguro de actualizar el acceso de ${user.username}?`,
                showConfirmButton: true,
                confirmButtonText: 'Aceptar',
                showLoaderOnConfirm: true,
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                icon: 'question',
                preConfirm: async () => {
                    try {
                        let acceso = [];
                        selected.map((id) => {
                            let element = menu.find(m => m.id == id);
                            let pare = element.path.split('/');
                            if (pare.length > 1) {
                                pare.map(r => {
                                    let parent = menu.find(v => v.icon == r);
                                    if (selected.indexOf(parent.id) === -1) {
                                        acceso.push({
                                            menu: parent,
                                            user: user
                                        });
                                    }
                                })
                            }
                            acceso.push({
                                menu: element,
                                user: user
                            })
                        });
                        oldAcces.map(async item => {
                            if (selected.indexOf(item.menu.id) === -1) {
                                await deletePermission({id: item.id})
                            }
                        })
                        acceso.map(async item => {
                            if (!oldAcces.find(e => e.menu.id == item.menu.id)) {
                                await postCreatePermission(item)
                            }
                        })

                    } catch (error) {
                        AlertSwal.showValidationMessage(error);
                    }
                },
                allowOutsideClick: () => !AlertSwal.isLoading()
            }).then(res => {
                if (res.isConfirmed) {
                    AlertSwal.fire({
                        title: 'El acceso a este usuario se modificó con éxito',
                        confirmButtonText: 'Aceptar',
                        preConfirm: async () => {
                            try {
                                const acc = await listAcces({user_id: user.id});
                                if (acc) {
                                    let per = [];
                                    acc.map(value => per.push(value.menu.id));
                                    setOldAccess(acc)
                                    setSelected(per);
                                }
                            } catch (error) {

                            }
                        }
                    })
                }
            })
        }

    }

    if (!users) return (
        <>
            <Skeleton/>
            <Skeleton/>
            <Skeleton/>
            <Skeleton/>
            <Skeleton/>
        </>
    );

    const Formulario = ({userToEdit}) => {
        const formik = useFormik({
            initialValues: {
                username: userToEdit ? userToEdit.username : '',
                periodo: userToEdit ? userToEdit.periodo : '',
                type: userToEdit ? userToEdit.type : '',
                firstname: userToEdit ? userToEdit.firstname : '',
                lastname: userToEdit ? userToEdit.lastname : '',
                email: userToEdit ? userToEdit.email : '',
                password: ''
            },
            onSubmit: handleSubmit,
        });
        const tipos = ["operador", "usuario"];

        async function handleSubmit(value) {
            if (isEditing) {
                AlertSwal.fire({
                    title: `¿Estas seguro de editar el usuario ${value.username}?`,
                    showConfirmButton: true,
                    confirmButtonText: 'Aceptar',
                    showLoaderOnConfirm: true,
                    showCancelButton: true,
                    cancelButtonText: 'Cancelar',
                    icon: 'question',
                    preConfirm: async () => {
                        try {
                            await editUser(userToEdit.id, value);
                        } catch (error) {
                            AlertSwal.showValidationMessage(error);
                        }
                    },
                    allowOutsideClick: () => !AlertSwal.isLoading()
                }).then(res => {
                    if (res.isConfirmed) {
                        AlertSwal.fire({
                            title: `El usuario ${value.username} fue actualizado con éxito`,
                            confirmButtonText: 'Aceptar'
                        })
                        fetchData();
                        setOpenCreate(!openCreate);
                    }
                })
            } else {
                await postUser(value).then(async res => {
                    await fetchData();
                    await AlertSwal.fire({
                        title: `Usuario ${value.username} creado exitosamente`,
                        icon: 'success'
                    });
                    setOpenCreate(!openCreate);
                }).catch((err) => {
                    AlertSwal.fire({
                        title: err.response.data.message,
                        icon: 'error'
                    })
                });
            }
        }

        return (
            <form onSubmit={formik.handleSubmit}>
                <Stack direction={{xs: 'column', sm: 'row'}}
                       spacing={{xs: 1, sm: 2, md: 4}}>
                    <Stack>
                        <Typography>Usuario</Typography>
                        <TextField
                            id="username"
                            name="username"
                            value={formik.values.username}
                            onChange={formik.handleChange}
                        />
                        <Typography>Nombres</Typography>
                        <TextField
                            id="firstname"
                            name="firstname"
                            value={formik.values.firstname}
                            onChange={formik.handleChange}
                        />
                        <Typography>Correo electrónico</Typography>
                        <TextField
                            id="email"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                        />
                        <Typography>Periodo</Typography>
                        <TextField
                            id="periodo"
                            name="periodo"
                            value={formik.values.periodo}
                            onChange={formik.handleChange}
                        />
                    </Stack>
                    <Stack>
                        <Typography>Contraseña</Typography>
                        <TextField
                            id="password"
                            name="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                        />
                        <Typography>Apellidos</Typography>
                        <TextField
                            id="lastname"
                            name="lastname"
                            value={formik.values.lastname}
                            onChange={formik.handleChange}
                        />
                        <Typography>Tipo</Typography>
                        <TextField
                            id="tipo"
                            name="type"
                            select
                            value={formik.values.type}
                            onChange={formik.handleChange}
                            fullWidth
                        >
                            {tipos.map((d, idx) => (
                                <MenuItem value={d} key={idx}>
                                    {d}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Stack>
                </Stack>
                <Stack spacing={2} sx={{mt: 2}} alignItems='center'>
                    <Button variant="contained" type="submit">
                        Guardar
                    </Button>
                </Stack>
            </form>
        );
    }

    const PasswordForm = () => {
        const formik = useFormik({
            initialValues: {
                password: ''
            },
            onSubmit: handlePasswordSubmit,
        });

        return (
            <form onSubmit={formik.handleSubmit}>
                <Stack direction={{xs: 'column', sm: 'row'}} spacing={{xs: 1, sm: 2, md: 4}}>
                    <Typography>Contraseña</Typography>
                    <TextField
                        id="password"
                        name="password"
                        type="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                    />
                </Stack>
                <Stack spacing={2} sx={{mt: 2}} alignItems='center'>
                    <Button variant="contained" type="submit">
                        Actualizar contraseña
                    </Button>
                </Stack>
            </form>
        );
    };

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedUsers = [...users].sort((a, b) => {
        if (a[orderBy] < b[orderBy]) {
            return order === 'asc' ? -1 : 1;
        }
        if (a[orderBy] > b[orderBy]) {
            return order === 'asc' ? 1 : -1;
        }
        return 0;
    });

    return (
        <>
            <Stack>
                <Paper elevation={10} sx={{p: 2}}>
                    <Stack spacing={2}>
                        <Stack direction={{xs: 'column', sm: 'row'}}
                               spacing={{xs: 1, sm: 2, md: 4}} justifyContent="space-between">
                            <Box>
                                <Button startIcon={<PersonAdd/>} onClick={() => setOpenCreate(!openCreate)}
                                        variant='contained'>Nuevo usuario</Button>
                            </Box>
                            <Fab size="small" color="primary" aria-label="refresh" onClick={() => fetchData()}>
                                <Refresh/>
                            </Fab>
                        </Stack>
                        <Stack direction={{xs: 'column', sm: 'row'}}
                               spacing={{xs: 1, sm: 2, md: 4}}>
                            <TableContainer sx={{maxHeight: 500}}>
                                <Table sx={{minWidth: 300}}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={orderBy === 'username'}
                                                    direction={orderBy === 'username' ? order : 'asc'}
                                                    onClick={() => handleRequestSort('username')}
                                                >
                                                    Nombre de usuario
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={orderBy === 'periodo'}
                                                    direction={orderBy === 'periodo' ? order : 'asc'}
                                                    onClick={() => handleRequestSort('periodo')}
                                                >
                                                    Periodo
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={orderBy === 'type'}
                                                    direction={orderBy === 'type' ? order : 'asc'}
                                                    onClick={() => handleRequestSort('type')}
                                                >
                                                    Tipo
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={orderBy === 'lastname'}
                                                    direction={orderBy === 'lastname' ? order : 'asc'}
                                                    onClick={() => handleRequestSort('lastname')}
                                                >
                                                    Apellidos
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={orderBy === 'firstname'}
                                                    direction={orderBy === 'firstname' ? order : 'asc'}
                                                    onClick={() => handleRequestSort('firstname')}
                                                >
                                                    Nombres
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={orderBy === 'email'}
                                                    direction={orderBy === 'email' ? order : 'asc'}
                                                    onClick={() => handleRequestSort('email')}
                                                >
                                                    Correo
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>Opciones</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {sortedUsers.map((user, idx) => {
                                            return (
                                                <TableRow key={idx}>
                                                    <TableCell>{user.username || ''}</TableCell>
                                                    <TableCell>{user.periodo || ''}</TableCell>
                                                    <TableCell>{user.type || ''}</TableCell>
                                                    <TableCell>{user.lastname || ''}</TableCell>
                                                    <TableCell>{user.firstname || ''}</TableCell>
                                                    <TableCell>{user.email || ''}</TableCell>
                                                    <TableCell>
                                                        <Stack direction='row' spacing={1}>
                                                            <Tooltip title='Editar'>
                                                                <IconButton
                                                                    onClick={() => {
                                                                        setUser(user);
                                                                        setIsEditing(true);
                                                                        setOpenCreate(true);
                                                                    }}>
                                                                    <Edit color="warning"/>
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title='Eliminar'>
                                                                <IconButton
                                                                    onClick={() => delUser(user.username, user.id)}>
                                                                    <PersonRemove color='error'/>
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Cambiar contraseña">
                                                                <IconButton onClick={() => {
                                                                    const userWithoutPassword = { ...user };
                                                                    delete userWithoutPassword.password;
                                                                    setUser (userWithoutPassword);
                                                                    setOpenPw(true);
                                                                }}>
                                                                    <Password color="primary"/>
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Ligar acceso un empleado">
                                                                <IconButton onClick={(e) => {
                                                                    setUser (user);
                                                                    getPermission(e,user)
                                                                    setOpenPermision(true);
                                                                }}>
                                                                    <PersonSearch color="info"/>
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Stack>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Stack>
                    </Stack>
                </Paper>

            </Stack>
            <Dialog open={openCreate} onClose={() => {
                setOpenCreate(false);
                setIsEditing(false);
                setUser(null);
            }}>
                <DialogTitle>{isEditing ? 'Editar usuario' : 'Creación de nuevo usuario'}</DialogTitle>
                <DialogContent>
                    <Formulario userToEdit={isEditing ? user : null}/>
                </DialogContent>
            </Dialog>

            <Dialog open={openPw} onClose={() => {
                setOpenPw(false);
                setUser (null);
            }}>
                <DialogTitle>{`Actualizar contraseña del usuario ${user ? user.username : ''}`}</DialogTitle>
                <DialogContent>
                    <PasswordForm/>
                </DialogContent>
            </Dialog>
            <Dialog open={openPermision} onClose={() => {
                setOpenPermision(false);
                setUser (null);
            }}>
                <DialogTitle>{`Actualizar accesos del usuario ${user ? user.username : ''}`}</DialogTitle>
                <DialogContent>
                    <Stack>
                        <TableContainer sx={{maxHeight: 440}}>
                            <Table sx={{minWidth: 400}}>
                                <EnhancedTableHead
                                    numSelected={selected.length}
                                    onSelectAllClick={handleSelectAllClick}
                                    rowCount={menu.length}
                                />
                                <TableBody>
                                    {menu.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((el, idx) => {

                                        const isItemSelected = isSelected(el.id);
                                        const labelId = `enhanced-table-checkbox-${idx}`;
                                        return (
                                            <TableRow

                                                hover
                                                onClick={(event) => handleClick(event, el.id)}
                                                role="checkbox"
                                                aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                key={idx}
                                                selected={isItemSelected}>
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        color="primary"
                                                        checked={isItemSelected}
                                                        inputProps={{
                                                            'aria-labelledby': labelId,
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>{el.title}</TableCell>
                                                <TableCell>{el.path.toUpperCase()}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            labelRowsPerPage='Filas por página'
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            component="div"
                            count={menu.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}>
                        </TablePagination>
                    </Stack>
                    <Stack alignItems='center'>
                        <Button variant="contained" onClick={postPermission}>Guardar accesos</Button>
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    );


}


function EnhancedTableHead(props) {
    const {onSelectAllClick, numSelected, rowCount} =
        props;

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                    />
                </TableCell>
                <TableCell>Titulo</TableCell>
                <TableCell>Path</TableCell>
            </TableRow>
        </TableHead>
    );
}


