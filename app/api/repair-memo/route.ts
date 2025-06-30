import { NextResponse } from "next/server";
import {
  getRepairMemoByMemoId,
  insertRepairMemo,
} from "@/app/lib/models/repairMemo";
import clientPromise from "@/app/lib/db/mongodb";
import { v4 as uuidv4 } from "uuid";

// Helper to generate memoId
async function generateMemoId(db: any, vehicleNumber: string, prefix = "UZ") {
  // Get last two digits from vehicle number (digits only)
  const digits = vehicleNumber.replace(/\D/g, "");
  const lastTwo = digits.slice(-2).padStart(2, "0");
  const base = `${prefix}${lastTwo}`;

  // Find the latest memo with this base
  const latest = await db
    .collection("repair_memos")
    .find({ memoId: { $regex: `^${base}-\\d{4}$` } })
    .sort({ memoId: -1 })
    .limit(1)
    .toArray();

  let nextSerial = 1;
  if (latest.length > 0) {
    const lastId = latest[0].memoId;
    const match = lastId.match(/-(\d{4})$/);
    if (match) {
      nextSerial = parseInt(match[1], 10) + 1;
    }
  }

  return `${base}-${nextSerial.toString().padStart(4, "0")}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // const memoId = uuidv4();
    // const memoId = `${Date.now()}`;
    const { vehicleNumber, date, parts } = body;
    const total = parts.reduce(
      (sum: number, p: any) => sum + p.price * p.quantity,
      0
    );

    // Validate and update parts quantity atomically
    const client = await clientPromise;
    const db = client.db("uzma");
    const partsCollection = db.collection("parts");

    // Validate all parts first
    for (const p of parts) {
      const partDoc = await partsCollection.findOne({ name: p.part });
      if (!partDoc) {
        return NextResponse.json(
          { success: false, error: `Part "${p.part}" not found.` },
          { status: 400 }
        );
      }
      if (p.quantity > partDoc.quantity) {
        return NextResponse.json(
          {
            success: false,
            error: `Not enough quantity for "${p.part}". Available: ${partDoc.quantity}, Requested: ${p.quantity}`,
          },
          { status: 400 }
        );
      }
    }
    // Generate custom memoId
    const memoId = await generateMemoId(db, vehicleNumber, "UZ");

    // All parts are valid, now update their quantities
    for (const p of parts) {
      await partsCollection.updateOne(
        { name: p.part },
        { $inc: { quantity: -p.quantity } }
      );
    }

    // Insert the memo
    const memo = {
      memoId,
      vehicleNumber,
      date,
      parts,
      total,
    };

    const result = await insertRepairMemo(memo);
    // console.log("Inserted memo:", result);
    return NextResponse.json({ success: true, memoId, id: result.insertedId });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

// GET /api/repair-memo?memoId=xxxx
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const memoId = searchParams.get("memoId");
  if (!memoId) {
    return NextResponse.json(
      { success: false, error: "memoId is required" },
      { status: 400 }
    );
  }
  try {
    const memo = await getRepairMemoByMemoId(memoId);
    if (!memo) {
      return NextResponse.json(
        { success: false, error: "Memo not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, memo });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
