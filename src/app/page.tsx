import GoogleMap from "@/components/GoogleMap";
import LineGraph from "@/components/LineGraph";
import Image from "next/image";

export default function Application() {
  return (
    <div className="flex flex-col justify-center items-center p-12 gap-y-6 h-screen">
      <div className="font-bold text-2xl">
        Smart Notification System for Aging Society
      </div>
      <div className="flex flex-row size-full gap-x-12">
        <div className="flex flex-col w-1/2 h-full">
          <div className="h-1/2 pb-3">
            <LineGraph name={"Gyrometer Graph"} datas={[]} />
          </div>
          <div className="h-1/2 pt-3">
            <LineGraph name={"Accelerometer Graph"} datas={[]} />
          </div>
        </div>
        <GoogleMap />
      </div>
    </div>
  );
}
