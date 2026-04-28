"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Loader2, User, Mail, Phone, LogOut, Package } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      
      setUser(session.user);
      
      // Fetch profile data
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      if (profileData) {
        setProfile(profileData);
      } else {
        // Fallback to metadata if table is not created yet
        setProfile({
          full_name: session.user.user_metadata?.full_name || 'Customer',
          phone: session.user.user_metadata?.phone || 'Not provided',
        });
      }
      
      setLoading(false);
    };

    fetchUser();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    router.push("/login");
    router.refresh();
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gold-deep" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-1 container-luxe py-32">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-10 pb-6 border-b border-border/50">
            <div className="w-16 h-16 rounded-full bg-gradient-gold/20 flex items-center justify-center text-2xl font-serif text-gold-deep border border-gold/30 shadow-soft">
              {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <div>
              <h1 className="text-3xl font-serif text-foreground">My <span className="italic text-gold-gradient">Profile</span></h1>
              <p className="text-muted-foreground mt-1">Manage your account and view orders</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              {/* Profile Details */}
              <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                <h3 className="text-lg font-medium mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-gold-deep" />
                  Personal Information
                </h3>
                
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Full Name</p>
                    <p className="font-medium text-foreground">{profile?.full_name || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Email Address</p>
                    <p className="font-medium text-foreground">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Phone Number</p>
                    <p className="font-medium text-foreground">{profile?.phone || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-border/50">
                  <button className="text-sm font-medium text-primary hover:text-gold-deep transition-colors px-4 py-2 rounded-lg border border-primary/20 hover:border-gold/50 bg-primary/5 hover:bg-gold/5">
                    Edit Details
                  </button>
                </div>
              </div>

              {/* Order History (Placeholder) */}
              <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                <h3 className="text-lg font-medium mb-6 flex items-center gap-2">
                  <Package className="w-5 h-5 text-gold-deep" />
                  Recent Inquiries
                </h3>
                <div className="text-center py-10">
                  <p className="text-muted-foreground text-sm">You haven't made any wholesale inquiries yet.</p>
                  <button className="mt-4 px-6 py-2 bg-gradient-primary text-primary-foreground rounded-full text-sm font-medium hover:shadow-elegant transition-shadow">
                    Browse Catalogue
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar actions */}
            <div className="space-y-4">
              <div className="bg-secondary/30 rounded-2xl p-6 border border-border">
                <h3 className="font-medium mb-4 text-foreground">Account Actions</h3>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between px-4 py-3 bg-card hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 border border-border rounded-xl transition-colors text-sm font-medium group"
                >
                  <span className="flex items-center gap-2">
                    <LogOut className="w-4 h-4 text-muted-foreground group-hover:text-destructive" />
                    Log Out
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
