"use client";
import { useMemo, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { FloatingActions } from "@/components/site/FloatingActions";
import { ProductCard } from "@/components/site/ProductCard";
import { QuoteDialog } from "@/components/site/QuoteDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES, GENDERS, PURITIES, PRICE_RANGES, PRODUCTS, type Product } from "@/data/products";
import { useSearchParams } from "next/navigation";

const PAGE_SIZE = 12;

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="border-b border-border/60 pb-5 mb-5">
    <h4 className="text-xs tracking-[0.25em] uppercase text-gold-deep mb-3">{title}</h4>
    <div className="space-y-2.5">{children}</div>
  </div>
);

const Toggle = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <label className="flex items-center gap-2.5 cursor-pointer text-sm text-foreground/80 hover:text-primary transition-colors">
    <Checkbox checked={checked} onCheckedChange={(v) => onChange(!!v)} />
    {label}
  </label>
);

const FiltersPanel = ({
  cats,
  setCats,
  genders,
  setGenders,
  purities,
  setPurities,
  prices,
  setPrices,
  reset,
}: any) => (
  <div>
    <div className="flex items-center justify-between mb-5">
      <h3 className="font-serif text-2xl text-foreground">Filters</h3>
      <button onClick={reset} className="text-xs text-primary hover:underline">Reset</button>
    </div>
    <Section title="Category">
      {CATEGORIES.map((c) => (
        <Toggle key={c} label={c} checked={cats.includes(c)} onChange={(v) => setCats(v ? [...cats, c] : cats.filter((x: string) => x !== c))} />
      ))}
    </Section>
    <Section title="Gender">
      {GENDERS.map((g) => (
        <Toggle key={g} label={g} checked={genders.includes(g)} onChange={(v) => setGenders(v ? [...genders, g] : genders.filter((x: string) => x !== g))} />
      ))}
    </Section>
    <Section title="Gold Purity">
      {PURITIES.map((p) => (
        <Toggle key={p} label={p} checked={purities.includes(p)} onChange={(v) => setPurities(v ? [...purities, p] : purities.filter((x: string) => x !== p))} />
      ))}
    </Section>
    <Section title="Price">
      {PRICE_RANGES.map((p) => (
        <Toggle key={p.label} label={p.label} checked={prices.includes(p.label)} onChange={(v) => setPrices(v ? [...prices, p.label] : prices.filter((x: string) => x !== p.label))} />
      ))}
    </Section>
  </div>
);

const Shop = () => {
  const params = useSearchParams();
  const initialCat = params.get("category");
  const [cats, setCats] = useState<string[]>(initialCat ? [initialCat] : []);
  const [genders, setGenders] = useState<string[]>([]);
  const [purities, setPurities] = useState<string[]>([]);
  const [prices, setPrices] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [quote, setQuote] = useState<Product | null>(null);

  const reset = () => {
    setCats([]); setGenders([]); setPurities([]); setPrices([]); setSearch("");
  };

  const filtered = useMemo(() => {
    let arr = PRODUCTS.filter((p) => {
      if (cats.length && !cats.includes(p.category)) return false;
      if (genders.length && !genders.includes(p.gender)) return false;
      if (purities.length && !purities.includes(p.purity)) return false;
      if (prices.length) {
        const ranges = PRICE_RANGES.filter((r) => prices.includes(r.label));
        if (!ranges.some((r) => p.price >= r.min && p.price < r.max)) return false;
      }
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.category.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
    if (sort === "price-asc") arr = [...arr].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") arr = [...arr].sort((a, b) => b.price - a.price);
    else if (sort === "trending") arr = [...arr].sort((a, b) => Number(!!b.trending) - Number(!!a.trending));
    else arr = [...arr].sort((a, b) => b.createdAt - a.createdAt);
    return arr;
  }, [cats, genders, purities, prices, search, sort]);

  const visible = filtered.slice(0, page * PAGE_SIZE);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-10 bg-gradient-hero">
        <div className="container-luxe">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="text-xs tracking-[0.3em] uppercase text-gold-deep mb-3">Wholesale Catalogue</div>
            <h1 className="font-serif text-4xl md:text-5xl text-foreground">Shop the <span className="italic text-gold-gradient">Collection</span></h1>
            <p className="mt-3 text-muted-foreground max-w-xl">Hallmarked gold jewellery crafted for retailers, resellers and bulk buyers.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-luxe grid lg:grid-cols-[260px_1fr] gap-10">
          {/* Sidebar */}
          <aside className="hidden lg:block sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
            <FiltersPanel {...{ cats, setCats, genders, setGenders, purities, setPurities, prices, setPrices, reset }} />
          </aside>

          {/* Main */}
          <div>
            {/* Top bar */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="relative flex-1 min-w-[200px]">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search jewellery..." className="pl-10 bg-card" />
              </div>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-[170px] bg-card"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="trending">Trending</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden gap-2"><SlidersHorizontal size={16} /> Filters</Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[320px] overflow-y-auto bg-background">
                  <FiltersPanel {...{ cats, setCats, genders, setGenders, purities, setPurities, prices, setPrices, reset }} />
                </SheetContent>
              </Sheet>
            </div>

            {/* Active chips */}
            {(cats.length + genders.length + purities.length + prices.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {[...cats, ...genders, ...purities, ...prices].map((t) => (
                  <span key={t} className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-soft text-primary text-xs rounded-full">
                    {t}
                    <button onClick={() => { setCats(cats.filter(x=>x!==t)); setGenders(genders.filter(x=>x!==t)); setPurities(purities.filter(x=>x!==t)); setPrices(prices.filter(x=>x!==t)); }}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="text-sm text-muted-foreground mb-4">{filtered.length} products</div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {visible.map((p) => (
                <ProductCard key={p.id} product={p} onQuickView={(prod) => setQuote(prod)} />
              ))}
            </div>

            {visible.length < filtered.length && (
              <div className="flex justify-center mt-12">
                <Button onClick={() => setPage((p) => p + 1)} className="bg-gradient-primary text-primary-foreground hover:shadow-elegant px-8">
                  Load More
                </Button>
              </div>
            )}
            {filtered.length === 0 && (
              <div className="text-center py-20 text-muted-foreground">No products match your filters.</div>
            )}
          </div>
        </div>
      </section>

      <Footer />
      <FloatingActions />
      <QuoteDialog open={!!quote} onOpenChange={(v) => !v && setQuote(null)} productName={quote?.name || ""} />
    </main>
  );
};

const ShopPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Shop />
    </Suspense>
  );
};

export default ShopPage;

