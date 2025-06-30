import clientPromise from "@/app/lib/db/mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { startDate, endDate, vehicle, query }: {
    startDate?: string;
    endDate?: string;
    vehicle?: string;
    query?: string;
  } = await req.json();

  const client = await clientPromise;
  const db = client.db("uzma");
  const collection = db.collection("bookings");

  // Build dynamic filter object
  const filter: any = {};

  // Date range filter (based on booking date)
  if (startDate || endDate) {
    filter.created_at = {};
    if (startDate) {
      filter.created_at.$gte = new Date(startDate);
    }
    if (endDate) {
      // set endDate to end of the day
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filter.created_at.$lte = end;
    }
  }

  // Vehicle filter
  if (vehicle) {
    filter.vehicle = { $regex: vehicle, $options: "i" };
  }

  // General search query (challan, booking no, debit voucher, etc.)
  if (query) {
    filter.$or = [
      { customer: { $regex: query, $options: "i" } },
      { vehicle: { $regex: query, $options: "i" } },
      { driver: { $regex: query, $options: "i" } },
      { pickup_address: { $regex: query, $options: "i" } },
      { dropoff_address: { $regex: query, $options: "i" } },
      { payment_status: { $regex: query, $options: "i" } },
      { booking_status: { $regex: query, $options: "i" } },
      { booking_type: { $regex: query, $options: "i" } },
      { note: { $regex: query, $options: "i" } },
      { "challan_data.challan_no": { $regex: query, $options: "i" } },
      { "delivery_costs_data.debit_voucher_no": { $regex: query, $options: "i" } },
      { booking_no: { $regex: query, $options: "i" } },
    ];
  }

  const bookings = await collection
    .find(filter)
    .sort({ created_at: -1 })
    .toArray();

  return NextResponse.json(
    bookings.map((booking) => ({
      id: booking._id.toString(),
      customer: booking.customer,
      customer_bin: booking.customer_bin,
      customer_address: booking.customer_address,
      vehicle: booking.vehicle,
      driver: booking.driver,
      pickup_address: booking.pickup_address,
      dropoff_address: booking.dropoff_address,
      pickup_dt: booking.pickup_dt,
      dropoff_dt: booking.dropoff_dt,
      return_pickup_dt: booking.return_pickup_dt,
      return_dropoff_dt: booking.return_dropoff_dt,
      passenger_num: booking.passenger_num,
      payment_status: booking.payment_status,
      booking_status: booking.booking_status,
      booking_type: booking.booking_type,
      note: booking.note,
      credit_amount: booking.credit_amount,
      challan_data: booking.challan_data,
      delivery_costs_data: booking.delivery_costs_data,
      created_at: booking.created_at,
      updated_at: booking.updated_at,
      updated_by: booking.updated_by,
    }))
  );
}
