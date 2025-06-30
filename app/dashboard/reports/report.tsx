"use client";
import { ReportContainer } from "@/app/ui/reports/report-container";
import { useState } from "react";

export default function ReportPageWithButtons() {
  const [selectedReport, setSelectedReport] = useState<
    "delivery" | "crdr" | "workshop" | null
  >(null);

  return <>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div onClick={() => setSelectedReport("delivery")} className={`p-6 cursor-pointer rounded-2xl ${selectedReport === "delivery" ? "bg-teal-100" : "bg-white hover:bg-gray-100"} transition`}>
          <h2 className="text-lg font-semibold mb-2">Delivery History</h2>
          <p className="text-sm text-gray-600 ">
            View all bookings made for deliveries.
          </p>
        </div>

        <div onClick={() => setSelectedReport("crdr")} className={`p-6 cursor-pointer rounded-2xl ${selectedReport === "crdr" ? "bg-teal-100" : "bg-white hover:bg-gray-100"} transition`}>
          <h2 className="text-lg font-semibold mb-2">Cr/Dr History</h2>
          <p className="text-sm text-gray-600 ">
            Track vehicle, credit, cost, and debit records.
          </p>
        </div>

        <div onClick={() => setSelectedReport("workshop")} className={`p-6 cursor-pointer rounded-2xl ${selectedReport === "workshop" ? "bg-teal-100" : "bg-white hover:bg-gray-100"}  transition`}>
          <h2 className="text-lg font-semibold mb-2">Workshop History</h2>
          <p className="text-sm text-gray-600 ">
            See maintenance and workshop activity logs.
          </p>
        </div>
      </div>
      
  {selectedReport && <ReportContainer type={selectedReport} />}
  </>;
}
