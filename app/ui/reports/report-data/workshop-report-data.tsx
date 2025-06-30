"use client";
import { formatDateToLocal } from "@/app/lib/utils";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Fragment } from "react";
import {
  WrenchScrewdriverIcon,
  UserIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import WorkshopReportPDF from "../pdf/workshop-report-pdf";

type WorkshopFilters = {
  startDate: string;
  endDate: string;
  vehicle: string;
  // mechanic: string;
  query: string;
};

type Props = { filters: WorkshopFilters; data: any[] };

export default function WorkshopDeliveryData({ filters, data }: Props) {
  if (data.length === 0) return <p>No data found.</p>;

  return (
    <div className="overflow-x-auto">
      {/* summary */}
      <div className="border p-4 my-4 rounded-md bg-gray-50 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-lg font-semibold text-teal-700 mb-1">
              Workshop Report Summary
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
              {/* {filters.mechanic && (
                <p>
                  <span className="font-medium">Mechanic:</span>{" "}
                  {filters.mechanic}
                </p>
              )} */}
              {filters.query && (
                <p>
                  <span className="font-medium">Memo / Job No:</span>{" "}
                  {filters.query}
                </p>
              )}
            </div>
          </div>
          {data && data.length > 0 && filters && (
            <PDFDownloadLink
              document={<WorkshopReportPDF data={data} filters={filters} />}
              fileName={`workshop-report-${filters.startDate || ""}-${
                filters.endDate || ""
              }.pdf`}
            >
              {({ loading }) => (
                <button className="border border-teal-600 text-teal-700 px-4 py-2 rounded hover:bg-teal-50 transition">
                  {loading ? "Preparing PDF..." : "Download Workshop Report"}
                </button>
              )}
            </PDFDownloadLink>
          )}
        </div>
      </div>
      <table className="w-full table-auto border-collapse text-sm">
        <thead>
          <tr className="bg-gray-200 text-left">
            {/* <th className="px-4 py-2 border">#</th> */}
            <th className="px-4 py-2 border">Vehicle</th>
            {/* <th className="px-4 py-2 border">Mechanic</th> */}
            <th className="px-4 py-2 border">Date</th>
            <th className="px-4 py-2 border">Parts</th>
            <th className="px-4 py-2 border text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <Fragment key={row.id || idx}>
              <tr className="hover:bg-gray-100">
                {/* <td className="px-4 py-2 border">{row.id || idx + 1}</td> */}
                <td className="px-4 py-2 border">
                  <span className="flex items-center gap-1">
                    <WrenchScrewdriverIcon className="w-4 h-4 text-teal-500" />
                    {row.vehicle || "-"}
                  </span>
                </td>
                {/* <td className="px-4 py-2 border">
                  <span className="flex items-center gap-1">
                    <UserIcon className="w-4 h-4 text-gray-500" />
                    {row.mechanic || "-"}
                  </span>
                </td> */}
                <td className="px-4 py-2 border">
                  <span className="flex items-center gap-1">
                    <CalendarDaysIcon className="w-4 h-4 text-gray-500" />
                    {formatDateToLocal(row.date)}
                  </span>
                </td>
                <td className="px-4 py-2 border">
                  {Array.isArray(row.parts)
                    ? row.parts.map((part: any, i: number) => (
                        <div key={i}>
                          {part.part} × {part.quantity} @ {part.price}
                        </div>
                      ))
                    : "-"}
                </td>
                <td className="px-4 py-2 border text-right">
                  {row.total ?? 0}
                </td>
              </tr>
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
