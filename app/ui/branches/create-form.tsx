"use client";

import Link from "next/link";
import {
  CurrencyDollarIcon,
  DocumentTextIcon,
  PhoneIcon,
  ShareIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/app/ui/button";
import { OfficeState, createOffice } from "@/app/lib/actions";
import { startTransition, useActionState, useEffect, useState } from "react";

export default function CreateBranchForm() {
  const [isLoading, setIsLoading] = useState(false);
  const initialState: OfficeState = { message: null, errors: {}, values: {} };
  const [state, formAction] = useActionState<OfficeState, FormData>(
    createOffice,
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
    }
  }, [state.errors]);

  // state.message
  useEffect(() => {
    if (state.message === "Office created successfully.") {
      window.location.href = "/dashboard/offices"; // Redirect on the client side
    } else if (state.message !== null) {
      console.error(state.message);
    }
  }, [state.message]);

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="flex flex-wrap lg:flex-nowrap gap-2">
          {/* Branch Name */}
          <div className="mb-4">
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Office / Branch Name
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter branch name"
                  defaultValue={state?.values?.name ?? ""}
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  // required
                />
                <ShareIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
            {state.errors?.name && (
              <p className="text-red-500 text-sm mt-1">{state.errors.name}</p>
            )}
          </div>

          {/* Manager Name */}
          <div className="mb-4">
            <label htmlFor="manager" className="mb-2 block text-sm font-medium">
              Choose manager
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="manager"
                  name="manager"
                  type="text"
                  placeholder="Enter manager name"
                  defaultValue={state?.values?.manager ?? ""}
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  // required
                />
                <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
            {state.errors?.manager && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.manager}
              </p>
            )}
          </div>

          {/* Contact Info */}
          <div className="mb-4">
            <label htmlFor="contact" className="mb-2 block text-sm font-medium">
              Contact Info
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="contact"
                  name="contact"
                  type="text"
                  placeholder="Enter contact info"
                  defaultValue={state?.values?.contact ?? ""}
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  // required
                />
                <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
            {state.errors?.contact && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.contact}
              </p>
            )}
          </div>

          {/* BIN */}
          <div className="mb-4">
            <label htmlFor="bin" className="mb-2 block text-sm font-medium">
              BIN
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="bin"
                  name="bin"
                  type="text"
                  placeholder="Enter business identification number"
                  defaultValue={state?.values?.bin ?? ""}
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  // required
                />
                <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
            {state.errors?.bin && (
              <p className="text-red-500 text-sm mt-1">{state.errors.bin}</p>
            )}
          </div>
        </div>

        {/* Branch address */}
        <div className="mb-4">
          <label htmlFor="address" className="mb-2 block text-sm font-medium">
            Address / Location
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <textarea
                id="address"
                name="address"
                placeholder="Enter branch address"
                defaultValue={state?.values?.address ?? ""}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          {state.errors?.address && (
            <p className="text-red-500 text-sm mt-1">{state.errors.address}</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/offices"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit" disabled={isLoading}>
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
              creating office...
            </>
          ) : (
            "Create Office"
          )}
        </Button>
      </div>
    </form>
  );
}
