"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import {
  inventoryItemSchema,
  inventoryItemUpdateSchema,
} from "@/lib/validations";

// Server Action for creating inventory items
export async function createInventoryItem(formData: FormData) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return {
        success: false,
        error: "You must be logged in to create items.",
      };
    }

    // Extract and validate form data
    const rawData = {
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || undefined,
      quantity: parseInt(formData.get("quantity") as string),
      price: parseFloat(formData.get("price") as string),
      category: formData.get("category") as string,
      sku: formData.get("sku") as string,
    };

    // Validate using Zod schema
    const validatedData = inventoryItemSchema.parse(rawData);

    // Create item in database with userId
    const item = await prisma.inventoryItem.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        quantity: validatedData.quantity,
        price: validatedData.price,
        category: validatedData.category,
        sku: validatedData.sku,
        userId: session.user.id,
      },
    });

    // Revalidate the page to show updated data
    revalidatePath("/");

    return { success: true, item };
  } catch (error) {
    console.error("Error creating inventory item:", error);

    // Handle unique constraint violation for SKU
    if (error instanceof Error && error.message.includes("sku")) {
      return {
        success: false,
        error: "SKU already exists. Please use a different SKU.",
      };
    }

    // Handle validation errors
    if (error instanceof Error && error.name === "ZodError") {
      return {
        success: false,
        error: "Please check your input data and try again.",
      };
    }

    return {
      success: false,
      error: "Failed to create item. Please try again.",
    };
  }
}

// Server Action for updating inventory items
export async function updateInventoryItem(id: string, formData: FormData) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return {
        success: false,
        error: "You must be logged in to update items.",
      };
    }

    // Get user role
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!user) {
      return {
        success: false,
        error: "User not found.",
      };
    }

    // Check if item exists
    const existingItem = await prisma.inventoryItem.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return {
        success: false,
        error: "Item not found.",
      };
    }

    // Authorization: Users can only update their own items, admins can update any item
    if (user.role !== "ADMIN" && existingItem.userId !== session.user.id) {
      return {
        success: false,
        error: "You don't have permission to update this item.",
      };
    }

    // Extract and validate form data
    const rawData = {
      name: (formData.get("name") as string) || undefined,
      description: (formData.get("description") as string) || undefined,
      quantity: formData.get("quantity")
        ? parseInt(formData.get("quantity") as string)
        : undefined,
      price: formData.get("price")
        ? parseFloat(formData.get("price") as string)
        : undefined,
      category: (formData.get("category") as string) || undefined,
      sku: (formData.get("sku") as string) || undefined,
    };

    // Remove undefined values
    const cleanData = Object.fromEntries(
      Object.entries(rawData).filter(([, value]) => value !== undefined)
    );

    // Validate using Zod schema
    const validatedData = inventoryItemUpdateSchema.parse(cleanData);

    // Update item in database
    const item = await prisma.inventoryItem.update({
      where: { id },
      data: validatedData,
    });

    // Revalidate the page to show updated data
    revalidatePath("/");

    return { success: true, item };
  } catch (error) {
    console.error("Error updating inventory item:", error);

    // Handle unique constraint violation for SKU
    if (error instanceof Error && error.message.includes("sku")) {
      return {
        success: false,
        error: "SKU already exists. Please use a different SKU.",
      };
    }

    // Handle validation errors
    if (error instanceof Error && error.name === "ZodError") {
      return {
        success: false,
        error: "Please check your input data and try again.",
      };
    }

    return {
      success: false,
      error: "Failed to update item. Please try again.",
    };
  }
}

// Server Action for deleting inventory items
export async function deleteInventoryItem(id: string) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return {
        success: false,
        error: "You must be logged in to delete items.",
      };
    }

    // Get user role
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!user) {
      return {
        success: false,
        error: "User not found.",
      };
    }

    // Check if item exists
    const existingItem = await prisma.inventoryItem.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return {
        success: false,
        error: "Item not found.",
      };
    }

    // Authorization: Users can only delete their own items, admins can delete any item
    if (user.role !== "ADMIN" && existingItem.userId !== session.user.id) {
      return {
        success: false,
        error: "You don't have permission to delete this item.",
      };
    }

    await prisma.inventoryItem.delete({
      where: { id },
    });

    // Revalidate the page to show updated data
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error deleting inventory item:", error);
    return {
      success: false,
      error: "Failed to delete item. Please try again.",
    };
  }
}

// Helper function for form submission with redirect
export async function createInventoryItemWithRedirect(formData: FormData) {
  const result = await createInventoryItem(formData);

  if (result.success) {
    redirect("/?tab=list&success=item-created");
  }

  // If there's an error, we'll handle it in the component
  return result;
}
