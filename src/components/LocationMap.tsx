"use client";

import { useState } from "react";

export default function LocationMap() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const center = { lat: 37.7749, lng: -122.4194 };
  const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=${googleApiKey}&q=${center.lat},${center.lng}`;

  return (
    <div className="flex flex-col items-center bg-primary-white w-1/2 rounded-2xl gap-y-4 py-3">
      <div className="text-hl-primary-blue font-bold text-lg">Location</div>
      <iframe
        width="85%"
        height="90%"
        loading="lazy"
        allowFullScreen={true}
        referrerPolicy="no-referrer-when-downgrade"
        src={mapSrc}
      ></iframe>
    </div>
  );
}
