import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { Box, Checkbox, Collapse, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useState } from "react";

export default function CSIndex({ menu, original }) {
    return (

        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell padding="checkbox">
                            <Checkbox
                                color="primary"
                            />
                        </TableCell>
                        <TableCell>Modulo</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {menu.map((item, idx) => <DropMenu item={item} key={idx} />)}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

function hasChildren(item) {
    const { items: children } = item;
    if (children === undefined) {
        return false;
    }
    if (children.constructor !== Array) {
        return false;
    }

    if (children.length === 0) {
        return false;
    }

    return true;
}
function DropMenu({ item }) {
    return hasChildren(item)? <DropMenuMulti item={item}/>: <DropMenuItem item={item}/>
}

function DropMenuMulti({ item }) {
    
    const { items: children } = item;
    const [open, setOpen] = useState(false);
    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"

                    />
                </TableCell>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                    {item.title}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box>
                            <Table size="small">
                                <TableBody>
                                    {children.map((value, key) => <DropMenuItem item={value} key={key} />)}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}
function DropMenuItem({ item }) {
    return (
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
            <TableCell padding="checkbox">
                <Checkbox
                    color="primary"
                />
            </TableCell>
            <TableCell>{item.title}</TableCell>
        </TableRow>
    );
}