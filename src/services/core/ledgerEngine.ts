import { createClient } from "@/lib/supabase/client";
import type { PartyLedger } from "@/types/sales";

function supabase() {
  return createClient();
}

export type VoucherType = "sale" | "receipt" | "metal_receipt" | "metal_issue" | "journal" | "opening";

export interface LedgerPayload {
  party_id: number;
  voucher_no: string;
  voucher_type: VoucherType;
  cash_dr?: number;
  cash_cr?: number;
  gold_dr?: number;
  gold_cr?: number;
  remarks?: string;
}

/**
 * Pillar 1: Ledger Engine
 * Strictly handles database ledger journal entries.
 */
export const LedgerEngine = {
  async postEntry(payload: LedgerPayload) {
    const db = supabase();
    const { data, error } = await db.rpc("post_ledger_entry", {
      p_party_id: payload.party_id,
      p_voucher_no: payload.voucher_no,
      p_voucher_type: payload.voucher_type,
      p_cash_dr: payload.cash_dr || 0,
      p_cash_cr: payload.cash_cr || 0,
      p_gold_dr: payload.gold_dr || 0,
      p_gold_cr: payload.gold_cr || 0,
      p_remarks: payload.remarks || "",
    });

    if (error) throw new Error(`LedgerEngine Error: ${error.message}`);
    return data;
  },

  async getPartyStatement(partyId: number, startDate?: string, endDate?: string): Promise<PartyLedger[]> {
    const db = supabase();
    let query = db.from("party_ledger").select("*").eq("party_id", partyId).order("created_at", { ascending: true });
    
    if (startDate) query = query.gte("created_at", `${startDate}T00:00:00.000Z`);
    if (endDate) query = query.lte("created_at", `${endDate}T23:59:59.999Z`);

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data as PartyLedger[];
  },

  async getPartyRunningBalance(partyId: number) {
    const db = supabase();
    const { data, error } = await db.from("parties").select("current_cash_balance, current_gold_balance").eq("id", partyId).single();
    if (error) throw new Error(error.message);
    return data;
  }
};
