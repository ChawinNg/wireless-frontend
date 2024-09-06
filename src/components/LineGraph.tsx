"use client";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function LineGraph({
  name,
  datas,
}: {
  name: string;
  datas: string[];
}) {
  const data = {
    labels: ["January", "February", "March", "April", "May", "May"],
    datasets: [
      {
        data: [30, 50, 70, 60, 90, 100],
        borderColor: "rgba(75, 192, 192, 1)",
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  return (
    <div className="flex flex-col bg-primary-white justify-center items-center p-6 rounded-xl h-full">
      <div className="text-hl-primary-blue font-bold text-lg">{name}</div>
      <Line data={data} options={options} />
    </div>
  );
}
