"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { OfficeForm } from "@/app/lib/definitions";
import CustomDropdown from "../dropdown";

type UserInfo = {
  name: string;
  user_role: string;
  email: string;
  image_url?: string;
};

type Office = {
  id: string;
  name: string;
  address: string;
  manager: string;
  contact: string;
  bin: string;
};

export default function TopNav({
  userInfo,
  offices,
  currentOffice,
}: {
  userInfo: UserInfo;
  offices: OfficeForm[];
  currentOffice: string | null;
}) {
  const router = useRouter();

  // profile state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // notification states
  const [notificationCount, setNotificationCount] = useState(0);
  const [hasSeenNotifications, setHasSeenNotifications] = useState(false);

  // Fetch notification count (expiring vehicles) from API
  const fetchNotificationCount = async () => {
    try {
      const res = await fetch("/api/vehicles/get-all");
      const data = await res.json();
      const today = new Date();
      const count = data.filter((v: any) => {
        const licenseDays =
          v.licenseExpirationDate &&
          Math.ceil(
            (new Date(v.licenseExpirationDate).getTime() - today.getTime()) /
              (1000 * 60 * 60 * 24)
          );
        const fitnessDays =
          v.fitnessExpirationDate &&
          Math.ceil(
            (new Date(v.fitnessExpirationDate).getTime() - today.getTime()) /
              (1000 * 60 * 60 * 24)
          );
        return (
          (licenseDays !== null && licenseDays <= 30) ||
          (fitnessDays !== null && fitnessDays <= 30)
        );
      }).length;
      setNotificationCount(count);
      setHasSeenNotifications(false); // Reset badge on fetch
    } catch {
      setNotificationCount(0);
      setHasSeenNotifications(false);
    }
  };

  useEffect(() => {
    fetchNotificationCount();
  }, []);

  const handleNotificationClick = () => {
    // fetchNotificationCount();
    setHasSeenNotifications(true); // Hide badge after click
    router.push("/dashboard/notification");
  };

  // manage office session
  const [selectedOffice, setSelectedOffice] = useState(currentOffice);
  const handleOfficeChange = async (office: Office) => {
    setSelectedOffice(office.id);

    await fetch("/api/session/set-office", {
      method: "POST",
      body: JSON.stringify({ officeId: office.id }),
    });

    router.refresh(); // refetch server components using the updated cookie
  };

  useEffect(() => {
    if (!selectedOffice && offices.length > 0) {
      const firstOfficeId = offices[0].id;
      setSelectedOffice(firstOfficeId);

      // set the cookie via the API route
      fetch("/api/session/set-office", {
        method: "POST",
        body: JSON.stringify({ officeId: firstOfficeId }),
      });
    }
  }, [selectedOffice, offices]);

  // since the type:DropdownOptionBase in CustomDropdown component is taking id and name as required fields
  // but offices array contains office_name
  const dropdownOffices = offices.map((office) => ({
    ...office,
    id: office.id,
    name: office.office_name,
  }));

  return (
    <div className="relative flex items-center justify-between p-4 bg-gray-50 mb-2 rounded-lg shadow-sm">
      <div className="flex items-center  gap-4 w-full">
        {/* Notification Bell Icon with Badge */}
        <div
          className="relative mr-4 cursor-pointer "
          onClick={handleNotificationClick}
        >
          {/* Bell SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          {/* Notification Count Badge */}
          {notificationCount > 0 && !hasSeenNotifications && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
              {notificationCount}
            </span>
          )}
        </div>

        {/* office */}
        <CustomDropdown<Office>
          values={dropdownOffices}
          selectedId={selectedOffice ?? undefined}
          onSelect={handleOfficeChange}
        />

        {/* profile */}
        <div className="flex items-center gap-4 justify-end w-full">
          <div
            className="bg-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer "
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <Image
              src={"/user-avatar.png"}
              alt={`${userInfo?.name}'s profile`}
              width={30}
              height={30}
              className="rounded-full"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{userInfo?.name}</span>
            <span className="text-xs text-gray-500">{userInfo?.email}</span>
          </div>
        </div>
      </div>
      {isDropdownOpen && (
        <div className="absolute right-0 top-16 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1 px-1">
            <div className="flex flex-col text-gray-700 group rounded-md w-full px-2 py-2 text-sm hover:bg-teal-100 hover:text-teal-900">
              <span className="text-sm font-medium">{userInfo?.name}</span>
              <span className="text-xs font-medium text-teal-400">
                {userInfo?.user_role}
              </span>
              <span className="text-xs text-gray-500">{userInfo?.email}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
