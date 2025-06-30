"use client";

import { XCircleIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface Vehicle {
  model: string;
  registrationNumber: string;
  type: string;
  manufacturingYear: string | number;
  engineNumber: string;
  chassisNumber: string;
  fuelType: string;
  ownerName: string;
  ownerAddress: string;
  carryingCapacity: string | number;
  fitnessExpirationDate: string;
  licenseExpirationDate: string;
  taxTokenExpirationDate: string;
  routePermitExpirationDate: string;
  initialMileage: string | number;
  averageMileage: string | number;
  inService: boolean;
  assetFiles?: File[];
  assetFileUrl?: string;
  mobileNumber?: string;
}

const VehiclesEntry = () => {
  const searchParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;
  const mode = searchParams?.get("mode") ?? "add";
  const vehicleId = searchParams?.get("id") ?? "";

  const [formData, setFormData] = useState<Vehicle>({
    model: "",
    registrationNumber: "",
    type: "",
    manufacturingYear: "",
    engineNumber: "",
    chassisNumber: "",
    fuelType: "",
    ownerName: "",
    ownerAddress: "",
    carryingCapacity: "",
    fitnessExpirationDate: "",
    licenseExpirationDate: "",
    taxTokenExpirationDate: "",
    routePermitExpirationDate: "",
    initialMileage: "",
    averageMileage: "",
    inService: false,
    mobileNumber: "",
    assetFiles: [],
  });

  const [filePreviews, setFilePreviews] = useState<
    { name: string; preview: string | null }[]
  >([]);
  const [fileInputRef, setFileInputRef] = useState<HTMLInputElement | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch vehicle data if in edit mode
  useEffect(() => {
    if (mode === "edit" && vehicleId) {
      const fetchVehicle = async () => {
        try {
          const response = await fetch(`/api/vehicles/${vehicleId}`);
          if (!response.ok) throw new Error("Failed to fetch vehicle");
          const data = await response.json();
          setFormData({
            ...data,
            fitnessExpirationDate: data.fitnessExpirationDate?.split("T")[0],
            licenseExpirationDate: data.licenseExpirationDate?.split("T")[0],
            taxTokenExpirationDate:
              data.taxTokenExpirationDate?.split("T")[0] || "",
            routePermitExpirationDate:
              data.routePermitExpirationDate?.split("T")[0] || "",
            mobileNumber: data.mobileNumber || "",
            assetFiles: [],
          });
        } catch (error) {
          console.error("Error fetching vehicle:", error);
        }
      };
      fetchVehicle();
    }
  }, [mode, vehicleId]);

  // File handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData({ ...formData, assetFiles: files });
      const previews = files
        .map((file) => {
          if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = () => {
              setFilePreviews((prev) => [
                ...prev,
                { name: file.name, preview: reader.result as string },
              ]);
            };
            reader.readAsDataURL(file);
            return null;
          } else if (file.type === "application/pdf") {
            const pdfUrl = URL.createObjectURL(file);
            return { name: file.name, preview: pdfUrl };
          } else {
            return { name: file.name, preview: null };
          }
        })
        .filter(Boolean) as { name: string; preview: string | null }[];
      setFilePreviews(previews);
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = (formData.assetFiles ?? []).filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, assetFiles: updatedFiles });
    setFilePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  // Unified submit handler for both add and edit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setMessage("");
    try {
      const formDataToSend = new FormData();
      // Debug log
      console.log("Submitting form data:", formData);
      // Append all non-file fields
      Object.keys(formData).forEach((key) => {
        if (key !== "assetFiles") {
          formDataToSend.append(key, formData[key as keyof Vehicle] as string);
        }
      });
      // Append files if any
      formData.assetFiles?.forEach((file) => {
        formDataToSend.append("assetFiles", file);
      });

      let url = "/api/vehicles";
      let method: "POST" | "PUT" = "POST";
      if (mode === "edit" && vehicleId) {
        url = `/api/vehicles/${vehicleId}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });
      // Debug log
      console.log("Server response:", await response.clone().json());

      if (response.ok) {
        setSubmitSuccess(true);
        setMessage(
          mode === "edit"
            ? "Vehicle updated successfully!"
            : "Vehicle added successfully!"
        );
        setFormData({
          model: "",
          registrationNumber: "",
          type: "",
          manufacturingYear: "",
          engineNumber: "",
          chassisNumber: "",
          fuelType: "",
          ownerName: "",
          ownerAddress: "",
          carryingCapacity: "",
          fitnessExpirationDate: "",
          licenseExpirationDate: "",
          initialMileage: "",
          averageMileage: "",
          taxTokenExpirationDate: "",
          routePermitExpirationDate: "",
          inService: false,
          mobileNumber: "",
          assetFiles: [],
        });
        if (fileInputRef) fileInputRef.value = "";
        setFilePreviews([]);
        setTimeout(() => setMessage(""), 3000);
        window.parent.postMessage(
          { action: "vehicleUpdated" },
          window.location.origin
        );
      } else {
        const error = await response.json();
        setMessage(error.message || "Failed to save vehicle");
      }
    } catch (error) {
      setMessage("Error saving vehicle");
      console.error("Error saving vehicle:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- FORM RENDER FUNCTION ---
  function renderVehicleForm(
    formData: Vehicle,
    setFormData: React.Dispatch<React.SetStateAction<Vehicle>>,
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
    mode: string | null,
    filePreviews: { name: string; preview: string | null }[],
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    handleRemoveFile: (index: number) => void,
    fileInputRef: HTMLInputElement | null,
    setFileInputRef: React.Dispatch<
      React.SetStateAction<HTMLInputElement | null>
    >
  ) {
    return (
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        {/* Model */}
        <div>
          <label className="block text-sm font-medium">Model</label>
          <input
            name="model"
            value={formData.model}
            onChange={(e) =>
              setFormData({ ...formData, model: e.target.value })
            }
            placeholder="Model"
            className="w-full border px-2 py-1 rounded"
            required
          />
        </div>
        {/* Registration Number */}
        <div>
          <label className="block text-sm font-medium">
            Registration Number
          </label>
          <input
            name="registrationNumber"
            value={formData.registrationNumber}
            onChange={(e) =>
              setFormData({ ...formData, registrationNumber: e.target.value })
            }
            placeholder="Registration Number"
            className="w-full border px-2 py-1 rounded"
            required
          />
        </div>
        {/* vehicle type */}
        <div>
          <label className="block text-sm font-medium">Type</label>
          <input
            name="type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            placeholder="Vehicle Type"
            className="w-full border px-2 py-1 rounded"
            required
          />
        </div>
        {/* Manufacturing Year */}
        <div>
          <label className="block text-sm font-medium">
            Manufacturing Year
          </label>
          <input
            name="manufacturingYear"
            type="number"
            value={formData.manufacturingYear}
            onChange={(e) =>
              setFormData({
                ...formData,
                manufacturingYear: Number(e.target.value),
              })
            }
            placeholder="Manufacturing Year"
            className="w-full border px-2 py-1 rounded"
            required
          />
        </div>
        {/* Engine Number */}
        <div>
          <label className="block text-sm font-medium">Engine Number</label>
          <input
            name="engineNumber"
            value={formData.engineNumber}
            onChange={(e) =>
              setFormData({ ...formData, engineNumber: e.target.value })
            }
            placeholder="Engine Number"
            className="w-full border px-2 py-1 rounded"
            required
          />
        </div>
        {/* Chassis Number */}
        <div>
          <label className="block text-sm font-medium">Chassis Number</label>
          <input
            name="chassisNumber"
            value={formData.chassisNumber}
            onChange={(e) =>
              setFormData({ ...formData, chassisNumber: e.target.value })
            }
            placeholder="Chassis Number"
            className="w-full border px-2 py-1 rounded"
            required
          />
        </div>

        {/* Fuel Type */}
        <div>
          <label className="block text-sm font-medium">Fuel Type</label>
          <input
            name="fuelType"
            value={formData.fuelType}
            onChange={(e) =>
              setFormData({ ...formData, fuelType: e.target.value })
            }
            placeholder="Fuel Type"
            className="w-full border px-2 py-1 rounded"
            required
          />
        </div>

        {/* Owner's Name and Address */}
        <div>
          <label className="block text-sm font-medium">Owner's Name</label>
          <input
            name="ownerName"
            value={formData.ownerName}
            onChange={(e) =>
              setFormData({ ...formData, ownerName: e.target.value })
            }
            placeholder="Owner's Name"
            className="w-full border px-2 py-1 rounded"
            required
          />
        </div>
        {/* Owner's Address */}
        <div>
          <label className="block text-sm font-medium">Owner's Address</label>
          <textarea
            name="ownerAddress"
            value={formData.ownerAddress}
            onChange={(e) =>
              setFormData({ ...formData, ownerAddress: e.target.value })
            }
            placeholder="Owner's Address"
            className="w-full border px-2 py-1 rounded"
            required
          ></textarea>
        </div>
        {/* Carrying Capacity */}
        <div>
          <label className="block text-sm font-medium">
            Carrying Capacity(Ton)
          </label>
          <input
            name="carryingCapacity"
            type="number"
            value={formData.carryingCapacity}
            onChange={(e) =>
              setFormData({
                ...formData,
                carryingCapacity: Number(e.target.value),
              })
            }
            placeholder="Carrying Capacity (Ton)"
            className="w-full border px-2 py-1 rounded"
            required
          />
        </div>

        {/*Fitness Expiration Dates */}
        <div>
          <label className="block text-sm font-medium">
            Fitness Expiration Date
          </label>
          <input
            name="fitnessExpirationDate"
            type="date"
            value={formData.fitnessExpirationDate}
            onChange={(e) =>
              setFormData({
                ...formData,
                fitnessExpirationDate: e.target.value,
              })
            }
            placeholder="Fitness Expiration Date"
            className="w-full border px-2 py-1 rounded"
            required
          />
        </div>

        {/* Liscense Exp date */}
        <div>
          <label className="block text-sm font-medium">
            License Expiration Date
          </label>
          <input
            name="licenseExpirationDate"
            type="date"
            value={formData.licenseExpirationDate}
            onChange={(e) =>
              setFormData({
                ...formData,
                licenseExpirationDate: e.target.value,
              })
            }
            placeholder="License Expiration Date"
            className="w-full border px-2 py-1 rounded"
            required
          />
        </div>
        {/* Tax Token Expiration Date */}
        <div>
          <label className="block text-sm font-medium">
            Tax Token Expiration Date
          </label>
          <input
            name="taxTokenExpirationDate"
            type="date"
            value={formData.taxTokenExpirationDate}
            onChange={(e) =>
              setFormData({
                ...formData,
                taxTokenExpirationDate: e.target.value,
              })
            }
            placeholder="Tax Token Expiration Date"
            className="w-full border px-2 py-1 rounded"
            required
          />
        </div>

        {/* Route Permit Expiration Date */}
        <div>
          <label className="block text-sm font-medium">
            Route Permit Expiration Date
          </label>
          <input
            name="routePermitExpirationDate"
            type="date"
            value={formData.routePermitExpirationDate}
            onChange={(e) =>
              setFormData({
                ...formData,
                routePermitExpirationDate: e.target.value,
              })
            }
            placeholder="Route Permit Expiration Date"
            className="w-full border px-2 py-1 rounded"
            required
          />
        </div>

        {/* Initial Mileage and Average Mileage */}
        <div>
          <label className="block text-sm font-medium">
            Initial Mileage / Litre
          </label>
          <input
            name="initialMileage"
            type="number"
            value={formData.initialMileage}
            onChange={(e) =>
              setFormData({
                ...formData,
                initialMileage: Number(e.target.value),
              })
            }
            placeholder="Initial Mileage / Litre"
            className="w-full border px-2 py-1 rounded"
          />
        </div>
        {/* Average mileage */}
        <div>
          <label className="block text-sm font-medium">
            Average Mileage / Litre
          </label>
          <input
            name="averageMileage"
            type="number"
            value={formData.averageMileage}
            onChange={(e) =>
              setFormData({
                ...formData,
                averageMileage: Number(e.target.value),
              })
            }
            placeholder="Average Mileage / Litre"
            className="w-full border px-2 py-1 rounded"
          />
        </div>
        {/* In Service Checkbox */}
        <div className="flex items-center space-x-2">
          <label className="block text-sm font-medium">onTrip?</label>
          <input
            type="checkbox"
            name="inService"
            checked={formData.inService}
            onChange={(e) =>
              setFormData({ ...formData, inService: e.target.checked })
            }
            className="h-5 w-5 rounded-full border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-sm font-medium">Mobile Number</label>
          <input
            name="mobileNumber"
            type="tel"
            value={formData.mobileNumber}
            onChange={(e) =>
              setFormData({ ...formData, mobileNumber: e.target.value })
            }
            placeholder="Mobile Number"
            className="w-full border px-2 py-1 rounded"
            required
          />
        </div>
        {/* File Upload */}
        <div>
          <label htmlFor="assetFiles" className="block text-sm font-medium">
            Upload Vehicles Document
            {/* <PaperClipIcon className="h-5 w-5 text-gray-600" /> */}
          </label>
          <input
            name="assetFiles"
            type="file"
            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
            multiple
            onChange={handleFileChange}
            ref={(input) => setFileInputRef(input)} // Set the file input reference
            className="w-full border px-2 py-1 rounded"
          />
        </div>

        {/* File Previews */}
        {filePreviews.length > 0 && (
          <div className="mt-4 flex">
            {filePreviews.map((file, index) => (
              <div
                key={index}
                className="my-4 w-[180px] h-[180px] flex flex-col justify-center items-center border rounded-md p-2 relative"
              >
                {file.preview ? (
                  file.name.endsWith(".pdf") ? (
                    <iframe
                      src={file.preview}
                      title={`PDF Preview ${index}`}
                      className="mt-2 w-full h-64 border rounded-md"
                    ></iframe>
                  ) : (
                    <img
                      src={file.preview}
                      alt={`File Preview ${index}`}
                      className="mt-2 w-32 h-32 object-cover rounded-md border"
                    />
                  )
                ) : (
                  <p className="text-gray-500 mt-2">No preview available</p>
                )}
                <p className="text-sm font-medium mt-2">{file.name}</p>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="absolute top-0 right-0 text-red-500 hover:text-red-700"
                >
                  <XCircleIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded "
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Saving..."
            : mode === "edit"
            ? "Update Vehicle"
            : "Add Vehicle"}
        </button>
        {message && (
          <div className="mt-2 text-green-600 font-semibold">{message}</div>
        )}
      </form>
    );
  }

  // --- MAIN RENDER ---
  return (
    <div className="flex flex-col items-center p-6 md:w-3/4 lg:w-2/3 mx-auto rounded-md shadow-md bg-white">
      <h1 className="text-2xl font-bold mb-4">
        {mode === "edit" ? "Edit Vehicle" : "Vehicle Entry Form"}
      </h1>
      {renderVehicleForm(
        formData,
        setFormData,
        handleSubmit,
        mode ?? null,
        filePreviews,
        handleFileChange,
        handleRemoveFile,
        fileInputRef,
        setFileInputRef
      )}
    </div>
  );
};

export default VehiclesEntry;
