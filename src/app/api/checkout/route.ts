import { db } from "@/db";
import { laptops, transactions, transactionItems, customers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const checkoutSchema = z.object({
  customerName: z.string(),
  customerPhone: z.string().optional(),
  items: z.array(z.object({
    id: z.number(),
    price: z.number(),
  })),
  total: z.number(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = checkoutSchema.parse(body);

    // 1. Handle Customer
    const customer = await db.insert(customers).values({
      name: validatedData.customerName,
      phone: validatedData.customerPhone,
    }).returning({ id: customers.id });

    const customerId = customer[0]?.id;

    // 2. Create Transaction
    const transaction = await db.insert(transactions).values({
      customerId,
      totalAmount: validatedData.total,
      paymentMethod: "Tunai", // Defaulted as per user request to simplify
      status: "Success",
    }).returning({ id: transactions.id });

    const transactionId = transaction[0]?.id;

    // 3. Process Items
    for (const item of validatedData.items) {
      await db.insert(transactionItems).values({
        transactionId,
        laptopId: item.id,
        priceAtSale: item.price,
      });

      // Update Laptop Status to 'Sold'
      await db.update(laptops)
        .set({ status: "Sold" })
        .where(eq(laptops.id, item.id));
    }

    return NextResponse.json({ success: true, transactionId });
  } catch (error) {
    console.error("Checkout detail error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
