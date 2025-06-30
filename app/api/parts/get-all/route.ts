import { NextResponse } from "next/server";
import { getAllParts } from "@/app/lib/models/repairMemo";

export async function GET() {
  try {
    const parts = await getAllParts();
    return NextResponse.json(parts);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
