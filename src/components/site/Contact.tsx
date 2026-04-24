import { motion } from "framer-motion";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

const items = [
  { icon: Phone, label: "Phone", value: "+91 98765 43210", href: "tel:+919876543210" },
  { icon: MessageCircle, label: "WhatsApp", value: "+91 98765 43210", href: "https://wa.me/919876543210" },
  { icon: Mail, label: "Email", value: "wholesale@swastikgold.in", href: "mailto:wholesale@swastikgold.in" },
  { icon: MapPin, label: "Address", value: "Johari Bazaar, Jaipur, Rajasthan 302003", href: "#" },
];

export const Contact = () => (
  <section id="contact" className="py-28 bg-background">
    <div className="container-luxe">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-2xl mx-auto mb-16"
      >
        <div className="text-xs tracking-[0.3em] uppercase text-gold-deep mb-4">Get In Touch</div>
        <h2 className="font-serif text-4xl md:text-5xl text-foreground">
          Visit Our <span className="italic text-gold-gradient">Atelier</span>
        </h2>
        <div className="gold-divider w-24 mx-auto mt-6" />
        <p className="mt-6 text-muted-foreground">
          Speak to our wholesale team for catalogues, pricing and trade inquiries.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-4">
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
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-3 rounded-2xl overflow-hidden border border-border/60 shadow-card min-h-[400px] relative"
        >
          <iframe
            title="Swastik Gold Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.7842986824856!2d75.8267!3d26.9239!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db4106a701657%3A0x68e4d1c2f3cf6c1!2sJohari%20Bazaar%2C%20Jaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1700000000000"
            width="100%"
            height="100%"
            style={{ minHeight: 400, border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>
      </div>
    </div>
  </section>
);
