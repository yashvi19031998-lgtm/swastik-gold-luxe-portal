"use client";

import { Building2, Wallet, AlertTriangle } from "lucide-react";
import type { PartySummary } from "@/types/sales";

interface PartySelectorProps {
  parties: PartySummary[];
  value: number | "";
  onChange: (partyId: number | "") => void;
  error?: string;
  disabled?: boolean;
}

export function PartySelector({ parties, value, onChange, error, disabled }: PartySelectorProps) {
  const selected = parties.find((p) => p.id === value);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-slate-700">
        Select Party <span className="text-red-500">*</span>
      </label>

      <div className="relative">
        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <select
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
          className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 bg-white appearance-none disabled:opacity-60 ${
            error ? "border-red-400" : "border-slate-200"
          }`}
        >
          <option value="">— Select a party —</option>
          {parties.map((party) => (
            <option key={party.id} value={party.id}>
              {party.party_name}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500">
          <AlertTriangle className="w-3 h-3" /> {error}
        </p>
      )}

      {/* Balance info card */}
      {selected && (
        <div className="flex flex-wrap gap-3 mt-1 p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 text-xs">
            <Wallet className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500">Cash Balance:</span>
            <span
              className={`font-bold ${
                selected.current_cash_balance < 0 ? "text-red-600" : "text-emerald-600"
              }`}
            >
              ₹{Math.abs(selected.current_cash_balance).toLocaleString("en-IN")}
              {selected.current_cash_balance < 0 ? " (Dr)" : " (Cr)"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Credit Limit:</span>
            <span className="font-bold text-slate-700">
              ₹{selected.credit_limit.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
