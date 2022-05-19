import { getListMenu } from "@/api/menu";
import { getUsers } from "@/api/user";
import CSIndex from "@/components/sistema";
import { KeyboardArrowDown, KeyboardArrowUp, Shield } from "@mui/icons-material";
import { Paper, Skeleton, Stack, Table, TableCell, TableHead, TableRow, TableBody, TableContainer, IconButton, Tooltip, Checkbox, TablePagination, Box, Grid, Collapse, Typography, Button } from "@mui/material";
import { useEffect, useState } from "react";

export default function Saccesos() {
    const [users, setUsers] = useState();
    const [menu, setMenu] = useState();
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [menu_convert, setMenuConvert] = useState([]);

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
                let data = [];
                menu_list.map(element => {
                    let nav = element.path.split('/');
                    codeMenu(data, element, nav)
                })
                setMenuConvert(data);
            }
            const list_users = await getUsers();
            if (list_users) {
                setUsers(list_users);
            }
        })()
    }, []);
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
                <Stack direction={{ xs: 'column', sm: 'row' }}
                    spacing={{ xs: 1, sm: 2, md: 4 }}>
                    <TableContainer>
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
                                                <Tooltip title='Permisos'>
                                                    <IconButton>
                                                        <Shield htmlColor="#2A4DEB" />
                                                    </IconButton>
                                                </Tooltip>
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
                                                <TableCell>{el.module}</TableCell>
                                                <TableCell>{el.title}</TableCell>
                                            </TableRow>
                                        );
                                    })}

                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            labelRowsPerPage='Filas por página'
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={menu.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}>

                        </TablePagination>
                    </Stack>
                </Stack>
            </Paper>
            <Button onClick={()=>selected.map(el=>console.log(menu.find(e=>e.id==el)))}>Prueba</Button>
            <CSIndex menu={menu_convert} original={menu}/>
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
                <TableCell>Modulo</TableCell>
                <TableCell>Titulo</TableCell>
            </TableRow>
        </TableHead>
    );
}

function HeadTableSelected(props){
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
                </TableRow>
            </TableHead>
        );
}


function hasChildren(nav) {
    return !(nav.length == 1);
}
function codeMenu(data, item, nav) {

    if (hasChildren(nav)) {
        multiItem(data.find(e => e.icon == nav[0]), item, nav);
    } else {
        singleItem(data, item)
    }
}
function multiItem(data, item, nav) {
    nav.shift()
    codeMenu(data.items, item, nav)
}
function singleItem(data, item) {
    data.push({
        name: item.module,
        icon: item.icon,
        path: '/' + item.path,
        title: item.title,
        items: []
    })
}

