import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement,LineElement} from "chart.js";
import { useState } from "react";
import { Bar, Line } from "react-chartjs-2";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
)

export default function ChartJs({data,title,type}){
    const [opt,setOpt] = useState({
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: title,
            },
        },
    });

    if (type == 'GRÁFICO DE BARRAS') return  <Bar options={opt} data={data}/>
    if (type == 'GRÁFICO DE LINEAS') return  <Line options={opt} data={data}/>
    return null;
}