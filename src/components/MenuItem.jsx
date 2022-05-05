import { ExpandLessOutlined, ExpandMoreOutlined } from "@mui/icons-material";
import { ListItem, ListItemIcon, ListItemText, Collapse, List } from "@mui/material";
import { useState } from "react";
import { menu } from "@/service/navigation";
import { hasChildren } from "./utils";
import { Link, useNavigate, useRoutes } from "react-router-dom";

export default function MenuItem({item}){
    const Menu = hasChildren(item)? MultiLevel:SingleLevel;
    
    return <Menu item={item}/>
}
function SingleLevel({item}){
    const el =menu.find(e=>e.name==item.icon);
    return(
        <Link to={item.to} style={{ display: "block", textDecoration: "none",color:'white' }}>
        <ListItem button>
            <ListItemIcon>{el.icon}</ListItemIcon>
            <ListItemText>{item.title}</ListItemText>
        </ListItem>
        </Link>
    );
}
function MultiLevel({item}){
    const {items: children} = item;
    const [open,setOpen] = useState(false);

    function handleClick(e){
        setOpen(!open)
    }
    return(
        <>
        <ListItem button onClick={handleClick}>
            <ListItemIcon>{menu.find(e=>e.name==item.icon).icon}</ListItemIcon>
            <ListItemText primary={item.title}/>
            {open?<ExpandLessOutlined/>:<ExpandMoreOutlined/>}
        </ListItem>
        <Collapse in={open} timeout='auto' unmountOnExit>
            <List component='div' disablePadding>
                {children.map((child,key)=>(
                    <MenuItem key={key} item={child}/>
                ))}
            </List>
        </Collapse>
        </>
    );
}