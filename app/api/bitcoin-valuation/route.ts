import { NextResponse } from "next/server";
import { fetchBitcoinValuation } from "@/lib/fetchBitcoinValuation";

export async function GET() {
  try {
    const data = await fetchBitcoinValuation();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 502 });
  }
}
