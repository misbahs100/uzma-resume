import {
  Dispatch,
  SetStateAction,
  startTransition,
  useEffect,
  useState,
} from "react";
import { Button } from "../button";
import { useActionState } from "react";
import { InventoryForm } from "@/app/lib/definitions";
import {
  CalendarIcon,
  CurrencyDollarIcon,
  ShareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  InventoryState,
  updateInventory,
} from "@/app/lib/actions";
import { formatDateInput } from "@/app/lib/utils";

export function UpdateInventoryModal({
  setShowUpdateInventoryModal,
  part,
}: {
  setShowUpdateInventoryModal: Dispatch<SetStateAction<boolean>>;
  part: InventoryForm;
}) {
  const initialState: InventoryState = {
    message: null,
    errors: {},
    values: {},
  };
  const [isLoading, setIsLoading] = useState(false);

  const [state, formAction] = useActionState<InventoryState, FormData>(
    updateInventory.bind(null, part.id),
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

  useEffect(() => {
    if (state.message) {
      const regex = /Inventory item updated successfully./;
      const match = state.message.match(regex);

      if (match) {
        console.log(match);
        setTimeout(() => {
          setIsLoading(false);
          setShowUpdateInventoryModal(false);
        }, 500);
      }
    }
  }, [state.message]);

  useEffect(() => {
    if (state.errors) {
      setShowUpdateInventoryModal(true);
      setIsLoading(false);
    }
    console.log(state.errors)
  }, [state.errors]);

  return (
    <>
      <div className="justify-center items-center flex fixed inset-0 z-50">
        <div className="relative w-full max-w-3xl mx-auto my-8">
          {/* content */}
          <div className="max-h-[90vh] overflow-y-auto border-0 rounded-lg shadow-lg flex flex-col bg-white outline-none">
            {/* header */}
            <div className="p-5 border-b border-solid border-slate-200 rounded-t flex justify-between">
              <h1 className="text-lg font-semibold">Update Part</h1>
              <Button
                className="bg-red-400 hover:bg-red-700"
                onClick={() => setShowUpdateInventoryModal(false)}
              >
                <XMarkIcon className="w-5 h-5" />
              </Button>
            </div>

            {/* scrollable form */}
            <div className="p-6 overflow-y-auto">
              <form className="space-y-6" onSubmit={handleFormSubmit}>
                <div className="flex">
                  {/* Condition */}
                  <div className="mb-4 mr-5">
                    <label
                      htmlFor="condition"
                      className="mb-2 block text-sm font-medium"
                    >
                      Choose Condition
                    </label>

                    <div className="relative">
                      <select
                        id="condition"
                        name="condition"
                        className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                        aria-describedby="condition-error"
                        defaultValue={
                          state?.values?.condition ?? part.condition ?? ""
                        }
                      >
                        <option value="" disabled>
                          Select condition
                        </option>
                        <option value="new">New</option>
                        <option value="old">Old</option>
                      </select>
                      <ShareIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                    {state.errors?.condition && (
                      <p className="text-red-500 text-sm mt-1">
                        {state.errors.condition}
                      </p>
                    )}
                  </div>

                  {/* Part Type */}
                  <div className="mb-4">
                    <label
                      htmlFor="type"
                      className="mb-2 block text-sm font-medium"
                    >
                      Choose Part Type
                    </label>

                    <div className="relative">
                      <select
                        id="type"
                        name="type"
                        className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                        aria-describedby="type-error"
                        defaultValue={state?.values?.type ?? part.type ?? ""}
                      >
                        <option value="" disabled>
                          Select type
                        </option>
                        <option value="engine">Engine</option>
                        <option value="brake">Brake</option>
                        <option value="filter">Filter</option>
                      </select>
                      <ShareIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                    {state.errors?.type && (
                      <p className="text-red-500 text-sm mt-1">
                        {state.errors.type}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex">
                  {/* Part Name */}
                  <div className="mb-4 mr-5">
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium"
                    >
                      Part Name
                    </label>
                    <div className="relative mt-2 rounded-md">
                      <div className="relative">
                        <input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Enter part name"
                          className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                          // required
                          defaultValue={state?.values?.name ?? part.name ?? ""}
                        />
                        <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                      </div>
                    </div>
                    {state.errors?.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {state.errors.name}
                      </p>
                    )}
                  </div>

                  {/* Vehicle  */}
                  <div className="mb-4">
                    <label
                      htmlFor="vehicle"
                      className="mb-2 block text-sm font-medium"
                    >
                      Vehicle Model
                    </label>
                    <div className="relative mt-2 rounded-md">
                      <div className="relative">
                        <input
                          id="vehicle"
                          name="vehicle"
                          type="text"
                          placeholder="Enter vehicle name/model"
                          className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                          // required
                          defaultValue={
                            state?.values?.vehicle ?? part.vehicle ?? ""
                          }
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
                </div>

                <div className="flex">
                  {/* price */}
                  <div className="mb-4 mr-5">
                    <label
                      htmlFor="price"
                      className="mb-2 block text-sm font-medium"
                    >
                      Price
                    </label>
                    <div className="relative mt-2 rounded-md">
                      <div className="relative">
                        <input
                          id="price"
                          name="price"
                          type="text"
                          placeholder="Enter price per unit"
                          className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                          // required
                          defaultValue={
                            state?.values?.price ?? part.price ?? ""
                          }
                        />
                        <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                      </div>
                    </div>
                    {state.errors?.price && (
                      <p className="text-red-500 text-sm mt-1">
                        {state.errors.price}
                      </p>
                    )}
                  </div>

                  {/* expire date */}
                  <div className="mb-5">
                    <label
                      htmlFor="expire_date"
                      className="mb-2 block text-sm font-medium"
                    >
                      Select Expire Date
                    </label>

                    <div className="relative">
                      <input
                        type="date"
                        id="expire_date"
                        name="expire_date"
                        className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                        aria-describedby="expire_date-error"
                        defaultValue={
                          state?.values?.expire_date ?? formatDateInput(part.expire_date) ?? ""
                        }
                      />
                      <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                    {state.errors?.expire_date && (
                      <p className="text-red-500 text-sm mt-1">
                        {state.errors.expire_date}
                      </p>
                    )}
                  </div>
                </div>

                {/* quantity */}
                <div className="mb-4">
                  <label
                    htmlFor="quantity"
                    className="mb-2 block text-sm font-medium"
                  >
                    Qunatity
                  </label>
                  <div className="relative mt-2 rounded-md">
                    <div className="relative">
                      <input
                        id="quantity"
                        name="quantity"
                        type="text"
                        placeholder="Enter part quantity"
                        className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                        // required
                        defaultValue={
                          state?.values?.quantity ?? part.quantity ?? 1
                        }
                      />
                      <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                    </div>
                  </div>
                  {state.errors?.quantity && (
                    <p className="text-red-500 text-sm mt-1">
                      {state.errors.quantity}
                    </p>
                  )}
                </div>

                <div className="flex">
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
                        Updating. Wait...
                      </>
                    ) : (
                      "Update Booking"
                    )}
                  </Button>

                  <button
                    className="text-red-500 background-transparent uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowUpdateInventoryModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* backdrop */}
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}
