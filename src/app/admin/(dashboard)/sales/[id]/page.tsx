"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  Loader2,
  FileText,
  Building2,
  Calendar,
  User,
  CheckCircle2,
  Clock,
  AlertCircle,
  Scale,
  Printer,
} from "lucide-react";

import { getSaleById } from "@/services/salesService";
import type { Sale } from "@/types/sales";

// ─────────────────────────────────────────────────────────────────────────────
// Badge
// ─────────────────────────────────────────────────────────────────────────────
function PaymentBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string; icon: React.ElementType }> = {
    paid: { label: "Paid", cls: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
    partial: { label: "Partial", cls: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock },
    pending: { label: "Pending", cls: "bg-red-50 text-red-700 border-red-200", icon: AlertCircle },
  };
  const badge = map[status] ?? { label: status, cls: "bg-slate-100 text-slate-600 border-slate-200", icon: FileText };
  const Icon = badge.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${badge.cls}`}>
      <Icon className="w-3.5 h-3.5" />
      {badge.label}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Info Row
// ─────────────────────────────────────────────────────────────────────────────
function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-slate-100 rounded-lg">
        <Icon className="w-4 h-4 text-slate-500" />
      </div>
      <div>
        <p className="text-xs text-slate-400 font-medium">{label}</p>
        <p className="text-sm font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────
export default function SaleDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [sale, setSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getSaleById(params.id);
        setSale(data);
      } catch (err: any) {
        toast.error("Failed to load sale: " + err.message);
      } finally {
        setLoading(false);
      }
    }
    if (params.id) load();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
        <p className="text-sm text-slate-500">Loading invoice…</p>
      </div>
    );
  }

  if (!sale) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <FileText className="w-12 h-12 text-slate-200" />
        <p className="text-slate-400">Sale not found.</p>
        <Link href="/admin/sales" className="text-sm text-gold-600 hover:underline font-semibold">
          ← Back to Sales
        </Link>
      </div>
    );
  }

  const fmt = (n: number) =>
    "₹" + (n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{sale.invoice_no}</h1>
            <p className="text-slate-500 text-sm">Invoice Detail</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <PaymentBadge status={sale.payment_status} />
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-xl font-medium text-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
        </div>
      </div>

      {/* Info Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Party & Sale info */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            Sale Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoRow
              icon={Building2}
              label="Party"
              value={sale.parties?.party_name ?? "—"}
            />
            <InfoRow
              icon={Calendar}
              label="Invoice Date"
              value={new Date(sale.invoice_date).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            />
            <InfoRow
              icon={User}
              label="Sales By"
              value={sale.sales_by ?? "—"}
            />
            {sale.notes && (
              <InfoRow icon={FileText} label="Notes" value={sale.notes} />
            )}
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            Financial Summary
          </h2>
          <div className="space-y-2.5">
            {[
              { label: "Subtotal (before GST)", val: fmt(sale.total_amount) },
              { label: "GST Amount", val: fmt(sale.gst_amount) },
              { label: "Grand Total", val: fmt(sale.final_amount), bold: true },
            ].map(({ label, val, bold }) => (
              <div
                key={label}
                className={`flex justify-between text-sm ${bold ? "pt-2 border-t border-slate-200 font-bold text-slate-900" : ""}`}
              >
                <span className={bold ? "text-slate-900" : "text-slate-500"}>{label}</span>
                <span className={bold ? "text-slate-900" : "text-slate-700"}>{val}</span>
              </div>
            ))}

            {(sale.paid_amount > 0 || (sale.paid_gold ?? 0) > 0) && (
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Payment Breakdown:</span>
                </div>
                {sale.paid_amount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400 ml-4">Cash Received</span>
                    <span className="text-emerald-600 font-semibold">{fmt(sale.paid_amount)}</span>
                  </div>
                )}
                {(sale.paid_gold ?? 0) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400 ml-4">Gold Credit ({sale.paid_gold}g)</span>
                    <span className="text-amber-600 font-semibold">
                      {fmt((sale.paid_gold ?? 0) * (sale.gold_rate_on_payment ?? 0))}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between text-sm pt-2 border-t border-slate-200 font-bold">
              <span className="text-slate-900">Remaining Outstanding</span>
              <span className={sale.pending_amount > 0 ? "text-red-600" : "text-emerald-600"}>
                {fmt(sale.pending_amount)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60 flex items-center gap-2">
          <Scale className="w-4 h-4 text-slate-500" />
          <h2 className="font-bold text-slate-700 text-sm uppercase tracking-wider">
            Sale Items
            <span className="ml-2 font-normal text-slate-400 text-xs">
              ({sale.sale_items?.length ?? 0} item{(sale.sale_items?.length ?? 0) !== 1 ? "s" : ""})
            </span>
          </h2>
        </div>

        {!sale.sale_items || sale.sale_items.length === 0 ? (
          <div className="px-6 py-12 text-center text-slate-400 text-sm">
            No items found for this invoice.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="px-6 py-3">#</th>
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">Purity</th>
                  <th className="px-6 py-3 text-right">Qty</th>
                  <th className="px-6 py-3 text-right">Gross Wt</th>
                  <th className="px-6 py-3 text-right">Net Wt</th>
                  <th className="px-6 py-3 text-right">Gold Rate</th>
                  <th className="px-6 py-3 text-right">Making</th>
                  <th className="px-6 py-3 text-right">Item Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sale.sale_items.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-slate-400 font-medium">{index + 1}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {item.products?.name ?? item.product_id}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold uppercase">
                        {item.products?.purity ?? "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">{item.qty}</td>
                    <td className="px-6 py-4 text-right text-slate-600">{item.gross_weight?.toFixed(3)}g</td>
                    <td className="px-6 py-4 text-right text-slate-600">{item.net_weight?.toFixed(3)}g</td>
                    <td className="px-6 py-4 text-right text-slate-600">
                      ₹{(item.gold_rate || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 text-right text-slate-600">
                      ₹{(item.making_charge || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900">
                      ₹{(item.item_total || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* Footer total */}
              <tfoot>
                <tr className="bg-slate-50 border-t-2 border-slate-200">
                  <td colSpan={8} className="px-6 py-4 text-right text-sm font-bold text-slate-700">
                    Grand Total (incl. GST)
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-lg text-slate-900">
                    {fmt(sale.final_amount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
