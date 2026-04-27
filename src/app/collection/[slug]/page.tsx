"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, redirect } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Filter, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { FloatingActions } from "@/components/site/FloatingActions";
import { ProductCard } from "@/components/site/ProductCard";
import { COLLECTIONS, getCollection, productsForCollection, PURITIES } from "@/data/products";

const CollectionDetail = () => {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const collection = getCollection(slug);
  const [purityFilter, setPurityFilter] = useState<string>("All");
  const [sort, setSort] = useState<"featured" | "low" | "high" | "weight">("featured");

  useEffect(() => {
    if (!collection) return;
    document.title = `${collection.name} — Swastik Gold`;
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [collection]);

  const products = useMemo(() => {
    if (!collection) return [];
    let list = productsForCollection(collection);
    if (purityFilter !== "All") list = list.filter((p) => p.purity === purityFilter);
    if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "weight") list = [...list].sort((a, b) => a.weight - b.weight);
    return list;
  }, [collection, purityFilter, sort]);

  if (!collection) return redirect("/collection");

  const related = COLLECTIONS.filter((c) => c.slug !== collection.slug).slice(0, 4);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <img src={typeof collection.img === "string" ? collection.img : (collection.img as any).src} alt="" className="w-full h-full object-cover scale-110 blur-2xl opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
        </div>
        <div className="container-luxe relative grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Link href="/collection" className="text-xs tracking-[0.3em] uppercase text-gold-deep hover:text-primary transition-colors">
              ← All Collections
            </Link>
            <h1 className="font-serif text-5xl md:text-6xl text-foreground leading-[1.05] mt-4">
              {collection.name.split(" ").slice(0, -1).join(" ")} <span className="italic text-gold-gradient">{collection.name.split(" ").slice(-1)}</span>
            </h1>
            <div className="gold-divider w-32 my-6" />
            <p className="text-lg text-muted-foreground max-w-md">{(collection as any).tagline || collection.desc}</p>
            <p className="mt-3 text-muted-foreground/80 max-w-md">{collection.desc}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <div className="px-4 py-2 rounded-full glass text-xs tracking-wider text-foreground/80 inline-flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-gold-deep" />
                {products.length} curated pieces
              </div>
              {(collection as any).categories?.slice(0, 3).map((c: string) => (
                <div key={c} className="px-4 py-2 rounded-full bg-primary-soft/60 text-xs tracking-wider text-primary">{c}</div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="relative">
            <div className="absolute -inset-6 bg-gradient-gold opacity-25 blur-3xl rounded-full" />
            <img src={typeof collection.img === "string" ? collection.img : (collection.img as any).src} alt={collection.name} loading="eager" className="relative rounded-3xl shadow-elegant w-full aspect-[4/3] object-cover" />
          </motion.div>
        </div>
      </section>

      {/* Toolbar */}
      <section className="sticky top-[68px] z-30 bg-background/90 backdrop-blur-md border-y border-border">
        <div className="container-luxe py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-gold-deep" />
            <span className="text-xs tracking-wider uppercase text-foreground/70 mr-2">Purity</span>
            {["All", ...PURITIES].map((p) => (
              <button
                key={p}
                onClick={() => setPurityFilter(p)}
                className={`px-4 py-1.5 rounded-full text-xs tracking-wider transition-all ${
                  purityFilter === p ? "bg-gradient-primary text-primary-foreground shadow-soft" : "bg-secondary text-foreground/70 hover:bg-secondary/70"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="px-4 py-2 rounded-full bg-secondary text-sm text-foreground/80 border border-border focus:outline-none focus:ring-2 focus:ring-gold/30"
          >
            <option value="featured">Sort: Featured</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="weight">Weight: Light to Heavy</option>
          </select>
        </div>
      </section>

      {/* Products */}
      <section className="py-16">
        <div className="container-luxe">
          {products.length === 0 ? (
            <div className="text-center py-24 glass rounded-3xl">
              <h3 className="font-serif text-2xl text-foreground">No pieces match this filter</h3>
              <p className="text-muted-foreground mt-2">Try a different purity or browse the full catalogue.</p>
              <Link href="/shop" className="inline-flex mt-6 px-6 py-2.5 rounded-full bg-gradient-primary text-primary-foreground text-sm">Browse Shop</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Related collections */}
      <section className="py-20 bg-secondary/40">
        <div className="container-luxe">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="text-xs tracking-[0.3em] uppercase text-gold-deep mb-3">You may also love</div>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground">Related <span className="italic text-gold-gradient">collections</span></h2>
            </div>
            <Link href="/collection" className="text-sm text-primary hover:text-gold-deep flex items-center gap-1">View all <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((c) => (
              <Link key={c.slug} href={`/collection/${c.slug}`} className="group relative rounded-2xl overflow-hidden shadow-card hover:shadow-elegant transition-all aspect-[4/5]">
                <img src={typeof c.img === "string" ? c.img : (c.img as any).src} alt={c.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/20 to-transparent" />
                <div className="relative h-full flex flex-col justify-end p-5">
                  <h3 className="font-serif text-xl text-primary-foreground">{c.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <FloatingActions />
    </main>
  );
};

export default CollectionDetail;
