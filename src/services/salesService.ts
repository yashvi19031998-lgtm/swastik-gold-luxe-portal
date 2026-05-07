/**
 * Sales Service Layer
 * Pages → Service → Supabase
 * Never call Supabase directly from pages/components.
 */

import { createClient } from "@/lib/supabase/client";
import type {
  Sale,
  SaleItem,
  SaleFormData,
  SaleItemFormEntry,
  PartySummary,
  ProductSummary,
  PartyLedger,
} from "@/types/sales";

// ─────────────────────────────────────────────────────────────────────────────
// Helper
// ─────────────────────────────────────────────────────────────────────────────
function supabase() {
  return createClient();
}

// ─────────────────────────────────────────────────────────────────────────────
// SALES CRUD
// ─────────────────────────────────────────────────────────────────────────────

export async function getSales(): Promise<Sale[]> {
  const db = supabase();
  const { data, error } = await db
    .from("sales")
    .select(
      `
      *,
      parties ( party_name )
    `
    )
    .order("invoice_date", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as Sale[];
}

export async function getSaleById(id: string): Promise<Sale> {
  const db = supabase();
  const { data, error } = await db
    .from("sales")
    .select(
      `
      *,
      parties ( party_name ),
      sale_items (
        *,
        products ( name, purity )
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data as Sale;
}

/**
 * Create a sale with full business logic:
 * 1. Insert sales row
 * 2. Insert sale_items rows
 * 3. Reduce product stock (qty)
 * 4. Create party_ledger debit entry
 * 5. Update party outstanding (current_cash_balance)
 */
export async function createSale(
  formData: SaleFormData,
  invoiceSummary: {
    total_amount: number;
    gst_amount: number;
    final_amount: number;
    pending_amount: number;
  }
): Promise<{ saleId: string; invoiceNo: string }> {
  const db = supabase();

  // ── 1. Generate invoice number ───────────────────────────────────────────
  const invoiceNo = await generateInvoiceNo(db);

  // ── 2. Insert sales row ──────────────────────────────────────────────────
  const { data: saleData, error: saleError } = await db
    .from("sales")
    .insert([
      {
        invoice_no: invoiceNo,
        party_id: formData.party_id,
        sales_by: formData.sales_by,
        invoice_date: formData.invoice_date,
        total_amount: invoiceSummary.total_amount,
        gst_amount: invoiceSummary.gst_amount,
        final_amount: invoiceSummary.final_amount,
        paid_amount: formData.paid_amount,
        pending_amount: invoiceSummary.pending_amount,
        payment_status: formData.payment_status,
        notes: formData.notes || null,
      },
    ])
    .select("id")
    .single();

  if (saleError) throw new Error(saleError.message);
  const saleId = saleData.id as string;

  // ── 3. Insert sale_items rows ────────────────────────────────────────────
  const saleItems = formData.items.map((item: SaleItemFormEntry) => ({
    sale_id: saleId,
    product_id: item.product_id,
    qty: item.qty,
    gross_weight: item.gross_weight,
    net_weight: item.net_weight,
    gold_rate: item.gold_rate,
    making_charge: item.making_charge,
    item_total: item.item_total,
  }));

  const { error: itemsError } = await db.from("sale_items").insert(saleItems);
  if (itemsError) throw new Error(itemsError.message);

  // ── 4. Reduce product stock ──────────────────────────────────────────────
  for (const item of formData.items) {
    // Fetch current stock
    const { data: productData, error: stockFetchErr } = await db
      .from("products")
      .select("stock_qty")
      .eq("id", item.product_id)
      .single();

    if (stockFetchErr) throw new Error(stockFetchErr.message);

    const newQty = Math.max(0, (productData.stock_qty ?? 0) - item.qty);

    const { error: stockUpdateErr } = await db
      .from("products")
      .update({ stock_qty: newQty })
      .eq("id", item.product_id);

    if (stockUpdateErr) throw new Error(stockUpdateErr.message);
  }

  // ── 5. Get current party balance ─────────────────────────────────────────
  const { data: partyData, error: partyFetchErr } = await db
    .from("parties")
    .select("current_cash_balance")
    .eq("id", formData.party_id)
    .single();

  if (partyFetchErr) throw new Error(partyFetchErr.message);

  const currentBalance = partyData.current_cash_balance ?? 0;
  const newBalance = currentBalance - invoiceSummary.final_amount + formData.paid_amount;

  // ── 6. Insert party_ledger debit entry ────────────────────────────────────
  const { error: ledgerError } = await db.from("party_ledger").insert([
    {
      party_id: formData.party_id,
      transaction_type: "sale",
      reference_id: saleId,
      reference_type: "sales",
      debit_amount: invoiceSummary.final_amount,
      credit_amount: formData.paid_amount,
      gold_debit: 0,
      gold_credit: 0,
      balance_amount: newBalance,
      balance_gold: 0,
      remarks: `Invoice ${invoiceNo}`,
    },
  ]);

  if (ledgerError) throw new Error(ledgerError.message);

  // ── 7. Update party outstanding ───────────────────────────────────────────
  const { error: partyUpdateErr } = await db
    .from("parties")
    .update({ current_cash_balance: newBalance })
    .eq("id", formData.party_id);

  if (partyUpdateErr) throw new Error(partyUpdateErr.message);

  return { saleId, invoiceNo };
}

export async function updateSale(
  id: string,
  updates: Partial<Pick<Sale, "paid_amount" | "pending_amount" | "payment_status" | "notes">>
): Promise<void> {
  const db = supabase();
  const { error } = await db.from("sales").update(updates).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteSale(id: string): Promise<void> {
  const db = supabase();
  // Delete sale_items first (FK constraint)
  const { error: itemsErr } = await db.from("sale_items").delete().eq("sale_id", id);
  if (itemsErr) throw new Error(itemsErr.message);

  const { error } = await db.from("sales").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ─────────────────────────────────────────────────────────────────────────────
// PARTY HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export async function getPartiesSummary(): Promise<PartySummary[]> {
  const db = supabase();
  const { data, error } = await db
    .from("parties")
    .select("id, party_name, current_cash_balance, current_gold_balance, credit_limit")
    .order("party_name", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as PartySummary[];
}

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export async function getProductsSummary(): Promise<ProductSummary[]> {
  const db = supabase();
  const { data, error } = await db
    .from("products")
    .select(
      "id, name, purity, gross_weight, net_weight, making_charge, wastage_percent, gold_rate, stock_qty"
    )
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as ProductSummary[];
}

// ─────────────────────────────────────────────────────────────────────────────
// GOLD RATE HELPER
// ─────────────────────────────────────────────────────────────────────────────

export async function getLatestGoldRate(): Promise<{
  gold_18k: number;
  gold_22k: number;
  gold_24k: number;
} | null> {
  const db = supabase();
  const { data, error } = await db
    .from("gold_rates")
    .select("gold_18k, gold_22k, gold_24k")
    .order("rate_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL HELPERS
// ─────────────────────────────────────────────────────────────────────────────

async function generateInvoiceNo(db: ReturnType<typeof createClient>): Promise<string> {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, "0");

  const { count } = await db
    .from("sales")
    .select("id", { count: "exact", head: true });

  const seq = String((count ?? 0) + 1).padStart(4, "0");
  return `INV-${year}${month}-${seq}`;
}
