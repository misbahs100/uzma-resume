import { NextResponse } from "next/server";
import { sendSmsNotification } from "@/app/lib/twilio/twilioServer";
export async function POST(req: Request) {
  const { to, message } = await req.json();
  const result = await sendSmsNotification(to, message);
  return NextResponse.json(result);
}
