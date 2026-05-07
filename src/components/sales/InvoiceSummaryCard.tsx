"use client";

import { Receipt, Scale } from "lucide-react";
import type { InvoiceSummary } from "@/types/sales";

interface InvoiceSummaryCardProps {
  summary: InvoiceSummary;
  gstPercent: number;
}

function Row({
  label,
  value,
  bold,
  highlight,
}: {
  label: string;
  value: string;
  bold?: boolean;
  highlight?: "green" | "red" | "gold";
}) {
  const colorMap = {
    green: "text-emerald-600",
    red: "text-red-600",
    gold: "text-amber-600",
  };
  return (
    <div className={`flex items-center justify-between py-1.5 ${bold ? "border-t border-slate-200 mt-1 pt-2.5" : ""}`}>
      <span className={`text-sm ${bold ? "font-bold text-slate-800" : "text-slate-500"}`}>
        {label}
      </span>
      <span
        className={`text-sm ${bold ? "font-bold text-slate-900" : ""} ${
          highlight ? colorMap[highlight] : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export function InvoiceSummaryCard({ summary, gstPercent }: InvoiceSummaryCardProps) {
  const fmt = (n: number) =>
    "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-4 bg-slate-50/70 border-b border-slate-200 flex items-center gap-2">
        <div className="p-1.5 bg-gold-500 rounded-lg">
          <Receipt className="w-4 h-4 text-slate-900" />
        </div>
        <h3 className="font-bold text-slate-800 text-sm">Invoice Summary</h3>
      </div>

      <div className="px-5 py-4 space-y-0.5">
        <Row label="Subtotal (before GST)" value={fmt(summary.total_amount)} />
        <Row label={`GST @ ${gstPercent}%`} value={fmt(summary.gst_amount)} />
        <Row label="Grand Total" value={fmt(summary.final_amount)} bold />
        <Row label="Paid Amount" value={fmt(summary.paid_amount)} highlight="green" />
        <Row
          label="Pending Amount"
          value={fmt(summary.pending_amount)}
          highlight={summary.pending_amount > 0 ? "red" : "green"}
        />
      </div>

      {/* Gold weight */}
      {summary.total_gold_weight > 0 && (
        <div className="px-5 pb-4">
          <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <Scale className="w-4 h-4 text-amber-600" />
            <span className="text-xs text-amber-700 font-semibold">
              Total Net Gold Weight:{" "}
              <span className="font-bold">
                {summary.total_gold_weight.toFixed(3)} g
              </span>
            </span>
          </div>
        </div>
      )}

      {/* Status pill */}
      <div className="px-5 pb-4">
        {summary.pending_amount <= 0 ? (
          <div className="w-full py-2 text-center text-xs font-bold rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            ✓ FULLY PAID
          </div>
        ) : summary.paid_amount > 0 ? (
          <div className="w-full py-2 text-center text-xs font-bold rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
            ◑ PARTIAL PAYMENT
          </div>
        ) : (
          <div className="w-full py-2 text-center text-xs font-bold rounded-xl bg-red-50 text-red-700 border border-red-200">
            ○ PAYMENT PENDING
          </div>
        )}
      </div>
    </div>
  );
}
