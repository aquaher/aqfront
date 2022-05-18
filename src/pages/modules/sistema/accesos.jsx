import { getUsers } from "@/api/user";
import { Shield } from "@mui/icons-material";
import { Paper, Skeleton, Stack, Table, TableCell, TableHead, TableRow, TableBody, TableContainer, IconButton, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";

export default function Saccesos() {
    const [users, setUsers] = useState();
    useEffect(() => {
        (async () => {
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
                <TableContainer>
                    <Table sx={{ minWidth: 650 }}>
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
                                        <TableCell>
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
            </Paper>
        </Stack>
    );
}