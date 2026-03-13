import { fetchOrderBook } from "@/lib/coinbase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const productId = searchParams.get("product_id");

  if (!productId) {
    return NextResponse.json(
      { error: "product_id is required" },
      { status: 400 }
    );
  }

  try {
    const orderbook = await fetchOrderBook(productId);
    return NextResponse.json(orderbook);
  } catch (error) {
    console.error("Failed to fetch order book:", error);
    return NextResponse.json(
      { error: "Failed to fetch order book" },
      { status: 500 }
    );
  }
}
