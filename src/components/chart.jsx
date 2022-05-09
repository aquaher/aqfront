import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, } from "chart.js";
import { useState } from "react";
import { Bar } from "react-chartjs-2";

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
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
    return null;
}