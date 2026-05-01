"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, MapPin, MessageCircle, Send, Loader2, CheckCircle2 } from "lucide-react";
import { CONTACT_INFO } from "@/config/contact";

const items = [
  { icon: Phone, label: "Phone", value: CONTACT_INFO.phone, href: `tel:${CONTACT_INFO.phoneRaw}` },
  { icon: MessageCircle, label: "WhatsApp", value: CONTACT_INFO.whatsappDisplay, href: `https://wa.me/${CONTACT_INFO.whatsapp}` },
  { icon: Mail, label: "Email", value: CONTACT_INFO.email, href: `mailto:${CONTACT_INFO.email}` },
  { icon: MapPin, label: "Address", value: CONTACT_INFO.address, href: CONTACT_INFO.googleMaps },
];

export const Contact = () => {
  const [form, setForm] = useState({
    contactName: "",
    phone: "",
    email: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setSent(true);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to send enquiry.");
    } finally {
      setSending(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="py-28 bg-background">
      <div className="container-luxe">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <div className="text-xs tracking-[0.3em] uppercase text-gold-deep mb-4">Connect With Us</div>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground">
            Get in <span className="italic text-gold-gradient">Touch</span>
          </h2>
          <div className="gold-divider w-24 mx-auto mt-6" />
          <p className="mt-6 text-muted-foreground">
            Whether you have a wholesale inquiry or a custom design request, our team is here to assist you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Left: Info */}
          <div className="lg:col-span-4 space-y-4">
            {items.map((it, i) => (
              <motion.a
                key={it.label}
                href={it.href}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="group flex items-start gap-5 p-5 rounded-2xl bg-card border border-border/60 hover:border-gold/50 hover:shadow-card transition-all duration-500"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center group-hover:bg-gradient-gold transition-all duration-500">
                  <it.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors duration-500" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-xs tracking-wider uppercase text-muted-foreground">{it.label}</div>
                  <div className="font-serif text-lg text-foreground mt-0.5">{it.value}</div>
                </div>
              </motion.a>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8 rounded-2xl overflow-hidden border border-border/60 shadow-card h-[250px]"
            >
              <iframe
                title="Swastik Gold Location"
                src={CONTACT_INFO.mapEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>
          </div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-8"
          >
            <div className="bg-card border border-border/60 rounded-[2rem] p-8 md:p-10 shadow-card relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -mr-32 -mt-32" />
              
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center text-center py-20 gap-6"
                  >
                    <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center">
                      <CheckCircle2 className="w-12 h-12 text-green-500" />
                    </div>
                    <h3 className="font-serif text-3xl">Message Sent Successfully!</h3>
                    <p className="text-muted-foreground max-w-sm">
                      Thank you for reaching out. Our team will review your message and get back to you shortly.
                    </p>
                    <button
                      onClick={() => { setSent(false); setForm({ contactName: "", phone: "", email: "", message: "" }); }}
                      className="px-8 py-3 rounded-full border border-gold/30 text-gold hover:bg-gold/10 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="relative space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your Name *</label>
                        <input
                          required
                          name="contactName"
                          value={form.contactName}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className="w-full px-5 py-4 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone Number *</label>
                        <input
                          required
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="+91 XXXXX XXXXX"
                          className="w-full px-5 py-4 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full px-5 py-4 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your Message *</label>
                      <textarea
                        required
                        name="message"
                        rows={5}
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Tell us what you're looking for..."
                        className="w-full px-5 py-4 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all text-sm resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-gradient-gold text-gold-foreground font-bold text-base shadow-gold hover:-translate-y-0.5 transition-all disabled:opacity-70"
                    >
                      {sending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
