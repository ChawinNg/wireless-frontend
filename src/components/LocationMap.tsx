"use client";

import { useState } from "react";
import Image from "next/image";

export default function LocationMap() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const center = { lat: 37.7749, lng: -122.4194 };
  const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=${googleApiKey}&q=${center.lat},${center.lng}`;

  return (
    <div
      className="h-[97%] w-1/2 rounded-2xl bg-primary-white duration-300 ease-in hover:scale-105 active:scale-100"
      onClick={() => {
        setIsOpen(!isOpen);
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
