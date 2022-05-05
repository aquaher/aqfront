import { Dashboard, Factory, SupervisedUserCircle, Water, WaterDamage, WaterfallChart } from "@mui/icons-material";
import { Trabajador } from "@/components/icons/trabajajdor";
import Prueba from "@/pages/users/prueba";
import Prueba2 from "@/pages/users/prueba2";


export const menu = [
    {
        name:'inicio',
        icon:<Dashboard/>,
        componet:<Prueba/>
    },
    {
        name:'usuarios',
        icon:<Dashboard/>,
        componet:<Prueba/>
    },
    {
        name:'produccion',
        icon:<Factory/>,
        componet:<Prueba/>
    },
    {
        name:'operadores',
        icon: <Trabajador/>,
        componet:<Prueba/>
    },
    {
        name:'purificada',
        icon: <Water/>,
        componet:<Prueba/>
    },
    {
        name:'ultrafiltrada',
        icon: <WaterfallChart/>,
        componet:<Prueba/>
    },
    {
        name:'generica',
        icon: <WaterDamage/>,
        componet:<Prueba2/>
    }
]
