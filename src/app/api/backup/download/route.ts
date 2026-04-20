import { db } from "@/db";
import { laptops, customers, transactions, transactionItems, users, loginHistory } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const backupData = {
      laptops: await db.select().from(laptops),
      customers: await db.select().from(customers),
      transactions: await db.select().from(transactions),
      transactionItems: await db.select().from(transactionItems),
      users: await db.select().from(users),
      loginHistory: await db.select().from(loginHistory),
      exportedAt: new Date().toISOString(),
      system: "Naka ERP v1.0 Modernized"
    };

    const jsonString = JSON.stringify(backupData, null, 2);
    
    return new NextResponse(jsonString, {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="naka_erp_vault_${new Date().toISOString().split('T')[0]}.json"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate vault backup" }, { status: 500 });
  }
}
