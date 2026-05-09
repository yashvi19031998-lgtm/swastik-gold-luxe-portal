import { createClient } from "@/lib/supabase/client";

function supabase() {
  return createClient();
}

/**
 * Pillar 2: Gold Accounting Engine
 * Handles complex purity conversions and daily rates.
 */
export const GoldAccountingEngine = {
  
  async getTodayGoldRate() {
    const db = supabase();
    const { data, error } = await db
      .from("gold_rates")
      .select("gold_18k, gold_22k, gold_24k")
      .order("rate_date", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  },

  purityConversion(weight: number, purityPercentage: number): number {
    return Number((weight * (purityPercentage / 100)).toFixed(3));
  },

  convertGoldToAmount(fineWeight: number, goldRate: number): number {
    if (!fineWeight || !goldRate) return 0;
    return Number((fineWeight * goldRate).toFixed(2));
  }
};
