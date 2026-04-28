"use client";

import { motion } from "framer-motion";

export const ShopHeader = () => {
  return (
    <section className="pt-32 pb-10 bg-gradient-hero">
      <div className="container-luxe">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="text-xs tracking-[0.3em] uppercase text-gold-deep mb-3">Wholesale Catalogue</div>
          <h1 className="font-serif text-4xl md:text-5xl text-foreground">Shop the <span className="italic text-gold-gradient">Collection</span></h1>
          <p className="mt-3 text-muted-foreground max-w-xl">Hallmarked gold jewellery crafted for retailers, resellers and bulk buyers.</p>
        </motion.div>
      </div>
    </section>
  );
};
