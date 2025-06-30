"use client";
import { useEffect, useState } from "react";

type WorkshopFilters = {
  startDate: string;
  endDate: string;
  vehicle: string;

  query: string;
};

type Props = {
  onFilterChange: (filters: WorkshopFilters) => void;
};

export default function WorkshopHistoryFilters({ onFilterChange }: Props) {
  const today = new Date();
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 2);

  const [filters, setFilters] = useState<WorkshopFilters>({
    startDate: firstOfMonth.toISOString().split("T")[0],
    endDate: today.toISOString().split("T")[0],
    vehicle: "",
    query: "",
  });

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div>
        <div>
          <label className="text-xs text-gray-400">Start Date</label>
        </div>
        <div>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, startDate: e.target.value }))
            }
            className="border rounded px-3 py-2"
          />
        </div>
      </div>
      <div>
        <div>
          <label className="text-xs text-gray-400">End Date</label>
        </div>
        <div>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, endDate: e.target.value }))
            }
            className="border rounded px-3 py-2"
          />
        </div>
      </div>
      <div>
        <div>
          <label className="text-xs text-gray-400">Vehicle No.</label>
        </div>
        <div>
          <input
            type="text"
            placeholder="Vehicle"
            value={filters.vehicle}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, vehicle: e.target.value }))
            }
            className="border rounded px-3 py-2"
          />
        </div>
      </div>
      {/* <div>
        <div>
          <label className="text-xs text-gray-400">Mechanic</label>
        </div>
        <div>
          <input
            type="text"
            placeholder="Mechanic"
            value={filters.mechanic}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, mechanic: e.target.value }))
            }
            className="border rounded px-3 py-2"
          />
        </div>
      </div> */}
      {/* <div>
        <div>
          <label className="text-xs text-gray-400">#</label>
        </div>
        <div>
          <input
            type="text"
            placeholder="Memo / Job No"
            value={filters.query}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, query: e.target.value }))
            }
            className="border rounded px-3 py-2"
          />
        </div>
      </div> */}
    </div>
  );
}
