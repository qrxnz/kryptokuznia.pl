import { NextResponse } from "next/server";
import { fetchDashboard } from "@/lib/fetchDashboard";

export async function GET() {
  const data = await fetchDashboard();
  return NextResponse.json(data);
}
