"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { get } from "http";
import { daysLeft } from "@/app/lib/utils";

// import { sendSmsNotification } from "../../lib/twilio/twilioServer";
interface Vehicle {
  _id: string;
  model: string;
  registrationNumber: string;
  licenseExpirationDate: string;
  fitnessExpirationDate: string;
  taxTokenExpirationDate?: string;
  routePermitExpirationDate?: string;
  mobileNumber?: string; // Add this field
}

const REMOVED_KEY = "removedNotifications";
const POLL_INTERVAL = 10 * 60 * 1000; // 10 minutes

const NotificationPage = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [removed, setRemoved] = useState<string[]>([]);
  const notifiedRef = useRef<Set<string>>(new Set()); // To avoid duplicate SMS

  // Load removed notifications from localStorage
  useEffect(() => {
    const removedIds = JSON.parse(localStorage.getItem(REMOVED_KEY) || "[]");
    setRemoved(removedIds);
  }, []);

  // Fetch vehicles on mount and at intervals
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await fetch("/api/vehicles/get-all");
        const data = await res.json();
        setVehicles(data);
      } catch (error) {
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
    const interval = setInterval(fetchVehicles, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Filter out removed notifications
  const filteredVehicles = vehicles.filter((v) => !removed.includes(v._id));

  const expiringSoon = filteredVehicles.filter(
    (v) =>
      (daysLeft(v.licenseExpirationDate) !== null &&
        daysLeft(v.licenseExpirationDate)! <= 30) ||
      (daysLeft(v.fitnessExpirationDate) !== null &&
        daysLeft(v.fitnessExpirationDate)! <= 30) ||
      (v.taxTokenExpirationDate !== undefined &&
        daysLeft(v.taxTokenExpirationDate) !== null &&
        daysLeft(v.taxTokenExpirationDate)! <= 30) ||
      (v.routePermitExpirationDate !== undefined &&
        daysLeft(v.routePermitExpirationDate) !== null &&
        daysLeft(v.routePermitExpirationDate)! <= 30)
  );

  // Remove notification and persist in localStorage
  const handleRemove = (id: string) => {
    const updated = [...removed, id];
    setRemoved(updated);
    localStorage.setItem(REMOVED_KEY, JSON.stringify(updated));
  };

  // Helper to check if expired
  const isExpired = (dateStr?: string) =>
    dateStr ? daysLeft(dateStr) <= 0 : false;

  // Auto notification effect (runs on vehicles update)
  useEffect(() => {
    expiringSoon.forEach((v) => {
      if (!v.mobileNumber) return;

      let expiredFields: string[] = [];
      if (isExpired(v.licenseExpirationDate)) expiredFields.push("লাইসেন্স");
      if (isExpired(v.fitnessExpirationDate)) expiredFields.push("ফিটনেস");
      if (isExpired(v.taxTokenExpirationDate))
        expiredFields.push("ট্যাক্স টোকেন");
      if (isExpired(v.routePermitExpirationDate))
        expiredFields.push("রুট পারমিট");

      // Only notify if not already notified in this session
      if (expiredFields.length > 0 && !notifiedRef.current.has(v._id)) {
        const msg = `গাড়ি ${v.registrationNumber} এর ${expiredFields.join(
          ", "
        )} মেয়াদ শেষ হয়েছে। দয়া করে দ্রুত নবায়ন করুন।`;

        (async () => {
          await fetch("/api/send-sms", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ to: v.mobileNumber, message: msg }),
          });
          notifiedRef.current.add(v._id);
        })();
      }
    });
  }, [expiringSoon]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>

      {loading ? (
        <div>Loading...</div>
      ) : expiringSoon.length === 0 ? (
        <div>No upcoming expirations.</div>
      ) : (
        <ul className="space-y-4">
          {expiringSoon.map((v) => (
            <li
              key={v._id}
              className="p-4 border rounded bg-yellow-50 flex items-center justify-between"
            >
              <div>
                <div className="font-semibold">
                  {v.model} ({v.registrationNumber})
                </div>
                {daysLeft(v.licenseExpirationDate)! <= 0 ? (
                  <div className="text-red-600">
                    License expired before{" "}
                    {Math.abs(daysLeft(v.licenseExpirationDate))} day(s) (
                    {v.licenseExpirationDate})
                  </div>
                ) : (
                  daysLeft(v.licenseExpirationDate) !== null &&
                  daysLeft(v.licenseExpirationDate)! <= 30 && (
                    <div className="text-red-600">
                      License will expire within{" "}
                      {daysLeft(v.licenseExpirationDate)} day(s) (
                      {v.licenseExpirationDate})
                    </div>
                  )
                )}
                {daysLeft(v.fitnessExpirationDate)! <= 0 ? (
                  <div className="text-red-600">
                    Fitness expired before{" "}
                    {Math.abs(daysLeft(v.fitnessExpirationDate))} day(s) (
                    {v.fitnessExpirationDate})
                  </div>
                ) : (
                  daysLeft(v.fitnessExpirationDate) !== null &&
                  daysLeft(v.fitnessExpirationDate)! <= 30 && (
                    <div className="text-red-600">
                      Fitness will expire within{" "}
                      {daysLeft(v.fitnessExpirationDate)} day(s) (
                      {v.fitnessExpirationDate})
                    </div>
                  )
                )}
                {v.taxTokenExpirationDate &&
                  (daysLeft(v.taxTokenExpirationDate)! <= 0 ? (
                    <div className="text-red-600">
                      Tax Token expired before{" "}
                      {Math.abs(daysLeft(v.taxTokenExpirationDate))} day(s) (
                      {v.taxTokenExpirationDate})
                    </div>
                  ) : (
                    daysLeft(v.taxTokenExpirationDate)! <= 30 && (
                      <div className="text-red-600">
                        Tax Token will expire within{" "}
                        {daysLeft(v.taxTokenExpirationDate)} day(s) (
                        {v.taxTokenExpirationDate})
                      </div>
                    )
                  ))}
                {v.routePermitExpirationDate &&
                  (daysLeft(v.routePermitExpirationDate)! <= 0 ? (
                    <div className="text-red-600">
                      Route Permit expired before{" "}
                      {Math.abs(daysLeft(v.routePermitExpirationDate))} day(s) (
                      {v.routePermitExpirationDate})
                    </div>
                  ) : (
                    daysLeft(v.routePermitExpirationDate)! <= 30 && (
                      <div className="text-red-600">
                        Route Permit will expire within{" "}
                        {daysLeft(v.routePermitExpirationDate)} day(s) (
                        {v.routePermitExpirationDate})
                      </div>
                    )
                  ))}
              </div>
              {/* Remove Button */}
              <button
                className="text-red-500 hover:text-red-700 font-bold text-lg flex flex-col items-center"
                title="Remove notification"
                onClick={() => handleRemove(v._id)}
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationPage;
