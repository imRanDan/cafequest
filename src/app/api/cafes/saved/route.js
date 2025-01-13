import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST /api/cafes/saved - Save a new cafe
export async function POST(req) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const savedCafe = await prisma.savedCafe.create({
      data: {
        userId: session.user.id,
        cafeId: body.cafeId,
        name: body.name,
        latitude: body.latitude,
        longitude: body.longitude,
      },
    });
    return NextResponse.json(savedCafe);
  } catch (error) {
    return NextResponse.json({ error: "Failed to save cafe" }, { status: 500 });
  }
}

// GET /api/cafes/saved - Get all saved cafes
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
