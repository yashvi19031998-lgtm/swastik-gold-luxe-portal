import { createClient } from "@/lib/supabase/client";
import { GoldAccountingEngine } from "./goldAccountingEngine";

function supabase() {
  return createClient();
}

export interface SaleTransactionPayload {
  party_id: number;
  sales_by: string;
  invoice_date: string;
  total_amount: number;
  gst_amount: number;
  final_amount: number;
  paid_amount: number;
  paid_gold: number;      // Fine Gold Weight
  gold_rate: number;
  notes: string;
  items: Array<{
    product_id: string;
    qty: number;
    gross_weight: number;
    net_weight: number;
    gold_rate: number;
    making_charge: number;
    item_total: number;
  }>;
}

/**
 * Pillar 4: Transaction Engine
 * Responsible for strictly committing complex operations safely via Database RPCs.
 */
export const TransactionEngine = {

  /**
   * Executes the entire Sale Flow:
   * Insert Invoice -> Insert Items -> Reduce Stock -> Post Ledger Debit -> Commit.
   */
  async processSale(payload: SaleTransactionPayload) {
    const db = supabase();

    const { data, error } = await db.rpc("process_sale_transaction", {
      p_party_id: payload.party_id,
      p_sales_by: payload.sales_by,
      p_invoice_date: payload.invoice_date,
      p_total_amount: payload.total_amount,
      p_gst_amount: payload.gst_amount,
      p_final_amount: payload.final_amount,
      p_paid_amount: payload.paid_amount,
      p_paid_gold: payload.paid_gold,
      p_gold_rate: payload.gold_rate,
      p_notes: payload.notes || "",
      p_items: payload.items,
    });

    if (error) throw new Error(`Sale Transaction Failed: ${error.message}`);
    return data;
  },

  /**
   * Executes a standalone Payment Flow against a specific Invoice or Party Account.
   */
  async processPayment(
    partyId: number, 
    receiptNo: string, 
    paidCash: number, 
    paidGold: number, 
    goldRate: number,
    convertGoldToCash: boolean
  ) {
    const db = supabase();
    
    // We can use post_ledger_entry directly here because payment usually 
    // only affects the ledger (unless applied to a specific invoice, 
    // where we'd also call OutstandingEngine).

    const results = [];
    
    if (paidCash > 0) {
      const { data: cData, error: cErr } = await db.rpc("post_ledger_entry", {
        p_party_id: partyId,
        p_voucher_no: receiptNo,
        p_voucher_type: "receipt",
        p_cash_dr: 0,
        p_cash_cr: paidCash,
        p_gold_dr: 0,
        p_gold_cr: 0,
        p_remarks: "Cash Payment"
      });
      if (cErr) throw new Error(cErr.message);
      results.push(cData);
    }

    if (paidGold > 0) {
      // 1. Metal Jama (Gold Credit)
      const { data: gData, error: gErr } = await db.rpc("post_ledger_entry", {
        p_party_id: partyId,
        p_voucher_no: receiptNo,
        p_voucher_type: "metal_receipt",
        p_cash_dr: 0,
        p_cash_cr: 0,
        p_gold_dr: 0,
        p_gold_cr: paidGold,
        p_remarks: `Metal Jama ${paidGold}g`
      });
      if (gErr) throw new Error(gErr.message);
      results.push(gData);

      // 2. Journal Adjustment if converted to cash
      if (convertGoldToCash && goldRate > 0) {
        const cashValue = GoldAccountingEngine.convertGoldToAmount(paidGold, goldRate);
        const { data: adjData, error: adjErr } = await db.rpc("post_ledger_entry", {
          p_party_id: partyId,
          p_voucher_no: `${receiptNo}-ADJ`,
          p_voucher_type: "journal",
          p_cash_dr: 0,
          p_cash_cr: cashValue,
          p_gold_dr: paidGold, // wipe out gold credit
          p_gold_cr: 0,
          p_remarks: `Gold Converted to Cash @ ${goldRate}`
        });
        if (adjErr) throw new Error(adjErr.message);
        results.push(adjData);
      }
    }

    return results;
  }
};
