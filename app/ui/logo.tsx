import { TruckIcon } from "@heroicons/react/24/outline";
import { lusitana } from "@/app/ui/fonts";

export default function Logo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-end leading-none text-white`}
    >
      <TruckIcon className="h-7 w-7 mr-2" />
      <p className="text-[22px]">UZMA</p>
    </div>
  );
}
