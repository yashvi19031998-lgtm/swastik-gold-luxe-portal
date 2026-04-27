"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  Loader2,
  X
} from "lucide-react";
import { toast } from "sonner";

interface Collection {
  id: string;
  name: string;
  created_at: string;
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCollection, setCurrentCollection] = useState<Collection | null>(null);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const supabase = createClient();

  const fetchCollections = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("collections")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch collections");
    } else {
      setCollections(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    try {
      if (currentCollection) {
        // Edit
        const { error } = await supabase
          .from("collections")
          .update({ name })
          .eq("id", currentCollection.id);
        if (error) throw error;
        toast.success("Collection updated successfully");
      } else {
        // Add
        const { error } = await supabase
          .from("collections")
          .insert([{ name }]);
        if (error) throw error;
        toast.success("Collection added successfully");
      }
      setIsModalOpen(false);
      setName("");
      setCurrentCollection(null);
      fetchCollections();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this collection?")) return;

    try {
      const { error } = await supabase.from("collections").delete().eq("id", id);
      if (error) throw error;
      toast.success("Collection deleted successfully");
      fetchCollections();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const openModal = (collection?: Collection) => {
    if (collection) {
      setCurrentCollection(collection);
      setName(collection.name);
    } else {
      setCurrentCollection(null);
      setName("");
    }
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Collections</h1>
          <p className="text-slate-500 text-sm">Manage your product collections</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-slate-950 px-4 py-2 rounded-lg font-bold transition-all shadow-lg shadow-gold-500/20"
        >
          <Plus className="w-5 h-5" />
          Add Collection
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search collections..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">Collection Name</th>
                <th className="px-6 py-4">Created Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-gold-500" />
                    <p className="text-slate-400 text-sm mt-2">Loading collections...</p>
                  </td>
                </tr>
              ) : collections.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center">
                    <p className="text-slate-400">No collections found. Add your first collection!</p>
                  </td>
                </tr>
              ) : (
                collections.map((collection) => (
                  <tr key={collection.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-slate-800">{collection.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(collection.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openModal(collection)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(collection.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">
                {currentCollection ? "Edit Collection" : "Add New Collection"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Collection Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 placeholder-slate-400 text-slate-800"
                  placeholder="e.g. Wedding Special"
                  required
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 text-slate-600 font-semibold border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    currentCollection ? "Update" : "Save"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
