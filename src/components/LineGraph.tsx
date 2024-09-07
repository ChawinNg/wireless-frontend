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
import { useEffect, useState } from "react";
import Image from "next/image";
import CircularProgress from "@mui/material/CircularProgress";

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
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isNormal, setIsNormal] = useState<boolean>(true);
  const [normalImage, setNormalImage] = useState<string>("");
  const [alarmImage, setAlarmImage] = useState<string>("");

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

  useEffect(() => {
    if (name == "Gyrometer Graph") {
      setNormalImage("./profile_green.svg");
      setAlarmImage("./profile_red.svg");
    } else {
      setNormalImage("./speed_normal.svg");
      setAlarmImage("./speed_fast.svg");
    }
  }, []);

  return (
    <div className="bg-primary-white p-6 rounded-xl h-full">
      {normalImage && isOpen ? (
        <div
          className="flex flex-col size-full justify-center items-center"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="text-hl-primary-blue font-bold text-lg">{name}</div>
          <Line data={data} options={options} />
        </div>
      ) : (
        <div className="size-full" onClick={() => setIsOpen(!isOpen)}>
          {normalImage ? (
            <div className="flex flex-col size-full justify-center items-center gap-y-4">
              <Image
                src={isNormal ? normalImage : alarmImage}
                alt={"test"}
                width={200}
                height={200}
              />
              <div className="text-black font-bold text-3xl">
                {isNormal ? "Normal" : "Falling"}
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center size-full">
              <CircularProgress />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
