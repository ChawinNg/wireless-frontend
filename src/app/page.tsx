"use client";
import LineGraph from "@/components/LineGraph";
import LocationMap from "@/components/LocationMap";
import Modal from "@/components/Popup";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Image from "next/image";

export default function Application() {
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);

  useEffect(() => {
    const socket = io("http://localhost:8000");

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("alert", (msg) => {
      if (msg.message) {
        setShowModal(true);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-y-6 p-12">
      <div className="text-2xl font-bold">
        Smart Notification System for Aging Society
      </div>
      <div className="flex size-full flex-row gap-x-12">
        <div className="flex h-[97%] w-1/2 flex-col">
          <div className="h-1/2 pb-3">
            <LineGraph name={"Gyrometer Graph"} />
          </div>
          <div className="h-1/2 pt-3">
            <LineGraph name={"Accelerometer Graph"} />
          </div>
        </div>
        <LocationMap />
        <Modal show={showModal} onClose={handleCloseModal}>
          <Image src={"/potter.jpg"} alt={"test"} width={300} height={500} />
          <div className="text-3xl">แย่แล้ว! มีคนล้ม!</div>
        </Modal>
      </div>
    </div>
  );
}
