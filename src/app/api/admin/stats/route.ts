import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// GET /api/admin/stats - Admin-only endpoint for system statistics
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

    // Get user role from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Admin-only endpoint
    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Get system statistics
    const [totalUsers, totalItems, inventoryItems] = await Promise.all([
      prisma.user.count(),
      prisma.inventoryItem.count(),
      prisma.inventoryItem.findMany({
        select: {
          quantity: true,
          price: true,
        },
      }),
    ]);

    // Calculate total value
    const totalValue = inventoryItems.reduce((sum, item) => {
      return sum + item.quantity * item.price;
    }, 0);

    const stats = {
      totalUsers,
      totalItems,
      totalValue,
      systemHealth: "Healthy",
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin statistics" },
      { status: 500 }
    );
  }
}
