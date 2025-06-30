// import { NextRequest, NextResponse } from "next/server";
// import {
//   getVehicleById,
//   deleteVehicleById,
//   updateVehicleById,
// } from "@/app/lib/controller/vehicleController";
// import { updateVehicle, deleteVehicle } from "@/app/lib/models/vehicle";

// // Fetching and Updating a Vehicle
// // export async function GET(
// //   req: Request,
// //   { params }: { params: { id: string } }
// // ) {
// //   try {
// //     const id = await params?.id;
// //     const vehicle = await getVehicleById(id);
// //     // console.log("Fetched vehicle:", vehicle); // Log the fetched vehicle
// //     if (!vehicle) {
// //       return NextResponse.json(
// //         { message: "Vehicle not found." },
// //         { status: 404 }
// //       );
// //     }
// //     return NextResponse.json(vehicle, { status: 200 });
// //   } catch (error) {
// //     console.error("Error fetching vehicle:", error);
// //     return NextResponse.json(
// //       {
// //         message:
// //           error instanceof Error ? error.message : "Failed to fetch vehicle.",
// //       },
// //       { status: 500 }
// //     );
// //   }
// // }

// export async function GET(req: Request, context: { params: { id: string } }) {
//   try {
//     const id = context.params.id;
//     const vehicle = await getVehicleById(id);
//     if (!vehicle) {
//       return NextResponse.json({ message: "Vehicle not found." }, { status: 404 });
//     }
//     return NextResponse.json(vehicle, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching vehicle:", error);
//     return NextResponse.json(
//       { message: error instanceof Error ? error.message : "Failed to fetch vehicle." },
//       { status: 500 }
//     );
//   }
// }

// //Update a Vehicle
// /*export async function PUT(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   const id = await params?.id;
//   const vehicleData = await req.json();

//   const existingVehicle = await updateVehicleById(id, vehicleData);
//   if (!existingVehicle) {
//     return NextResponse.json(
//       { message: "Vehicle not found." },
//       { status: 404 }
//     );
//   }

//   const updatedVehicle = await updateVehicle(id, vehicleData);
//   return NextResponse.json(updatedVehicle, { status: 200 });
// }*/

// export async function PUT(req: Request, context: { params: { id: string } }) {
//   try {
//     const id = context.params.id;
//     if (!id) {
//       return NextResponse.json(
//         { message: "Vehicle ID is required" },
//         { status: 400 }
//       );
//     }

//     const vehicleData = await req.json();
//     // console.log("Received update request for vehicle:", id);
//     // console.log("Update data:", vehicleData);

//     // Remove _id from update data if present
//     const { _id, ...updateData } = vehicleData;

//     const result = await updateVehicleById(id, updateData);

//     if (!result.success) {
//       return NextResponse.json({ message: "Failed to update vehicle" }, { status: 400 });
//     }

//     return NextResponse.json({ message: "Vehicle updated successfully!" }, { status: 200 });
//   } catch (error) {
//     console.error("Error updating vehicle:", error);
//     return NextResponse.json({ message: "Failed to update vehicle." }, { status: 500 });
//   }
// }

// // DELETE Handler
// export async function DELETE(
//   request: NextRequest,
//   context: { params: { id: string } }
// ) {
//   const { id } = context.params;
//   try {
//     const id = context.params.id;
//     // console.log("API: Delete request received for ID:", id);

//     if (!id) {
//       return NextResponse.json(
//         { message: "Vehicle ID is required" },
//         { status: 400 }
//       );
//     }
//     const result = await deleteVehicle(id);

//     if (!result.success) {
//       return NextResponse.json({ message: result.error || "Failed to delete vehicle" }, { status: 400 });
//     }

//     return NextResponse.json({ message: "Vehicle deleted successfully" }, { status: 200 });
//   } catch (error) {
//     console.error("API: Error in DELETE handler:", error);
//     return NextResponse.json({ message: "Internal server error" }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import {
  getVehicleById,
  deleteVehicleById,
  updateVehicleById,
} from "@/app/lib/controller/vehicleController";
import { updateVehicle, deleteVehicle } from "@/app/lib/models/vehicle";

// GET Handler
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const vehicle = await getVehicleById(id);
    if (!vehicle) {
      return NextResponse.json({ message: "Vehicle not found." }, { status: 404 });
    }
    return NextResponse.json(vehicle, { status: 200 });
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to fetch vehicle." },
      { status: 500 }
    );
  }
}

// PUT Handler
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { message: "Vehicle ID is required" },
        { status: 400 }
      );
    }

    const vehicleData = await req.json();
    const { _id, ...updateData } = vehicleData;

    const result = await updateVehicleById(id, updateData);

    if (!result.success) {
      return NextResponse.json({ message: "Failed to update vehicle" }, { status: 400 });
    }

    return NextResponse.json({ message: "Vehicle updated successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Error updating vehicle:", error);
    return NextResponse.json({ message: "Failed to update vehicle." }, { status: 500 });
  }
}

// DELETE Handler
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { message: "Vehicle ID is required" },
        { status: 400 }
      );
    }
    const result = await deleteVehicle(id);

    if (!result.success) {
      return NextResponse.json({ message: result.error || "Failed to delete vehicle" }, { status: 400 });
    }

    return NextResponse.json({ message: "Vehicle deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("API: Error in DELETE handler:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
