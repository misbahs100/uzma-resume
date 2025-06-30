"use client";
import {
  ChevronDoubleDownIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
// import VehiclesEntry from "../../vehicles-entry/page";
// import { useRouter } from "next/router";
// Define the Vehicle type
interface Vehicle {
  _id: string;
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
  taxTokenExpirationDate?: string;
  routePermitExpirationDate?: string;
  initialMileage: string | number;
  averageMileage: string | number;
  inService: boolean;
  mobileNumber?: string;
  assetFiles?: File[];
  assetFileUrl?: string;
}

const initialVehicleState: Vehicle = {
  _id: "",
  model: "",
  registrationNumber: "",
  type: "",
  manufacturingYear: 0,
  engineNumber: "",
  chassisNumber: "",
  fuelType: "",
  ownerName: "",
  ownerAddress: "",
  carryingCapacity: 0,
  fitnessExpirationDate: "",
  licenseExpirationDate: "",
  taxTokenExpirationDate: "",
  routePermitExpirationDate: "",

  initialMileage: 0,
  averageMileage: 0,
  inService: false,
  mobileNumber: "",
  assetFiles: [] as File[],
};

const VehiclesManagement = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Vehicle>(
    selectedVehicle || initialVehicleState
  );
  // const router = useRouter();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch("/api/vehicles/get-all");
        const data: Vehicle[] = await response.json();
        // console.log("Fetched vehicles:", data); // Log the fetched data
        setVehicles(data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchVehicles();
  }, []);

  useEffect(() => {
    if (selectedVehicle) setEditFormData(selectedVehicle);
  }, [selectedVehicle]);

  // Add refreshVehicles function
  const refreshVehicles = async () => {
    try {
      const response = await fetch("/api/vehicles/get-all");
      const data: Vehicle[] = await response.json();
      setVehicles(data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  //Handle vehicle edit
  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/vehicles/${editFormData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editFormData),
      });

      if (response.ok) {
        setIsModalOpen(false);
        setSelectedVehicle(null);
        refreshVehicles();
      } else {
        const error = await response.json();
        console.error("Error updating vehicle:", error.message);
        alert(error.message || "Failed to update vehicle");
      }
    } catch (error) {
      console.error("Error in update operation:", error);
      alert("An error occurred while updating the vehicle");
    }
  };

  //Handle vehicle delete
  const handleDeleteVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteVehicle = async () => {
    if (!selectedVehicle?._id) return;

    try {
      // console.log("Frontend: Deleting vehicle:", selectedVehicle._id);

      const response = await fetch(`/api/vehicles/${selectedVehicle._id}`, {
        method: "DELETE",
      });

      const result = await response.json();
      // console.log("Frontend: Delete response:", result);

      if (response.ok && result.success) {
        // Update local state
        setVehicles((prevVehicles) =>
          prevVehicles.filter((v) => v._id !== selectedVehicle._id)
        );
        setIsDeleteModalOpen(false);
        setSelectedVehicle(null);
      } else {
        const error = await response.json();
        console.error("Frontend: Failed to delete vehicle:", error.message);
        alert(result.message || "Failed to delete vehicle");
      }
    } catch (error) {
      console.error("Frontend: Error in delete operation:", error);
      alert("An error occurred while deleting the vehicle");
    }
  };

  const handleActionClick = (vehicle: Vehicle) => {
    setSelectedVehicle((prev) => (prev?._id === vehicle._id ? null : vehicle));
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.action === "vehicleUpdated") {
        refreshVehicles(); // Refresh the list
        setIsModalOpen(false);
        setSelectedVehicle(null);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const renderVehicleForm = (
    formData: Vehicle,
    setFormData: React.Dispatch<React.SetStateAction<Vehicle>>,
    handleSubmit: (e: React.FormEvent) => void,
    mode: string
  ) => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Model</label>
          <input
            type="text"
            value={formData.model}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, model: e.target.value }))
            }
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Registration Number</label>
          <input
            type="text"
            value={formData.registrationNumber}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                registrationNumber: e.target.value,
              }))
            }
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Vehicle Type</label>
          <input
            type="text"
            value={formData.type}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, type: e.target.value }))
            }
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Manufacturing Year</label>
          <input
            type="number"
            value={formData.manufacturingYear}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                manufacturingYear: e.target.value,
              }))
            }
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Engine Number</label>
          <input
            type="text"
            value={formData.engineNumber}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, engineNumber: e.target.value }))
            }
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Chassis Number</label>
          <input
            type="text"
            value={formData.chassisNumber}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                chassisNumber: e.target.value,
              }))
            }
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Fuel Type</label>
          <input
            type="text"
            value={formData.fuelType}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, fuelType: e.target.value }))
            }
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Owner Name</label>
          <input
            type="text"
            value={formData.ownerName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, ownerName: e.target.value }))
            }
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Owner Address</label>
          <input
            type="text"
            value={formData.ownerAddress}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, ownerAddress: e.target.value }))
            }
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Carrying Capacity</label>
          <input
            type="number"
            value={formData.carryingCapacity}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                carryingCapacity: e.target.value,
              }))
            }
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Fitness Expiration Date</label>
          <input
            type="date"
            value={formData.fitnessExpirationDate}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                fitnessExpirationDate: e.target.value,
              }))
            }
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">License Expiration Date</label>
          <input
            type="date"
            value={formData.licenseExpirationDate}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                licenseExpirationDate: e.target.value,
              }))
            }
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">
            Tax Token Expiration Date
          </label>
          <input
            type="date"
            value={formData.taxTokenExpirationDate}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                taxTokenExpirationDate: e.target.value,
              }))
            }
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">
            Route Permit Expiration Date
          </label>
          <input
            type="date"
            value={formData.routePermitExpirationDate}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                routePermitExpirationDate: e.target.value,
              }))
            }
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Initial Mileage</label>
          <input
            type="number"
            value={formData.initialMileage}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                initialMileage: e.target.value,
              }))
            }
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Average Mileage</label>
          <input
            type="number"
            value={formData.averageMileage}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                averageMileage: e.target.value,
              }))
            }
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Mobile Number</label>
          <input
            type="text"
            value={formData.mobileNumber}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                mobileNumber: e.target.value,
              }))
            }
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">In Service</label>
          <select
            value={formData.inService ? "true" : "false"}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                inService: e.target.value === "true",
              }))
            }
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Asset Files</label>
          <input
            type="file"
            multiple
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                assetFiles: Array.from(e.target.files || []),
              }))
            }
            className="w-full px-4 py-2 border rounded-md"
          />
          {formData.assetFileUrl && (
            <div className="mt-2">
              <a
                href={formData.assetFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Current File
              </a>
            </div>
          )}
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          {mode === "edit" ? "Update Vehicle" : "Add Vehicle"}
        </button>
      </form>
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Vehicles Management</h1>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse border border-gray-300">
          <thead>
            <tr className="">
              <th className="border border-gray-300 px-4 py-2">Model</th>
              <th className="border border-gray-300 px-4 py-2">Number Plate</th>
              <th className="border border-gray-300 px-4 py-2">Vehicle Type</th>
              <th className="border border-gray-300 px-4 py-2">On Trip</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  No vehicles found.
                </td>
              </tr>
            ) : (
              vehicles.map((vehicle) => (
                <tr key={vehicle._id}>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {vehicle.model}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {vehicle.registrationNumber}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {vehicle.type}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {vehicle.inService ? "Yes" : "No"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 flex items-center justify-center relative">
                    <button
                      onClick={() => handleActionClick(vehicle)}
                      className="flex items-center justify-center px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                      <span className="material-icons">
                        <Cog6ToothIcon className="h-5 w-5" />
                      </span>
                      <span className="material-icons">
                        <ChevronDoubleDownIcon className="h-5 w-5" />
                      </span>
                    </button>
                    {selectedVehicle?._id === vehicle._id && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                        <button
                          onClick={() => handleEditVehicle(vehicle)}
                          className="block w-full px-4 py-2 text-left hover:bg-gray-100 "
                        >
                          Edit Vehicle
                        </button>
                        <button
                          onClick={() => handleDeleteVehicle(vehicle)}
                          className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-red-600"
                        >
                          Delete Vehicle
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/*Edit Modal */}
      {isModalOpen && selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md w-2/3 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Update Vehicle</h2>
            {renderVehicleForm(
              editFormData,
              setEditFormData,
              handleEditSubmit,
              "edit"
            )}
            <button
              onClick={() => {
                setIsModalOpen(false);
                setSelectedVehicle(null);
              }}
              className="mt-4 px-4 py-2 bg-gray-300 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md w-2/3 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this vehicle?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-md mr-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteVehicle}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehiclesManagement;
