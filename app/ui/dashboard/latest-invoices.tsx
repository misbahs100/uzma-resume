import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
export default async function LatestInvoices() {
  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Latest Transactions
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        <div className="bg-white px-6">
          <div className="flex items-center justify-between border-b py-4">
            <h3 className="text-lg font-semibold">Trx #12345</h3>
            <p className="text-sm text-gray-500">৳ 1,000.00</p>
          </div>
          <div className="flex items-center justify-between border-b py-4">
            <h3 className="text-lg font-semibold">Trx #12346</h3>
            <p className="text-sm text-gray-500">৳ 2,000.00</p>
          </div>
          <div className="flex items-center justify-between border-b py-4">
            <h3 className="text-lg font-semibold">Trx #12347</h3>
            <p className="text-sm text-gray-500">৳ 3,000.00</p>
          </div>
        </div>
        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
        </div>
      </div>
    </div>
  );
}
