export interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  price: number;
  category?: string;
  sku?: string;
  userId: string; // Owner of this inventory item
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateInventoryItem {
  name: string;
  description?: string;
  quantity: number;
  price: number;
  category?: string;
  sku?: string;
}

export interface UpdateInventoryItem {
  name?: string;
  description?: string;
  quantity?: number;
  price?: number;
  category?: string;
  sku?: string;
}

export interface InventoryStats {
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  categories: string[];
}
