import { useEffect, useState } from "react";
import DeliveryHistoryFilters from "./filters/delivery-filters";
import DeliveryReportData from "./report-data/delivery-report-data";
import CrDrReportData from "./report-data/crdr-report-data";
import WorkshopHistoryFilters from "./filters/workshop-filters";
import WorkshopReportData from "./report-data/workshop-report-data";

export const ReportContainer = ({ type }: { type: string }) => {
  const [filters, setFilters] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (!filters) return;

    const fetchData = async () => {
      const res = await fetch(`/api/reports/${type}`, {
        method: "POST",
        body: JSON.stringify(filters),
      });
      const result = await res.json();
      setData(result);
    };

    fetchData();
  }, [filters]);

  const renderFilters = () => {
    switch (type) {
      case "delivery":
        return <DeliveryHistoryFilters onFilterChange={setFilters} />;
      case "crdr":
        return <DeliveryHistoryFilters onFilterChange={setFilters} />;
    //   case "workshop":
    //     return <WorkshopHistoryFilters onFilterChange={setFilters} />;
      case "workshop":
        return <WorkshopHistoryFilters onFilterChange={setFilters} />;
    }
  };

  return (
    <div className="mt-6 space-y-4">
      {renderFilters()}
      {type === "delivery" && (
        <DeliveryReportData filters={filters} data={data} />
      )}
      {type === "crdr" && <CrDrReportData filters={filters} data={data} />}
      {type === "workshop" && (
        <WorkshopReportData filters={filters} data={data} />
      )}
    </div>
  );
};
