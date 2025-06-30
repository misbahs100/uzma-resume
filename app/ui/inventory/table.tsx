"use client";
import { formatDateToLocal } from "@/app/lib/utils";
import { PencilIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { InventoryForm } from "@/app/lib/definitions";
import { UpdateInventoryModal } from "./update-inventory-modal";

export default function InventoryTable({
  inventories,
}: {
  inventories: InventoryForm[];
}) {
  const totalOldParts = inventories.reduce((acc: any, item) => {
    return item.condition === "old" ? acc + item.quantity : acc;
  }, 0);

  const totalNewParts = inventories.reduce((acc: any, item) => {
    return item.condition === "new" ? acc + item.quantity : acc;
  }, 0);

  const [showUpdateInventoryModal, setShowUpdateInventoryModal] =
    useState(false);
  const [selectedPart, setSelectedPart] = useState<InventoryForm | null>(null);

  return (
    <div className="mt-6 flow-root">
      <div className="mb-5  w-full lg:w-[50%] space-y-2">
        <div className="border p-2">
          <p>Total Item: {inventories.length}</p>
        </div>
        <div className="border p-2">
          <p>Total Stock: {totalNewParts + totalOldParts}</p>
          <div className="flex justify-between">
            <p>
              <span className="inline-block rounded-full px-2 py-1 text-xs font-semibold bg-green-100 text-green-700">
                New:
              </span>{" "}
              {totalNewParts}
            </p>
            <p>
              <span className="inline-block rounded-full px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-700">
                Old:
              </span>{" "}
              {totalOldParts}
            </p>
          </div>
        </div>
      </div>
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {inventories?.map((item) => (
              <div
                key={item.id}
                className="mb-3 w-full rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-200"
              >
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="text-base font-semibold text-gray-800">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">
                      {item.type} – {item.vehicle}
                    </p>
                  </div>
                  <span
                    className={`ml-2 inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                      item.condition === "new"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {item.condition.toUpperCase()}
                  </span>
                </div>

                <div className="border-b py-3 text-sm text-gray-600">
                  <p>
                    <span className="font-medium text-gray-700">Qty:</span>{" "}
                    {item.quantity}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">Price:</span> ₹
                    {item.price}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">Expire:</span>{" "}
                    {item.expire_date
                      ? formatDateToLocal(item.expire_date)
                      : "—"}
                  </p>
                </div>

                <div className="pt-3 flex justify-end gap-3">
                  {/* <UpdateInventory id={item.id} /> */}
                  {/* <DeleteInventory id={item.id} /> */}
                </div>
              </div>
            ))}
          </div>

          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg bg-gray-50 text-left text-sm font-semibold">
              <tr>
                <th className="px-4 py-4 sm:pl-6">Part Name</th>
                <th className="px-3 py-4">Type</th>
                <th className="px-3 py-4">Vehicle</th>
                <th className="px-3 py-4">Condition</th>
                <th className="px-3 py-4">Qty</th>
                <th className="px-3 py-4">Price</th>
                <th className="px-3 py-4">Expire Date</th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white text-sm">
              {inventories?.map((item) => (
                <tr
                  key={item.id}
                  className="border-b last:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap px-4 py-4 sm:pl-6 font-medium text-gray-800">
                    {item.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 capitalize text-gray-600">
                    {item.type}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-gray-600">
                    {item.vehicle}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4">
                    <span
                      className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                        item.condition === "new"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {item.condition.toUpperCase()}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-gray-600">
                    {item.quantity}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-gray-600">
                    ৳ {item.price}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-gray-600">
                    {item.expire_date
                      ? formatDateToLocal(item.expire_date)
                      : "—"}
                  </td>
                  <td className="whitespace-nowrap py-4 pr-6 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        className="flex items-center space-x-1 text-sm font-medium text-teal-400 hover:text-teal-700"
                        onClick={() => {
                          setShowUpdateInventoryModal(true);
                          setSelectedPart(item);
                        }}
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      {/* <DeleteInventory id={item.id} /> */}
                    </div>
                    {showUpdateInventoryModal &&
                    selectedPart &&
                    selectedPart.id === item.id ? (
                      <UpdateInventoryModal
                        setShowUpdateInventoryModal={
                          setShowUpdateInventoryModal
                        }
                        part={item}
                      />
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
