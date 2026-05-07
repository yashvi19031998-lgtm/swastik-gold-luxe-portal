"use client";

import { Trash2 } from "lucide-react";
import type { SaleItemFormEntry } from "@/types/sales";

interface SaleItemsTableProps {
  items: SaleItemFormEntry[];
  onRemove: (index: number) => void;
  onUpdateField: (index: number, field: keyof SaleItemFormEntry, value: number | string) => void;
}

const inputCls =
  "w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 text-right bg-white";

export function SaleItemsTable({ items, onRemove, onUpdateField }: SaleItemsTableProps) {
  if (items.length === 0) {
    return (
      <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-400">
        <p className="text-sm font-medium">No items added yet.</p>
        <p className="text-xs mt-1">Click "Add Product" below to add jewellery line items.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Product</th>
            <th className="px-4 py-3">Purity</th>
            <th className="px-4 py-3 text-right">Qty</th>
            <th className="px-4 py-3 text-right">Gross Wt (g)</th>
            <th className="px-4 py-3 text-right">Net Wt (g)</th>
            <th className="px-4 py-3 text-right">Gold Rate (₹/g)</th>
            <th className="px-4 py-3 text-right">Making (₹/g)</th>
            <th className="px-4 py-3 text-right">Item Total (₹)</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((item, index) => (
            <tr key={index} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-4 py-3 text-slate-500 font-medium">{index + 1}</td>

              {/* Product name – read only */}
              <td className="px-4 py-3">
                <span className="font-semibold text-slate-800">{item.product_name}</span>
              </td>

              {/* Purity – read only */}
              <td className="px-4 py-3">
                <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold uppercase">
                  {item.purity}
                </span>
              </td>

              {/* Qty – editable */}
              <td className="px-4 py-3 w-20">
                <input
                  type="number"
                  min={1}
                  value={item.qty}
                  onChange={(e) => onUpdateField(index, "qty", Number(e.target.value))}
                  className={inputCls}
                />
              </td>

              {/* Gross weight – editable */}
              <td className="px-4 py-3 w-24">
                <input
                  type="number"
                  min={0}
                  step={0.001}
                  value={item.gross_weight}
                  onChange={(e) => onUpdateField(index, "gross_weight", Number(e.target.value))}
                  className={inputCls}
                />
              </td>

              {/* Net weight – editable */}
              <td className="px-4 py-3 w-24">
                <input
                  type="number"
                  min={0}
                  step={0.001}
                  value={item.net_weight}
                  onChange={(e) => onUpdateField(index, "net_weight", Number(e.target.value))}
                  className={inputCls}
                />
              </td>

              {/* Gold rate – editable */}
              <td className="px-4 py-3 w-28">
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={item.gold_rate}
                  onChange={(e) => onUpdateField(index, "gold_rate", Number(e.target.value))}
                  className={inputCls}
                />
              </td>

              {/* Making charge – editable */}
              <td className="px-4 py-3 w-24">
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={item.making_charge}
                  onChange={(e) => onUpdateField(index, "making_charge", Number(e.target.value))}
                  className={inputCls}
                />
              </td>

              {/* Item total – computed, read only */}
              <td className="px-4 py-3 text-right font-bold text-slate-900">
                ₹{item.item_total.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
              </td>

              {/* Remove */}
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
