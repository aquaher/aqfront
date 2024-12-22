import {
    AdminPanelSettings,
    AppRegistration,
    AssignmentInd,
    Dashboard,
    EnergySavingsLeaf,
    EngineeringOutlined,
    GppGood,
    ProductionQuantityLimits,
    TurnedIn,
    VerifiedUser,
    Water,
    WaterDamage,
    WaterDrop,
    WaterfallChart,
    WaterfallChartRounded,
    WaterOutlined
} from "@mui/icons-material";
import { Trabajador } from "@/components/icons/trabajajdor";
import { ChartAreasPline } from "@/components/icons/chart_areaspline";
import { WaterCircle } from "@/components/icons/water_cricle";


export const menu = [
    {
        name: 'inicio',
        icon: <Dashboard />,

    },
    {
        name: 'produccion',
        icon: <EngineeringOutlined />,

    },
    {
        name: 'operadores',
        icon: <Trabajador />,

    },
    {
        name: 'bitacora',
        icon: <AppRegistration />,
    },
    {
        name: 'medidor',
        icon: <EnergySavingsLeaf />,
    },
    {
        name: 'purificada',
        icon: <Water />,

    },
    {
        name: 'ultrafiltrada',
        icon: <WaterfallChart />,

    },
    {
        name: 'generica',
        icon: <WaterDamage />,
    },
    {
        name: 'ablandada',
        icon: <WaterDrop />,
    },

    {
        name: 'alimentacion de osmosis',
        icon: <WaterCircle />,
    },
    {
        name: 'informe',
        icon: <ChartAreasPline />,
    },
    {
        name: 'turno',
        icon: <TurnedIn />,
    },
    {
        name: 'volumen',
        icon: <WaterfallChartRounded />,
    },
    {
        name: 'control_calidad',
        icon: <GppGood />,
    },
    {
        name: 'agua',
        icon: <WaterOutlined />,
    },
    {
        name: 'sistema',
        icon: <AdminPanelSettings />,
    },
    {
        name: 'usuarios',
        icon: <AssignmentInd />,
    },
    {
        name: 'accesos',
        icon: <VerifiedUser />,
    },
    {
        name: 'produccion_total',
        icon: <ProductionQuantityLimits />,
    }
]
