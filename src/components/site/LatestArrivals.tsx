"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowUpRight, Sparkles, Diamond } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

// Import category defaults
import catAnklets from "@/assets/cat-anklets.jpg";
import catBracelet from "@/assets/cat-bracelet.jpg";
import catKada from "@/assets/cat-kada.jpg";
import catMangalsutra from "@/assets/cat-mangalsutra.jpg";
import catNosepin from "@/assets/cat-nosepin.jpg";
import catPendant from "@/assets/cat-pendant.jpg";
import catWatch from "@/assets/cat-watch.jpg";
import catBangles from "@/assets/collection-bangles.jpg";
import catChains from "@/assets/collection-chains.jpg";
import catEarrings from "@/assets/collection-earrings.jpg";
import catNecklaces from "@/assets/collection-necklaces.jpg";
import catRings from "@/assets/collection-rings.jpg";

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

const CATEGORY_DEFAULTS: Record<string, any> = {
  "anklets": catAnklets,
  "bracelet": catBracelet,
  "bracelets": catBracelet,
  "kada": catKada,
  "kadas": catKada,
  "mangalsutra": catMangalsutra,
  "nose-pin": catNosepin,
  "nosepin": catNosepin,
  "pendant": catPendant,
  "pendants": catPendant,
  "watch": catWatch,
  "watches": catWatch,
  "bangles": catBangles,
  "bangle": catBangles,
  "chain": catChains,
  "chains": catChains,
  "earrings": catEarrings,
  "earring": catEarrings,
  "necklace": catNecklaces,
  "necklaces": catNecklaces,
  "rings": catRings,
  "ring": catRings,
  "jewellery": catNecklaces, // Use necklaces as a general default
};

const getCategoryDefault = (catName: string) => {
  const slug = catName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  // Try exact match, then try singular/plural if needed
  let defaultImg = CATEGORY_DEFAULTS[slug];
  
  if (!defaultImg) {
    // Try without trailing 's' if it exists
    if (slug.endsWith('s')) {
      defaultImg = CATEGORY_DEFAULTS[slug.slice(0, -1)];
    } else {
      // Try with trailing 's'
      defaultImg = CATEGORY_DEFAULTS[slug + 's'];
    }
  }

  const finalImg = defaultImg || catNecklaces; // Fallback to necklaces if still nothing
  return typeof finalImg === 'string' ? finalImg : (finalImg as any).src;
};

export const LatestArrivals = () => {
  const [products, setProducts] = useState<LatestProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("products")
          .select("id, name, price, purity, categories(name), product_images(image_url)")
          .order("created_at", { ascending: false })
          .limit(5);

        if (error) throw error;

        let mapped: LatestProduct[] = ((data as SupabaseProduct[]) || []).map((p) => {
          const categoryName = Array.isArray(p.categories) ? p.categories[0]?.name ?? "Jewellery" : "Jewellery";
          const dbImage = Array.isArray(p.product_images) && p.product_images.length > 0 ? p.product_images[0]?.image_url : null;
          
          return {
            id: p.id,
            name: p.name,
            price: p.price,
            purity: p.purity,
            categoryName,
            imageUrl: dbImage || getCategoryDefault(categoryName),
          };
        });

        // If no data or less than 5, fill with professional defaults
        const DEFAULT_TITLES = ["Antique Necklace", "Bridal Bangles", "Gold Kada", "Temple Jewellery", "Designer Ring"];
        const DEFAULT_CATS = ["Necklace", "Bangles", "Kada", "Necklace", "Rings"];

        if (mapped.length === 0) {
          mapped = Array.from({ length: 5 }).map((_, i) => ({
            id: `default-${i}`,
            name: DEFAULT_TITLES[i],
            price: 45000 + (i * 15000),
            purity: "22Kt",
            categoryName: DEFAULT_CATS[i],
            imageUrl: getCategoryDefault(DEFAULT_CATS[i]),
          }));
        } else {
          while (mapped.length < 5) {
            const i = mapped.length;
            mapped.push({
              ...mapped[0],
              id: `placeholder-${i}`,
              name: DEFAULT_TITLES[i] || mapped[0].name,
              imageUrl: getCategoryDefault(DEFAULT_CATS[i] || mapped[0].categoryName),
            });
          }
        }

        setProducts(mapped);
      } catch (err) {
        console.error("Error fetching products:", err);
        // Fallback to 5 items on error
        const fallback = Array.from({ length: 5 }).map((_, i) => ({
          id: `fallback-${i}`,
          name: "Premium Jewellery",
          price: 50000,
          purity: "22Kt",
          categoryName: "Gold",
          imageUrl: PLACEHOLDER,
        }));
        setProducts(fallback);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  const slideNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % products.length);
  }, [products.length]);

  const slidePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  }, [products.length]);

  // Auto-slide
  useEffect(() => {
    if (loading || products.length === 0) return;
    const timer = setInterval(slideNext, 5000);
    return () => clearInterval(timer);
  }, [loading, products.length, slideNext]);

  if (loading) return (
    <div className="py-24 bg-brand-dark flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
    </div>
  );

  if (products.length === 0) return null;

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? 45 : -45,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      zIndex: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 500 : -500,
      opacity: 0,
      scale: 0.8,
      rotateY: direction < 0 ? 45 : -45,
      zIndex: 0,
    }),
  };

  return (
    <section className="py-28 bg-brand-dark relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(191,149,63,0.08)_0%,transparent_70%)]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
      </div>

      <div className="container-luxe relative">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 mb-6"
          >
            <Diamond className="w-3.5 h-3.5 text-gold animate-pulse" />
            <span className="text-[11px] tracking-[0.3em] uppercase text-gold font-bold">New Collection</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-7xl text-white mb-6"
          >
            Latest from our <span className="italic text-gold-gradient">Atelier</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 max-w-2xl mx-auto text-lg"
          >
            Discover our newest masterpieces, where every piece is handcrafted to perfection.
            A blend of heritage artistry and modern elegance.
          </motion.p>
        </div>

        {/* Carousel Container */}
        <div className="relative h-[500px] md:h-[650px] w-full max-w-5xl mx-auto flex items-center justify-center">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.4 },
                scale: { duration: 0.6 },
                rotateY: { duration: 0.6 }
              }}
              className="absolute w-full h-full"
            >
              <div className="grid lg:grid-cols-2 gap-12 items-center h-full">
                {/* Product Image with 3D effect */}
                <div className="relative aspect-[4/5] md:aspect-square rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl group">
                  <img
                    src={products[currentIndex].imageUrl}
                    alt={`${products[currentIndex].name} — ${products[currentIndex].categoryName} by Swastik Gold`}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent" />

                  {/* Floating price badge */}
                  <div className="absolute top-8 right-8 px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl">
                    <span className="text-gold font-serif text-2xl">₹{products[currentIndex].price.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* Product Details */}
                <div className="space-y-8 text-left">
                  <div className="space-y-4">
                    <span className="text-gold tracking-[0.4em] uppercase text-xs font-bold block">{products[currentIndex].categoryName}</span>
                    <h3 className="text-4xl md:text-6xl font-serif text-white leading-tight">{products[currentIndex].name}</h3>
                    <div className="flex items-center gap-4">
                      <div className="h-px w-12 bg-gold/50" />
                      <span className="text-slate-400 italic text-xl font-serif">{products[currentIndex].purity} Purity</span>
                    </div>
                  </div>

                  <p className="text-slate-400 text-lg leading-relaxed">
                    This exquisite piece is a testament to our artisans' skill.
                    Featuring intricate detailing and the finest 100% BIS Hallmarked gold.
                  </p>

                  <div className="flex flex-wrap gap-6 pt-4">
                    <Link
                      href={`/product/${products[currentIndex].id}`}
                      className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-gold text-brand-dark font-bold rounded-2xl shadow-gold hover:-translate-y-1 transition-all group"
                    >
                      View Details
                      <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Link>
                    <Link
                      href="/shop"
                      className="inline-flex items-center gap-3 px-10 py-5 border border-gold/30 text-gold hover:bg-gold/5 rounded-2xl transition-all"
                    >
                      Explore All
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-8 z-20">
            <button
              onClick={slidePrev}
              className="w-16 h-16 rounded-full border border-gold/20 flex items-center justify-center text-gold hover:bg-gold hover:text-brand-dark transition-all shadow-soft"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <div className="flex gap-3">
              {products.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > currentIndex ? 1 : -1);
                    setCurrentIndex(i);
                  }}
                  className={`h-2 rounded-full transition-all duration-500 ${i === currentIndex ? "w-12 bg-gold" : "w-2 bg-gold/20"
                    }`}
                />
              ))}
            </div>

            <button
              onClick={slideNext}
              className="w-16 h-16 rounded-full border border-gold/20 flex items-center justify-center text-gold hover:bg-gold hover:text-brand-dark transition-all shadow-soft"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
