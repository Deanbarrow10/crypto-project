import { fetchCandles } from "@/lib/coinbase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const productId = searchParams.get("product_id");
  const granularity = searchParams.get("granularity") || "ONE_HOUR";

  if (!productId) {
    return NextResponse.json(
      { error: "product_id is required" },
      { status: 400 }
    );
  }

  try {
    const candles = await fetchCandles(productId, granularity);
    return NextResponse.json(candles);
  } catch (error) {
    console.error("Failed to fetch candles:", error);
    return NextResponse.json(
      { error: "Failed to fetch candle data" },
      { status: 500 }
    );
  }
}
