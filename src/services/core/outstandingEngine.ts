import { createClient } from "@/lib/supabase/client";

function supabase() {
  return createClient();
}

/**
 * Pillar 3: Outstanding Engine
 * Calculates pending amounts specific to invoices and cross-checks party balances.
 */
export const OutstandingEngine = {

  calculatePendingAmount(finalAmount: number, paidCash: number, paidGoldValue: number): number {
    return Math.max(0, finalAmount - (paidCash + paidGoldValue));
  },

  async getPartyOutstanding(partyId: number) {
    const db = supabase();
    const { data, error } = await db
      .from("parties")
      .select("current_cash_balance, current_gold_balance, credit_limit")
      .eq("id", partyId)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async getInvoiceOutstanding(invoiceId: string) {
    const db = supabase();
    const { data, error } = await db
      .from("sales")
      .select("final_amount, pending_amount, payment_status")
      .eq("id", invoiceId)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async adjustInvoiceOutstanding(invoiceId: string, reductionAmount: number) {
    const db = supabase();
    
    // Fetch current outstanding
    const { data: sale, error: fetchErr } = await db
      .from("sales")
      .select("pending_amount, final_amount")
      .eq("id", invoiceId)
      .single();

    if (fetchErr) throw new Error(fetchErr.message);

    const newPending = Math.max(0, sale.pending_amount - reductionAmount);
    let newStatus = "pending";
    if (newPending === 0) newStatus = "paid";
    else if (newPending < sale.final_amount) newStatus = "partial";

    const { error: updateErr } = await db
      .from("sales")
      .update({ pending_amount: newPending, payment_status: newStatus })
      .eq("id", invoiceId);

    if (updateErr) throw new Error(updateErr.message);

    return { newPending, newStatus };
  }
};
