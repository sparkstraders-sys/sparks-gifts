"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, Plus, Trash2, GripVertical, ImagePlus } from "lucide-react";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";

interface Category { id: string; name: string }
interface ProductImage { id: string; url: string; sortOrder: number }
interface ProductData {
  id?: string;
  name?: string;
  brand?: string;
  description?: string;
  sku?: string;
  costPrice?: number;
  sellPrice?: number;
  discount?: number;
  stock?: number;
  categoryId?: string;
  isActive?: boolean;
  images?: ProductImage[];
}

interface Props {
  categories: Category[];
  product?: ProductData;
  isEdit?: boolean;
}

export default function ProductForm({ categories, product, isEdit = false }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<ProductImage[]>(product?.images ?? []);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    name: product?.name ?? "",
    brand: product?.brand ?? "",
    description: product?.description ?? "",
    sku: product?.sku ?? "",
    costPrice: product?.costPrice ?? "",
    sellPrice: product?.sellPrice ?? "",
    discount: product?.discount ?? 0,
    stock: product?.stock ?? 0,
    categoryId: product?.categoryId ?? (categories[0]?.id ?? ""),
    isActive: product?.isActive ?? true,
  });

  function set(field: string, value: string | number | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Product name is required";
    if (!form.costPrice) e.costPrice = "Cost price is required";
    if (!form.sellPrice) e.sellPrice = "Selling price is required";
    if (!form.categoryId) e.categoryId = "Category is required";
    if (Number(form.stock) < 0) e.stock = "Stock cannot be negative";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        if (res.ok) {
          const { url } = await res.json();
          setImages((prev) => [...prev, { id: `temp-${Date.now()}`, url, sortOrder: prev.length }]);
        }
      }
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function removeImage(imageId: string, url: string) {
    // If it's an existing saved image, delete from server
    if (!imageId.startsWith("temp-") && product?.id) {
      await fetch(`/api/admin/products/${product.id}/images/${imageId}`, { method: "DELETE" });
    }
    setImages((prev) => prev.filter((i) => i.id !== imageId));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const payload = {
      ...form,
      costPrice: Number(form.costPrice),
      sellPrice: Number(form.sellPrice),
      discount: Number(form.discount),
      stock: Number(form.stock),
      images: images.map((img, i) => ({ url: img.url, sortOrder: i })),
    };

    try {
      const url = isEdit ? `/api/admin/products/${product!.id}` : "/api/admin/products";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to save product");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!product?.id) return;
    if (!confirm(`Delete "${form.name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/products");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main fields */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white border border-gray-100 p-5">
            <h2 className="text-xs font-medium tracking-widest uppercase text-gray-500 mb-4">Product Info</h2>
            <div className="space-y-4">
              <Input label="Product Name" id="name" value={form.name} onChange={(e) => set("name", e.target.value)} error={errors.name} required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Brand" id="brand" value={form.brand} onChange={(e) => set("brand", e.target.value)} placeholder="e.g. Lattafa" />
                <Input label="SKU" id="sku" value={form.sku} onChange={(e) => set("sku", e.target.value)} placeholder="e.g. LAT-001" />
              </div>
              <Textarea label="Description" id="description" value={form.description} onChange={(e) => set("description", e.target.value)} rows={5} />
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white border border-gray-100 p-5">
            <h2 className="text-xs font-medium tracking-widest uppercase text-gray-500 mb-4">Pricing</h2>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Cost Price (Rs.)"
                id="costPrice"
                type="number"
                min="0"
                step="0.01"
                value={String(form.costPrice)}
                onChange={(e) => set("costPrice", e.target.value)}
                error={errors.costPrice}
                hint="Hidden from customers"
                required
              />
              <Input
                label="Selling Price (Rs.)"
                id="sellPrice"
                type="number"
                min="0"
                step="0.01"
                value={String(form.sellPrice)}
                onChange={(e) => set("sellPrice", e.target.value)}
                error={errors.sellPrice}
                required
              />
              <Input
                label="Discount (%)"
                id="discount"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={String(form.discount)}
                onChange={(e) => set("discount", e.target.value)}
              />
              <Input
                label="Stock Quantity"
                id="stock"
                type="number"
                min="0"
                value={String(form.stock)}
                onChange={(e) => set("stock", e.target.value)}
                error={errors.stock}
              />
            </div>

            {/* Live profit preview */}
            {form.costPrice && form.sellPrice && (
              <div className="mt-4 p-3 bg-green-50 border border-green-100 text-sm">
                <div className="text-xs font-medium text-green-700 uppercase tracking-wider mb-1">Profit Preview</div>
                <div className="text-green-800">
                  Gross profit per unit: <strong>
                    Rs. {(Number(form.sellPrice) * (1 - Number(form.discount) / 100) - Number(form.costPrice)).toLocaleString("en-PK")}
                  </strong>
                </div>
              </div>
            )}
          </div>

          {/* Images */}
          <div className="bg-white border border-gray-100 p-5">
            <h2 className="text-xs font-medium tracking-widest uppercase text-gray-500 mb-4">Product Images</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
              {images.map((img, i) => (
                <div key={img.id} className="relative group aspect-square bg-gray-50">
                  <Image src={img.url} alt="Product" fill className="object-cover" sizes="150px" />
                  {i === 0 && (
                    <div className="absolute top-1 left-1 bg-gold-500 text-white text-[9px] px-1.5 py-0.5 font-medium">
                      Main
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(img.id, img.url)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                  <div className="absolute bottom-1 left-1 text-[9px] text-white/70">
                    <GripVertical className="w-3 h-3" />
                  </div>
                </div>
              ))}

              <label className="aspect-square border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-gold-400 transition-colors">
                {uploading ? (
                  <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                ) : (
                  <>
                    <ImagePlus className="w-5 h-5 text-gray-300 mb-1" />
                    <span className="text-[10px] text-gray-400">Add Image</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
            <p className="text-xs text-gray-400">First image is the main product image. Upload JPEG/PNG/WebP.</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="bg-white border border-gray-100 p-5">
            <h2 className="text-xs font-medium tracking-widest uppercase text-gray-500 mb-4">Organisation</h2>
            <div className="space-y-4">
              <Select
                label="Category"
                id="categoryId"
                value={form.categoryId}
                onChange={(e) => set("categoryId", e.target.value)}
                error={errors.categoryId}
                required
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </Select>
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-5">
            <h2 className="text-xs font-medium tracking-widest uppercase text-gray-500 mb-4">Status</h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => set("isActive", e.target.checked)}
                className="w-4 h-4 accent-gold-500"
              />
              <div>
                <div className="text-sm font-medium text-gray-700">Active</div>
                <div className="text-xs text-gray-400">Visible to customers</div>
              </div>
            </label>
          </div>

          <div className="space-y-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gold-500 text-white text-xs font-medium tracking-widest uppercase hover:bg-gold-600 transition-colors disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {isEdit ? "Save Changes" : "Create Product"}
            </button>

            {isEdit && (
              <button
                type="button"
                onClick={handleDelete}
                className="w-full py-3 border border-red-200 text-red-500 text-xs font-medium tracking-widest uppercase hover:bg-red-50 transition-colors"
              >
                Delete Product
              </button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
