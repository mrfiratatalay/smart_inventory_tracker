import { z } from "zod";

// Inventory item validation schema
export const inventoryItemSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Product name must be less than 100 characters"),
  
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  
  quantity: z
    .number()
    .min(0, "Quantity cannot be negative")
    .max(999999, "Quantity is too large")
    .int("Quantity must be a whole number"),
  
  price: z
    .number()
    .min(0, "Price cannot be negative")
    .max(999999.99, "Price is too large")
    .refine((val) => Number(val.toFixed(2)) === val, {
      message: "Price can only have up to 2 decimal places"
    }),
  
  category: z
    .string()
    .min(1, "Category is required")
    .max(50, "Category must be less than 50 characters"),
  
  sku: z
    .string()
    .min(1, "SKU is required")
    .max(50, "SKU must be less than 50 characters")
    .regex(/^[A-Z0-9-]+$/i, "SKU can only contain letters, numbers, and hyphens")
});

// Type inference from schema
export type InventoryItemFormData = z.infer<typeof inventoryItemSchema>;

// Partial schema for updates (all fields optional except id)
export const inventoryItemUpdateSchema = inventoryItemSchema.partial();

export type InventoryItemUpdateData = z.infer<typeof inventoryItemUpdateSchema>; 