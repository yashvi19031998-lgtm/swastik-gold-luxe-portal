"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowUpRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface SupabaseProduct {
  id: string;
  name: string;
  price: number;
  purity: string;
  categories: { name: string }[] | null;
  product_images: { image_url: string }[] | null;
}

interface LatestProduct {
  id: string;
  name: string;
  price: number;
  purity: string;
  categoryName: string;
  imageUrl: string;
}

const PLACEHOLDER = "https://images.unsplash.com/photo-1599643478514-4a7f0528e578?w=800&q=80";

export const LatestArrivals = () => {
  const [products, setProducts] = useState<LatestProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("products")
        .select("id, name, price, purity, categories(name), product_images(image_url)")
        .order("created_at", { ascending: false })
        .limit(10);

      const mapped: LatestProduct[] = ((data as SupabaseProduct[]) || []).map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        purity: p.purity,
        categoryName: Array.isArray(p.categories) ? p.categories[0]?.name ?? "Jewellery" : "Jewellery",
        imageUrl: Array.isArray(p.product_images) ? p.product_images[0]?.image_url ?? PLACEHOLDER : PLACEHOLDER,
      }));

      setProducts(mapped);
      setLoading(false);
    };
    fetchLatest();
  }, []);

  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.clientWidth * 0.8;
      containerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      checkScroll();
    }
    return () => {
      el?.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [products]);

  if (loading) return null;
  if (products.length === 0) return null;

  return (
    <section className="py-24 bg-brand-dark relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container-luxe relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 mb-4">
              <Sparkles className="w-3 h-3 text-gold" />
              <span className="text-[10px] tracking-[0.2em] uppercase text-gold font-medium">New Arrivals</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-white leading-tight">
              Latest from our <span className="italic text-gold-gradient">Atelier</span>
            </h2>
            <p className="mt-4 text-slate-400 max-w-lg">
              Explore our most recent creations, where traditional craftsmanship meets contemporary design. Freshly hallmarked and ready for your collection.
            </p>
          </motion.div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
                canScrollLeft
                  ? "border-gold/40 text-gold hover:bg-gold hover:text-brand-dark"
                  : "border-slate-800 text-slate-600 cursor-not-allowed"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
                canScrollRight
                  ? "border-gold/40 text-gold hover:bg-gold hover:text-brand-dark"
                  : "border-slate-800 text-slate-600 cursor-not-allowed"
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={containerRef}
          className="flex gap-6 overflow-x-auto pb-12 hide-scrollbar snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product, i) => {
            const imgSrc = product.imageUrl;
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex-shrink-0 w-[280px] md:w-[320px] snap-start"
              >
                <Link href={`/product/${product.id}`} className="group block">
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 mb-4">
                    <img
                      src={imgSrc}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Hover Overlay Content */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                      <div className="w-12 h-12 rounded-full bg-gold text-brand-dark flex items-center justify-center shadow-elegant">
                        <ArrowUpRight className="w-6 h-6" />
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <span className="px-2.5 py-1 bg-brand-dark/60 backdrop-blur-md border border-white/10 rounded-full text-[9px] tracking-widest uppercase text-white font-medium">
                        {product.categoryName}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-serif text-lg group-hover:text-gold transition-colors truncate pr-4">
                        {product.name}
                      </h3>
                      <span className="text-gold font-medium">₹{product.price.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 text-[11px] tracking-wider uppercase">
                      <span>{product.categoryName}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-700" />
                      <span>{product.purity}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}

          {/* View More Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: products.length * 0.1 }}
            className="flex-shrink-0 w-[280px] md:w-[320px] snap-start"
          >
            <Link href="/shop" className="group block h-full">
              <div className="relative aspect-[4/5] rounded-2xl border-2 border-dashed border-gold/30 flex flex-col items-center justify-center text-center p-8 hover:border-gold hover:bg-gold/5 transition-all duration-500 h-[calc(100%-4rem)]">
                <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ChevronRight className="w-8 h-8 text-gold" />
                </div>
                <h3 className="font-serif text-2xl text-white mb-2">View All</h3>
                <p className="text-slate-500 text-sm">Discover our entire collection of premium pieces</p>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
