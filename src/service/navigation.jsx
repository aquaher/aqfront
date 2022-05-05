import { Dashboard, Factory, SupervisedUserCircle, Water, WaterDamage, WaterfallChart } from "@mui/icons-material";
import { Trabajador } from "@/components/icons/trabajajdor";


export const menu = [
    {
        name:'inicio',
        icon:<Dashboard/>,
    },
    {
        name:'usaurios',
        icon:<Dashboard/>
    },
    {
        name:'produccion',
        icon:<Factory/>,
    },
    {
        name:'operadores',
        icon: <Trabajador/>,
    },
    {
        name:'purificada',
        icon: <Water/>,
    },
    {
        name:'ultrafiltrada',
        icon: <WaterfallChart/>,
    },
    {
        name:'generica',
        icon: <WaterDamage/>,
    }
]
