import { Suspense } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { FloatingActions } from "@/components/site/FloatingActions";
import { ShopContent } from "../../components/site/ShopContent";
import { createClient } from "@/lib/supabase/server";
import { type Product } from "@/data/products";

// Static Motion Wrapper because motion needs a client component, but we can wrap parts of it
import { ShopHeader } from "../../components/site/ShopHeader";


export default async function ShopPage() {
  const supabase = createClient();

  // Fetch products on the server
  const { data, error } = await supabase.from('products').select('*, categories(name)');

  let initialProducts: Product[] = [];
  if (data && !error) {
    initialProducts = data.map((p: any) => ({
      id: p.id,
      sku: `SG-${p.id?.substring(0, 4) || '1000'}`,
      name: p.name,
      category: p.categories?.name || 'Uncategorized',
      gender: 'Ladies Jewellery', // Default fallback
      purity: '22Kt', // Default fallback
      weight: 10,
      stones: 'None',
      price: p.price || 0,
      image: p.image_url || 'https://images.unsplash.com/photo-1599643478514-4a7f0528e578?w=800&q=80',
      trending: false,
      newArrival: true,
      createdAt: new Date(p.created_at || Date.now()).getTime(),
    }));
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <ShopHeader />

      <section className="py-12">
        <Suspense fallback={null}>
          <ShopContent initialProducts={initialProducts} />
        </Suspense>
      </section>

      <Footer />
      <FloatingActions />
    </main>
  );
}
