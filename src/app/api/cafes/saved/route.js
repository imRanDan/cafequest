import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const savedCafes = await prisma.savedCafe.findMany({
      where: {
        userId: session.user.id,
      },
    });
    return NextResponse.json(savedCafes);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch saved cafes" },
      { status: 500 }
    );
  }
}
