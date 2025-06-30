import { getAllVehicles } from "@/app/lib/controller/vehicleController";
import { NextResponse } from "next/server";

//Fetching all vehicles
export async function GET() {
  try {
    const vehicles = await getAllVehicles();
    return NextResponse.json(vehicles, { status: 200 });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return NextResponse.json(
      { message: "Failed to fetch vehicles." },
      { status: 500 }
    );
  }
}
