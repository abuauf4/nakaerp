import { db } from "@/db";
import { transactions, transactionItems, laptops, customers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const txns = await db.select().from(transactions);
    return NextResponse.json(txns);
  } catch (error) {
    console.error(error);
    return NextResponse.json([], { status: 200 });
  }
}
