import {
  getInventoryChartData,
  getMonthlyBookingsData,
  getMonthlyEarningsCosts,
  getMonthlyRepairs,
  getTopVehiclesData,
} from "@/app/lib/data";
import BookingTrendChart from "./charts/booking-chart";
import InventoryStats from "./charts/inventory-chart";
import TopVehiclesChart from "./charts/top-vehicles-chart";
import RepairActivityTimeline from "./charts/repair-activity-chart";
import MonthlyEarningsChart from "./charts/earning-expense-chart";


export default async function ChartWrapper() {
  const bookingData = await getMonthlyBookingsData();
  const { totalItems, totalStock, pieChartData, barChartData } = await getInventoryChartData();
  const topvehicles = await getTopVehiclesData();
  const revenueData = await getMonthlyEarningsCosts();
  const repairsData = await getMonthlyRepairs();
  return (
    <>
      <div className="mt-6">
        <BookingTrendChart data={bookingData} />
      </div>
      <div className="mt-6">
        <InventoryStats
          pieChartData={pieChartData}
          barChartData={barChartData}
        />
      </div>
      <div className="mt-6">
        <div className="w-full bg-white rounded-xl p-4 ">
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
            <TopVehiclesChart data={topvehicles} />
            <RepairActivityTimeline data={repairsData} />
          </div>
        </div>
      </div>
      <div className="mt-6">
        <MonthlyEarningsChart data={revenueData} />
      </div>
    </>
  );
}
