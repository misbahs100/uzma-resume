// app/api/send-sms/send-cron-sms/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/db/mongodb";
import { sendSmsNotification } from "@/app/lib/twilio/twilioServer";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("uzma");
  const vehicles = await db.collection("vehicles").find({}).toArray();

  const getDaysLeft = (dateStr: string) => {
    if (!dateStr) return 0;
    const today = new Date();
    const exp = new Date(dateStr);
    return Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  for (const v of vehicles) {
    let expiredFields: string[] = [];
    if (getDaysLeft(v.licenseExpirationDate) <= 30)
      expiredFields.push("লাইসেন্স");
    if (getDaysLeft(v.fitnessExpirationDate) <= 30)
      expiredFields.push("ফিটনেস");
    if (getDaysLeft(v.taxTokenExpirationDate) <= 30)
      expiredFields.push("ট্যাক্স টোকেন");
    if (getDaysLeft(v.routePermitExpirationDate) <= 30)
      expiredFields.push("রুট পারমিট");

    if (expiredFields.length > 0 && v.mobileNumber) {
      const msg = `গাড়ি ${v.registrationNumber} এর ${expiredFields.join(
        ", "
      )} মেয়াদ শেষ হয়েছে। দয়া করে দ্রুত নবায়ন করুন।`;
      await sendSmsNotification(v.mobileNumber, msg);
    }
  }

  return NextResponse.json({ success: true });
}

/**
 * Vercel Cron Jobs (if using Vercel)
Vercel supports scheduled serverless functions using Vercel Cron Jobs.

How to set up:

Create API route, e.g. /api/send-sms/send-cron-sms/route.ts.
In  project root, create a vercel.json file (if you don't have one).
Add a cron job entry:
{
  "crons": [
    {
      "path": "/api/notifications/send-expiry-sms",
      "schedule": "0 0 * * *" // This runs every day at midnight
    }
  ]
 */
