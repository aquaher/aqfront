import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { Box, Button, Checkbox, Collapse, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useState } from "react";

export default function CSIndex({ menu, original }) {
    const [selected, setSelected] = useState([]);
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = original.map((n) => n.id);
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

    const isSelected = (id) => selected.indexOf(id) !== -1;

    return (
<>
        <TableContainer>
            <Table>
                <TableHead>
                    <HeadTableSelected
                        numSelected={selected.length}
                        onSelectAllClick={handleSelectAllClick}
                        rowCount={original.length}
                    />
                </TableHead>
                <TableBody>
                    {menu.map((item, idx) => {
                        const isItemSelected = isSelected(item.id);
                        const labelId = `enhanced-table-checkbox-${idx}`;
                        return(
                            <DropMenu
                        item={item}
                        isItemSelected={isItemSelected}
                        labelId={labelId}
                        selected={selected}
                        handleClick={handleClick}
                        setSelected={setSelected}
                        original={original}
                        key={idx} />
                        );
                    
                    })}
                </TableBody>
            </Table>
        </TableContainer>
        <Button onClick={()=>console.log(selected)}>prueba</Button>
        </>
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
function DropMenu({ item,isItemSelected,labelId,selected,handleClick,setSelected,original }) {

    return hasChildren(item) ? 
    <DropMenuMulti item={item} labelId={labelId} selected={selected} setSelected={setSelected} original={original}/> 
    : <DropMenuItem item={item} isItemSelected={isItemSelected} labelId={labelId} handleClick={handleClick}/>
}

function DropMenuMulti({ item,labelId,selected,setSelected,original }) {
    
    const { items: children } = item;
    const [open, setOpen] = useState(false);
    const [sel,setSel] = useState([]);
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            let data = []
            const newSelecteds = children.map((n) => {
                const r = original.find(e=>e.id==n.id);
                data.push(r.id);
                return n.id;
            });
            setSelected([...selected,item.id,...data])
            setSel(newSelecteds)
            return;
        }
        
        const ind = selected.findIndex(e=>e==item.id);
        let data = selected.slice(0,ind);
        setSelected(data)
        setSel([]);
    };

    const handleClick2 = (event, id) => {
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
        if(selected.find(e=>e==item.id)){
            setSelected(newSelected);
        }else{
            setSelected([...newSelected,item.id]);
        }

        const selIndx = sel.indexOf(id);
        let newSel = [];
        if (selIndx === -1) {
            newSel = newSel.concat(sel, id);
        } else if (selIndx === 0) {
            newSel = newSel.concat(sel.slice(1));
        } else if (selIndx === sel.length - 1) {
            newSel = newSel.concat(sel.slice(0, -1));
        } else if (selIndx > 0) {
            newSel = newSel.concat(
                sel.slice(0, selIndx),
                sel.slice(selIndx + 1),
            );
        }
        if(!sel.find(e=>e==item.id)){
            setSel(newSel);
        }else{
            setSel([...newSel,item.id]);
        }

    };
    const isSelected = (id) => selected.indexOf(id) !== -1;
    /**
     * 
     * numSelected={selected.length}
                                    onSelectAllClick={handleSelectAllClick}
                                    rowCount={menu.length}
     */
    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}
            >
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={sel.length > 0 && sel.length < (children.length)}
                        checked={children.length > 0 && sel.length === (children.length)}     
                        onChange={handleSelectAllClick}
                        inputProps={{
                            'aria-labelledby': labelId,
                        }}
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
                                    {children.map((value, key) => {
                                        const isSelec = isSelected(value.id);
                                        const labelId = `enhanced-table-checkbox-${key}`;
                                        return(
                                            <DropMenu 
                                            item={value} 
                                            key={key} 
                                            isItemSelected={isSelec} 
                                            labelId={labelId} 
                                            selected={selected} 
                                            handleClick={handleClick2}
                                            original={original}
                                            setSelected={setSelected}/>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}
function DropMenuItem({ item,isItemSelected,labelId,handleClick }) {
    return (
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} hover
        onClick={(event) => handleClick(event, item.id)}
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
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
            <TableCell>{item.title}</TableCell>
        </TableRow>
    );
}

function HeadTableSelected(props) {
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
            </TableRow>
        </TableHead>
    );
}