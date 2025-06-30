"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

type RepairPart = {
  part: string;
  quantity: number;
  price: number;
};

type Vehicle = {
  _id: string;
  registrationNumber: string;
};

type Part = {
  _id: string;
  name: string;
  quantity: number;
};

export default function RepairForm() {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [parts, setParts] = useState<RepairPart[]>([
    { part: "", quantity: 1, price: 0 },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [partsList, setPartsList] = useState<Part[]>([]);
  const [partsDropdownOpen, setPartsDropdownOpen] = useState<number | null>(
    null
  );
  const [filteredPartsList, setFilteredPartsList] = useState<Part[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const partsInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const partsDropdownRefs = useRef<(HTMLUListElement | null)[]>([]);
  const router = useRouter();

  // Fetch all vehicles for dropdown
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await fetch("/api/vehicles/get-all");
        const data = await res.json();
        setVehicles(data);
      } catch {
        setVehicles([]);
      }
    };
    fetchVehicles();
  }, []);

  // Fetch all parts for dropdown
  useEffect(() => {
    const fetchParts = async () => {
      try {
        const res = await fetch("/api/parts/get-all");
        const data = await res.json();
        setPartsList(data);
      } catch {
        setPartsList([]);
      }
    };
    fetchParts();
  }, []);

  // Update filteredVehicles when vehicles or vehicleNumber changes
  useEffect(() => {
    if (vehicleNumber.trim() === "") {
      setFilteredVehicles(vehicles);
    } else {
      setFilteredVehicles(
        vehicles.filter((v) =>
          v.registrationNumber
            .toLowerCase()
            .includes(vehicleNumber.trim().toLowerCase())
        )
      );
    }
  }, [vehicleNumber, vehicles]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  // Close parts dropdown on outside click
  useEffect(() => {
    const handlePartsClick = (e: MouseEvent) => {
      if (
        partsDropdownOpen !== null &&
        partsDropdownRefs.current[partsDropdownOpen] &&
        !partsDropdownRefs.current[partsDropdownOpen]?.contains(
          e.target as Node
        )
      ) {
        setPartsDropdownOpen(null);
      }
    };
    if (partsDropdownOpen !== null) {
      document.addEventListener("mousedown", handlePartsClick);
    }
    return () => document.removeEventListener("mousedown", handlePartsClick);
  }, [partsDropdownOpen]);

  // Fix: Prevent empty part rows from being submitted
  const filteredParts = parts.filter(
    (p) => p.part.trim() !== "" && p.quantity > 0 && p.price >= 0
  );

  const handlePartChange = (
    idx: number,
    field: keyof RepairPart,
    value: string | number
  ) => {
    setParts((prev) =>
      prev.map((p, i) =>
        i === idx
          ? { ...p, [field]: field === "part" ? value : Number(value) }
          : p
      )
    );
  };

  const addRow = () =>
    setParts((prev) => [...prev, { part: "", quantity: 1, price: 0 }]);
  const removeRow = (idx: number) =>
    setParts((prev) => prev.filter((_, i) => i !== idx));

  const total = filteredParts.reduce((sum, p) => sum + p.price * p.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleNumber.trim()) {
      alert("Vehicle number is required.");
      return;
    }
    if (filteredParts.length === 0) {
      alert("Please add at least one valid repair part.");
      return;
    }
    // Validate quantity for each part
    for (const p of filteredParts) {
      const partInfo = partsList.find((part) => part.name === p.part);
      if (!partInfo) {
        alert(`Part "${p.part}" not found in inventory.`);
        return;
      }
      if (p.quantity > partInfo.quantity) {
        alert(
          `Not enough quantity for "${p.part}". Available: ${partInfo.quantity}, Requested: ${p.quantity}`
        );
        return;
      }
    }
    setSubmitting(true);
    const res = await fetch("/api/repair-memo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vehicleNumber, date, parts: filteredParts }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (data.success) {
      router.push(`/dashboard/repair/memo/${data.memoId}`);
    } else {
      alert("Failed to save memo: " + data.error);
    }
  };

  // Filtering for each part input
  const handlePartInputChange = (idx: number, value: string) => {
    handlePartChange(idx, "part", value);
    if (value.trim() === "") {
      setFilteredPartsList(partsList);
    } else {
      setFilteredPartsList(
        partsList.filter((p) =>
          p.name.toLowerCase().includes(value.trim().toLowerCase())
        )
      );
    }
    setPartsDropdownOpen(idx);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">গাড়ি মেরামত রসিদ</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4 flex justify-between gap-4">
          <div className="relative w-full">
            <label className="block font-medium">গাড়ি নংঃ </label>
            <div className="flex items-center relative">
              <input
                ref={inputRef}
                className="border p-2 w-full"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                required
                onFocus={() => setDropdownOpen(true)}
                autoComplete="on"
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-50"
                onClick={() => setDropdownOpen((open) => !open)}
              >
                <ChevronDownIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            {dropdownOpen && (
              <ul className="absolute z-10 bg-white border w-full mt-1 max-h-48 overflow-y-auto rounded shadow">
                {filteredVehicles.length === 0 ? (
                  <li className="p-2 text-gray-400">No vehicles found</li>
                ) : (
                  filteredVehicles.map((v) => (
                    <li
                      key={v._id}
                      className="p-2 hover:bg-blue-100 cursor-pointer"
                      onMouseDown={() => {
                        setVehicleNumber(v.registrationNumber);
                        setDropdownOpen(false);
                      }}
                    >
                      {v.registrationNumber}
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
          <div>
            <label className="block font-medium">তারিখঃ </label>
            <input
              type="date"
              className="border p-2 w-full"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
        </div>
        <table className="w-full border mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">যন্ত্রপাতি</th>
              <th className="border p-2">পরিমান</th>
              <th className="border p-2">মূল্য/ইউনিট</th>
              <th className="border p-2"></th>
            </tr>
          </thead>
          <tbody>
            {parts.map((p, idx) => (
              <tr key={idx}>
                <td className="border p-2 relative">
                  <div className="flex items-center relative">
                    <input
                      ref={(el) => {
                        partsInputRefs.current[idx] = el;
                      }}
                      className="border p-1 w-full"
                      value={p.part}
                      onChange={(e) =>
                        handlePartInputChange(idx, e.target.value)
                      }
                      required
                      onFocus={() => {
                        setFilteredPartsList(partsList);
                        setPartsDropdownOpen(idx);
                      }}
                      autoComplete="off"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => {
                        setFilteredPartsList(partsList);
                        setPartsDropdownOpen(
                          partsDropdownOpen === idx ? null : idx
                        );
                        partsInputRefs.current[idx]?.focus();
                      }}
                    >
                      <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                  {partsDropdownOpen === idx && (
                    <ul
                      ref={(el) => {
                        partsDropdownRefs.current[idx] = el;
                      }}
                      className="absolute z-20 bg-white border w-full mt-1 max-h-48 overflow-y-auto rounded shadow"
                    >
                      {filteredPartsList.length === 0 ? (
                        <li className="p-2 text-gray-400">No parts found</li>
                      ) : (
                        filteredPartsList.map((part) => (
                          <li
                            key={part._id}
                            className="p-2 hover:bg-blue-100 cursor-pointer"
                            onMouseDown={() => {
                              handlePartChange(idx, "part", part.name);
                              setPartsDropdownOpen(null);
                            }}
                          >
                            {part.name}
                          </li>
                        ))
                      )}
                    </ul>
                  )}
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    min={1}
                    className="border p-1 w-20"
                    value={p.quantity}
                    onChange={(e) =>
                      handlePartChange(idx, "quantity", e.target.value)
                    }
                    required
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    min={0}
                    className="border p-1 w-24"
                    value={p.price}
                    onChange={(e) =>
                      handlePartChange(idx, "price", e.target.value)
                    }
                    required
                  />
                </td>
                <td className="border p-2 text-center">
                  {parts.length > 1 && (
                    <button
                      type="button"
                      className="text-red-500"
                      onClick={() => removeRow(idx)}
                    >
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="text-right font-bold p-2">
                Total: ৳ {total}
              </td>
              <td className="p-2">
                <button
                  type="button"
                  className="text-blue-600"
                  onClick={addRow}
                >
                  + Add Row
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
          disabled={submitting}
        >
          {submitting ? "Saving..." : "Submit Memo"}
        </button>
      </form>
    </div>
  );
}
