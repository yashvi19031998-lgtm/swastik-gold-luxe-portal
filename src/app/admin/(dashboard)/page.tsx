"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Package, 
  Layers, 
  Tags, 
  TrendingUp, 
  Users,
  ShoppingBag
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    collections: 0,
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchStats() {
      const [
        { count: productCount },
        { count: categoryCount },
        { count: collectionCount }
      ] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("categories").select("*", { count: "exact", head: true }),
        supabase.from("collections").select("*", { count: "exact", head: true }),
      ]);

      setStats({
        products: productCount || 0,
        categories: categoryCount || 0,
        collections: collectionCount || 0,
      });
      setLoading(false);
    }

    fetchStats();
  }, []);

  const statCards = [
    { name: "Total Products", value: stats.products, icon: Package, color: "bg-blue-500", trend: "+12%" },
    { name: "Total Categories", value: stats.categories, icon: Tags, color: "bg-purple-500", trend: "+2%" },
    { name: "Total Collections", value: stats.collections, icon: Layers, color: "bg-gold-500", trend: "+5%" },
    { name: "Active Users", value: "1,284", icon: Users, color: "bg-green-500", trend: "+18%" },
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
                {loading ? "..." : stat.value}
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
            <button className="flex flex-col items-center gap-3 p-4 border border-dashed border-slate-200 rounded-2xl hover:border-gold-500 hover:bg-gold-50/30 transition-all group">
              <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-white">
                <Package className="w-6 h-6 text-slate-400 group-hover:text-gold-500" />
              </div>
              <span className="text-sm font-semibold text-slate-600 group-hover:text-gold-600">Add Product</span>
            </button>
            <button className="flex flex-col items-center gap-3 p-4 border border-dashed border-slate-200 rounded-2xl hover:border-gold-500 hover:bg-gold-50/30 transition-all group">
              <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-white">
                <Layers className="w-6 h-6 text-slate-400 group-hover:text-gold-500" />
              </div>
              <span className="text-sm font-semibold text-slate-600 group-hover:text-gold-600">New Collection</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
