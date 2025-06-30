import { NextResponse } from "next/server";
import {
  createVehicle,
  getAllVehicles,
} from "@/app/lib/controller/vehicleController";
import cloudinary from "@/app/lib/cloudinary.config";
import { PassThrough } from "stream";

//Input: Vehicle data from the form
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    // console.log("Formdata: ", formData);
    const vehicleData: any = {};

    // Extract text fields
    formData.forEach((value, key) => {
      if (key === "assetFiles") return; // Skip file for now
      vehicleData[key] = value;
    });
    // Convert inService to a boolean
    vehicleData.inService = vehicleData.inService === "true";

    // Handle file upload to Cloudinary
    const file = formData.get("assetFiles") as File | null;
    // console.log("File: ", file);
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());

      // Create a PassThrough stream
      const stream = new PassThrough();
      stream.end(buffer);
      console.log("Starting Cloudinary upload...");
      // Upload to Cloudinary
      const uploadResult = await new Promise<{ secure_url: string }>(
        (resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              resource_type: "auto",
              folder: "vehicles",
            },
            (error, result) => {
              if (error) {
                console.error("Cloudinary upload error:", error);
                reject(error);
              } else {
                // console.log("Cloudinary upload result:", result);
                resolve(result as { secure_url: string });
              }
            }
          );
          // console.log("UploadStream: ", uploadStream);

          stream.pipe(uploadStream);
        }
      );

      vehicleData.assetFileUrl = uploadResult.secure_url; // Save the Cloudinary URL
      console.log("Cloudinary upload successful");
    }

    // Save vehicle data to the database
    const result = await createVehicle(vehicleData);
    // console.log("DB data: ", result);
    if (result.success) {
      return NextResponse.json(
        { message: "Vehicle added successfully!", id: result.insertedId },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { message: result.error || "Failed to add vehicle." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

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
