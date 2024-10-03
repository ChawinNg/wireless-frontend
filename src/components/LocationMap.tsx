"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { io } from "socket.io-client";

export default function LocationMap() {
  const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [mapSrc, setMapSrc] = useState(
    `https://www.google.com/maps/embed/v1/place?key=${googleApiKey}&q=0,0`,
  );

  useEffect(() => {
    let latitude = 0.0;
    let longitude = 0.0;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          latitude = position.coords.latitude;
          longitude = position.coords.longitude;
        },
        (error) => {
          console.error("Error getting location: ", error);
        },
      );
    }

    const socket = io("http://localhost:8000");

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("mqtt-message", (msg) => {
      // setTimeout(() => {
      //   setMapSrc(
      //     `https://www.google.com/maps/embed/v1/directions?key=${googleApiKey}&origin=${latitude},${longitude}&destination=${msg.message.latitude},${msg.message.longitude}`,
      //   );
      // }, 120000);
    });
    setMapSrc(
      `https://www.google.com/maps/embed/v1/directions?key=${googleApiKey}&origin=${13.736},${100.533283}&destination=${13.736975},${100.533283}`,
    );
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div
      className="h-[97%] w-1/2 rounded-2xl bg-primary-white duration-300 ease-in hover:scale-105 active:scale-100"
      onClick={() => {
        setIsOpen(isOpen);
      }}
    >
      {isOpen ? (
        <div className="flex size-full flex-col items-center gap-y-4 py-3">
          <div className="text-lg font-bold text-hl-primary-blue">Location</div>
          <iframe
            width="85%"
            height="90%"
            loading="lazy"
            allowFullScreen={true}
            referrerPolicy="no-referrer-when-downgrade"
            src={mapSrc}
          ></iframe>
        </div>
      ) : (
        <div className="flex size-full flex-col items-center justify-center gap-y-16">
          <Image src={"./location.svg"} alt={"test"} width={200} height={200} />
          <div className="text-3xl font-bold text-black">Location</div>
        </div>
      )}
    </div>
  );
}
