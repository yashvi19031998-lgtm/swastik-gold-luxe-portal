import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  Package,
  Layers,
  Tags,
  TrendingUp,
  Users,
  ShoppingBag,
  Building2
} from "lucide-react";

export default async function AdminDashboard() {
  const supabase = createClient();

  const [
    { count: productCount },
    { data: salesData },
    { data: partiesData }
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("sales").select("final_amount, pending_amount"),
    supabase.from("parties").select("current_cash_balance, current_gold_balance"),
  ]);

  const totalRevenue = (salesData || []).reduce((acc, s) => acc + (s.final_amount || 0), 0);
  const totalOutstanding = (partiesData || []).reduce((acc, p) => acc + (p.current_cash_balance || 0), 0);
  const totalGoldBalance = (partiesData || []).reduce((acc, p) => acc + (p.current_gold_balance || 0), 0);

  const stats = {
    products: productCount || 0,
    revenue: totalRevenue,
    outstanding: totalOutstanding,
    goldBalance: totalGoldBalance,
  };

  const fmt = (n: number) => "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

  const statCards = [
    { name: "Total Revenue", value: fmt(stats.revenue), icon: TrendingUp, color: "bg-emerald-500", trend: "Total Sales" },
    { name: "Total Outstanding", value: fmt(stats.outstanding), icon: ShoppingBag, color: "bg-red-500", trend: "Receivables" },
    { name: "Gold Balance", value: `${stats.goldBalance.toFixed(3)} g`, icon: Layers, color: "bg-gold-500", trend: "Metal Account" },
    { name: "Inventory Items", value: stats.products, icon: Package, color: "bg-blue-500", trend: "Active Stock" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
        <p className="text-slate-500 text-sm">Welcome back, here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className={stat.color + " p-3 rounded-xl text-white"}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3" />
                {stat.trend}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-sm text-slate-500 font-medium">{stat.name}</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">
                {stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800">Recent Activity</h2>
            <button className="text-sm text-gold-600 font-semibold hover:text-gold-700">View All</button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors">
                <div className="w-10 h-10 rounded-full bg-gold-50 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-gold-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">New product added to inventory</p>
                  <p className="text-xs text-slate-400">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/admin/products" className="flex flex-col items-center gap-3 p-4 border border-dashed border-slate-200 rounded-2xl hover:border-gold-500 hover:bg-gold-50/30 transition-all group text-center">
              <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-white">
                <Package className="w-6 h-6 text-slate-400 group-hover:text-gold-500" />
              </div>
              <span className="text-sm font-semibold text-slate-600 group-hover:text-gold-600">Add Product</span>
            </Link>
            <Link href="/admin/parties" className="flex flex-col items-center gap-3 p-4 border border-dashed border-slate-200 rounded-2xl hover:border-gold-500 hover:bg-gold-50/30 transition-all group text-center">
              <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-white">
                <Building2 className="w-6 h-6 text-slate-400 group-hover:text-gold-500" />
              </div>
              <span className="text-sm font-semibold text-slate-600 group-hover:text-gold-600">New Party</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
