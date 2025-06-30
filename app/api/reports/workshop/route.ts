import clientPromise from "@/app/lib/db/mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const {
    startDate,
    endDate,
    vehicle,
    // mechanic,
    query,
  }: {
    startDate?: string;
    endDate?: string;
    vehicle?: string;
    // mechanic?: string;
    query?: string;
  } = await req.json();

  const client = await clientPromise;
  const db = client.db("uzma");
  const collection = db.collection("repair_memos");
  // console.log("Collection:", collection);

  // Build dynamic filter object
  const filter: any = {};

  // Date range filter (based on repair date)
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = startDate;
    if (endDate) filter.date.$lte = endDate;
  }

  // Vehicle filter
  if (vehicle) {
    filter.vehicleNumber = { $regex: vehicle, $options: "i" };
  }

  // Mechanic filter
  // if (mechanic) {
  //   filter.mechanic = { $regex: mechanic, $options: "i" };
  // }

  // General search query (memo/job no, part, note, etc.)
  if (query) {
    filter.$or = [
      { memoId: { $regex: query, $options: "i" } },
      // { jobNo: { $regex: query, $options: "i" } },
      { "parts.part": { $regex: query, $options: "i" } },
      // { note: { $regex: query, $options: "i" } },
      { vehicleNumber: { $regex: query, $options: "i" } },
      //   { mechanic: { $regex: query, $options: "i" } },
    ];
  }
  // console.log("Filter:", filter);

  const memos = await collection.find(filter).sort({ date: -1 }).toArray();

  // console.log("Memos:", memos);
  return NextResponse.json(
    memos.map((memo) => ({
      id: memo._id.toString(),
      memoId: memo.memoId,
      vehicle: memo.vehicleNumber,
      //   mechanic: memo.mechanic,
      date: memo.date,
      parts: memo.parts,
      total: memo.total,
      note: memo.note,
      created_at: memo.created_at,
      updated_at: memo.updated_at,
      updated_by: memo.updated_by,
    }))
  );
}
