import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { officeId } = await req.json();

  if (!officeId) {
    return NextResponse.json({ error: "Office ID is required" }, { status: 400 });
  }

  const response = NextResponse.json({ message: "Office set successfully" });
  response.cookies.set("uzma_selected_office", officeId, {
    path: "/",
    httpOnly: false,
  });

  return response;
}
