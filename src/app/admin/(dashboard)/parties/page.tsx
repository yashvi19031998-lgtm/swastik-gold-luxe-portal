"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Loader2,
  X,
  Phone,
  Mail,
  MapPin,
  Building2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";

interface Party {
  id: string;
  party_name: string;
  contact_person: string;
  mobile_number: string;
  email: string;
  address: string;
  gst_number: string;
  city: string;
  state: string;
  created_at: string;
}

export default function PartiesPage() {
  const [parties, setParties] = useState<Party[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 15;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentParty, setCurrentParty] = useState<Party | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    contact_person: "",
    phone: "",
    email: "",
    address: "",
    gst_number: "",
    city: "",
    state: ""
  });
  const [submitting, setSubmitting] = useState(false);
  
  const supabase = createClient();

  const fetchParties = async () => {
    setLoading(true);
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
      .from("parties")
      .select("*", { count: "exact" });

    if (searchQuery) {
      query = query.or(`party_name.ilike.%${searchQuery}%,contact_person.ilike.%${searchQuery}%,city.ilike.%${searchQuery}%`);
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Error fetching parties:", error);
      toast.error("Failed to fetch parties.");
    } else {
      setParties(data || []);
      setTotalCount(count || 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchParties();
  }, [page]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page !== 1) setPage(1);
      else fetchParties();
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Party name is required");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        party_name: formData.name,
        contact_person: formData.contact_person,
        mobile_number: formData.phone,
        email: formData.email,
        address: formData.address,
        gst_number: formData.gst_number,
        city: formData.city,
        state: formData.state,
      };

      if (currentParty) {
        const { error } = await supabase
          .from("parties")
          .update(payload)
          .eq("id", currentParty.id);
        if (error) throw error;
        toast.success("Party updated successfully");
      } else {
        const insertPayload = {
          ...payload,
          unique_id: `PTY-${Date.now()}`,
          company_id: 1
        };
        const { error } = await supabase
          .from("parties")
          .insert([insertPayload]);
        if (error) throw error;
        toast.success("Party added successfully");
      }
      setIsModalOpen(false);
      resetForm();
      fetchParties();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this party?")) return;

    try {
      const { error } = await supabase.from("parties").delete().eq("id", id);
      if (error) throw error;
      toast.success("Party deleted successfully");
      fetchParties();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      contact_person: "",
      phone: "",
      email: "",
      address: "",
      gst_number: "",
      city: "",
      state: ""
    });
    setCurrentParty(null);
  };

  const openModal = (party?: Party) => {
    if (party) {
      setCurrentParty(party);
      setFormData({
        name: party.party_name || "",
        contact_person: party.contact_person || "",
        phone: party.mobile_number || "",
        email: party.email || "",
        address: party.address || "",
        gst_number: party.gst_number || "",
        city: party.city || "",
        state: party.state || ""
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Party Management</h1>
          <p className="text-slate-500 text-sm">Manage your suppliers and business clients</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 text-slate-950 px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-gold-500/20"
        >
          <Plus className="w-5 h-5" />
          Add New Party
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, contact person or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">Party Details</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4">GST / Location</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-gold-500" />
                    <p className="text-slate-400 text-sm mt-2">Loading parties...</p>
                  </td>
                </tr>
              ) : parties.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Building2 className="w-12 h-12 text-slate-200" />
                      <p className="text-slate-400">No parties found. Add your first business contact!</p>
                    </div>
                  </td>
                </tr>
              ) : (
                parties.map((party) => (
                  <tr key={party.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">{party.party_name}</span>
                        <span className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <Building2 className="w-3 h-3" />
                          {party.contact_person || "No contact person"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="space-y-1">
                        {party.mobile_number && (
                          <div className="flex items-center gap-2 text-slate-600">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            {party.mobile_number}
                          </div>
                        )}
                        {party.email && (
                          <div className="flex items-center gap-2 text-slate-600">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            {party.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      <div className="space-y-1">
                        <div className="font-medium text-slate-700">GST: {party.gst_number || "N/A"}</div>
                        <div className="flex items-center gap-1.5 text-xs">
                          <MapPin className="w-3 h-3" />
                          {party.city && party.state ? `${party.city}, ${party.state}` : (party.city || party.state || "No location")}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openModal(party)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(party.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete"
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

        {/* Pagination footer */}
        {!loading && totalCount > PAGE_SIZE && (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-sm">
            <span className="text-slate-500">
              Showing {(page - 1) * PAGE_SIZE + 1}–
              {Math.min(page * PAGE_SIZE, totalCount)} of {totalCount}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 text-slate-500 hover:bg-slate-200 rounded-lg disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-medium text-slate-700">
                {page} / {Math.ceil(totalCount / PAGE_SIZE)}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(Math.ceil(totalCount / PAGE_SIZE), p + 1))}
                disabled={page === Math.ceil(totalCount / PAGE_SIZE)}
                className="p-2 text-slate-500 hover:bg-slate-200 rounded-lg disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 my-auto">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <div className="p-2 bg-gold-500 rounded-lg text-slate-950">
                  <Building2 className="w-5 h-5" />
                </div>
                {currentParty ? "Edit Party Details" : "Add New Party"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Party / Company Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 bg-slate-50/30 text-slate-800"
                    placeholder="e.g. Swastik Jewellery Suppliers"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Contact Person</label>
                  <input
                    type="text"
                    value={formData.contact_person}
                    onChange={(e) => setFormData({...formData, contact_person: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 bg-slate-50/30 text-slate-800"
                    placeholder="e.g. Rajesh Kumar"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">GST Number</label>
                  <input
                    type="text"
                    value={formData.gst_number}
                    onChange={(e) => setFormData({...formData, gst_number: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 bg-slate-50/30 text-slate-800 uppercase"
                    placeholder="e.g. 24AAAAA0000A1Z5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 bg-slate-50/30 text-slate-800"
                    placeholder="e.g. +91 9876543210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 bg-slate-50/30 text-slate-800"
                    placeholder="e.g. supplier@example.com"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 bg-slate-50/30 text-slate-800 min-h-[80px]"
                    placeholder="Complete office/shop address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 bg-slate-50/30 text-slate-800"
                    placeholder="e.g. Surat"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 bg-slate-50/30 text-slate-800"
                    placeholder="e.g. Gujarat"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 text-slate-600 font-bold border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-3 bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-gold-500/20"
                >
                  {submitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    currentParty ? "Update Party" : "Save Party"
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
