"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Loader2, ArrowLeft, Zap } from "lucide-react";

import { PartySelector } from "@/components/sales/PartySelector";
import { ProductSelector } from "@/components/sales/ProductSelector";
import { SaleItemsTable } from "@/components/sales/SaleItemsTable";
import { InvoiceSummaryCard } from "@/components/sales/InvoiceSummaryCard";

import type {
  PartySummary,
  ProductSummary,
  SaleItemFormEntry,
  SaleFormData,
  InvoiceSummary,
} from "@/types/sales";

import {
  getPartiesSummary,
  getProductsSummary,
  getLatestGoldRate,
  createSale,
} from "@/services/salesService";

// ─────────────────────────────────────────────────────────────────────────────
// Zod schema
// ─────────────────────────────────────────────────────────────────────────────
const saleSchema = z.object({
  party_id: z.number({ invalid_type_error: "Party is required" }).positive("Party is required"),
  invoice_date: z.string().min(1, "Invoice date is required"),
  sales_by: z.string().min(1, "Sales person name is required"),
  paid_amount: z.number().min(0, "Paid amount cannot be negative"),
  payment_status: z.enum(["paid", "partial", "pending"]),
  notes: z.string().optional(),
  gst_percent: z.number().min(0).max(28),
});

type FormValues = z.infer<typeof saleSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Jewellery calculation
// ─────────────────────────────────────────────────────────────────────────────
/**
 * item_total = (net_weight * gold_rate) + (net_weight * making_charge)
 * wastage is already absorbed in net_weight from product.
 * All values per gram.
 */
function calcItemTotal(item: Partial<SaleItemFormEntry>): number {
  const net = item.net_weight ?? 0;
  const rate = item.gold_rate ?? 0;
  const making = item.making_charge ?? 0;
  const qty = item.qty ?? 1;
  return Number(((net * rate + net * making) * qty).toFixed(2));
}

function computeSummary(
  items: SaleItemFormEntry[],
  gstPercent: number,
  paidAmount: number
): InvoiceSummary {
  const subtotal = items.reduce((sum, i) => sum + i.item_total, 0);
  const gst_amount = Number(((subtotal * gstPercent) / 100).toFixed(2));
  const final_amount = Number((subtotal + gst_amount).toFixed(2));
  const pending_amount = Number((final_amount - paidAmount).toFixed(2));
  const total_gold_weight = items.reduce((sum, i) => sum + i.net_weight * i.qty, 0);

  return {
    subtotal,
    gst_amount,
    total_amount: subtotal,
    final_amount,
    paid_amount: paidAmount,
    pending_amount,
    total_gold_weight: Number(total_gold_weight.toFixed(3)),
  };
}

function derivePaymentStatus(paidAmount: number, finalAmount: number): "paid" | "partial" | "pending" {
  if (finalAmount <= 0) return "pending";
  if (paidAmount <= 0) return "pending";
  if (paidAmount >= finalAmount) return "paid";
  return "partial";
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
export function SaleForm() {
  const router = useRouter();

  // Master data
  const [parties, setParties] = useState<PartySummary[]>([]);
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [masterLoading, setMasterLoading] = useState(true);

  // Line items
  const [items, setItems] = useState<SaleItemFormEntry[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");

  // Submission
  const [submitting, setSubmitting] = useState(false);

  // React-hook-form
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      party_id: undefined,
      invoice_date: new Date().toISOString().slice(0, 10),
      sales_by: "",
      paid_amount: 0,
      payment_status: "pending",
      notes: "",
      gst_percent: 3,
    },
  });

  const partyId = watch("party_id");
  const paidAmount = watch("paid_amount") ?? 0;
  const gstPercent = watch("gst_percent") ?? 3;

  // ── Load master data ─────────────────────────────────────────────────────
  useEffect(() => {
    async function loadMaster() {
      setMasterLoading(true);
      try {
        const [partiesData, productsData, goldRate] = await Promise.all([
          getPartiesSummary(),
          getProductsSummary(),
          getLatestGoldRate(),
        ]);
        setParties(partiesData);
        // Pre-fill gold rate from DB if available
        if (goldRate) {
          setProducts(
            productsData.map((p) => ({
              ...p,
              gold_rate:
                p.gold_rate ||
                (p.purity === "22kt"
                  ? goldRate.gold_22k
                  : p.purity === "18kt"
                  ? goldRate.gold_18k
                  : goldRate.gold_24k),
            }))
          );
        } else {
          setProducts(productsData);
        }
      } catch (err: any) {
        toast.error("Failed to load master data: " + err.message);
      } finally {
        setMasterLoading(false);
      }
    }
    loadMaster();
  }, []);

  // ── Recompute invoice summary ─────────────────────────────────────────────
  const invoiceSummary = useMemo(
    () => computeSummary(items, gstPercent, Number(paidAmount) || 0),
    [items, gstPercent, paidAmount]
  );

  // Auto-update payment_status when paid changes
  useEffect(() => {
    const status = derivePaymentStatus(
      Number(paidAmount) || 0,
      invoiceSummary.final_amount
    );
    setValue("payment_status", status);
  }, [paidAmount, invoiceSummary.final_amount, setValue]);

  // ── Add product to line items ────────────────────────────────────────────
  const handleAddProduct = (product: ProductSummary | null) => {
    if (!product) return;
    // Prevent duplicates
    if (items.some((i) => i.product_id === product.id)) {
      toast.warning(`"${product.name}" is already added. Update qty inline.`);
      setSelectedProductId("");
      return;
    }
    const newItem: SaleItemFormEntry = {
      product_id: product.id,
      product_name: product.name,
      purity: product.purity,
      qty: 1,
      gross_weight: product.gross_weight,
      net_weight: product.net_weight,
      gold_rate: product.gold_rate,
      making_charge: product.making_charge,
      wastage_percent: product.wastage_percent,
      item_total: calcItemTotal({
        qty: 1,
        net_weight: product.net_weight,
        gold_rate: product.gold_rate,
        making_charge: product.making_charge,
      }),
    };
    setItems((prev) => [...prev, newItem]);
    setSelectedProductId("");
  };

  // ── Remove line item ─────────────────────────────────────────────────────
  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Update a field in a line item and recompute total ────────────────────
  const handleUpdateField = (
    index: number,
    field: keyof SaleItemFormEntry,
    value: number | string
  ) => {
    setItems((prev) => {
      const updated = [...prev];
      const item = { ...updated[index], [field]: value };
      item.item_total = calcItemTotal(item);
      updated[index] = item;
      return updated;
    });
  };

  // ── Form submit ──────────────────────────────────────────────────────────
  const onSubmit = async (values: FormValues) => {
    if (items.length === 0) {
      toast.error("Add at least one product to the sale.");
      return;
    }

    setSubmitting(true);
    try {
      const formData: SaleFormData = {
        party_id: values.party_id,
        invoice_date: values.invoice_date,
        sales_by: values.sales_by,
        paid_amount: Number(values.paid_amount) || 0,
        payment_status: values.payment_status,
        notes: values.notes || "",
        gst_percent: values.gst_percent,
        items,
      };

      const { invoiceNo } = await createSale(formData, {
        total_amount: invoiceSummary.total_amount,
        gst_amount: invoiceSummary.gst_amount,
        final_amount: invoiceSummary.final_amount,
        pending_amount: invoiceSummary.pending_amount,
      });

      toast.success(`Sale created! Invoice: ${invoiceNo}`);
      router.push("/admin/sales");
      router.refresh();
    } catch (err: any) {
      toast.error("Failed to create sale: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ────────────────────────────────────────────────────────────────────────
  if (masterLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
        <p className="text-sm text-slate-500">Loading master data…</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Create Sale</h1>
            <p className="text-slate-500 text-sm">New wholesale jewellery invoice</p>
          </div>
        </div>
        <button
          type="submit"
          disabled={submitting || items.length === 0}
          className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-gold-500/20"
        >
          {submitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Zap className="w-5 h-5" />
          )}
          {submitting ? "Saving…" : "Save Sale"}
        </button>
      </div>

      {/* ── Main grid ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ── Left / Center: form fields ─────────────────────────────────── */}
        <div className="xl:col-span-2 space-y-6">

          {/* ── Section 1: Sale Header ─────────────────────────────────── */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60">
              <h2 className="font-bold text-slate-700 text-sm uppercase tracking-wide">
                Sale Details
              </h2>
            </div>
            <div className="p-6 space-y-5">
              {/* Party Selector */}
              <PartySelector
                parties={parties}
                value={partyId || ""}
                onChange={(id) => setValue("party_id", id as number, { shouldValidate: true })}
                error={errors.party_id?.message}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Invoice Date */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Invoice Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    {...register("invoice_date")}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 bg-white"
                  />
                  {errors.invoice_date && (
                    <p className="text-xs text-red-500 mt-1">{errors.invoice_date.message}</p>
                  )}
                </div>

                {/* Sales By */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Sales Person <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("sales_by")}
                    placeholder="e.g. Yashvi Shah"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 bg-white"
                  />
                  {errors.sales_by && (
                    <p className="text-xs text-red-500 mt-1">{errors.sales_by.message}</p>
                  )}
                </div>

                {/* GST % */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    GST %
                  </label>
                  <select
                    {...register("gst_percent", { valueAsNumber: true })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 bg-white"
                  >
                    <option value={0}>0% (Exempt)</option>
                    <option value={1.5}>1.5%</option>
                    <option value={3}>3% (Standard)</option>
                    <option value={5}>5%</option>
                    <option value={12}>12%</option>
                    <option value={18}>18%</option>
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Notes
                  </label>
                  <input
                    type="text"
                    {...register("notes")}
                    placeholder="Optional remarks…"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Section 2: Line Items ──────────────────────────────────── */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
              <h2 className="font-bold text-slate-700 text-sm uppercase tracking-wide">
                Sale Items
                <span className="ml-2 text-xs font-normal text-slate-400">
                  ({items.length} item{items.length !== 1 ? "s" : ""})
                </span>
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {/* Product picker row */}
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Add Product
                  </label>
                  <ProductSelector
                    products={products}
                    value={selectedProductId}
                    onChange={(p) => {
                      if (p) {
                        setSelectedProductId(p.id);
                        handleAddProduct(p);
                      }
                    }}
                    excludeIds={items.map((i) => i.product_id)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const product = products.find((p) => p.id === selectedProductId);
                    handleAddProduct(product ?? null);
                  }}
                  disabled={!selectedProductId}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 disabled:opacity-40 text-white text-sm font-bold rounded-xl transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>

              {/* Items table */}
              <SaleItemsTable
                items={items}
                onRemove={handleRemoveItem}
                onUpdateField={handleUpdateField}
              />
            </div>
          </div>

          {/* ── Section 3: Payment ──────────────────────────────────────── */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60">
              <h2 className="font-bold text-slate-700 text-sm uppercase tracking-wide">
                Payment Details
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Paid Amount */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Paid Amount (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  {...register("paid_amount", { valueAsNumber: true })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 bg-white"
                  placeholder="0.00"
                />
                {errors.paid_amount && (
                  <p className="text-xs text-red-500 mt-1">{errors.paid_amount.message}</p>
                )}
              </div>

              {/* Payment Status – auto-set, read-only display */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Payment Status
                  <span className="ml-2 text-[10px] text-slate-400 font-normal">(auto-computed)</span>
                </label>
                <div className="px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm font-medium capitalize">
                  {watch("payment_status") === "paid" && (
                    <span className="text-emerald-600">✓ Paid</span>
                  )}
                  {watch("payment_status") === "partial" && (
                    <span className="text-amber-600">◑ Partial</span>
                  )}
                  {watch("payment_status") === "pending" && (
                    <span className="text-red-600">○ Pending</span>
                  )}
                </div>
                {/* Hidden input so form value is submitted */}
                <input type="hidden" {...register("payment_status")} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Invoice Summary ──────────────────────────────────────── */}
        <div className="xl:col-span-1">
          <div className="sticky top-6">
            <InvoiceSummaryCard
              summary={invoiceSummary}
              gstPercent={gstPercent}
            />

            {/* Submit button (mobile) */}
            <button
              type="submit"
              disabled={submitting || items.length === 0}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 py-3 rounded-xl font-bold transition-all shadow-lg shadow-gold-500/20 xl:hidden"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Zap className="w-5 h-5" />
              )}
              {submitting ? "Saving…" : "Save Sale"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
