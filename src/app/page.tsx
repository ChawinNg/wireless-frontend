import LineGraph from "@/components/LineGraph";
import LocationMap from "@/components/LocationMap";

export default function Application() {
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
      </div>
    </div>
  );
}
