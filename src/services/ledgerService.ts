/**
 * Accounting Engine (Ledger Service)
 * Implements strict Double-Entry accounting rules for Wholesale Jewellery.
 */

import { createClient } from "@/lib/supabase/client";
import type { PartyLedger } from "@/types/sales";

function supabase() {
  return createClient();
}

export type VoucherType = 
  | "sale"           // Sales Invoice
  | "receipt"        // Cash/Bank Receipt
  | "metal_receipt"  // Gold Deposit
  | "metal_issue"    // Gold given to Karigar/Party
  | "journal"        // Adjustments (e.g. converting gold to cash)
  | "opening";       // Opening Balances

export interface VoucherPayload {
  party_id: number;
  voucher_no: string;
  voucher_type: VoucherType;
  cash_dr?: number;    // Increase monetary debt
  cash_cr?: number;    // Decrease monetary debt
  gold_dr?: number;    // Increase metal debt
  gold_cr?: number;    // Decrease metal debt
  remarks?: string;
}

/**
 * 1. CORE ENGINE: Post a voucher to the ledger.
 */
export async function postVoucher(payload: VoucherPayload) {
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

  if (error) throw new Error(`Ledger Post Failed [${payload.voucher_no}]: ${error.message}`);
  return data;
}

/**
 * 2. BUSINESS LOGIC: Record a Sale (Invoice)
 */
export async function postSaleInvoice(partyId: number, invoiceNo: string, totalAmount: number, remarks?: string) {
  return postVoucher({
    party_id: partyId,
    voucher_no: invoiceNo,
    voucher_type: "sale",
    cash_dr: totalAmount, // Party owes us money
    remarks: remarks || `Invoice ${invoiceNo}`,
  });
}

/**
 * 3. BUSINESS LOGIC: Process a Mixed Payment (Cash + Gold)
 * This handles the complex Gold Conversion logic.
 */
export async function processPayment(
  partyId: number,
  receiptNo: string,
  paidCash: number,
  paidGoldFineWeight: number,
  goldRate: number,
  convertGoldToCashDebt: boolean,
  remarks?: string
) {
  const results = [];

  // A. If they paid Cash
  if (paidCash > 0) {
    const cashRes = await postVoucher({
      party_id: partyId,
      voucher_no: receiptNo,
      voucher_type: "receipt",
      cash_cr: paidCash, // Reduces cash debt
      remarks: remarks ? `${remarks} (Cash)` : "Cash Receipt",
    });
    results.push(cashRes);
  }

  // B. If they gave Gold
  if (paidGoldFineWeight > 0) {
    if (convertGoldToCashDebt && goldRate > 0) {
      // SCENARIO 1: We "buy" the gold from them to reduce their CASH debt.
      // E.g., they owe us Rs. 5L, they give 50g gold to clear Rs. 3.5L of that debt.
      const goldValue = paidGoldFineWeight * goldRate;

      // 1. First, receive the gold into their Metal Khata
      await postVoucher({
        party_id: partyId,
        voucher_no: receiptNo,
        voucher_type: "metal_receipt",
        gold_cr: paidGoldFineWeight,
        remarks: `Metal Jama: ${paidGoldFineWeight}g Fine`,
      });

      // 2. Second, do a Journal Adjustment to "sell" that gold to the business
      const adjRes = await postVoucher({
        party_id: partyId,
        voucher_no: `${receiptNo}-ADJ`,
        voucher_type: "journal",
        gold_dr: paidGoldFineWeight, // Wipe out the metal credit we just gave them
        cash_cr: goldValue,          // Credit their cash account instead!
        remarks: `Auto-Conv: ${paidGoldFineWeight}g @ ₹${goldRate}`,
      });
      results.push(adjRes);
    } else {
      // SCENARIO 2: They just deposit gold into their Metal Khata. 
      // Does not affect cash debt.
      const goldRes = await postVoucher({
        party_id: partyId,
        voucher_no: receiptNo,
        voucher_type: "metal_receipt",
        gold_cr: paidGoldFineWeight, // Reduces metal debt
        remarks: remarks || `Metal Jama: ${paidGoldFineWeight}g Fine`,
      });
      results.push(goldRes);
    }
  }

  return results;
}

/**
 * 4. REPORTING: Get Party Statement (Khata Copy)
 */
export async function getPartyStatement(partyId: number, startDate?: string, endDate?: string) {
  const db = supabase();
  let query = db
    .from("party_ledger")
    .select("*")
    .eq("party_id", partyId)
    .order("created_at", { ascending: true }); // Must be chronological!

  if (startDate) query = query.gte("created_at", `${startDate}T00:00:00.000Z`);
  if (endDate) query = query.lte("created_at", `${endDate}T23:59:59.999Z`);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}
