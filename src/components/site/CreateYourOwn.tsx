import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

const schema = z.object({
  productType: z.string().trim().min(2, "Select a product type").max(60),
  weight: z.string().trim().min(1, "Enter approx. weight").max(30),
  designIdea: z.string().trim().min(5, "Tell us a bit more about the design").max(600),
  budget: z.string().trim().min(1, "Enter your budget").max(40),
  contact: z.string().trim().regex(/^[+0-9\s\-()]{7,20}$/, "Enter a valid contact number"),
});

const productTypes = ["Necklace", "Ring", "Earrings", "Bangles", "Chain", "Pendant", "Bracelet"];

export const CreateYourOwn = () => {
  const [form, setForm] = useState({ productType: "", weight: "", designIdea: "", budget: "", contact: "" });
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) {
      toast.error(r.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Inquiry received — our atelier will contact you within 24 hours.");
      setForm({ productType: "", weight: "", designIdea: "", budget: "", contact: "" });
      setSubmitting(false);
    }, 700);
  };

  const input = "w-full px-5 py-3.5 rounded-xl bg-background/70 border border-border focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all text-foreground placeholder:text-muted-foreground/70";

  return (
    <section id="custom" className="py-28 bg-background relative overflow-hidden">
      <div className="absolute -left-40 top-1/3 w-[30rem] h-[30rem] rounded-full bg-gold/10 blur-3xl pointer-events-none" />
      <div className="container-luxe relative grid lg:grid-cols-5 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-2"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-6">
            <Sparkles className="w-3.5 h-3.5 text-gold-deep" />
            <span className="text-xs tracking-[0.2em] uppercase text-foreground/70">Bespoke Atelier</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground leading-tight">
            Create Your Own <br />
            <span className="italic text-gold-gradient">Signature Piece</span>
          </h2>
          <div className="gold-divider w-24 my-6" />
          <p className="text-muted-foreground leading-relaxed text-lg max-w-md">
            Bring your vision to life. Share your design idea, weight and budget — our master craftsmen will translate it into a handcrafted masterpiece for your retail collection.
          </p>
          <ul className="mt-8 space-y-3">
            {["Dedicated design consultant", "CAD preview before crafting", "Bulk customisation available"].map((f) => (
              <li key={f} className="flex items-center gap-3 text-foreground/80">
                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                {f}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="lg:col-span-3 glass rounded-3xl p-8 md:p-10 shadow-elegant border border-gold/20"
        >
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs tracking-wider uppercase text-foreground/70 mb-2 block">Product Type</label>
              <select
                className={input}
                value={form.productType}
                onChange={(e) => setForm({ ...form, productType: e.target.value })}
              >
                <option value="">Select a product</option>
                {productTypes.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs tracking-wider uppercase text-foreground/70 mb-2 block">Approx. Weight</label>
              <input
                className={input}
                placeholder="e.g. 25 grams"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
                maxLength={30}
              />
            </div>
            <div>
              <label className="text-xs tracking-wider uppercase text-foreground/70 mb-2 block">Budget (₹)</label>
              <input
                className={input}
                placeholder="e.g. ₹1,50,000"
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
                maxLength={40}
              />
            </div>
            <div>
              <label className="text-xs tracking-wider uppercase text-foreground/70 mb-2 block">Contact Number</label>
              <input
                className={input}
                placeholder="+91 98765 43210"
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
                maxLength={20}
              />
            </div>
          </div>
          <div className="mt-5">
            <label className="text-xs tracking-wider uppercase text-foreground/70 mb-2 block">Design Idea</label>
            <textarea
              className={`${input} min-h-[140px] resize-none`}
              placeholder="Describe the design you envision — patterns, stones, references..."
              value={form.designIdea}
              onChange={(e) => setForm({ ...form, designIdea: e.target.value })}
              maxLength={600}
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="mt-7 w-full sm:w-auto inline-flex items-center justify-center px-10 py-4 rounded-full bg-gradient-primary text-primary-foreground tracking-wide shadow-soft hover:shadow-elegant hover:-translate-y-0.5 transition-all duration-500 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Sending..." : "Submit Design Inquiry"}
          </button>
        </motion.form>
      </div>
    </section>
  );
};
