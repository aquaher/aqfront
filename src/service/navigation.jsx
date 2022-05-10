import { AppRegistration, Dashboard, EnergySavingsLeaf, EngineeringOutlined, Factory, GppGood, SupervisedUserCircle, TurnedIn, Water, WaterDamage, WaterfallChart, WaterfallChartRounded, WaterOutlined } from "@mui/icons-material";
import { Trabajador } from "@/components/icons/trabajajdor";
import { ChartAreasPline } from "@/components/icons/chart_areaspline";
import { WaterCircle } from "@/components/icons/water_cricle";


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
        icon:<EngineeringOutlined/>,
 
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
    },
    {
        name:'informe',
        icon: <ChartAreasPline/>,
    },
    {
        name:'turno',
        icon: <TurnedIn/>,
    },
    {
        name:'volumen',
        icon: <WaterfallChartRounded/>,
    },
    {
        name:'control_calidad',
        icon: <GppGood/>,
    },
    {
        name:'agua',
        icon: <WaterOutlined/>,
    }
]
