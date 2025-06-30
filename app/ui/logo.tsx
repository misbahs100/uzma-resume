import { TruckIcon } from "@heroicons/react/24/outline";
import { lusitana } from "@/app/ui/fonts";

export default async function Logo() {
 
  return (
    <div
      className={`${lusitana.className} flex items-center gap-2 text-white w-full `}
    >
      <TruckIcon className="h-7 w-7 flex-shrink-0" />
      <p
        className=" text-[20px] truncate w-full md:w-full"
        title="UZMA Travels Company Ltd."
      >
        UZMA
      </p>
    </div>
  );
}
