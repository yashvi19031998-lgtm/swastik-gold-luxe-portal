"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  BadgePercent,
  Truck,
  ShieldCheck,
  Headphones,
  PackageCheck,
  ChevronDown,
  Gem,
  Star,
  Send,
  Loader2,
  Building2,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { FloatingActions } from "@/components/site/FloatingActions";

/* ─── Static Data ────────────────────────────────────────────── */
const benefits = [
  {
    icon: BadgePercent,
    title: "Competitive Wholesale Rates",
    desc: "Access special pricing tiers based on order volume — the more you buy, the better your margin.",
  },
  {
    icon: Truck,
    title: "Pan-India Delivery",
    desc: "Secure, insured shipping to any city in India. Orders dispatched within 2–3 working days.",
  },
  {
    icon: ShieldCheck,
    title: "BIS Hallmarked Gold",
    desc: "Every piece carries an official BIS Hallmark ensuring purity and compliance across 18Kt, 22Kt & 24Kt.",
  },
  {
    icon: PackageCheck,
    title: "No Minimum Quantity on Most Items",
    desc: "Start small or scale big — flexible MOQ policies designed for retailers of all sizes.",
  },
  {
    icon: Headphones,
    title: "Dedicated Account Manager",
    desc: "A single point of contact who understands your business and helps you curate the right catalogue.",
  },
  {
    icon: Gem,
    title: "Exclusive Designs First",
    desc: "Wholesale partners get early access to new arrivals and festival collections before they go public.",
  },
];

const steps = [
  { num: "01", title: "Submit Enquiry", desc: "Fill out the form below with your business details." },
  { num: "02", title: "Verification Call", desc: "Our team calls within 24 hours to understand your needs." },
  { num: "03", title: "Catalogue Access", desc: "Get access to our full wholesale catalogue with pricing." },
  { num: "04", title: "Place Your Order", desc: "Order seamlessly via WhatsApp, call or our portal." },
  { num: "05", title: "Delivery & Support", desc: "Receive insured delivery with continued account support." },
];

const faqs = [
  {
    q: "What is the minimum order value to become a wholesale partner?",
    a: "There is no fixed minimum order value for partnership registration. However, preferential pricing starts from orders of ₹1 Lakh and above. We work with jewellery shops of all scales.",
  },
  {
    q: "Do you offer credit / payment terms?",
    a: "Credit terms are available for verified partners with established trading history. Initial orders are typically on advance payment. Speak to your account manager for details.",
  },
  {
    q: "Can I get exclusive pieces not listed in the public catalogue?",
    a: "Yes. Wholesale partners can request custom or exclusive designs. Minimum quantities apply for bespoke production runs.",
  },
  {
    q: "Is there a registration or membership fee?",
    a: "No. Becoming a Swastik Gold wholesale partner is completely free. We earn when you earn.",
  },
  {
    q: "Do you ship outside India?",
    a: "Currently, we serve retailers across India. International wholesale enquiries are reviewed on a case-by-case basis. Please mention your requirement in the enquiry form.",
  },
];

/* ─── Component ──────────────────────────────────────────────── */
export default function WholesalePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({
    businessName: "",
    contactName: "",
    phone: "",
    email: "",
    city: "",
    annualTurnover: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Simulate API call — replace with your Supabase insert / email service
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);
    setSent(true);
  };

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative pt-36 pb-28 md:pt-48 md:pb-36 bg-brand-dark overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="container-luxe relative text-center max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/25 mb-6">
              <Star className="w-3.5 h-3.5 text-gold" />
              <span className="text-[11px] tracking-[0.22em] uppercase text-gold font-semibold">
                B2B Wholesale Partner Program
              </span>
            </div>

            <h1 className="font-serif text-5xl md:text-7xl text-white leading-[1.05] mb-6">
              Grow your jewellery{" "}
              <span className="italic text-gold-gradient">business with us</span>
            </h1>

            <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
              Join 200+ retail partners across India who trust Swastik Gold for BIS-hallmarked, competitively-priced
              wholesale jewellery — direct from our Ahmedabad atelier.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#enquiry"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-gold text-gold-foreground font-semibold text-sm tracking-wide shadow-gold hover:-translate-y-0.5 transition-all"
              >
                Become a Partner
              </a>
              <a
                href="tel:+919974878332"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-gold/30 text-gold hover:bg-gold/10 font-semibold text-sm tracking-wide transition-all"
              >
                <Phone className="w-4 h-4" />
                Call Us Now
              </a>
            </div>

            {/* Stats */}
            <div className="mt-14 grid grid-cols-3 gap-6 max-w-lg mx-auto">
              {[
                { val: "200+", label: "Retail Partners" },
                { val: "15+", label: "Categories" },
                { val: "Since 1998", label: "In Business" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="font-serif text-3xl text-gold">{s.val}</div>
                  <div className="text-[11px] text-slate-400 uppercase tracking-widest mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="py-24 bg-background">
        <div className="container-luxe">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <div className="text-xs tracking-[0.3em] uppercase text-gold-deep mb-3">Why Partner With Us</div>
            <h2 className="font-serif text-4xl md:text-5xl">
              Everything you need to{" "}
              <span className="italic text-gold-gradient">sell more gold</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group p-8 rounded-2xl bg-card border border-border hover:border-gold/40 hover:shadow-elegant transition-all duration-500"
              >
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-5 group-hover:bg-gold/20 transition-colors">
                  <b.icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-serif text-xl mb-2">{b.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section className="py-24 bg-brand-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/5 via-transparent to-transparent pointer-events-none" />
        <div className="container-luxe relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="text-xs tracking-[0.3em] uppercase text-gold mb-3">How It Works</div>
            <h2 className="font-serif text-4xl md:text-5xl text-white">
              Partner in <span className="italic text-gold-gradient">5 simple steps</span>
            </h2>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-0 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="flex-1 flex flex-col items-center text-center px-6 py-4"
              >
                <div className="w-20 h-20 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-5 relative z-10">
                  <span className="font-serif text-2xl text-gold">{s.num}</span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Enquiry Form ── */}
      <section id="enquiry" className="py-24 bg-background scroll-mt-24">
        <div className="container-luxe grid lg:grid-cols-[1fr_1.2fr] gap-14 items-start">
          {/* Left: info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="text-xs tracking-[0.3em] uppercase text-gold-deep mb-4">Get Started</div>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-6">
              Send us your <span className="italic text-gold-gradient">wholesale enquiry</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-10">
              Fill in your details and our wholesale team will reach out within 24 hours with a personalised catalogue
              and pricing proposal.
            </p>

            <div className="space-y-5">
              {[
                { icon: Phone, label: "+91 99748 78332" },
                { icon: Mail, label: "wholesale@swastikgold.in" },
                { icon: MapPin, label: "7-8-9 Ground Floor, Satkar Complex, CG Road, Ahmedabad" },
                { icon: Building2, label: "GST: 24AABCS1429E1ZR" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-gold" />
                  </div>
                  <p className="text-foreground/80 text-sm leading-snug pt-2.5">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="bg-card border border-border rounded-3xl p-8 shadow-card">
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center text-center py-10 gap-5"
                  >
                    <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
                      <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="font-serif text-3xl">Enquiry Received!</h3>
                    <p className="text-muted-foreground max-w-xs">
                      Thank you! Our wholesale team will contact you within 24 hours on the number you provided.
                    </p>
                    <button
                      onClick={() => { setSent(false); setForm({ businessName: "", contactName: "", phone: "", email: "", city: "", annualTurnover: "", message: "" }); }}
                      className="px-6 py-2.5 rounded-full border border-gold/30 text-gold text-sm hover:bg-gold/10 transition-colors"
                    >
                      Submit Another
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    <h3 className="font-serif text-2xl mb-2">Partnership Enquiry Form</h3>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-foreground/70 mb-1.5 uppercase tracking-wider">
                          Business / Shop Name *
                        </label>
                        <input
                          required
                          name="businessName"
                          value={form.businessName}
                          onChange={handleChange}
                          placeholder="e.g. Mehta Jewellers"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-gold/50 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-foreground/70 mb-1.5 uppercase tracking-wider">
                          Contact Person *
                        </label>
                        <input
                          required
                          name="contactName"
                          value={form.contactName}
                          onChange={handleChange}
                          placeholder="Your full name"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-gold/50 text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-foreground/70 mb-1.5 uppercase tracking-wider">
                          WhatsApp / Phone *
                        </label>
                        <input
                          required
                          name="phone"
                          type="tel"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="+91 XXXXX XXXXX"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-gold/50 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-foreground/70 mb-1.5 uppercase tracking-wider">
                          Email
                        </label>
                        <input
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-gold/50 text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-foreground/70 mb-1.5 uppercase tracking-wider">
                          City / State *
                        </label>
                        <input
                          required
                          name="city"
                          value={form.city}
                          onChange={handleChange}
                          placeholder="e.g. Surat, Gujarat"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-gold/50 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-foreground/70 mb-1.5 uppercase tracking-wider">
                          Approx. Monthly Requirement
                        </label>
                        <select
                          name="annualTurnover"
                          value={form.annualTurnover}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-gold/50 text-sm"
                        >
                          <option value="">Select range</option>
                          <option value="below-1L">Below ₹1 Lakh</option>
                          <option value="1-5L">₹1 – 5 Lakh</option>
                          <option value="5-10L">₹5 – 10 Lakh</option>
                          <option value="10-25L">₹10 – 25 Lakh</option>
                          <option value="25L+">Above ₹25 Lakh</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-foreground/70 mb-1.5 uppercase tracking-wider">
                        Additional Message
                      </label>
                      <textarea
                        name="message"
                        rows={4}
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Tell us about your shop, preferred categories, or any specific requirements..."
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-gold/50 text-sm resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-gold text-gold-foreground font-bold text-sm tracking-wide shadow-gold hover:-translate-y-0.5 transition-all disabled:opacity-70"
                    >
                      {sending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Submit Wholesale Enquiry
                        </>
                      )}
                    </button>

                    <p className="text-[11px] text-muted-foreground text-center">
                      By submitting, you agree to be contacted by our team. No spam — ever.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 bg-brand-dark">
        <div className="container-luxe max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="text-xs tracking-[0.3em] uppercase text-gold mb-3">FAQs</div>
            <h2 className="font-serif text-4xl text-white">
              Frequently asked <span className="italic text-gold-gradient">questions</span>
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between gap-4 p-6 text-left text-white hover:text-gold transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-medium text-[15px] leading-snug">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180 text-gold" : "text-slate-400"}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <FloatingActions />
    </main>
  );
}
