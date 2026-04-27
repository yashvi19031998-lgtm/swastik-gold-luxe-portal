"use client";
import { motion } from "framer-motion";
import { Heart, Eye } from "lucide-react";
import Link from "next/link";
import type { Product } from "@/data/products";
import { useState } from "react";

export const ProductCard = ({ product, onQuickView }: { product: Product; onQuickView?: (p: Product) => void }) => {
  const [wish, setWish] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.6 }}
      className="group relative bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elegant transition-all duration-700 hover:-translate-y-1"
    >
      <Link href={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-secondary/40">
        <img
          src={typeof product.image === "string" ? product.image : (product.image as any).src}
          alt={`${product.name} — ${product.purity} wholesale gold jewellery`}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {product.newArrival && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] tracking-widest uppercase bg-gradient-gold text-gold-foreground rounded-full shadow-soft">
            New
          </span>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            setWish((v) => !v);
          }}
          aria-label="Wishlist"
          className="absolute top-3 right-3 h-9 w-9 rounded-full bg-background/90 backdrop-blur flex items-center justify-center shadow-soft hover:scale-110 transition-transform"
        >
          <Heart size={16} className={wish ? "fill-primary text-primary" : "text-foreground/60"} />
        </button>
        {onQuickView && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onQuickView(product);
            }}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/95 backdrop-blur text-xs tracking-wide text-foreground shadow-soft"
          >
            <Eye size={14} /> Quick Quote
          </button>
        )}
      </Link>
      <Link href={`/product/${product.id}`} className="block p-4">
        <div className="text-[10px] tracking-[0.25em] uppercase text-gold-deep mb-1.5">
          {product.category} · {product.purity}
        </div>
        <h3 className="font-serif text-lg leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {product.name}
        </h3>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{product.weight}g</span>
          <span className="text-sm font-medium text-primary">₹{product.price.toLocaleString("en-IN")}</span>
        </div>
      </Link>
    </motion.div>
  );
};

