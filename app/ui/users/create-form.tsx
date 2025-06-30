'use client'

import { BriefcaseIcon, DocumentTextIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Button } from "../button";
import { createUser, UserState } from "@/app/lib/actions";
import { startTransition, useActionState, useEffect, useState } from "react";

export default function CreateUserForm() {
    const initialState: UserState = { message: null, errors: {} };
    const [isLoading, setIsLoading] = useState(false);
    const [state, formAction] = useActionState<UserState, FormData>(createUser, initialState);

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
      if (state.message === "User created successfully.") {
        window.location.href = "/dashboard/users"; // Redirect on the client side
      } else {
        console.error(state.message);
      }
    }, [state.message]);


  return (
    <form  onSubmit={handleFormSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        
        {/* User name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
          User name
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter user name"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <BriefcaseIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* User email */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
          Email
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <BriefcaseIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* User password */}
        <div className="mb-4">
          <label htmlFor="password" className="mb-2 block text-sm font-medium">
          Password
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="password"
                name="password"
                type="text"
                placeholder="Enter a minimum of 8 character long strong password with numbers, small and capital letters, special characters. Don't use dot(.)."
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                // pattern="/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/"
                aria-describedby="password-error"
              />
              <BriefcaseIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div id="password-error" aria-live="polite" aria-atomic="true">
            {state.errors?.password &&
              state.errors.password.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* contact no */}
        <div className="mb-4">
          <label htmlFor="contact" className="mb-2 block text-sm font-medium">
          Contact number
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="contact"
                name="contact"
                type="text"
                placeholder="Enter a phone number."
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <BriefcaseIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Role */}
        <div className="mb-4">
          <label htmlFor="user_role" className="mb-2 block text-sm font-medium">
            Choose role
          </label>
          <div className="relative">
            <select
              id="user_role"
              name="user_role"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            >
              <option value="" disabled>
                Select a role
              </option>
              {/* <option value="salesman">Salesman</option> */}
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* User address */}
        <div className="mb-4">
          <label htmlFor="address" className="mb-2 block text-sm font-medium">
          User Address
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <textarea
                id="address"
                name="address"
                placeholder="Enter address"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>


      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/suppliers"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit" disabled={isLoading} >
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
              creating user...
            </>
          ) : (
            "Create User"
          )}
        </Button>
      </div>
    </form>
  );
}
