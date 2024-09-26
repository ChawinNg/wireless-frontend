"use client";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import { useEffect, useState } from "react";
import Image from "next/image";
import CircularProgress from "@mui/material/CircularProgress";
import mqtt, { IClientOptions } from "mqtt";
import { io } from "socket.io-client";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export default function LineGraph({ name }: { name: string }) {
  const initData = {
    labels: ["X", "Y", "Z"],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgb(75, 192, 192)",
        borderWidth: 1,
      },
    ],
  };

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isNormal, setIsNormal] = useState<boolean>(true);
  const [normalImage, setNormalImage] = useState<string>("");
  const [alarmImage, setAlarmImage] = useState<string>("");
  const [chartDatas, setChartDatas] = useState<any>(initData);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
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

  useEffect(() => {
    const socket = io("http://localhost:8000");

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("mqtt-message", (msg) => {
      if (msg.topic == "mpu") {
        console.log(msg);
        const chartData = {
          labels: ["X", "Y", "Z"],
          datasets: [
            {
              data:
                name == "Gyrometer Graph"
                  ? [
                      msg.message.gyroscope.x,
                      msg.message.gyroscope.y,
                      msg.message.gyroscope.z,
                    ]
                  : [
                      msg.message.accelerometer.x,
                      msg.message.accelerometer.y,
                      msg.message.accelerometer.z,
                    ],
              backgroundColor: "rgb(75, 192, 192)",
              borderColor: "rgb(75, 192, 192)",
              borderWidth: 1,
            },
          ],
        };
        setChartDatas(chartData);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="h-full rounded-xl bg-primary-white p-6 duration-300 ease-in hover:scale-105 active:scale-100">
      {normalImage && isOpen ? (
        <div
          className="flex size-full flex-col items-center justify-center"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="text-lg font-bold text-hl-primary-blue">{name}</div>
          <Bar data={chartDatas} options={options} />
        </div>
      ) : (
        <div className="size-full" onClick={() => setIsOpen(!isOpen)}>
          {normalImage ? (
            <div className="flex size-full flex-col items-center justify-center gap-y-4">
              <Image
                src={isNormal ? normalImage : alarmImage}
                alt={"test"}
                width={200}
                height={200}
              />
              <div className="text-3xl font-bold text-black">
                {isNormal ? "Normal" : "Falling"}
              </div>
            </div>
          ) : (
            <div className="flex size-full items-center justify-center">
              <CircularProgress />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
