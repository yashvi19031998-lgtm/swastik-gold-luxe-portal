"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MessageCircle, Share2, ShieldCheck, Award, Truck, Minus, Plus, Loader2 } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { FloatingActions } from "@/components/site/FloatingActions";
import { QuoteDialog } from "@/components/site/QuoteDialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/hooks/use-toast";

const PLACEHOLDER = "https://images.unsplash.com/photo-1599643478514-4a7f0528e578?w=800&q=80";

interface DBProduct {
  id: string;
  name: string;
  price: number;
  description: string | null;
  gender: string;
  purity: string;
  created_at: string;
  categories: { name: string } | null;
  product_images: { image_url: string }[];
}

const views = [
  { label: "Front", style: { transform: "scale(1)" } as const, filter: "none" },
  { label: "Detail", style: { transform: "scale(1.6) translate(-8%, -6%)" } as const, filter: "saturate(1.1) contrast(1.05)" },
  { label: "Angle", style: { transform: "scale(1.15) rotate(-4deg)" } as const, filter: "brightness(1.05)" },
  { label: "Macro", style: { transform: "scale(1.9) translate(10%, 8%)" } as const, filter: "saturate(1.15) contrast(1.08)" },
  { label: "Mood", style: { transform: "scale(1.1)" } as const, filter: "brightness(0.85) saturate(1.2) hue-rotate(-6deg)" },
];

const ProductDetail = () => {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";

  const [product, setProduct] = useState<DBProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [quote, setQuote] = useState(false);

  /* ── Fetch from Supabase ── */
  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("products")
        .select(`
          id, name, price, description, gender, purity, created_at,
          categories ( name ),
          product_images ( image_url )
        `)
        .eq("id", id)
        .single();

      if (error || !data) {
        setProduct(null);
      } else {
        // Supabase returns categories as array when using joins — normalise
        const raw = data as any;
        const normalised: DBProduct = {
          ...raw,
          categories: Array.isArray(raw.categories)
            ? raw.categories[0] ?? null
            : raw.categories,
          product_images: Array.isArray(raw.product_images) ? raw.product_images : [],
        };
        setProduct(normalised);
        document.title = `${normalised.name} — Swastik Gold Wholesale`;
        window.scrollTo(0, 0);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  /* ── Share helper ── */
  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: product?.name, url: window.location.href });
      else {
        await navigator.clipboard.writeText(window.location.href);
        toast({ title: "Link copied" });
      }
    } catch { }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-60">
          <Loader2 className="w-10 h-10 animate-spin text-gold" />
        </div>
        <Footer />
      </main>
    );
  }

  /* ── Not Found ── */
  if (!product) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="container-luxe py-40 text-center">
          <h1 className="font-serif text-4xl">Product not found</h1>
          <Link href="/shop" className="text-primary mt-4 inline-block">← Back to Shop</Link>
        </div>
        <Footer />
      </main>
    );
  }

  /* ── Derived values ── */
  const images = product.product_images.length > 0
    ? product.product_images.map((i) => i.image_url)
    : [PLACEHOLDER];
  // For the 5-view gallery we always use the first (primary) image with CSS transforms
  const primaryImg = images[0];
  const category = product.categories?.name ?? "Jewellery";
  const sku = `SG-${product.id.substring(0, 8).toUpperCase()}`;
  const whatsappText = encodeURIComponent(
    `Hello Swastik Gold, I'm interested in *${product.name}* (${sku}). Quantity: ${qty}.`
  );

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-28 pb-16">
        <div className="container-luxe">
          {/* Breadcrumb */}
          <nav className="text-xs text-muted-foreground mb-6">
            <Link href="/" className="hover:text-primary">Home</Link>
            {" / "}
            <Link href="/shop" className="hover:text-primary">Shop</Link>
            {" / "}
            <span className="text-foreground">{category}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* ── Gallery ── */}
            <div className="grid grid-cols-[80px_1fr] gap-4">
              {/* Thumbnails — real images if multiple, else 5 CSS-transform views of primary */}
              <div className="flex flex-col gap-3">
                {images.length > 1
                  ? images.slice(0, 5).map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      aria-label={`Image ${i + 1}`}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${active === i ? "border-primary shadow-soft" : "border-border/40 opacity-70 hover:opacity-100"
                        }`}
                    >
                      <img src={src} alt="" loading="lazy" className="w-full h-full object-cover" />
                    </button>
                  ))
                  : views.map((v, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      aria-label={`${v.label} view`}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${active === i ? "border-primary shadow-soft" : "border-border/40 opacity-70 hover:opacity-100"
                        }`}
                    >
                      <img
                        src={primaryImg}
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

              {/* Main image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary/40 shadow-card group">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={active}
                    src={images.length > 1 ? images[active] : primaryImg}
                    alt={product.name}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={
                      images.length === 1
                        ? { ...views[active].style, filter: views[active].filter, transition: "transform 1s ease, filter 0.6s ease" }
                        : {}
                    }
                  />
                </AnimatePresence>
                <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-gold text-gold-foreground text-[10px] tracking-widest uppercase rounded-full shadow-soft">
                  Hallmark Certified
                </div>
                {images.length === 1 && (
                  <div className="absolute bottom-4 right-4 px-3 py-1 bg-background/85 backdrop-blur text-[10px] tracking-widest uppercase rounded-full text-foreground/80">
                    {views[active].label} View
                  </div>
                )}
              </div>
            </div>

            {/* ── Details ── */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <div className="text-xs tracking-[0.3em] uppercase text-gold-deep mb-3">{category}</div>
              <h1 className="font-serif text-4xl md:text-5xl text-foreground leading-tight">{product.name}</h1>
              <div className="text-sm text-muted-foreground mt-2">SKU: {sku}</div>

              <div className="gold-divider my-6" />

              <dl className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
                <div><dt className="text-muted-foreground">Gold Purity</dt><dd className="font-medium text-foreground">{product.purity}</dd></div>
                <div><dt className="text-muted-foreground">For</dt><dd className="font-medium text-foreground">{product.gender}</dd></div>
                <div><dt className="text-muted-foreground">Category</dt><dd className="font-medium text-foreground">{category}</dd></div>
                <div><dt className="text-muted-foreground">Hallmark</dt><dd className="font-medium text-foreground">BIS Certified</dd></div>
              </dl>

              {product.description && (
                <p className="mt-6 text-foreground/80 leading-relaxed">{product.description}</p>
              )}

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
                <a href={`https://wa.me/919974878332?text=${whatsappText}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 h-11 rounded-md border border-primary/30 text-primary hover:bg-primary-soft transition-colors">
                  <MessageCircle size={16} /> WhatsApp
                </a>
                <a href="tel:+919974878332" className="inline-flex items-center justify-center gap-2 h-11 rounded-md border border-primary/30 text-primary hover:bg-primary-soft transition-colors">
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

          {/* ── Tabs ── */}
          <div className="mt-20">
            <Tabs defaultValue="desc">
              <TabsList className="bg-secondary/60">
                <TabsTrigger value="desc">Description</TabsTrigger>
                <TabsTrigger value="spec">Specifications</TabsTrigger>
                <TabsTrigger value="care">Care Guide</TabsTrigger>
                <TabsTrigger value="ship">Shipping</TabsTrigger>
              </TabsList>
              <TabsContent value="desc" className="prose max-w-none mt-6 text-foreground/80 leading-relaxed">
                <p>{product.description || `The ${product.name} is a refined expression of our atelier's craftsmanship. Each piece undergoes a 12-step quality process to ensure heirloom-grade finish.`}</p>
              </TabsContent>
              <TabsContent value="spec" className="mt-6">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-border">
                    {[
                      ["SKU", sku],
                      ["Category", category],
                      ["Gold Purity", product.purity],
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
                <p>Insured pan-India shipping via certified logistics. Bulk orders ship in tamper-evident sealed cases with full GST invoice and hallmark certification.</p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingActions />
      <QuoteDialog open={quote} onOpenChange={setQuote} productName={product.name} />
    </main>
  );
};

export default ProductDetail;
