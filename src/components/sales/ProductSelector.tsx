"use client";

import { Package, AlertTriangle } from "lucide-react";
import type { ProductSummary } from "@/types/sales";

interface ProductSelectorProps {
  products: ProductSummary[];
  value: string;
  onChange: (product: ProductSummary | null) => void;
  error?: string;
  disabled?: boolean;
  excludeIds?: string[];
}

export function ProductSelector({
  products,
  value,
  onChange,
  error,
  disabled,
  excludeIds = [],
}: ProductSelectorProps) {
  const available = products.filter((p) => !excludeIds.includes(p.id));

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const found = products.find((p) => p.id === selectedId) ?? null;
    onChange(found);
  };

  return (
    <div className="space-y-1">
      <div className="relative">
        <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <select
          disabled={disabled}
          value={value}
          onChange={handleChange}
          className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 bg-white appearance-none disabled:opacity-60 ${
            error ? "border-red-400" : "border-slate-200"
          }`}
        >
          <option value="">— Select product —</option>
          {available.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.purity}) — Stock: {p.stock_qty}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500">
          <AlertTriangle className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  );
}
