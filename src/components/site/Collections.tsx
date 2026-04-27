"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import necklaces from "@/assets/collection-necklaces.jpg";
import rings from "@/assets/collection-rings.jpg";
import earrings from "@/assets/collection-earrings.jpg";
import bangles from "@/assets/collection-bangles.jpg";
import chains from "@/assets/collection-chains.jpg";

const items = [
  { name: "Necklace", desc: "Statement pieces & bridal sets", img: necklaces, span: "lg:col-span-2 lg:row-span-2" },
  { name: "Rings", desc: "Solitaires, bands & cocktail", img: rings, span: "" },
  { name: "Earrings", desc: "Studs, jhumkas & danglers", img: earrings, span: "" },
  { name: "Bangles", desc: "Traditional & contemporary", img: bangles, span: "" },
  { name: "Chain", desc: "Daily wear & ceremonial", img: chains, span: "" },
];

export const Collections = () => (
  <section id="collections" className="py-28 bg-secondary/40 relative overflow-hidden">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60rem] h-[60rem] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
    <div className="container-luxe relative">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14"
      >
        <div>
          <div className="text-xs tracking-[0.3em] uppercase text-gold-deep mb-4">Featured Collections</div>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground max-w-xl">
            Crafted with <span className="italic text-gold-gradient">passion</span>,<br />
            curated for connoisseurs.
          </h2>
        </div>
        <Link
          href="/collection"
          className="self-start md:self-end inline-flex items-center text-sm tracking-wider text-primary hover:text-gold-deep transition-colors group"
        >
          View Full Catalogue
          <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[18rem] gap-5">
        {items.map((it, i) => (
          <motion.div
            key={it.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: i * 0.08 }}
            className={`group relative rounded-2xl overflow-hidden shadow-card hover:shadow-elegant transition-all duration-700 ${it.span} ${i === 0 ? "min-h-[24rem]" : "min-h-[18rem]"}`}
          >
            <Link href={`/shop?category=${encodeURIComponent(it.name)}`} className="absolute inset-0 z-10" aria-label={it.name} />
            <img
              src={typeof it.img === "string" ? it.img : (it.img as any).src}
              alt={`${it.name} - luxury wholesale gold jewellery`}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/20 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-500" />
            <div className="absolute inset-0 ring-1 ring-inset ring-gold/0 group-hover:ring-gold/40 transition-all duration-500" />
            <div className="relative h-full flex flex-col justify-end p-7">
              <div className="text-xs tracking-[0.25em] uppercase text-gold-soft/90 mb-1.5">{it.desc}</div>
              <h3 className="font-serif text-3xl md:text-4xl text-primary-foreground">{it.name}</h3>
              <div className="mt-4 flex items-center gap-2 text-sm text-primary-foreground/80 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                Explore Collection <span>→</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

