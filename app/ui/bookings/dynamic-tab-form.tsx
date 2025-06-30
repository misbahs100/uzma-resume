"use client";
import React, { useState } from "react";
import { XCircleIcon, PlusIcon } from "@heroicons/react/24/solid";
import {
  CurrencyDollarIcon,
  DocumentTextIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface TabData {
  id: string;
  customer: string;
  customer_bin: string;
  customer_address: string;
  challans: ChallanData[];
}

interface ChallanData {
  item_detail: string;
  delivery_unit: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  supplementary_duty_rate: number;
  supplementary_duty: number;
  value_added_tax_rate: number;
  value_added_tax: number;
  total_price_with_tax: number;
  [key: string]: string | number;
}

const createEmptyChallan = (): ChallanData => ({
  item_detail: "",
  delivery_unit: "",
  quantity: 0,
  unit_price: 0,
  total_price: 0,
  supplementary_duty_rate: 0,
  supplementary_duty: 0,
  value_added_tax_rate: 0,
  value_added_tax: 0,
  total_price_with_tax: 0,
});

interface Props {
  tabs: TabData[];
  setTabs: React.Dispatch<React.SetStateAction<TabData[]>>;
  activeTabId: string;
  setActiveTabId: (id: string) => void;
}

const DynamicTabsForm: React.FC<Props> = ({
  tabs,
  setTabs,
  activeTabId,
  setActiveTabId,
}) => {
  

  const handleInputChange = (
    id: string,
    field: keyof TabData,
    value: string
  ) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === id ? { ...tab, [field]: value } : tab
      )
    );
  };

  const handleItemChange = (
    tabId: string,
    index: number,
    field: keyof ChallanData,
    value: string | number
  ) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === tabId
          ? {
              ...tab,
              challans: tab.challans.map((challan, i) =>
                i === index ? { ...challan, [field]: value } : challan
              ),
            }
          : tab
      )
    );
  };

  const addItem = (tabId: string) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === tabId
          ? { ...tab, challans: [...tab.challans, createEmptyChallan()] }
          : tab
      )
    );
  };

  const removeItem = (tabId: string, index: number) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === tabId
          ? {
              ...tab,
              challans: tab.challans.filter((_, i) => i !== index),
            }
          : tab
      )
    );
  };

  const handleAddTab = () => {
    const newTab: TabData = {
      id: crypto.randomUUID(),
      customer: "",
      customer_bin: "",
      customer_address: "",
      challans: [createEmptyChallan()],
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab.id);
  };

  const handleRemoveTab = (id: string) => {
    if (tabs.length === 1) return;
    const updatedTabs = tabs.filter((tab) => tab.id !== id);
    setTabs(updatedTabs);
    if (activeTabId === id) {
      setActiveTabId(updatedTabs[0].id);
    }
  };

  const activeTab = tabs.find((tab) => tab.id === activeTabId);
  if (!activeTab) return null;

  return (
    <div className="space-y-4">
      {/* Top bar with tabs */}
      <div className="overflow-x-auto pb-2 border-b border-gray-300">
        <div className="flex space-x-2 min-w-max">
          {tabs.map((tab, index) => (
            <div
              key={tab.id}
              className={`flex items-center px-3 py-1 rounded-t-md border-b-2 cursor-pointer whitespace-nowrap ${
                activeTabId === tab.id
                  ? "border-blue-500 bg-white"
                  : "border-transparent bg-gray-100"
              }`}
              onClick={() => setActiveTabId(tab.id)}
            >
              <span className="mr-2">Delivery-{index + 1}</span>
              <XCircleIcon
                className="h-4 w-4 text-red-500 hover:text-red-700"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveTab(tab.id);
                }}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddTab}
            className="flex items-center px-2 py-1 border rounded-md hover:bg-gray-200"
          >
            <PlusIcon className="h-5 w-5 text-blue-600" />
          </button>
        </div>
      </div>

      {/* Customer fields */}
      <div className="rounded-md bg-gray-50 py-4 md:py-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium">Customer Name</label>
            <div className="relative">
              <input
                type="text"
                value={activeTab.customer}
                onChange={(e) =>
                  handleInputChange(activeTab.id, "customer", e.target.value)
                }
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm"
                placeholder="Enter customer name"
              />
              <CurrencyDollarIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Customer BIN</label>
            <div className="relative">
              <input
                type="text"
                value={activeTab.customer_bin}
                onChange={(e) =>
                  handleInputChange(
                    activeTab.id,
                    "customer_bin",
                    e.target.value
                  )
                }
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm"
                placeholder="Enter BIN"
              />
              <CurrencyDollarIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="lg:col-span-3">
            <label className="block text-sm font-medium">
              Customer Address
            </label>
            <div className="relative">
              <textarea
                value={activeTab.customer_address}
                onChange={(e) =>
                  handleInputChange(
                    activeTab.id,
                    "customer_address",
                    e.target.value
                  )
                }
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm"
                placeholder="Enter customer address"
              />
              <DocumentTextIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Challan Section */}
        <div className="space-y-6">
          {activeTab.challans.map((challan, index) => (
            <div
              key={index}
              className="bg-white rounded-md shadow p-4 space-y-4 border"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">Challan #{index + 1}</h4>
                <TrashIcon
                  className="w-5 h-5 text-red-500 cursor-pointer"
                  onClick={() => removeItem(activeTab.id, index)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium">
                    Item Detail
                  </label>
                  <textarea
                    value={challan.item_detail}
                    onChange={(e) =>
                      handleItemChange(
                        activeTab.id,
                        index,
                        "item_detail",
                        e.target.value
                      )
                    }
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm peer block"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Delivery Unit
                  </label>
                  <input
                    value={challan.delivery_unit}
                    onChange={(e) =>
                      handleItemChange(
                        activeTab.id,
                        index,
                        "delivery_unit",
                        e.target.value
                      )
                    }
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm peer block"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Quantity</label>
                  <input
                    type="number"
                    value={challan.quantity}
                    onChange={(e) =>
                      handleItemChange(
                        activeTab.id,
                        index,
                        "quantity",
                        Number(e.target.value)
                      )
                    }
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm peer block"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Unit Price
                  </label>
                  <input
                    type="number"
                    value={challan.unit_price}
                    onChange={(e) =>
                      handleItemChange(
                        activeTab.id,
                        index,
                        "unit_price",
                        Number(e.target.value)
                      )
                    }
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm peer block"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    SD Rate (%)
                  </label>
                  <input
                    type="number"
                    value={challan.supplementary_duty_rate}
                    onChange={(e) =>
                      handleItemChange(
                        activeTab.id,
                        index,
                        "supplementary_duty_rate",
                        Number(e.target.value)
                      )
                    }
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm peer block"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">VAT (%)</label>
                  <input
                    type="number"
                    value={challan.value_added_tax_rate}
                    onChange={(e) =>
                      handleItemChange(
                        activeTab.id,
                        index,
                        "value_added_tax_rate",
                        Number(e.target.value)
                      )
                    }
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm peer block"
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addItem(activeTab.id)}
            className="flex items-center px-3 py-2 border rounded-md bg-blue-100 hover:bg-blue-200 text-sm font-medium"
          >
            <PlusIcon className="w-5 h-5 text-blue-600 mr-1" />
            Add Challan
          </button>
        </div>

      </div>
    </div>
  );
};

export default DynamicTabsForm;
