import { db } from "@/db";
import { users } from "@/db/schema";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const allUsers = await db.select().from(users);
    
    // Map db users to the format expected by the frontend
    const formattedUsers = allUsers.map((user) => {
      let roleAccent = "outline";
      if (user.role === "Developer" || user.role === "Superadmin") roleAccent = "primary";
      else if (user.role === "Owner" || user.role === "Management") roleAccent = "secondary";
      else if (user.role === "Admin" || user.role === "Auditor") roleAccent = "tertiary";

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions ? JSON.parse(user.permissions) : [],
        lastActivity: new Date(user.createdAt || new Date()).toLocaleString(),
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBg87fQIUfXYy6IhwRj-1xcTh_7omro_OGU5SvOwbdFzNuowdDWAY-ayJdgsPPxrVx_qtCJdALhIoOjMLo16G51IZ4NyAm1nwMzMTvbNiwJDdNRkK-6RKIgmTxYjJ5oJZvGiWOWFnbwXnFjFCNapuH7CwwzygoRy-xSeXTlBBqYZiooFTNMT8rf-1HP-F38JtYrrJcwi_xXEGsiXTyoCAH_1imZGBHYRtingGdlf8noW7OQQw2NPT6QUQRtXtRxSC_-xR0A5OG5h9OE",
        roleAccent,
      };
    });

    return NextResponse.json(formattedUsers);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, username, password, role, permissions } = body;

    if (!name || !email || !username || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Securely hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    await db.insert(users).values({
      name,
      email,
      username,
      passwordHash,
      role,
      permissions: permissions && Array.isArray(permissions) ? JSON.stringify(permissions) : JSON.stringify(["/"]),
    });

    return NextResponse.json({ success: true, message: "User added successfully" });
  } catch (error: any) {
    if (error.code === '23505') { // postgres unique constraint error
        const field = error.detail.includes('email') ? 'Email' : 'Username';
        return NextResponse.json({ error: `${field} already exists` }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to add user" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    await db.delete(users).where(eq(users.id, parseInt(id, 10)));
    return NextResponse.json({ success: true, message: "User revoked" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to revoke user" }, { status: 500 });
  }
}
