import { Dashboard, Factory, SupervisedUserCircle } from "@mui/icons-material";
import Index from "@/pages/Index";
import Prueba from "@/pages/users/prueba";
import { Trabajador } from "@/components/icons/trabajajdor";


export const menu = [
    {
        name:'dashboard',
        title:'INICIO',
        to:'inicio',
        icon:<Dashboard/>,
        items: []
    },
    {
        name:'usaurios',
        title:'USUARIOS',
        to:'usuario',
        icon:<Dashboard/>,
        items: []
    },
    {
        name:'produccion',
        title:'PRODUCCION',
        icon:<Factory/>,
        to:'/produccion',
        items: [
            {
                name:'operador',
                title:'INICIO',
                icon:<Dashboard/>,
                to:'produccion/opearador',
                items: []
            }
        ]
    }
]
