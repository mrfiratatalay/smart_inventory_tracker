"use client";

import { useEffect, useState } from "react";
import { useInventoryStore } from "@/store/inventoryStore";
import InventoryItem from "./InventoryItem";

export default function InventoryList() {
  const { items, loading, error, fetchItems, clearError } = useInventoryStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Get unique categories from items
  const categories = Array.from(
    new Set(items.map((item) => item.category).filter(Boolean))
  );

  // Filter items based on search and filters
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = !categoryFilter || item.category === categoryFilter;

    const matchesStock =
      !stockFilter ||
      (stockFilter === "in-stock" && item.quantity > 10) ||
      (stockFilter === "low-stock" &&
        item.quantity > 0 &&
        item.quantity <= 10) ||
      (stockFilter === "out-of-stock" && item.quantity === 0);

    return matchesSearch && matchesCategory && matchesStock;
  });

  // Calculate stats
  const totalItems = items.length;
  const totalValue = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  const lowStockItems = items.filter(
    (item) => item.quantity > 0 && item.quantity <= 10
  ).length;
  const outOfStockItems = items.filter((item) => item.quantity === 0).length;

  if (loading && items.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm font-medium text-gray-600">Total Items</p>
          <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm font-medium text-gray-600">Total Value</p>
          <p className="text-2xl font-bold text-green-600">
            ${totalValue.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm font-medium text-gray-600">Low Stock</p>
          <p className="text-2xl font-bold text-yellow-600">{lowStockItems}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm font-medium text-gray-600">Out of Stock</p>
          <p className="text-2xl font-bold text-red-600">{outOfStockItems}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Search Items
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search by name, description, or SKU..."
            />
          </div>

          {/* Category Filter */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category
            </label>
            <select
              id="category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Filter */}
          <div>
            <label
              htmlFor="stock"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Stock Status
            </label>
            <select
              id="stock"
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Items</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Clear Filters */}
        {(searchTerm || categoryFilter || stockFilter) && (
          <div className="mt-4">
            <button
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("");
                setStockFilter("");
              }}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex justify-between items-center">
            <p className="text-red-700">{error}</p>
            <button
              onClick={clearError}
              className="text-red-700 hover:text-red-900"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Items List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Inventory Items ({filteredItems.length})
          </h2>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8v2m0 0V9m0-2a2 2 0 012 2m-2-2a2 2 0 00-2 2m2 2v2m0-2h2m-2 0h-2"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No items found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {items.length === 0
                ? "Get started by adding your first inventory item."
                : "Try adjusting your search criteria."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredItems.map((item) => (
              <InventoryItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
