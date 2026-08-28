"use client";

import { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Loader2, Tag, ImagePlus } from "lucide-react";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  isActive: boolean;
  sortOrder: number;
  _count?: { products: number };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const [form, setForm] = useState({ name: "", description: "", imageUrl: "", sortOrder: "0", isActive: true });

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/categories");
    if (res.ok) setCategories(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function resetForm() {
    setForm({ name: "", description: "", imageUrl: "", sortOrder: "0", isActive: true });
    setEditId(null);
    setShowForm(false);
  }

  function startEdit(cat: Category) {
    setForm({
      name: cat.name,
      description: cat.description ?? "",
      imageUrl: cat.imageUrl ?? "",
      sortOrder: String(cat.sortOrder),
      isActive: cat.isActive,
    });
    setEditId(cat.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: data });
    if (res.ok) {
      const { url } = await res.json();
      setForm((prev) => ({ ...prev, imageUrl: url }));
    }
    setUploading(false);
    e.target.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    const url = editId ? `/api/admin/categories/${editId}` : "/api/admin/categories";
    const method = editId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, sortOrder: Number(form.sortOrder) }),
    });
    if (res.ok) {
      resetForm();
      startTransition(() => { load(); });
    } else {
      const d = await res.json();
      alert(d.error ?? "Failed to save");
    }
    setSaving(false);
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete category "${name}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    startTransition(() => { load(); });
  }

  async function toggleStatus(cat: Category) {
    await fetch(`/api/admin/categories/${cat.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...cat, isActive: !cat.isActive }),
    });
    startTransition(() => { load(); });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-400 mt-0.5">{categories.length} categories</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-gold-500 text-white text-xs font-medium tracking-widest uppercase hover:bg-gold-600 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-gray-100 p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">{editId ? "Edit Category" : "New Category"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <Input label="Sort Order" type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
            </div>
            <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />

            {/* Image upload */}
            <div>
              <label className="block text-xs font-medium tracking-wider uppercase text-gray-600 mb-1.5">Category Image</label>
              <div className="flex items-center gap-3">
                {form.imageUrl && (
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <Image src={form.imageUrl} alt="Category" fill className="object-cover" sizes="64px" />
                    <button type="button" onClick={() => setForm({ ...form, imageUrl: "" })} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">×</button>
                  </div>
                )}
                <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-gray-200 text-xs text-gray-400 cursor-pointer hover:border-gold-400 hover:text-gold-500 transition-colors">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
                  Upload Image
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                </label>
                <Input placeholder="or paste image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="flex-1" />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 accent-gold-500" />
              <span className="text-sm text-gray-700">Active (visible on store)</span>
            </label>

            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-gold-500 text-white text-xs font-medium tracking-widest uppercase hover:bg-gold-600 transition-colors disabled:opacity-60">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {editId ? "Save Changes" : "Create Category"}
              </button>
              <button type="button" onClick={resetForm} className="px-5 py-2.5 border border-gray-200 text-gray-600 text-xs font-medium tracking-widest uppercase hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="bg-white border border-gray-100">
        {loading ? (
          <div className="text-center py-10"><Loader2 className="w-6 h-6 text-gold-400 animate-spin mx-auto" /></div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16">
            <Tag className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No categories yet.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {cat.imageUrl ? (
                        <Image src={cat.imageUrl} alt={cat.name} width={36} height={36} className="object-cover w-9 h-9 flex-shrink-0" />
                      ) : (
                        <div className="w-9 h-9 bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <Tag className="w-4 h-4 text-gray-300" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-800">{cat.name}</div>
                        <div className="text-xs text-gray-400 font-mono">{cat.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{cat._count?.products ?? 0}</td>
                  <td className="px-4 py-3 text-center text-gray-500 text-xs">{cat.sortOrder}</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => toggleStatus(cat)} className={`w-10 h-5 rounded-full transition-colors relative ${cat.isActive ? "bg-green-500" : "bg-gray-200"}`}>
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${cat.isActive ? "left-5" : "left-0.5"}`} />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => startEdit(cat)} className="p-1.5 text-gray-400 hover:text-gold-600 hover:bg-gold-50 transition-colors" title="Edit">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(cat.id, cat.name)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
