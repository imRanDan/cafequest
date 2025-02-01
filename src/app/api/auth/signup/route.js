import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    // Log the incoming request body
    const body = await req.json();
    console.log("Received request body:", body);

    const { name, email, password } = body;

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    // Improved error logging
    console.error("Signup error:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    // Always return a valid JSON object
    return NextResponse.json(
      { 
        error: "Error creating account", 
        details: error.message || "Unknown error",
        type: error.name
      },
      { status: 500 }
    );
  }
}