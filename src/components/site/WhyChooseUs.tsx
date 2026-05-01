"use client";

import { motion } from "framer-motion";
import { ShieldCheck, BadgeIndianRupee, Truck, Award, Sparkles } from "lucide-react";

const items = [
  { icon: ShieldCheck, title: "BIS Hallmarked Gold", desc: "We only sell BIS Hallmarked gold, ensuring 100% purity and complete trust for your business." },
  { icon: BadgeIndianRupee, title: "Wholesale Price", desc: "Buy directly from us at factory prices to save more and earn better profits for your shop." },
  { icon: Truck, title: "Fast & Safe Delivery", desc: "We deliver your jewellery safely all over India with full insurance and secure packaging." },
  { icon: Award, title: "5+ Years of Trust", desc: "Serving jewellery showrooms with a focus on honesty, quality, and long-term relationship." },
  { icon: Sparkles, title: "Make Custom Jewellery", desc: "We can make any gold jewellery design exactly as you want, tailored to your customers' needs." },
  { icon: ShieldCheck, title: "Best Quality & Great Support", desc: "We provide high-quality product photos and marketing support to grow your jewellery business faster." },
];

export const WhyChooseUs = () => (
  <section className="py-28 bg-background relative">
    <div className="container-luxe">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-2xl mx-auto"
      >
        <div className="text-xs tracking-[0.3em] uppercase text-gold-deep mb-4">
          The Swastik Difference
        </div>
        <h2 className="font-serif text-4xl md:text-5xl text-foreground">
          Why Wholesalers <span className="italic text-gold-gradient">Choose Us</span>
        </h2>
        <div className="gold-divider w-24 mx-auto mt-6" />
      </motion.div>

      <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((it, i) => (
          <motion.div
            key={it.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: i * 0.08 }}
            className="group relative p-8 rounded-2xl bg-card border border-border/60 shadow-card hover:shadow-elegant hover:-translate-y-1 hover:border-gold/50 transition-all duration-500 overflow-hidden"
          >
            <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-gold opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-700" />
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-primary-soft flex items-center justify-center mb-6 group-hover:bg-gradient-gold transition-all duration-500">
                <it.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors duration-500" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-2xl text-foreground mb-2">{it.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{it.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
