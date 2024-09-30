"use client";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  BarElement,
  PointElement,
  LineElement,
} from "chart.js";
import { useEffect, useState } from "react";
import Image from "next/image";
import CircularProgress from "@mui/material/CircularProgress";
import mqtt, { IClientOptions } from "mqtt";
import { io } from "socket.io-client";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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

  const initData2 = {
    labels: [],
    datasets: [
      {
        label: "X",
        data: [],
        borderColor: "rgba(75,192,192,1)",
        fill: false,
      },
    ],
  };

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isNormal, setIsNormal] = useState<boolean>(true);
  const [normalImage, setNormalImage] = useState<string>("");
  const [alarmImage, setAlarmImage] = useState<string>("");
  const [chartDatas, setChartDatas] = useState<any>(initData2);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Line Chart with 3 Lines",
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
        const now = new Date();
        const currentTime = now.toLocaleTimeString();

        const gyro_amp = Math.sqrt(
          msg.message.gyroscope.y * msg.message.gyroscope.y +
            msg.message.gyroscope.z * msg.message.gyroscope.z,
        );

        const acc_amp = Math.abs(msg.message.accelerometer.x);

        // console.log(msg);
        setChartDatas((prevState: any) => ({
          ...prevState,
          labels: [...prevState.labels, currentTime],
          datasets: [
            {
              label: name,
              data: [
                ...prevState.datasets[0].data,
                name == "Gyrometer Graph" ? gyro_amp : acc_amp,
              ],
              borderColor: "rgba(75,192,192,1)",
              fill: false,
            },
          ],
        }));
      }
    });

    socket.on("alert", (msg) => {
      if (msg.message) {
        setIsNormal(false);
        setTimeout(() => {
          setIsNormal(true);
        }, 10000000);
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
          <div className="flex flex-row justify-center">
            <div className="text-lg font-bold text-hl-primary-blue">{name}</div>
            <button
              className="right-2 bg-white px-2 py-1 text-black"
              onClick={() => {
                setIsNormal(true);
              }}
            >
              clear
            </button>
          </div>
          <Line data={chartDatas} options={options} />
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
