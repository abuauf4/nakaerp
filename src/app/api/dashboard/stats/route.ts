import { db } from "@/db";
import { laptops, transactions } from "@/db/schema";
import { sql, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Total Revenue (MTD - Mocked for now to just show total revenue)
    const revenueResult = await db.select({
      total: sql<number>`sum(${transactions.totalAmount})`
    }).from(transactions);

    // 2. Units Sold
    const unitsSoldResult = await db.select({
      count: sql<number>`count(*)`
    }).from(laptops).where(sql`${laptops.status} = 'Sold'`);

    // 3. Stock Health (Percentage of 'Ready' units / Total)
    const totalUnitsResult = await db.select({
      count: sql<number>`count(*)`
    }).from(laptops);

    const readyUnitsResult = await db.select({
      count: sql<number>`count(*)`
    }).from(laptops).where(sql`${laptops.status} = 'Ready'`);

    const total = totalUnitsResult[0]?.count || 0;
    const ready = readyUnitsResult[0]?.count || 0;
    const stockHealth = total > 0 ? (ready / total) * 100 : 0;

    const recentTx = await db.select({
      id: transactions.id,
      amount: transactions.totalAmount,
      status: transactions.status,
    }).from(transactions)
      .orderBy(desc(transactions.createdAt))
      .limit(3);

    return NextResponse.json({
      revenue: revenueResult[0]?.total || 0,
      unitsSold: unitsSoldResult[0]?.count || 0,
      stockHealth: stockHealth.toFixed(1) + "%",
      recentTransactions: recentTx.map(tx => ({
         name: `Pesanan #${tx.id.toString().padStart(3, "0")}`,
         id: `TXN-${tx.id.toString().padStart(5, '0')}`,
         amount: `$${tx.amount.toLocaleString()}`,
         status: tx.status || "Success",
         icon: "payments",
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 });
  }
}
