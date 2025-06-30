import { DeliveryFilters } from "@/app/lib/definitions";
import { formatDateToLocal } from "@/app/lib/utils";
import {
  ArrowLongRightIcon,
  ArrowUturnRightIcon,
  CalendarDaysIcon,
  MapPinIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Fragment } from "react";
import DeliveryReportPDF from "../pdf/delivery-report-pdf";

type Props = { filters: DeliveryFilters; data: any[] };

export default function DeliveryReportData({ filters, data }: Props) {
  if (data.length === 0) return <p>No data found.</p>;

  return (
    <div className="overflow-x-auto">
      {/* summary */}
      <div className="border p-4 my-4 rounded-md bg-gray-50 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-lg font-semibold text-teal-700 mb-1">
              Delivery Report Summary
            </p>
            <div className="text-sm space-y-0.5">
              <p>
                <span className="font-medium">Start Date:</span>{" "}
                {filters.startDate || "-"}
              </p>
              <p>
                <span className="font-medium">End Date:</span>{" "}
                {filters.endDate || "-"}
              </p>
              {filters.vehicle && (
                <p>
                  <span className="font-medium">Vehicle No:</span>{" "}
                  {filters.vehicle}
                </p>
              )}
              {filters.query && (
                <p>
                  <span className="font-medium">
                    Booking / Challan / Voucher No:
                  </span>{" "}
                  {filters.query}
                </p>
              )}
            </div>
          </div>
          <PDFDownloadLink
            document={<DeliveryReportPDF data={data} filters={filters} />}
            fileName={`delivery-report-${filters.startDate || ""}-${
              filters.endDate || ""
            }.pdf`}
          >
            {({ loading }) => (
              <button className="border border-teal-600 text-teal-700 px-4 py-2 rounded hover:bg-teal-50 transition">
                {loading ? "Preparing PDF..." : "Download Delivery Report"}
              </button>
            )}
          </PDFDownloadLink>
        </div>
      </div>
      <table className="w-full table-auto border-collapse text-sm">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="px-4 py-2 border">#</th>
            <th className="px-4 py-2 border">Customer</th>
            <th className="px-4 py-2 border">Vehicle</th>
            {/* <th className="px-4 py-2 border">Driver</th> */}

            <th className="px-4 py-2 border">Route</th>
            <th className="px-4 py-2 border">Credit</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <Fragment key={row.id}>
              <tr key={row.id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border">
                  {row.id || "-"} <br /> {formatDateToLocal(row.created_at)}{" "}
                </td>
                <td className="px-4 py-2 border">{row.customer || "-"}</td>
                <td className="px-4 py-2 border">
                  {row.vehicle || "-"} <br />
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <TruckIcon className="w-4 h-4 text-teal-500" />
                    {row.driver}
                  </span>
                </td>
                {/* <td className="px-4 py-2 border">{row.driver || "-"}</td> */}
                <td className="whitespace-nowrap px-4 py-2 border">
                  <div className="flex flex-col gap-2 text-sm">
                    {/* One-way or First Leg */}
                    <div className="flex items-start gap-2">
                      <MapPinIcon className="w-4 h-4 text-gray-500 mt-1" />
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {row.pickup_address}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <CalendarDaysIcon className="w-3 h-3" />
                          {formatDateToLocal(row.pickup_dt)}
                        </span>
                      </div>
                      <ArrowLongRightIcon className="w-5 h-5 text-blue-500 mx-1 mt-1" />
                      <MapPinIcon className="w-4 h-4 text-gray-500 mt-1" />
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {row.dropoff_address}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <CalendarDaysIcon className="w-3 h-3" />
                          {formatDateToLocal(row.dropoff_dt)}
                        </span>
                      </div>
                    </div>

                    {/* Return Leg (if applicable) */}
                    {row.booking_type === "return" &&
                      row.return_pickup_dt &&
                      row.return_dropoff_dt && (
                        <div className="flex items-start gap-2 border-l-2 border-dashed border-gray-300 pl-3 ml-3">
                          <ArrowUturnRightIcon className="w-4 h-4 text-amber-500 mt-1" />
                          <MapPinIcon className="w-4 h-4 text-gray-500 mt-1" />
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {row.dropoff_address}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <CalendarDaysIcon className="w-3 h-3" />
                              {formatDateToLocal(row.return_pickup_dt)}
                            </span>
                          </div>
                          <ArrowLongRightIcon className="w-5 h-5 text-blue-500 mx-1 mt-1" />
                          <MapPinIcon className="w-4 h-4 text-gray-500 mt-1" />
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {row.pickup_address}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <CalendarDaysIcon className="w-3 h-3" />
                              {formatDateToLocal(row.return_dropoff_dt)}
                            </span>
                          </div>
                        </div>
                      )}
                  </div>
                </td>

                <td className="px-4 py-2 border text-right">
                  {row.credit_amount ?? 0}
                </td>
              </tr>
              {row.note && (
                <tr className=" text-sm">
                  <td
                    colSpan={6}
                    className="px-4 py-2 border-t whitespace-pre-wrap break-words"
                  >
                    <strong>Note:</strong> {row.note}
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
