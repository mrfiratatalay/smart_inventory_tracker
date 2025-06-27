import { create } from "zustand";
import {
  InventoryItem,
  CreateInventoryItem,
  UpdateInventoryItem,
} from "@/types/inventory";

interface InventoryStore {
  items: InventoryItem[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchItems: () => Promise<void>;
  addItem: (item: CreateInventoryItem) => Promise<void>;
  updateItem: (id: string, item: UpdateInventoryItem) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useInventoryStore = create<InventoryStore>((set) => ({
  items: [],
  loading: false,
  error: null,

  fetchItems: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/inventory");
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || "Failed to fetch items");
      }
      const items = await response.json();
      set({ items, loading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";

      // Check if it's a database connection error
      if (
        errorMessage.includes("Environment variable not found: DATABASE_URL") ||
        errorMessage.includes("Invalid") ||
        errorMessage.includes("prisma")
      ) {
        set({
          error:
            "⚠️ Database not configured yet. Please set up MongoDB connection in .env file (see SETUP.md for instructions)",
          loading: false,
        });
      } else {
        set({
          error: errorMessage,
          loading: false,
        });
      }
    }
  },

  addItem: async (newItem: CreateInventoryItem) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || "Failed to add item");
      }
      const item = await response.json();
      set((state) => ({
        items: [...state.items, item],
        loading: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      console.error("Error adding item:", errorMessage);
      set({
        error: errorMessage,
        loading: false,
      });
    }
  },

  updateItem: async (id: string, updates: UpdateInventoryItem) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/inventory/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update item");
      const updatedItem = await response.json();
      set((state) => ({
        items: state.items.map((item) => (item.id === id ? updatedItem : item)),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        loading: false,
      });
    }
  },

  deleteItem: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/inventory/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete item");
      set((state) => ({
        items: state.items.filter((item) => item.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        loading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
