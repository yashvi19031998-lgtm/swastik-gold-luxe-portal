"use client";

import { useEffect, useState } from "react";
import { Bell, Search, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function AdminTopbar() {
  const [profile, setProfile] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchAdminProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('full_name, role')
          .eq('id', session.user.id)
          .single();
        
        if (data) setProfile(data);
        else setProfile({ full_name: session.user.email?.split('@')[0], role: 'admin' });
      }
    };
    fetchAdminProfile();
  }, [supabase]);

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="relative w-96">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" />
        </span>
        <input
          type="text"
          placeholder="Search products, orders..."
          className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="h-8 w-px bg-slate-200 mx-1"></div>
        <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1.5 pr-3 rounded-full transition-colors">
          <div className="flex flex-col items-end">
            <span className="text-sm font-semibold text-slate-700 capitalize">
              {profile?.full_name || 'Loading...'}
            </span>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
              {profile?.role || 'Admin'}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold-deep font-bold">
            {profile?.full_name?.charAt(0) || <User className="w-5 h-5" />}
          </div>
        </div>
      </div>
    </header>
  );
}
