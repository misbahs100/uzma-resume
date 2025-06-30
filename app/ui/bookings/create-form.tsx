"use client";

import Link from "next/link";
import {
  CalendarIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/app/ui/button";
import { BookingState, createBooking } from "@/app/lib/actions";
import { startTransition, useActionState, useEffect, useState } from "react";
import { PrintVoucher } from "@/app/lib/pdf/generate-voucher";
import DynamicTabsForm from "./dynamic-tab-form";


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

export default function CreateBookingForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isReturn, setIsReturn] = useState(false);
  // with print or not
  const [printVoucher, setPrintVoucher] = useState("");

  // dynamic tab states
  const [tabs, setTabs] = useState<TabData[]>([
    {
      id: crypto.randomUUID(),
      customer: "",
      customer_bin: "",
      customer_address: "",
      challans: [
        {
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
        },
      ],
    },
  ]);

  const [activeTabId, setActiveTabId] = useState(tabs[0].id);


  // form states and functions
  const initialState: BookingState = { message: null, errors: {}, values: {} };
  const [state, formAction] = useActionState<BookingState, FormData>(
    createBooking,
    initialState
  );

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    startTransition(() => {
      const formData = new FormData(event.currentTarget);
      formAction(formData);
    });
    

  };

  // state.errors
  useEffect(() => {
    if (state.errors) {
      setIsLoading(false);
      setPrintVoucher("");
    }
  }, [state.errors]);

  useEffect(() => {
    if (state.voucherData && printVoucher === "yes") {
      const voucherData = state.voucherData;
      PrintVoucher({ voucherData, type: "delivery_challan" });
      setIsLoading(false);
      setPrintVoucher("");
    } else if (state.voucherData && printVoucher === "no") {
      setIsLoading(false);
      setPrintVoucher("");
      alert("Booking Added Successfully");
    } else if (state.message) {
      // form error or early return
      setIsLoading(false);
    }
  }, [state.voucherData, state.message]);

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
          <div className="flex flex-wrap lg:flex-nowrap gap-2">
           
            {/* Vehicle */}
            <div className="mb-4">
              <label
                htmlFor="vehicle"
                className="mb-2 block text-sm font-medium"
              >
                Choose Vehicle
              </label>
              <div className="relative mt-2 rounded-md">
                <div className="relative">
                  <input
                    id="vehicle"
                    name="vehicle"
                    type="text"
                    placeholder="Enter vehicle number"
                    defaultValue={state?.values?.vehicle ?? ""}
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    // required
                  />
                  <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
              </div>
              {state.errors?.vehicle && (
                <p className="text-red-500 text-sm mt-1">
                  {state.errors.vehicle}
                </p>
              )}
            </div>

            {/* Driver */}
            <div className="mb-4">
              <label
                htmlFor="driver"
                className="mb-2 block text-sm font-medium"
              >
                Choose Driver
              </label>
              <div className="relative mt-2 rounded-md">
                <div className="relative">
                  <input
                    id="driver"
                    name="driver"
                    type="text"
                    placeholder="Enter driver name"
                    defaultValue={state?.values?.driver ?? ""}
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    // required
                  />
                  <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
              </div>
              {state.errors?.driver && (
                <p className="text-red-500 text-sm mt-1">
                  {state.errors.driver}
                </p>
              )}
            </div>

            {/* Pickup address */}
            <div className="mb-4">
              <label
                htmlFor="pickup_address"
                className="mb-2 block text-sm font-medium"
              >
                Pickup Address / Location
              </label>
              <div className="relative mt-2 rounded-md">
                <div className="relative">
                  <textarea
                    id="pickup_address"
                    name="pickup_address"
                    placeholder="Enter pickup address"
                    defaultValue={state?.values?.pickup_address ?? ""}
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    cols={40}
                  />
                  <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
              </div>
              {state.errors?.pickup_address && (
                <p className="text-red-500 text-sm mt-1">
                  {state.errors.pickup_address}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap lg:flex-nowrap gap-2">
            {/* Pickup date */}
            <div className="mb-4">
              <label
                htmlFor="pickup_dt"
                className="mb-2 block text-sm font-medium"
              >
                Select Pickup Date
              </label>

              <div className="relative">
                <input
                  type="date"
                  id="pickup_dt"
                  name="pickup_dt"
                  className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="pickup_dt-error"
                  defaultValue={
                    state?.values?.pickup_dt ??
                    new Date().toISOString().split("T")[0]
                  }
                />
                <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              </div>
              {state.errors?.pickup_dt && (
                <p className="text-red-500 text-sm mt-1">
                  {state.errors.pickup_dt}
                </p>
              )}
            </div>

            {/* Dropoff date */}
            <div className="mb-4">
              <label
                htmlFor="dropoff_dt"
                className="mb-2 block text-sm font-medium"
              >
                Select Dropoff Date
              </label>

              <div className="relative">
                <input
                  type="date"
                  id="dropoff_dt"
                  name="dropoff_dt"
                  defaultValue={state?.values?.dropoff_dt ?? ""}
                  className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="dropoff_dt-error"
                />
                <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              </div>
              {state.errors?.dropoff_dt && (
                <p className="text-red-500 text-sm mt-1">
                  {state.errors.dropoff_dt}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap lg:flex-nowrap gap-2">
            {/* booking type */}
            <div className="mb-4">
              <label
                htmlFor="booking_type"
                className="mb-2 block text-sm font-medium"
              >
                Choose Booking Type
              </label>

              <div className="relative">
                <select
                  id="booking_type"
                  name="booking_type"
                  className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="booking_type-error"
                  defaultValue={state?.values?.booking_type ?? ""}
                  onChange={(e) => {
                    setIsReturn(e.target.value === "return");
                  }}
                >
                  <option value="" disabled>
                    Select status
                  </option>
                  <option value="oneway">One Way</option>
                  <option value="return">Return</option>
                </select>
                <ShareIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              </div>
              {state.errors?.booking_type && (
                <p className="text-red-500 text-sm mt-1">
                  {state.errors.booking_type}
                </p>
              )}
            </div>

            {isReturn && (
              <>
                {/* return Pickup date */}
                <div className="mb-4">
                  <label
                    htmlFor="return_pickup_dt"
                    className="mb-2 block text-sm font-medium"
                  >
                    Select Return Pickup Date
                  </label>

                  <div className="relative">
                    <input
                      type="date"
                      id="return_pickup_dt"
                      name="return_pickup_dt"
                      defaultValue={state?.values?.return_pickup_dt ?? ""}
                      className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                      aria-describedby="return_pickup_dt-error"
                    />
                    <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                  </div>
                  {state.errors?.return_pickup_dt && (
                    <p className="text-red-500 text-sm mt-1">
                      {state.errors.return_pickup_dt}
                    </p>
                  )}
                </div>

                {/* Return Dropoff date */}
                <div className="mb-4">
                  <label
                    htmlFor="return_dropoff_dt"
                    className="mb-2 block text-sm font-medium"
                  >
                    Select Return Dropoff Date
                  </label>

                  <div className="relative">
                    <input
                      type="date"
                      id="return_dropoff_dt"
                      name="return_dropoff_dt"
                      defaultValue={state?.values?.return_dropoff_dt ?? ""}
                      className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                      aria-describedby="return_dropoff_dt-error"
                    />
                    <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                  </div>
                  {state.errors?.return_dropoff_dt && (
                    <p className="text-red-500 text-sm mt-1">
                      {state.errors.return_dropoff_dt}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="flex flex-wrap lg:flex-nowrap gap-2">
            {/* note */}
            <div className="mb-4">
              <label htmlFor="note" className="mb-2 block text-sm font-medium">
                Note
              </label>
              <div className="relative mt-2 rounded-md">
                <div className="relative">
                  <textarea
                    id="note"
                    name="note"
                    placeholder="Enter notes"
                    defaultValue={state?.values?.note ?? ""}
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  />
                  <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
              </div>
              {state.errors?.note && (
                <p className="text-red-500 text-sm mt-1">{state.errors.note}</p>
              )}
            </div>

            {/* credit amount */}
            <div className="mb-4">
              <label
                htmlFor="credit_amount"
                className="mb-2 block text-sm font-medium"
              >
                Credit Amount
              </label>
              <div className="relative mt-2 rounded-md">
                <div className="relative">
                  <input
                    id="credit_amount"
                    name="credit_amount"
                    type="number"
                    placeholder="Enter credit amount"
                    defaultValue={state?.values?.credit_amount ?? 0}
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    // required
                  />
                  <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
              </div>
              {state.errors?.credit_amount && (
                <p className="text-red-500 text-sm mt-1">
                  {state.errors.credit_amount}
                </p>
              )}
            </div>
          </div>

          <div className="mt-5 ">
            <DynamicTabsForm
        tabs={tabs}
        setTabs={setTabs}
        activeTabId={activeTabId}
        setActiveTabId={setActiveTabId}
      />
          <input
              type="hidden"
              name="deliveries"
              value={JSON.stringify(tabs)}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/dashboard/bookings"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </Link>
          {/* <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-4 w-4 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              creating booking...
            </>
          ) : (
            "Create Booking"
          )}
        </Button> */}
          <Button
            type="submit"
            disabled={isLoading}
            className={`${
              printVoucher === "yes" || printVoucher === "" ? "" : "hidden"
            }`}
            onClick={() => setPrintVoucher("yes")}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Posting...
              </>
            ) : (
              "Post & Print"
            )}
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className={`${
              printVoucher === "no" || printVoucher === "" ? "" : "hidden"
            }`}
            onClick={() => setPrintVoucher("no")}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Posting...
              </>
            ) : (
              "Post"
            )}
          </Button>
        </div>
      </form>
    </>
  );
}
