import clientPromise from "@/app/lib/db/mongodb";
import { ObjectId } from "mongodb";

export interface RepairPart {
  part: string;
  quantity: number;
  price: number;
  // description?: string;
}

export interface RepairMemo {
  _id?: ObjectId;
  memoId: string;
  vehicleNumber: string;
  date: string;
  parts: RepairPart[];
  total: number;
}

export async function insertRepairMemo(memo: RepairMemo) {
  const client = await clientPromise;
  const db = client.db("uzma");
  const collection = db.collection("repair_memos");
  const result = await collection.insertOne(memo);
  return result;
}

export async function getRepairMemoByMemoId(memoId: string) {
  const client = await clientPromise;
  const db = client.db("uzma");
  const collection = db.collection("repair_memos");
  return collection.findOne({ memoId });
}
export async function getAllParts() {
  const client = await clientPromise;
  const db = client.db("uzma");
  const collection = db.collection("parts");
  return collection.find({}).toArray();
}
