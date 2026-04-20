import { db } from "@/db";
import { laptops } from "@/db/schema";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq, ilike, or } from "drizzle-orm";

const laptopSchema = z.object({
  model: z.string(),
  sku: z.string(),
  manufacturer: z.string(),
  buyPrice: z.number().optional().default(0),
  extraCost: z.number().optional().default(0),
  sellPrice: z.number(),
  specs: z.string().optional(),
  imageUrl: z.string().optional(),
  status: z.string().optional().default("Ready"),
  processor: z.string().optional(),
  ram: z.string().optional(),
  storage: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const query = searchParams.get("query");

    let baseQuery = db.select().from(laptops);

    // If search query is provided (predictive search for Kasir)
    if (query) {
       const results = await db.select()
        .from(laptops)
        .where(
          or(
            ilike(laptops.sku, `%${query}%`),
            ilike(laptops.model, `%${query}%`)
          )
        )
        .limit(5);
       return NextResponse.json(results);
    }

    const allLaptops = await db.select().from(laptops);
    if (status) {
      return NextResponse.json(allLaptops.filter(l => l.status === status));
    }
    
    return NextResponse.json(allLaptops);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = laptopSchema.parse(body);

    const result = await db.insert(laptops).values({
      ...validatedData,
    }).returning({ id: laptops.id });

    return NextResponse.json({ success: true, id: result[0].id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Failed to add laptop" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = laptopSchema.parse(body);
    const { sku } = validatedData;

    await db.update(laptops)
      .set(validatedData)
      .where(eq(laptops.sku, sku));

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Failed to update laptop" }, { status: 500 });
  }
}
