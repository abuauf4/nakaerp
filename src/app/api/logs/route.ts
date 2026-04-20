import { db } from "@/db";
import { loginHistory, users } from "@/db/schema";
import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const rawLogs = await db
      .select({
        id: loginHistory.id,
        timestamp: loginHistory.timestamp,
        ipAddress: loginHistory.ipAddress,
        status: loginHistory.status,
        userName: users.name,
        userEmail: users.email,
        userRole: users.role,
      })
      .from(loginHistory)
      .leftJoin(users, eq(loginHistory.userId, users.id))
      .orderBy(desc(loginHistory.timestamp))
      .limit(50);

    return NextResponse.json(rawLogs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
  }
}
