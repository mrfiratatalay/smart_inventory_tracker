import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { CreateInventoryItem } from "@/types/inventory";

// GET /api/inventory - Fetch inventory items based on user role
export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Test the connection first
    await prisma.$connect();

    // Get user role from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let items;

    if (user.role === "ADMIN") {
      // Admins can see ALL inventory items from all users
      items = await prisma.inventoryItem.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      // Regular users can only see their own items
      items = await prisma.inventoryItem.findMany({
        where: { userId: session.user.id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching inventory items:", error);

    // Check for replica set error specifically
    if (
      error instanceof Error &&
      (error.message.includes("replica set") ||
        error.message.includes("transactions") ||
        error.message.includes("P2031"))
    ) {
      return NextResponse.json(
        {
          error:
            "MongoDB needs to be configured as a replica set. Please see MONGODB_FIX.md for setup instructions.",
          details:
            "Run MongoDB with replica set configuration or use MongoDB Atlas.",
        },
        { status: 503 }
      );
    }

    // Check if it's a database connection error
    if (
      error instanceof Error &&
      (error.message.includes("Environment variable not found: DATABASE_URL") ||
        error.message.includes("Invalid") ||
        error.message.includes("PrismaClientInitializationError"))
    ) {
      return NextResponse.json(
        {
          error:
            "Database not configured. Please set up MongoDB connection in .env file.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch inventory items" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST /api/inventory - Create a new inventory item
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body: CreateInventoryItem = await request.json();

    // Validate required fields
    if (!body.name || body.quantity < 0 || body.price < 0) {
      return NextResponse.json(
        { error: "Name is required, and quantity/price must be non-negative" },
        { status: 400 }
      );
    }

    // Test the connection first
    await prisma.$connect();

    // Create item with userId from session
    const item = await prisma.inventoryItem.create({
      data: {
        name: body.name,
        description: body.description,
        quantity: body.quantity,
        price: body.price,
        category: body.category,
        sku: body.sku,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Error creating inventory item:", error);

    // Check for replica set error specifically
    if (
      error instanceof Error &&
      (error.message.includes("replica set") ||
        error.message.includes("transactions") ||
        error.message.includes("P2031"))
    ) {
      return NextResponse.json(
        {
          error:
            "MongoDB needs to be configured as a replica set. Please see MONGODB_FIX.md for setup instructions.",
          details:
            "Run MongoDB with replica set configuration or use MongoDB Atlas.",
        },
        { status: 503 }
      );
    }

    // Check if it's a database connection error
    if (
      error instanceof Error &&
      (error.message.includes("Environment variable not found: DATABASE_URL") ||
        error.message.includes("Invalid") ||
        error.message.includes("PrismaClientInitializationError"))
    ) {
      return NextResponse.json(
        {
          error:
            "Database not configured. Please set up MongoDB connection in .env file.",
        },
        { status: 503 }
      );
    }

    // Handle unique constraint violation for SKU
    if (error instanceof Error && error.message.includes("sku")) {
      return NextResponse.json(
        { error: "SKU already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create inventory item" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
