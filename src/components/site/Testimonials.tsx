import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const reviews = [
  {
    name: "Rajesh Mehta",
    role: "Mehta Jewellers, Jaipur",
    text: "Swastik Gold has been our trusted wholesale partner for over a decade. Their craftsmanship and consistency are unmatched in the trade.",
  },
  {
    name: "Anita Sharma",
    role: "Shree Gold Boutique, Surat",
    text: "The hallmarked purity and elegant designs make every collection a hit with our customers. Truly a partner who understands retail.",
  },
  {
    name: "Vikram Singh",
    role: "Royal Ornaments, Delhi",
    text: "From custom bridal sets to bulk daily-wear chains, the team delivers with precision and on time. Our preferred manufacturer.",
  },
];

export const Testimonials = () => (
  <section className="py-28 bg-gradient-to-b from-background to-secondary/30">
    <div className="container-luxe">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-2xl mx-auto"
      >
        <div className="text-xs tracking-[0.3em] uppercase text-gold-deep mb-4">Testimonials</div>
        <h2 className="font-serif text-4xl md:text-5xl text-foreground">
          Loved by India's <span className="italic text-gold-gradient">Finest Jewellers</span>
        </h2>
        <div className="gold-divider w-24 mx-auto mt-6" />
      </motion.div>

      <div className="mt-16 grid md:grid-cols-3 gap-6">
        {reviews.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: i * 0.1 }}
            className="relative p-8 rounded-2xl bg-card border border-border/60 shadow-card hover:shadow-elegant hover:-translate-y-1 transition-all duration-500"
          >
            <Quote className="w-10 h-10 text-gold/40 mb-4" strokeWidth={1.5} />
            <p className="text-foreground/85 leading-relaxed font-light italic">"{r.text}"</p>
            <div className="mt-6 pt-6 border-t border-border/60">
              <div className="font-serif text-xl text-primary">{r.name}</div>
              <div className="text-sm text-muted-foreground tracking-wide">{r.role}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
