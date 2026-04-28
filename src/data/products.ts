import necklaces from "@/assets/collection-necklaces.jpg";
import rings from "@/assets/collection-rings.jpg";
import earrings from "@/assets/collection-earrings.jpg";
import bangles from "@/assets/collection-bangles.jpg";
import chains from "@/assets/collection-chains.jpg";
import anklets from "@/assets/cat-anklets.jpg";
import bracelet from "@/assets/cat-bracelet.jpg";
import mangalsutra from "@/assets/cat-mangalsutra.jpg";
import pendant from "@/assets/cat-pendant.jpg";
import nosepin from "@/assets/cat-nosepin.jpg";
import kada from "@/assets/cat-kada.jpg";
import watch from "@/assets/cat-watch.jpg";
import wedding from "@/assets/coll-wedding.jpg";
import engagement from "@/assets/coll-engagement.jpg";
import daily from "@/assets/coll-daily.jpg";

export const CATEGORY_IMAGES: Record<string, any> = {
  Anklets: anklets,
  Bangles: bangles,
  Bracelet: bracelet,
  Chain: chains,
  "Chain Pendant": pendant,
  "Chain Pendant Set": pendant,
  Earrings: earrings,
  Necklace: necklaces,
  "Nose Pin": nosepin,
  "Pendant Set": pendant,
  Pendants: pendant,
  Rings: rings,
  Kada: kada,
  Mangalsutra: mangalsutra,
  Mala: chains,
  Watch: watch,
  Cufflink: kada,
  Coins: nosepin,
  "Kids Jewellery": bracelet,
};

export const CATEGORIES = Object.keys(CATEGORY_IMAGES);
export const GENDERS = ["Ladies Jewellery", "Mens Jewellery", "Couple Jewellery", "Kids Jewellery", "Unisex"] as const;
export const PURITIES = ["24Kt", "22Kt", "18Kt"] as const;
export const PRICE_RANGES = [
  { label: "Upto ₹10,000", min: 0, max: 10000 },
  { label: "₹10K to ₹25K", min: 10000, max: 25000 },
  { label: "₹25K to ₹50K", min: 25000, max: 50000 },
  { label: "₹50K to ₹1 Lakh", min: 50000, max: 100000 },
  { label: "Above ₹1 Lakh", min: 100000, max: Infinity },
] as const;

export type Product = {
  id: string;
  sku: string;
  name: string;
  category: string;
  gender: (typeof GENDERS)[number];
  purity: (typeof PURITIES)[number];
  weight: number; // grams
  stones: string;
  price: number;
  image: any;
  trending?: boolean;
  newArrival?: boolean;
  createdAt: number;
};

const adjectives = ["Royal", "Heritage", "Aurelia", "Celestial", "Imperial", "Maharani", "Vintage", "Eternal", "Regal", "Classic", "Opulent", "Lumière"];
const suffixes = ["Edition", "Series", "Heirloom", "Signature", "Crest", "Bloom", "Drape", "Glow"];

const rand = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

export const PRODUCTS: Product[] = (() => {
  const list: Product[] = [];
  const r = rand(7);
  let id = 1;
  CATEGORIES.forEach((cat, ci) => {
    const count = 4 + Math.floor(r() * 3);
    for (let i = 0; i < count; i++) {
      const purity = PURITIES[Math.floor(r() * PURITIES.length)];
      const gender =
        cat === "Kids Jewellery"
          ? "Kids Jewellery"
          : cat === "Cufflink" || cat === "Kada"
          ? "Mens Jewellery"
          : cat === "Mangalsutra" || cat === "Nose Pin"
          ? "Ladies Jewellery"
          : GENDERS[Math.floor(r() * GENDERS.length)];
      const weight = +(3 + r() * 30).toFixed(2);
      const basePrice = Math.round(weight * (purity === "24Kt" ? 7200 : purity === "22Kt" ? 6600 : 5400));
      const price = Math.round(basePrice / 500) * 500;
      list.push({
        id: `SG-${1000 + id}`,
        sku: `SG-${1000 + id}`,
        name: `${adjectives[(ci + i) % adjectives.length]} ${cat} ${suffixes[i % suffixes.length]}`,
        category: cat,
        gender,
        purity,
        weight,
        stones: r() > 0.6 ? "Diamond accents" : r() > 0.3 ? "Uncut polki" : "None",
        price,
        image: CATEGORY_IMAGES[cat],
        trending: r() > 0.7,
        newArrival: r() > 0.6,
        createdAt: Date.now() - Math.floor(r() * 1e10),
      });
      id++;
    }
  });
  return list;
})();

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);
export const relatedProducts = (p: Product, n = 4) =>
  PRODUCTS.filter((x) => x.category === p.category && x.id !== p.id).slice(0, n);

export const COLLECTIONS = [
  { slug: "daily-wear", name: "Daily Wear Jewellery", desc: "Lightweight pieces for everyday elegance", img: daily, tagline: "Effortless luxury for every day", categories: ["Chain", "Pendants", "Earrings", "Rings", "Bracelet"], maxWeight: 12 },
  { slug: "office-wear", name: "Office Wear Jewellery", desc: "Subtle sophistication for the workplace", img: chains, tagline: "Refined statements for the boardroom", categories: ["Chain", "Earrings", "Pendants", "Bracelet"], maxWeight: 10 },
  { slug: "wedding", name: "Wedding Collection", desc: "Heirloom bridal sets crafted to last generations", img: wedding, featured: true, tagline: "The bride's first heirloom", categories: ["Necklace", "Bangles", "Earrings", "Mangalsutra", "Kada"] },
  { slug: "engagement", name: "Engagement Ring Collection", desc: "Solitaires & halo rings for the moment", img: engagement, tagline: "A promise carved in gold", categories: ["Rings"] },
  { slug: "party-wear", name: "Party Wear", desc: "Statement jewellery for grand occasions", img: necklaces, tagline: "Make the night unforgettable", categories: ["Necklace", "Earrings", "Pendant Set"] },
  { slug: "festive", name: "Festive Collection", desc: "Auspicious designs for every celebration", img: earrings, tagline: "Celebrate tradition in gold", categories: ["Earrings", "Necklace", "Bangles", "Mangalsutra"] },
  { slug: "diamond", name: "Diamond Jewellery", desc: "Brilliant cuts in 18Kt gold", img: rings, tagline: "Brilliance, refined", categories: ["Rings", "Earrings", "Pendants", "Necklace"], stones: "Diamond accents" },
  { slug: "polki", name: "Real Polki Jewellery", desc: "Traditional uncut diamond artistry", img: mangalsutra, tagline: "Heritage in every stone", categories: ["Necklace", "Earrings", "Mangalsutra"], stones: "Uncut polki" },
  { slug: "anniversary", name: "Anniversary Gift", desc: "Timeless tokens of love", img: bracelet, tagline: "Mark the milestones in gold", categories: ["Bracelet", "Pendants", "Rings"] },
  { slug: "god-idol", name: "God Idol", desc: "Sacred gold idols & coins", img: nosepin, tagline: "Blessings cast in pure gold", categories: ["Coins"] },
  { slug: "valentine", name: "Valentine Collection", desc: "Romantic designs in rose gold", img: pendant, tagline: "Love, beautifully expressed", categories: ["Pendants", "Rings", "Bracelet"] },
  { slug: "italian", name: "Italian Collection", desc: "Sleek European-inspired chains", img: chains, tagline: "Continental sophistication", categories: ["Chain", "Bracelet"] },
  { slug: "antique", name: "Antique Collection", desc: "Vintage finishes & heritage motifs", img: bangles, tagline: "Old-world charm reborn", categories: ["Bangles", "Necklace", "Kada"] },
  { slug: "kids", name: "Kids Collection", desc: "Petite pieces for little ones", img: bracelet, tagline: "Tiny treasures, lasting memories", categories: ["Kids Jewellery", "Bracelet"] },
  { slug: "mothers-day", name: "Mother's Day Collection", desc: "Heartfelt gifts to celebrate her", img: pendant, tagline: "For the woman who gave you everything", categories: ["Pendants", "Bracelet", "Earrings"] },
];

export type Collection = (typeof COLLECTIONS)[number];

export const getCollection = (slug: string) => COLLECTIONS.find((c) => c.slug === slug);

export const productsForCollection = (c: Collection): Product[] => {
  return PRODUCTS.filter((p) => {
    const cats = (c as any).categories as string[] | undefined;
    const stones = (c as any).stones as string | undefined;
    const maxWeight = (c as any).maxWeight as number | undefined;
    if (cats && !cats.includes(p.category)) return false;
    if (stones && p.stones !== stones) return false;
    if (maxWeight && p.weight > maxWeight) return false;
    return true;
  });
};

