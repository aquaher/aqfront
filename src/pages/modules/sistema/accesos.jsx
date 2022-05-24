import { listAcces, postCreatePermission, deletePermission } from "@/api/access";
import { getListMenu } from "@/api/menu";
import { getUsers } from "@/api/user";
import { AlertSwal } from "@/service/sweetAlert";
import { KeyboardArrowDown, KeyboardArrowUp, Shield } from "@mui/icons-material";
import { Paper, Skeleton, Stack, Table, TableCell, TableHead, TableRow, TableBody, TableContainer, IconButton, Tooltip, Checkbox, TablePagination, Box, Grid, Collapse, Typography, Button } from "@mui/material";
import { useEffect, useState } from "react";

export default function Saccesos() {
    const [users, setUsers] = useState();
    const [menu, setMenu] = useState([]);
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [user, setUser] = useState();
    const [oldAcces, setOldAccess] = useState([]);

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

    useEffect(() => {
        (async () => {
            const menu_list = await getListMenu();
            if (menu_list) {
                setMenu(menu_list);
            }
            const list_users = await getUsers();
            if (list_users) {
                setUsers(list_users);
            }
        })()
    }, []);
    async function getPermission(e, user) {
        const acceso = await listAcces({ user_id: user.id });
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
                icon:'error'
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
                                await deletePermission({ id: item.id })
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
                                const acc = await listAcces({ user_id: user.id });
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
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
        </>
    );
    return (
        <Stack>
            <Paper elevation={10} sx={{ p: 2 }}>
                <Stack spacing={2}>
                    <Stack direction={{ xs: 'column', sm: 'row' }}
                        spacing={{ xs: 1, sm: 2, md: 4 }}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                            <Table sx={{ minWidth: 300 }} >
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Nombre de usuario</TableCell>
                                        <TableCell>Rol de usuario</TableCell>
                                        <TableCell>Opciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users.map((user, idx) => {
                                        return (
                                            <TableRow key={idx}>
                                                <TableCell>{user.username}</TableCell>
                                                <TableCell>{user.type}</TableCell>
                                                <TableCell >
                                                    <Button onClick={e => getPermission(e, user)} startIcon={<Shield />} variant='contained' color='primary'>Permisos</Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Stack>
                            <TableContainer sx={{ maxHeight: 440 }}>
                                <Table sx={{ minWidth: 400 }}>
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
                    </Stack>
                    <Stack alignItems='center'>
                        <Button variant="contained" onClick={postPermission}>Guardar accesos</Button>
                    </Stack>
                </Stack>
            </Paper>

        </Stack>
    );
}



function EnhancedTableHead(props) {
    const { onSelectAllClick, numSelected, rowCount } =
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

