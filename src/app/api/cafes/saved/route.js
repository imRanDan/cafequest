import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";

// POST /api/cafes/saved - Save a new cafe
export async function POST(req) {
  try {
    console.log("1. Starting POST request");
    
    const session = await getServerSession(authOptions);
    console.log("2. Session:", session);

    if (!session) {
      console.log("3a. No session found");
      return NextResponse.json(
        { error: "Unauthorized - No session found" }, 
        { status: 401 }
      );
    }

    if (!session.user?.id) {
      console.log("3b. No user ID in session");
      return NextResponse.json(
        { error: "Unauthorized - No user ID in session" }, 
        { status: 401 }
      );
    }

    const body = await req.json();
    console.log("4. Request body:", body);

    console.log("5. Attempting database operation");
    const savedCafe = await prisma.savedCafe.create({
      data: {
        userId: session.user.id,
        cafeId: String(body.cafeId),
        name: body.name || "Unnamed Cafe",
        latitude: Number(body.latitude),
        longitude: Number(body.longitude),
        address: body.address || null,
      },
    });

    console.log("6. Successfully saved cafe:", savedCafe);
    return NextResponse.json({ success: true, data: savedCafe });

  } catch (error) {
    console.error("Error saving cafe:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// GET /api/cafes/saved - Get all saved cafes
export async function GET() {
  const session = await getServerSession(authOptions);

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

// New DELETE function
export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get cafeId from the URL
    const url = new URL(req.url);
    const cafeId = url.pathname.split('/').pop();

    await prisma.savedCafe.deleteMany({
      where: {
        userId: session.user.id,
        cafeId: cafeId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting cafe:", error);
    return NextResponse.json(
      { error: "Failed to delete cafe" },
      { status: 500 }
    );
  }
}