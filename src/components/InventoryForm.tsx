"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import {
  inventoryItemSchema,
  type InventoryItemFormData,
} from "@/lib/validations";
import { createInventoryItem, updateInventoryItem } from "@/lib/actions";
import { useInventoryStore } from "@/store/inventoryStore";
import { InventoryItem } from "@/types/inventory";

interface InventoryFormProps {
  onCancel?: () => void;
  editItem?: InventoryItem | null;
}

export default function InventoryForm({
  onCancel,
  editItem,
}: InventoryFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, startTransition] = useTransition();
  const { fetchItems } = useInventoryStore();

  // Initialize form with React Hook Form and Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
    watch,
  } = useForm<InventoryItemFormData>({
    resolver: zodResolver(inventoryItemSchema),
    defaultValues: editItem
      ? {
          name: editItem.name,
          description: editItem.description || "",
          quantity: editItem.quantity,
          price: editItem.price,
          category: editItem.category || "",
          sku: editItem.sku || "",
        }
      : {
          name: "",
          description: "",
          quantity: 0,
          price: 0,
          category: "",
          sku: "",
        },
    mode: "onChange", // Real-time validation
  });

  // Watch form values for dynamic feedback
  const watchedValues = watch();

  // Handle form submission with Server Actions
  const onSubmit = async (data: InventoryItemFormData) => {
    setSubmitError(null);

    startTransition(async () => {
      try {
        // Convert data to FormData for Server Action
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description || "");
        formData.append("quantity", data.quantity.toString());
        formData.append("price", data.price.toString());
        formData.append("category", data.category);
        formData.append("sku", data.sku);

        // Call appropriate Server Action based on edit mode
        const result = editItem
          ? await updateInventoryItem(editItem.id, formData)
          : await createInventoryItem(formData);

        if (result.success) {
          // Success: Reset form and refresh data
          reset();
          await fetchItems(); // Refresh the inventory list
          onCancel?.(); // Navigate back to list
        } else {
          // Handle server-side errors
          setSubmitError(result.error || "An unexpected error occurred");
        }
      } catch (error) {
        console.error("Form submission error:", error);
        setSubmitError("Failed to submit form. Please try again.");
      }
    });
  };

  // Common input classes for consistency
  const inputClasses =
    "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors";
  const inputValidClasses =
    "border-gray-300 focus:ring-blue-500 focus:border-blue-500";
  const inputErrorClasses =
    "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50";

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {editItem ? "Edit Inventory Item" : "Add New Inventory Item"}
        </h2>
        <p className="text-gray-600 mt-1">
          {editItem
            ? "Update the details below"
            : "Fill in the details below to add a new item to your inventory"}
        </p>
      </div>

      {/* Server Error Display */}
      {submitError && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Submission Error
              </h3>
              <p className="text-sm text-red-700 mt-1">{submitError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div className="md:col-span-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              {...register("name")}
              className={`${inputClasses} ${
                errors.name ? inputErrorClasses : inputValidClasses
              }`}
              placeholder="Enter product name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* SKU */}
          <div>
            <label
              htmlFor="sku"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              SKU (Stock Keeping Unit) *
            </label>
            <input
              type="text"
              id="sku"
              {...register("sku")}
              className={`${inputClasses} ${
                errors.sku ? inputErrorClasses : inputValidClasses
              }`}
              placeholder="e.g., PROD-001"
              style={{ textTransform: "uppercase" }}
            />
            {errors.sku && (
              <p className="mt-1 text-sm text-red-600">{errors.sku.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Unique identifier (letters, numbers, hyphens only)
            </p>
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Category *
            </label>
            <input
              type="text"
              id="category"
              {...register("category")}
              className={`${inputClasses} ${
                errors.category ? inputErrorClasses : inputValidClasses
              }`}
              placeholder="e.g., Electronics, Clothing"
              list="categories"
            />
            <datalist id="categories">
              <option value="Electronics" />
              <option value="Clothing" />
              <option value="Books" />
              <option value="Home & Garden" />
              <option value="Sports & Outdoors" />
              <option value="Toys & Games" />
            </datalist>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Quantity */}
          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Quantity *
            </label>
            <input
              type="number"
              id="quantity"
              {...register("quantity", { valueAsNumber: true })}
              className={`${inputClasses} ${
                errors.quantity ? inputErrorClasses : inputValidClasses
              }`}
              placeholder="0"
              min="0"
              step="1"
            />
            {errors.quantity && (
              <p className="mt-1 text-sm text-red-600">
                {errors.quantity.message}
              </p>
            )}
          </div>

          {/* Price */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Price ($) *
            </label>
            <input
              type="number"
              id="price"
              {...register("price", { valueAsNumber: true })}
              className={`${inputClasses} ${
                errors.price ? inputErrorClasses : inputValidClasses
              }`}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              {...register("description")}
              rows={3}
              className={`${inputClasses} ${
                errors.description ? inputErrorClasses : inputValidClasses
              }`}
              placeholder="Optional: Enter product description"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {watchedValues.description?.length || 0}/500 characters
            </p>
          </div>
        </div>

        {/* Form Summary */}
        {isDirty && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Preview</h4>
            <div className="text-sm text-blue-700">
              <p>
                <strong>Product:</strong>{" "}
                {watchedValues.name || "Not specified"}
              </p>
              <p>
                <strong>SKU:</strong> {watchedValues.sku || "Not specified"}
              </p>
              <p>
                <strong>Category:</strong>{" "}
                {watchedValues.category || "Not specified"}
              </p>
              <p>
                <strong>Quantity:</strong> {watchedValues.quantity || 0}
              </p>
              <p>
                <strong>Price:</strong> $
                {watchedValues.price?.toFixed(2) || "0.00"}
              </p>
              <p>
                <strong>Total Value:</strong> $
                {(
                  (watchedValues.quantity || 0) * (watchedValues.price || 0)
                ).toFixed(2)}
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6">
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className={`flex-1 flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors ${
              !isValid || isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            }`}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
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
                {editItem ? "Updating..." : "Adding..."}
              </>
            ) : editItem ? (
              "Update Item"
            ) : (
              "Add Item"
            )}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              reset();
              setSubmitError(null);
            }}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
          >
            Reset Form
          </button>
        </div>
      </form>
    </div>
  );
}
