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

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
        text: "Line Chart with 3 Lines",
      },
    },
  };

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isNormal, setIsNormal] = useState<boolean>(true);
  const [normalImage, setNormalImage] = useState<string>("");
  const [alarmImage, setAlarmImage] = useState<string>("");
  const [chartDatas, setChartDatas] = useState<any>(initData2);

  function convertToGMT7(timeStr: string) {
    const date = new Date(timeStr);
    const gmt7Date = new Date(date.getTime() + 7 * 60 * 60 * 1000); // Add 7 hours in milliseconds

    const year = gmt7Date.getFullYear();
    const month = String(gmt7Date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const day = String(gmt7Date.getDate()).padStart(2, "0");
    const hours = String(gmt7Date.getHours()).padStart(2, "0");
    const minutes = String(gmt7Date.getMinutes()).padStart(2, "0");

    // Return formatted string as "YYYY-MM-DDTHH:MM"
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/${name == "Gyrometer Graph" ? "gyroscope" : "accelerometer"}`,
        );
        const data = await response.json();
        const chartData = {
          labels: data.map((entry: {}) => convertToGMT7(Object.keys(entry)[0])), // Extracts the time (keys)
          datasets: [
            {
              label: "Magnitude",
              data: data.map(
                (entry: { [s: string]: unknown } | ArrayLike<unknown>) =>
                  Object.values(entry)[0],
              ), // Extracts the magnitude (values)
              fill: false,
              borderColor: "rgba(75, 192, 192, 1)",
              tension: 0.1,
            },
          ],
        };
        setChartDatas(chartData); // Assuming result is an array of key-value pairs
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  });

  return (
    <div className="h-full rounded-xl bg-primary-white p-6 duration-300 ease-in hover:scale-105 active:scale-100">
      {!isOpen ? (
        <div
          className="flex size-full flex-col items-center justify-center"
          onClick={() => setIsOpen(isOpen)}
        >
          <div className="flex flex-row justify-center">
            <div className="text-lg font-bold text-hl-primary-blue">{name}</div>
            {/* <button
              className="right-2 bg-white px-2 py-1 text-black"
              onClick={() => {
                setIsNormal(true);
              }}
            >
              clear
            </button> */}
          </div>
          {chartDatas ? (
            <Line data={chartDatas} options={options} />
          ) : (
            <div className="flex size-full items-center justify-center">
              <CircularProgress />
            </div>
          )}
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
