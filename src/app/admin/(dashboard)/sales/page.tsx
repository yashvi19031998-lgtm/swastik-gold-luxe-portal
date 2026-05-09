"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Filter,
  Loader2,
  FileText,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { getSales, getSalesPaginated, deleteSale } from "@/services/salesService";
import type { Sale } from "@/types/sales";

// ─────────────────────────────────────────────────────────────────────────────
// Payment Status Badge
// ─────────────────────────────────────────────────────────────────────────────
function PaymentBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    paid: {
      label: "Paid",
      cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    partial: {
      label: "Partial",
      cls: "bg-amber-50 text-amber-700 border-amber-200",
    },
    pending: {
      label: "Pending",
      cls: "bg-red-50 text-red-700 border-red-200",
    },
  };
  const badge = map[status] ?? {
    label: status,
    cls: "bg-slate-100 text-slate-600 border-slate-200",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${badge.cls}`}
    >
      {status === "paid" && <CheckCircle2 className="w-3 h-3" />}
      {status === "partial" && <Clock className="w-3 h-3" />}
      {status === "pending" && <AlertCircle className="w-3 h-3" />}
      {badge.label}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Stat Card
// ─────────────────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-slate-500 font-medium">{label}</p>
        <p className="text-xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Pagination config
// ─────────────────────────────────────────────────────────────────────────────
const PAGE_SIZE = 15;

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────
export default function SalesPage() {
  const router = useRouter();
  const [sales, setSales] = useState<Sale[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "paid" | "partial" | "pending">("");
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Financial aggregates (for cards)
  const [totals, setTotals] = useState({ revenue: 0, pending: 0, paidCount: 0 });

  const fetchSales = async () => {
    setLoading(true);
    try {
      const { data, count } = await getSalesPaginated(page, PAGE_SIZE, search, statusFilter);
      setSales(data);
      setTotalCount(count);
    } catch (err: any) {
      toast.error("Failed to load sales: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const { getSalesSummary } = await import("@/services/salesService");
      const summary = await getSalesSummary();
      setTotals(summary);
    } catch (err: any) {
      console.error("Failed to fetch summary:", err);
    }
  };

  // Fetch paginated data whenever page, search or filter changes
  useEffect(() => {
    fetchSales();
  }, [page, statusFilter]);

  // Fetch summary ONLY once on mount
  useEffect(() => {
    fetchSummary();
  }, []);

  // Handle search with a small delay (debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page !== 1) setPage(1);
      else fetchSales();
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // ── Pagination ─────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const paginated = sales; // Already paginated from server

  const totalRevenue = totals.revenue;
  const totalPending = totals.pending;
  const paidCount = totals.paidCount;

  const fmt = (n: number) =>
    "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

  // ── Delete handler ──────────────────────────────────────────────────────
  const handleDelete = async (id: string, invoiceNo: string) => {
    if (!confirm(`Delete invoice ${invoiceNo}? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await deleteSale(id);
      toast.success(`Invoice ${invoiceNo} deleted.`);
      fetchSales();
    } catch (err: any) {
      toast.error("Delete failed: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  // ────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Sales</h1>
          <p className="text-slate-500 text-sm">
            Wholesale jewellery invoices & party ledger
          </p>
        </div>
        <Link
          href="/admin/sales/create"
          className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-slate-950 px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-gold-500/20 text-sm"
        >
          <Plus className="w-5 h-5" />
          New Sale
        </Link>
      </div>

      {/* ── Stats Row ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Revenue"
          value={fmt(totalRevenue)}
          icon={TrendingUp}
          color="bg-gold-500/10 text-gold-600"
        />
        <StatCard
          label="Pending Collection"
          value={fmt(totalPending)}
          icon={Clock}
          color="bg-red-50 text-red-600"
        />
        <StatCard
          label="Paid Invoices"
          value={`${paidCount} / ${sales.length}`}
          icon={CheckCircle2}
          color="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* ── Table Card ───────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {/* Filters toolbar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search invoice or party…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 bg-white"
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="text-sm border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold-500 bg-white"
            >
              <option value="">All Status</option>
              <option value="paid">Paid</option>
              <option value="partial">Partial</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <span className="ml-auto text-xs text-slate-400">
            {totalCount} record{totalCount !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">Invoice No</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Party</th>
                <th className="px-6 py-4 text-right">Total</th>
                <th className="px-6 py-4 text-right">Paid</th>
                <th className="px-6 py-4 text-right">Pending</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-gold-500" />
                    <p className="text-slate-400 text-sm mt-2">Loading sales…</p>
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <FileText className="w-12 h-12 text-slate-200" />
                      <p className="text-slate-400 font-medium">
                        {search || statusFilter
                          ? "No sales match your filters."
                          : "No sales yet. Create your first invoice!"}
                      </p>
                      {!search && !statusFilter && (
                        <Link
                          href="/admin/sales/create"
                          className="text-sm text-gold-600 hover:underline font-semibold"
                        >
                          + Create Sale
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((sale) => (
                  <tr
                    key={sale.id}
                    className="hover:bg-slate-50/60 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-800 tracking-tight">
                        {sale.invoice_no}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(sale.invoice_date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                      {sale.parties?.party_name ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900">
                      ₹{(sale.final_amount || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 text-right text-emerald-600 font-semibold text-sm">
                      ₹{(sale.paid_amount || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      <span
                        className={
                          sale.pending_amount > 0
                            ? "text-red-600 font-bold"
                            : "text-slate-400"
                        }
                      >
                        ₹{(sale.pending_amount || 0).toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <PaymentBadge status={sale.payment_status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => router.push(`/admin/sales/${sale.id}`)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(sale.id, sale.invoice_no)}
                          disabled={deletingId === sale.id}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-40"
                          title="Delete"
                        >
                          {deletingId === sale.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
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
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 text-slate-500 hover:bg-slate-200 rounded-lg disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
