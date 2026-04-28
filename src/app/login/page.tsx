"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Loader2, Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Welcome back!");
      router.push("/");
      router.refresh(); // Refresh to update navbar state
    } catch (error: any) {
      toast.error(error.message || "Invalid login credentials");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all text-foreground placeholder-muted-foreground/50";

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-4 py-32 bg-gradient-hero relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-primary/5 rounded-full blur-3xl pointer-events-none -translate-x-1/3 translate-y-1/3" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-card/80 backdrop-blur-xl border border-gold/20 rounded-3xl p-8 shadow-elegant relative z-10"
        >
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl text-foreground mb-2">Welcome <span className="italic text-gold-gradient">Back</span></h1>
            <p className="text-muted-foreground text-sm">Log in to your Swastik Gold Luxe account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-muted-foreground ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass} 
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs uppercase tracking-wider text-muted-foreground">Password</label>
                <Link href="#" className="text-xs text-primary hover:text-gold-deep transition-colors">Forgot?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass} 
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 bg-gradient-primary text-primary-foreground rounded-xl font-medium tracking-wide shadow-soft hover:shadow-elegant transition-all disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Log In"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground border-t border-border/50 pt-6">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary hover:text-gold-deep transition-colors font-medium underline-offset-4 hover:underline">
              Register now
            </Link>
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </main>
  );
}
