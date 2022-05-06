import { AppRegistration, Dashboard, EnergySavingsLeaf, Factory, SupervisedUserCircle, Water, WaterDamage, WaterfallChart } from "@mui/icons-material";
import { Trabajador } from "@/components/icons/trabajajdor";


export const menu = [
    {
        name:'inicio',
        icon:<Dashboard/>,

    },
    {
        name:'usuarios',
        icon:<Dashboard/>,

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
        name:'bitacora',
        icon:<AppRegistration/>,
    },
    {
        name:'medidor',
        icon: <EnergySavingsLeaf/>,
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
