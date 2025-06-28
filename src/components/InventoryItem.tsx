"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useInventoryStore } from "@/store/inventoryStore";
import { InventoryItem as InventoryItemType } from "@/types/inventory";
import InventoryForm from "./InventoryForm";

interface InventoryItemProps {
  item: InventoryItemType & {
    user?: {
      id: string;
      name: string | null;
      email: string | null;
      role: string;
    };
  };
}

export default function InventoryItem({ item }: InventoryItemProps) {
  const { data: session } = useSession();
  const { deleteItem } = useInventoryStore();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isAdmin = session?.user?.role === "ADMIN";
  const isOwner = session?.user?.id === item.userId;
  const canEdit = isAdmin || isOwner;
  const canDelete = isAdmin || isOwner;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteItem(item.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0)
      return { text: "Out of Stock", color: "text-red-600 bg-red-50" };
    if (quantity <= 10)
      return { text: "Low Stock", color: "text-yellow-600 bg-yellow-50" };
    return { text: "In Stock", color: "text-green-600 bg-green-50" };
  };

  const stockStatus = getStockStatus(item.quantity);

  if (isEditing) {
    return (
      <InventoryForm editItem={item} onCancel={() => setIsEditing(false)} />
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>

            {/* Owner Badge for Admins */}
            {isAdmin && item.user && (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                  👤 {item.user.name || item.user.email || "Unknown User"}
                </span>
                {item.user.role === "ADMIN" && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                    👑 Admin
                  </span>
                )}
              </div>
            )}

            {/* Ownership indicator for current user */}
            {!isAdmin && isOwner && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                📦 Your Item
              </span>
            )}
          </div>

          {item.description && (
            <p className="text-gray-600 text-sm mb-2">{item.description}</p>
          )}
          {item.sku && (
            <p className="text-xs text-gray-500 font-mono">SKU: {item.sku}</p>
          )}
        </div>

        <div className="flex gap-2 ml-4">
          {canEdit && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title={isAdmin && !isOwner ? "Edit as Admin" : "Edit item"}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
          )}

          {canDelete && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title={isAdmin && !isOwner ? "Delete as Admin" : "Delete item"}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}

          {/* No Permission Indicator */}
          {!canEdit && !canDelete && (
            <div className="flex items-center px-3 py-2 text-xs text-gray-500 bg-gray-100 rounded-md">
              👁️ View Only
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            Quantity
          </p>
          <p className="text-lg font-semibold text-gray-900">{item.quantity}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            Price
          </p>
          <p className="text-lg font-semibold text-gray-900">
            ${item.price.toFixed(2)}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            Total Value
          </p>
          <p className="text-lg font-semibold text-gray-900">
            ${(item.quantity * item.price).toFixed(2)}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            Status
          </p>
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}
          >
            {stockStatus.text}
          </span>
        </div>
      </div>

      {item.category && (
        <div className="mb-3">
          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
            {item.category}
          </span>
        </div>
      )}

      <div className="text-xs text-gray-500 flex justify-between">
        <span>Created: {new Date(item.createdAt).toLocaleDateString()}</span>
        <span>Updated: {new Date(item.updatedAt).toLocaleDateString()}</span>
      </div>

      {/* Modern Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 relative transform transition-all duration-200 scale-100">
            {/* Close Button */}
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1"
              disabled={isDeleting}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="p-8">
              {/* Trash Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </div>
              </div>

              {/* Header */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  You Are About to Delete the Product
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Are you sure you want to permanently delete{" "}
                  <span className="font-semibold text-gray-900">
                    &quot;{item.name}&quot;
                  </span>
                  ? This action cannot be undone and will remove all associated
                  data.
                </p>

                {/* Admin Warning */}
                {isAdmin && !isOwner && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      ⚠️ <strong>Admin Action:</strong> You are deleting another
                      user&apos;s item.
                    </p>
                  </div>
                )}
              </div>

              {/* Product Info Card */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {item.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>SKU: {item.sku || "N/A"}</span>
                      <span>Qty: {item.quantity}</span>
                      <span>${item.price.toFixed(2)}</span>
                    </div>
                    {/* Owner info for admin */}
                    {isAdmin && item.user && (
                      <div className="text-xs text-gray-500 mt-1">
                        Owner: {item.user.name || item.user.email}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isDeleting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      <span>Delete Product</span>
                    </>
                  )}
                </button>
              </div>

              {/* Warning Footer */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  ⚠️ This action is permanent and cannot be reversed
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
