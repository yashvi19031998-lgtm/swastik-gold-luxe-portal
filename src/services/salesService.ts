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

/**
 * Fetch sales with server-side pagination
 */
export async function getSalesPaginated(
  page: number = 1,
  limit: number = 15,
  search?: string,
  status?: string
): Promise<{ data: Sale[]; count: number }> {
  const db = supabase();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = db
    .from("sales")
    .select(`*, parties ( party_name )`, { count: "exact" });

  // Filtering
  if (status) {
    query = query.eq("payment_status", status);
  }
  
  if (search) {
    // Search in invoice_no (using ilike for case-insensitive search)
    query = query.ilike("invoice_no", `%${search}%`);
  }

  const { data, error, count } = await query
    .order("invoice_date", { ascending: false })
    .range(from, to);

  if (error) throw new Error(error.message);
  return { 
    data: (data ?? []) as Sale[], 
    count: count ?? 0 
  };
}

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

export async function getSalesSummary(): Promise<{ revenue: number; pending: number; paidCount: number }> {
  const db = supabase();
  // Only select the bare minimum columns needed for the summary
  const { data, error } = await db
    .from("sales")
    .select("final_amount, pending_amount, payment_status");

  if (error) throw new Error(error.message);
  
  const sales = data ?? [];
  return {
    revenue: sales.reduce((s, r) => s + (r.final_amount || 0), 0),
    pending: sales.reduce((s, r) => s + (r.pending_amount || 0), 0),
    paidCount: sales.filter((s) => s.payment_status === "paid").length
  };
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

  // Call the transaction-safe PostgreSQL RPC function
  const { data, error } = await db.rpc("create_sale_transaction", {
    p_party_id: formData.party_id,
    p_sales_by: formData.sales_by,
    p_invoice_date: formData.invoice_date,
    p_total_amount: invoiceSummary.total_amount,
    p_gst_amount: invoiceSummary.gst_amount,
    p_final_amount: invoiceSummary.final_amount,
    p_paid_amount: formData.paid_amount,
    p_paid_gold: formData.paid_gold || 0,
    p_gold_rate_on_payment: formData.gold_rate_on_payment || 0,
    p_pending_amount: invoiceSummary.pending_amount,
    p_payment_status: formData.payment_status,
    p_notes: formData.notes || null,
    p_items: formData.items,
  });

  if (error) {
    throw new Error(`Transaction failed: ${error.message}`);
  }

  return {
    saleId: data.saleId,
    invoiceNo: data.invoiceNo,
  };
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
