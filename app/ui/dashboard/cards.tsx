import {
  ClockIcon,
  UserGroupIcon,
  TruckIcon,
  CircleStackIcon,
  WrenchScrewdriverIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { lusitana } from "@/app/ui/fonts";
import { getDashboardStats } from "@/app/lib/data";

const iconMap = {
  vehicles: TruckIcon,
  users: UserGroupIcon,
  pending: ClockIcon,
  parts: CircleStackIcon,
  repairs: WrenchScrewdriverIcon,
  bookings: ArrowRightStartOnRectangleIcon,
};

export default async function CardWrapper() {
  const { users, bookings, pending, vehicles, parts, repairs } =
    await getDashboardStats();

  return (
    <>
      <h2 className="mt-6 text-lg font-semibold mb-2 text-gray-700">
        Quick Data Summary
      </h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
        <Card title="Vehicles" value={`${vehicles}`} type="vehicles" />
        <Card
          title="Users"
          subtitle="System users"
          value={users}
          type="users"
        />
        <Card
          title="Onroad"
          subtitle="Vehicles onroad"
          value={pending}
          type="pending"
        />
        <Card
          title="Inventory"
          subtitle="Old & new stocks"
          value={parts}
          type="parts"
        />
        <Card title="Repaired" value={repairs} type="repairs" />
        <Card
          title="Bookings"
          subtitle="Total deliveries"
          value={bookings}
          type="bookings"
        />
      </div>
      <div className="mt-4 flex items-center justify-between rounded-xl bg-gray-50 p-4">
        <h3 className="ml-2 text-sm text-gray-500">Updated just now</h3>
        <ClockIcon className="h-5 w-5 text-gray-500" />
      </div>
    </>
  );
}

export function Card({
  title,
  subtitle,
  value,
  type,
}: {
  title: string;
  subtitle?: string;
  value: number | string;
  type: "users" | "bookings" | "pending" | "vehicles" | "parts" | "repairs";
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm flex flex-col justify-between">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <div>
          <h3 className="ml-2 text-sm font-medium">{title}</h3>
          {<p className="ml-2 text-xs ">{subtitle}</p>}
        </div>
      </div>

      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-xl`}
      >
        {value}
      </p>
    </div>
  );
}
