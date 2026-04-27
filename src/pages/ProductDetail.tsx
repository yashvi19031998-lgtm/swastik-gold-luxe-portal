import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MessageCircle, Share2, ShieldCheck, Award, Truck, Minus, Plus } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { FloatingActions } from "@/components/site/FloatingActions";
import { ProductCard } from "@/components/site/ProductCard";
import { QuoteDialog } from "@/components/site/QuoteDialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProduct, relatedProducts, PRODUCTS } from "@/data/products";
import { toast } from "@/hooks/use-toast";

const ProductDetail = () => {
  const { id } = useParams();
  const product = getProduct(id || "");
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [quote, setQuote] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    if (!product) return;
    document.title = `${product.name} — Swastik Gold Wholesale`;
    const stored = JSON.parse(localStorage.getItem("recently-viewed") || "[]") as string[];
    const next = [product.id, ...stored.filter((x) => x !== product.id)].slice(0, 8);
    localStorage.setItem("recently-viewed", JSON.stringify(next));
    setRecent(stored.filter((x) => x !== product.id).slice(0, 4));
    window.scrollTo(0, 0);
  }, [product?.id]);

  const related = useMemo(() => (product ? relatedProducts(product) : []), [product]);
  const recentProducts = useMemo(() => recent.map((rid) => PRODUCTS.find((p) => p.id === rid)).filter(Boolean), [recent]);

  if (!product) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="container-luxe py-40 text-center">
          <h1 className="font-serif text-4xl">Product not found</h1>
          <Link to="/shop" className="text-primary mt-4 inline-block">← Back to Shop</Link>
        </div>
        <Footer />
      </main>
    );
  }

  

  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: product.name, url: window.location.href });
      else {
        await navigator.clipboard.writeText(window.location.href);
        toast({ title: "Link copied" });
      }
    } catch {}
  };

  const whatsappText = encodeURIComponent(`Hello Swastik Gold, I'm interested in *${product.name}* (${product.sku}). Quantity: ${qty}.`);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-28 pb-16">
        <div className="container-luxe">
          <nav className="text-xs text-muted-foreground mb-6">
            <Link to="/" className="hover:text-primary">Home</Link> / <Link to="/shop" className="hover:text-primary">Shop</Link> / <span className="text-foreground">{product.category}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Gallery — 5 stylized views derived from the product image */}
            {(() => {
              const views = [
                { label: "Front", style: { transform: "scale(1)" } as const, filter: "none" },
                { label: "Detail", style: { transform: "scale(1.6) translate(-8%, -6%)" } as const, filter: "saturate(1.1) contrast(1.05)" },
                { label: "Angle", style: { transform: "scale(1.15) rotate(-4deg)" } as const, filter: "brightness(1.05)" },
                { label: "Macro", style: { transform: "scale(1.9) translate(10%, 8%)" } as const, filter: "saturate(1.15) contrast(1.08)" },
                { label: "Mood", style: { transform: "scale(1.1)" } as const, filter: "brightness(0.85) saturate(1.2) hue-rotate(-6deg)" },
              ];
              return (
                <div className="grid grid-cols-[80px_1fr] gap-4">
                  <div className="flex flex-col gap-3">
                    {views.map((v, i) => (
                      <button
                        key={i}
                        onClick={() => setActive(i)}
                        aria-label={`${v.label} view`}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${active === i ? "border-primary shadow-soft" : "border-border/40 opacity-70 hover:opacity-100"}`}
                      >
                        <img
                          src={product.image}
                          alt={`${product.name} ${v.label}`}
                          loading="lazy"
                          className="w-full h-full object-cover"
                          style={{ ...v.style, filter: v.filter }}
                        />
                        <span className="absolute bottom-0 inset-x-0 text-[8px] tracking-widest uppercase text-center py-0.5 bg-background/80 backdrop-blur-sm text-foreground/70">
                          {v.label}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary/40 shadow-card group">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={active}
                        src={product.image}
                        alt={`${product.name} — ${views[active].label} view`}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ ...views[active].style, filter: views[active].filter, transition: "transform 1s ease, filter 0.6s ease" }}
                      />
                    </AnimatePresence>
                    <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-gold text-gold-foreground text-[10px] tracking-widest uppercase rounded-full shadow-soft">
                      Hallmark Certified
                    </div>
                    <div className="absolute bottom-4 right-4 px-3 py-1 bg-background/85 backdrop-blur text-[10px] tracking-widest uppercase rounded-full text-foreground/80">
                      {views[active].label} View
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Details */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <div className="text-xs tracking-[0.3em] uppercase text-gold-deep mb-3">{product.category}</div>
              <h1 className="font-serif text-4xl md:text-5xl text-foreground leading-tight">{product.name}</h1>
              <div className="text-sm text-muted-foreground mt-2">SKU: {product.sku}</div>

              <div className="gold-divider my-6" />

              <dl className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
                <div><dt className="text-muted-foreground">Gold Purity</dt><dd className="font-medium text-foreground">{product.purity}</dd></div>
                <div><dt className="text-muted-foreground">Weight</dt><dd className="font-medium text-foreground">{product.weight} g</dd></div>
                <div><dt className="text-muted-foreground">Stones</dt><dd className="font-medium text-foreground">{product.stones}</dd></div>
                <div><dt className="text-muted-foreground">For</dt><dd className="font-medium text-foreground">{product.gender}</dd></div>
              </dl>

              <p className="mt-6 text-foreground/80 leading-relaxed">
                A masterfully crafted {product.category.toLowerCase()} from the {product.name.split(" ")[0]} series. Hand-finished in {product.purity} hallmarked gold, ideal for retailers seeking signature inventory pieces.
              </p>

              <div className="mt-7 flex items-end gap-4">
                <div>
                  <div className="text-xs text-muted-foreground">Wholesale Price (Indicative)</div>
                  <div className="font-serif text-3xl text-primary">₹{product.price.toLocaleString("en-IN")}</div>
                </div>
                <div className="ml-auto flex items-center border border-border rounded-full">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2 hover:text-primary"><Minus size={14} /></button>
                  <span className="px-3 text-sm w-10 text-center">{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)} className="px-3 py-2 hover:text-primary"><Plus size={14} /></button>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button onClick={() => setQuote(true)} className="bg-gradient-primary text-primary-foreground hover:shadow-elegant h-12 col-span-2">
                  Get Quote
                </Button>
                <a href={`https://wa.me/919876543210?text=${whatsappText}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 h-11 rounded-md border border-primary/30 text-primary hover:bg-primary-soft transition-colors">
                  <MessageCircle size={16} /> WhatsApp
                </a>
                <a href="tel:+919876543210" className="inline-flex items-center justify-center gap-2 h-11 rounded-md border border-primary/30 text-primary hover:bg-primary-soft transition-colors">
                  <Phone size={16} /> Call Now
                </a>
                <button onClick={share} className="col-span-2 inline-flex items-center justify-center gap-2 h-10 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Share2 size={14} /> Share Product
                </button>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-3 text-center">
                {[
                  { i: ShieldCheck, t: "BIS Hallmarked" },
                  { i: Award, t: "Trusted Wholesale" },
                  { i: Truck, t: "Pan-India Delivery" },
                ].map(({ i: Icon, t }) => (
                  <div key={t} className="p-3 rounded-xl bg-secondary/50 border border-border/60">
                    <Icon size={18} className="mx-auto text-gold-deep" />
                    <div className="text-[11px] mt-1.5 text-foreground/80">{t}</div>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-xs text-muted-foreground">Estimated dispatch: 3–5 business days</div>
            </motion.div>
          </div>

          {/* Tabs */}
          <div className="mt-20">
            <Tabs defaultValue="desc">
              <TabsList className="bg-secondary/60">
                <TabsTrigger value="desc">Description</TabsTrigger>
                <TabsTrigger value="spec">Specifications</TabsTrigger>
                <TabsTrigger value="care">Care Guide</TabsTrigger>
                <TabsTrigger value="ship">Shipping</TabsTrigger>
              </TabsList>
              <TabsContent value="desc" className="prose max-w-none mt-6 text-foreground/80 leading-relaxed">
                <p>The {product.name} is a refined expression of our atelier's craftsmanship. Each piece undergoes a 12-step quality process to ensure heirloom-grade finish. Ideal for showroom display and bulk reseller inventory.</p>
              </TabsContent>
              <TabsContent value="spec" className="mt-6">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-border">
                    {[
                      ["SKU", product.sku],
                      ["Category", product.category],
                      ["Gold Purity", product.purity],
                      ["Weight", `${product.weight} g`],
                      ["Stones", product.stones],
                      ["Gender", product.gender],
                      ["Hallmark", "BIS 916 Certified"],
                    ].map(([k, v]) => (
                      <tr key={k}><td className="py-3 text-muted-foreground w-1/3">{k}</td><td className="py-3 text-foreground">{v}</td></tr>
                    ))}
                  </tbody>
                </table>
              </TabsContent>
              <TabsContent value="care" className="mt-6 text-foreground/80 leading-relaxed">
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Store in a soft pouch to prevent scratches.</li>
                  <li>Avoid contact with perfumes and chemicals.</li>
                  <li>Clean with a soft microfiber cloth.</li>
                  <li>Periodic professional polishing recommended.</li>
                </ul>
              </TabsContent>
              <TabsContent value="ship" className="mt-6 text-foreground/80 leading-relaxed">
                <p>Insured pan-India shipping via certified logistics partners. Bulk orders ship in tamper-evident sealed cases with full GST invoice and hallmark certification.</p>
              </TabsContent>
            </Tabs>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-20">
              <h2 className="font-serif text-3xl text-foreground mb-6">Related <span className="italic text-gold-gradient">Pieces</span></h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {related.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          )}

          {/* Recently viewed */}
          {recentProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="font-serif text-3xl text-foreground mb-6">Recently <span className="italic text-gold-gradient">Viewed</span></h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {recentProducts.map((p: any) => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
      <FloatingActions />
      <QuoteDialog open={quote} onOpenChange={setQuote} productName={product.name} />
    </main>
  );
};

export default ProductDetail;
