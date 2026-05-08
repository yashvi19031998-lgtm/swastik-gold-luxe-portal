// ─────────────────────────────────────────────────────────────────────────────
// Sales Module – TypeScript Types
// Matches EXACT Supabase schema (no invented fields)
// ─────────────────────────────────────────────────────────────────────────────

/** Party row (from `parties` table) */
export interface Party {
  id: number; // bigint PK
  party_name: string;
  opening_balance: number;
  opening_gold_balance: number;
  current_cash_balance: number;
  current_gold_balance: number;
  credit_limit: number;
}

/** Lightweight party info used in selectors / summaries */
export interface PartySummary {
  id: number;
  party_name: string;
  current_cash_balance: number;
  current_gold_balance: number;
  credit_limit: number;
}

/** Product row (from `products` table) */
export interface Product {
  id: string; // uuid
  name: string;
  category_id: string;
  gross_weight: number;
  net_weight: number;
  making_charge: number;
  wastage_percent: number;
  stock_qty: number;
  gold_rate: number;
  purity: string;
  barcode: string | null;
}

/** Lightweight product info used in selectors */
export interface ProductSummary {
  id: string;
  name: string;
  purity: string;
  gross_weight: number;
  net_weight: number;
  making_charge: number;
  wastage_percent: number;
  gold_rate: number;
  stock_qty: number;
}

/** Sale row (from `sales` table) */
export interface Sale {
  id: string; // uuid
  invoice_no: string;
  party_id: number;
  sales_by: string;
  invoice_date: string;
  total_amount: number;
  gst_amount: number;
  final_amount: number;
  paid_amount: number;
  paid_gold: number;
  gold_rate_on_payment: number;
  pending_amount: number;
  payment_status: "paid" | "partial" | "pending";
  notes: string | null;
  // Joined data
  parties?: Pick<Party, "party_name">;
  sale_items?: SaleItem[];
}

/** sale_items row */
export interface SaleItem {
  id: string; // uuid
  sale_id: string;
  product_id: string;
  qty: number;
  gross_weight: number;
  net_weight: number;
  gold_rate: number;
  making_charge: number;
  item_total: number;
  // Joined
  products?: Pick<Product, "name" | "purity">;
}

/** Represents one line item during form entry (before save) */
export interface SaleItemFormEntry {
  product_id: string;
  product_name: string;
  purity: string;
  qty: number;
  gross_weight: number;
  net_weight: number;
  gold_rate: number;
  making_charge: number;
  wastage_percent: number;
  item_total: number;
}

/** Full form payload for creating a sale */
export interface SaleFormData {
  party_id: number | "";
  invoice_date: string;
  sales_by: string;
  paid_amount: number;
  paid_gold: number;
  gold_rate_on_payment: number;
  payment_status: "paid" | "partial" | "pending";
  notes: string;
  gst_percent: number; // e.g. 3 for 3%
  items: SaleItemFormEntry[];
}

/** Summary card totals computed on the fly */
export interface InvoiceSummary {
  subtotal: number;      // sum of item_total before GST
  gst_amount: number;    // subtotal * gst_percent / 100
  total_amount: number;  // subtotal (before GST, matches DB `total_amount`)
  final_amount: number;  // total_amount + gst_amount
  paid_amount: number;
  paid_gold: number;
  gold_value: number;
  pending_amount: number;
  total_gold_weight: number; // total net_weight * qty
}

/** party_ledger row */
export interface PartyLedger {
  id: string;
  party_id: number;
  transaction_type: string;
  reference_id: string;
  reference_type: string;
  debit_amount: number;
  credit_amount: number;
  gold_debit: number;
  gold_credit: number;
  balance_amount: number;
  balance_gold: number;
  remarks: string | null;
}
