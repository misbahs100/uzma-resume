import { DeliveryFilters } from "@/app/lib/definitions";
import { formatDateToLocal } from "@/app/lib/utils";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Fragment, useState } from "react";
import { CrDrReportPDF } from "../pdf/crdr-report-pdf";

type Props = { filters: DeliveryFilters; data: any[] };

export default function CrDrReportData({ filters, data }: Props) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  if (data.length === 0) return <p>No data found.</p>;

  // Calculate totals from filtered data
  const totalCredit = data.reduce(
    (sum, row) => sum + (row.credit_amount ?? 0),
    0
  );

  const totalCost = data.reduce((sum, row) => {
    const costs = Array.isArray(row.delivery_costs_data)
      ? row.delivery_costs_data
      : typeof row.delivery_costs_data === "string"
      ? JSON.parse(row.delivery_costs_data)
      : [];
    return (
      sum +
      costs.reduce((acc: number, item: { cost: number }) => acc + item.cost, 0)
    );
  }, 0);

  return (
    <div className="overflow-x-auto">
      {/* reoprt summary */}
      <div className="border p-4 my-4 rounded-md bg-gray-50 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-lg font-semibold text-teal-700 mb-1">
              Cr/Dr Report Summary
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
          <div className="text-sm space-y-0.5">
            <p>
              <span className="font-medium">Total Credit:</span> ৳ {totalCredit}
            </p>
            <p>
              <span className="font-medium">Total Cost:</span> ৳ {totalCost}
            </p>
          </div>
          {data && data.length > 0 && filters && (
            <PDFDownloadLink
              document={<CrDrReportPDF data={data} filters={filters} />}
              fileName={`crdr-report-${filters.startDate || ""}-${
                filters.endDate || ""
              }.pdf`}
            >
              {({ loading }) => (
                <button className="border border-teal-600 text-teal-700 px-4 py-2 rounded hover:bg-teal-50 transition">
                  {loading ? "Preparing PDF..." : "Download CrDr Report"}
                </button>
              )}
            </PDFDownloadLink>
          )}
        </div>
      </div>

      <table className="w-full table-auto border-collapse text-sm">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="px-4 py-2 border">#</th>
            <th className="px-4 py-2 border">Vehicle</th>
            <th className="px-4 py-2 border text-right">Credit</th>
            <th className="px-4 py-2 border text-right">Cost</th>
            <th className="px-4 py-2 border text-right">Debit</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            const rowId = row.id?.toString() || row._id?.toString();
            const costs = Array.isArray(row.delivery_costs_data)
              ? row.delivery_costs_data
              : typeof row.delivery_costs_data === "string"
              ? JSON.parse(row.delivery_costs_data)
              : [];

            const totalCost = costs.reduce(
              (acc: number, item: { cost: number }) => acc + item.cost,
              0
            );
            const isExpanded = rowId && expandedRows.has(rowId);

            return (
              <Fragment key={rowId}>
                <tr className="hover:bg-gray-100">
                  <td className="px-4 py-2 border">
                    {row.id || "-"} <br /> {formatDateToLocal(row.created_at)}{" "}
                  </td>
                  <td className="px-4 py-2 border">{row.vehicle || "-"}</td>
                  <td className="px-4 py-2 border text-right">
                    {row.credit_amount ?? 0}
                  </td>
                  <td className="px-4 py-2 border text-right align-top">
                    <div className="flex justify-end items-center">
                      {totalCost}
                      {rowId &&
                        (isExpanded ? (
                          <ChevronUpIcon
                            onClick={() => toggleRow(rowId)}
                            className="w-4 h-4 ml-2 cursor-pointer"
                          />
                        ) : (
                          <ChevronDownIcon
                            onClick={() => toggleRow(rowId)}
                            className="w-4 h-4 ml-2 cursor-pointer"
                          />
                        ))}
                    </div>
                  </td>
                  <td className="px-4 py-2 border text-right">-</td>
                </tr>

                {isExpanded && (
                  <tr className="bg-gray-50 text-xs">
                    <td colSpan={4} className="px-4 py-2 border-t">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-1 gap-x-4">
                        {costs.map((item: any, index: number) => (
                          <div key={index} className="flex ">
                            <span className="capitalize">
                              {item.cost_reason}:{" "}
                            </span>
                            <span className="text-right">৳ {item.cost}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
