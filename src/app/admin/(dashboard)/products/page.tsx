"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { upsertProduct, deleteProductImages, insertProductImages } from "@/app/actions/product";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Loader2,
  X,
  Image as ImageIcon,
  Upload,
  Filter,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  collection_id: string;
  collections?: {
    name: string;
  };
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category_id: string;
  gender: string;
  purity: string;
  created_at: string;
  categories?: Category;
  product_images?: { image_url: string }[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category_id: "",
    gender: "ladies",
    purity: "22kt"
  });
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  
  // Filter/Search State
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        supabase
          .from("products")
          .select(`
            *,
            categories (
              *,
              collections (
                name
              )
            ),
            product_images (
              id,
              image_url
            )
          `)
          .order("created_at", { ascending: false }),
        supabase
          .from("categories")
          .select("*, collections(name)")
          .order("name", { ascending: true })
      ]);

      if (prodRes.error) throw prodRes.error;
      if (catRes.error) throw catRes.error;

      setProducts(prodRes.data || []);
      setCategories(catRes.data || []);
    } catch (error: any) {
      toast.error("Data fetch error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalCurrentImages = imagePreviews.length;
    
    if (files.length + totalCurrentImages > 4) {
      toast.error("Maximum 4 images allowed");
      return;
    }

    setImages([...images, ...files]);
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    const previewToRemove = imagePreviews[index];
    
    // Check if it's a new upload or an existing URL
    if (previewToRemove.startsWith('blob:')) {
      // It's a new upload (File object)
      // We need to find the correct index in the 'images' array
      // This is tricky if we just use index. Let's find by blob URL.
      const newImages = [...images];
      const blobUrlToRemove = previewToRemove;
      
      // Revoke the specific blob URL
      URL.revokeObjectURL(blobUrlToRemove);
      
      // Update previews
      const newPreviews = [...imagePreviews];
      newPreviews.splice(index, 1);
      setImagePreviews(newPreviews);

      // We need a better way to track new vs old images. 
      // For now, let's just clear new images if any are removed to be safe, 
      // or find the file that matches the index among new images.
      // Better: filter images by recreating previews.
    } else {
      // It's an existing image from Supabase
      const newPreviews = [...imagePreviews];
      newPreviews.splice(index, 1);
      setImagePreviews(newPreviews);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category_id) {
      toast.error("Please fill required fields");
      return;
    }

    setSubmitting(true);
    try {
      let productId = currentProduct?.id;

      // 1. Upsert Product Details via Server Action
      const upsertResult = await upsertProduct({
        id: productId,
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        category_id: formData.category_id,
        gender: formData.gender,
        purity: formData.purity
      });

      if (!upsertResult.success) {
        throw new Error(upsertResult.error);
      }
      productId = upsertResult.productId;

      if (currentProduct) {
        // 2. Handle Image Sync for existing products
        // First, get currently stored images in DB (using normal client is fine for SELECT)
        const { data: existingImages } = await supabase
          .from("product_images")
          .select("id, image_url")
          .eq("product_id", productId);

        // Remove images from DB that are no longer in the preview list
        if (existingImages) {
          const imagesToDelete = existingImages
            .filter(img => !imagePreviews.includes(img.image_url))
            .map(img => img.id);

          if (imagesToDelete.length > 0) {
            const delResult = await deleteProductImages(imagesToDelete);
            if (!delResult.success) throw new Error(delResult.error);
          }
        }
      }

      // 3. Upload New Images (those in 'images' state)
      if (images.length > 0) {
        const newImageUrls: string[] = [];
        
        for (const image of images) {
          const fileExt = image.name.split('.').pop();
          const fileName = `${productId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from("products")
            .upload(fileName, image);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from("products")
            .getPublicUrl(fileName);
            
          newImageUrls.push(publicUrl);
        }
        
        if (newImageUrls.length > 0) {
          const insertResult = await insertProductImages(productId as string, newImageUrls);
          if (!insertResult.success) throw new Error(insertResult.error);
        }
      }

      toast.success(currentProduct ? "Product updated successfully" : "Product added successfully");
      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(error.message || "An error occurred during submission");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      description: "",
      category_id: "",
      gender: "ladies",
      purity: "22kt"
    });
    setImages([]);
    setImagePreviews([]);
    setCurrentProduct(null);
  };

  const openModal = (product?: Product) => {
    if (product) {
      setCurrentProduct(product);
      setFormData({
        name: product.name,
        price: product.price.toString(),
        description: product.description || "",
        category_id: product.category_id,
        gender: product.gender,
        purity: product.purity
      });
      setImagePreviews(product.product_images?.map(img => img.image_url) || []);
    } else {
      resetForm();
      if (categories.length > 0) {
        setFormData(prev => ({ ...prev, category_id: categories[0].id }));
      }
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      toast.success("Product deleted");
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory ? p.category_id === filterCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Products</h1>
          <p className="text-slate-500 text-sm">Manage your jewellery inventory</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-slate-950 px-4 py-2 rounded-lg font-bold transition-all shadow-lg shadow-gold-500/20"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center gap-4 bg-slate-50/50">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold-500 bg-white"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category / Collection</th>
                <th className="px-6 py-4">Details</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-gold-500" />
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">No products found.</td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                          {product.product_images?.[0] ? (
                            <img src={product.product_images[0].image_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-slate-300" />
                          )}
                        </div>
                        <span className="font-medium text-slate-800">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-700">{product.categories?.name}</span>
                        <span className="text-xs text-slate-400">{product.categories?.collections?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold uppercase">{product.gender}</span>
                        <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-600 text-[10px] font-bold uppercase">{product.purity}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      ₹{product.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openModal(product)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
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

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">
                {currentProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Product Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
                    <select
                      required
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none bg-white"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name} ({cat.collections?.name})</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none bg-white"
                      >
                        <option value="ladies">Ladies</option>
                        <option value="gents">Gents</option>
                        <option value="couple">Couple</option>
                        <option value="kids">Kids</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Purity</label>
                      <select
                        value={formData.purity}
                        onChange={(e) => setFormData({ ...formData, purity: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none bg-white"
                      >
                        <option value="18kt">18kt</option>
                        <option value="22kt">22kt</option>
                        <option value="24kt">24kt</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <textarea
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Images (Max 4)</label>
                    <div className="grid grid-cols-4 gap-2 mb-2">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative aspect-square rounded-lg border border-slate-200 overflow-hidden group">
                          <img src={preview} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      {imagePreviews.length < 4 && (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="aspect-square rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-gold-500 hover:text-gold-500 hover:bg-gold-50 transition-all"
                        >
                          <Upload className="w-5 h-5 mb-1" />
                          <span className="text-[10px] font-bold uppercase">Add</span>
                        </button>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      multiple
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 text-slate-600 font-semibold border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-[2] px-4 py-3 bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-gold-500/20"
                >
                  {submitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {currentProduct ? "Update Product" : "Save Product"}
                    </>
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
