import { CalendarIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

export default async function RevenueChart() {


  return (
    <div className="w-full md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Recent Revenue
      </h2>
      <div className="rounded-xl bg-gray-50 p-4">
        <div className="flex items-center justify-between border-b py-4">
          <h3 className="text-lg font-semibold">Total Revenue</h3>
          <p className="text-sm text-gray-500">৳ 1,000.00</p>
        </div>
        <div className="flex items-center justify-between border-b py-4">
          <h3 className="text-lg font-semibold">Total Expenses</h3>
          <p className="text-sm text-gray-500">৳ 2,000.00</p>
        </div>
        <div className="flex items-center justify-between border-b py-4">
          <h3 className="text-lg font-semibold">Net Profit</h3>
          <p className="text-sm text-gray-500">৳ 3,000.00</p>
        </div>
        <div className="flex items-center justify-between border-b py-4">
          <h3 className="text-lg font-semibold">Net Loss</h3>
          <p className="text-sm text-gray-500">৳ 4,000.00</p>
        </div>
        <div className="flex items-center justify-between border-b py-4">
          <h3 className="text-lg font-semibold">Net Income</h3>
          <p className="text-sm text-gray-500">৳ 5,000.00</p>
        </div>
        <div className="flex items-center justify-between border-b py-4">
          <h3 className="text-lg font-semibold">Net Revenue</h3>
          <p className="text-sm text-gray-500">৳ 6,000.00</p>
        </div>
        <div className="flex items-center justify-between border-b py-4">
          <h3 className="text-lg font-semibold">Net Profit Margin</h3>
          <p className="text-sm text-gray-500">20%</p>
        </div>
        <div className="flex items-center justify-between border-b py-4">
          <h3 className="text-lg font-semibold">Net Loss Margin</h3>
          <p className="text-sm text-gray-500">10%</p>
        </div>
        <div className="flex items-center justify-between border-b py-4">
          <h3 className="text-lg font-semibold">Net Income Margin</h3>
          <p className="text-sm text-gray-500">15%</p>
        </div>
        <div className="flex items-center justify-between border-b py-4">
          <h3 className="text-lg font-semibold">Net Revenue Margin</h3>
          <p className="text-sm text-gray-500">25%</p>
        </div>
        <div className="flex items-center justify-between border-b py-4">
          <h3 className="text-lg font-semibold">Net Profit Ratio</h3>
          <p className="text-sm text-gray-500">30%</p>
        </div>
        <div className="flex items-center justify-between border-b py-4">
          <h3 className="text-lg font-semibold">Net Loss Ratio</h3>
          <p className="text-sm text-gray-500">5%</p>
        </div>
        <div className="flex items-center pb-2 pt-6">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Last 12 months</h3>
        </div>
      </div>
    </div>
  );
}
