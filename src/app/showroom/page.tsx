"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Instagram, Facebook, Youtube, Twitter, Diamond, CheckCircle, Sparkles, RotateCcw, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { FloatingActions } from "@/components/site/FloatingActions";
import { useEffect } from "react";
import storeImage from "@/assets/store.jpg";

import { CONTACT_INFO } from "@/config/contact";

const Showroom = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Visit Our Showroom | Swastik Gold Luxe";
  }, []);

  const infoItems = [
    {
      icon: MapPin,
      title: "Our Location",
      text: CONTACT_INFO.address,
      href: CONTACT_INFO.googleMaps,
    },
    {
      icon: Phone,
      title: "Phone (Call)",
      text: CONTACT_INFO.phone,
      href: `tel:${CONTACT_INFO.phoneRaw}`,
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      text: CONTACT_INFO.whatsappDisplay,
      href: `https://wa.me/${CONTACT_INFO.whatsapp}`,
    },
    {
      icon: Mail,
      title: "Email",
      text: CONTACT_INFO.email,
      href: `mailto:${CONTACT_INFO.email}`,
    },
    {
      icon: Clock,
      title: "Business Hours",
      text: "Monday - Sunday: 10:30 AM - 8:00 PM",
    },
  ];

  const socials = [
    { icon: Facebook, href: CONTACT_INFO.facebook, label: "Facebook" },
    { icon: Instagram, href: CONTACT_INFO.instagram, label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Youtube, href: "#", label: "Youtube" },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
        <div className="container-luxe">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

            {/* Left: Content & Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-6">
                <MapPin className="w-3.5 h-3.5 text-gold-deep" />
                <span className="text-xs tracking-[0.2em] uppercase text-foreground/70">Flagship Store</span>
              </div>

              <h1 className="font-serif text-4xl md:text-6xl leading-tight">
                Visit Our <br />
                <span className="italic text-gold-gradient text-5xl md:text-7xl">Showroom</span>
              </h1>

              <p className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-xl">
                Experience our exquisite collection in person. Our flagship showroom in the heart of Ahmedabad's historic gold market provides the perfect setting.
              </p>

              <div className="mt-12 grid sm:grid-cols-2 gap-6">
                {infoItems.map((item, idx) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * idx }}
                    className="p-6 rounded-2xl bg-card border border-border shadow-card hover:border-gold/30 transition-all group"
                  >
                    {item.href ? (
                      <a href={item.href} target="_blank" rel="noreferrer" className="block">
                        <item.icon className="w-6 h-6 text-gold mb-3 group-hover:scale-110 transition-transform" />
                        <h3 className="font-medium text-foreground">{item.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1 leading-snug">{item.text}</p>
                      </a>
                    ) : (
                      <>
                        <item.icon className="w-6 h-6 text-gold mb-3" />
                        <h3 className="font-medium text-foreground">{item.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1 leading-snug">{item.text}</p>
                      </>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="mt-10 p-6 rounded-2xl bg-gradient-gold/5 border border-gold/20">
                <h3 className="font-serif text-xl mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  {socials.map((s, i) => (
                    <a
                      key={i}
                      href={s.href}
                      className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:bg-gradient-gold hover:text-white hover:border-transparent transition-all"
                      title={s.label}
                    >
                      <s.icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>

              <div className="mt-12">
                <a
                  href="/#contact"
                  className="inline-flex flex-col items-center justify-center w-full sm:w-auto px-10 py-5 rounded-2xl bg-gradient-gold text-white font-medium text-lg shadow-gold hover:-translate-y-1 transition-all group"
                >
                  Book Your Private Appointment
                  <span className="text-xs opacity-70 mt-1 font-normal tracking-wide group-hover:opacity-100 transition-opacity">
                    Experience personalized service & exclusive pieces
                  </span>
                </a>
              </div>
            </motion.div>

            {/* Right: Image & Atmosphere */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="relative"
            >
              <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-gold/10 blur-3xl pointer-events-none" />
              <div className="relative rounded-[2rem] overflow-hidden border border-border shadow-2xl aspect-[4/5]">
                <img
                  src={typeof storeImage === "string" ? storeImage : (storeImage as any).src}
                  alt="Swastik Gold Showroom"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-bottom p-10 flex-col justify-end">
                  <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                    <p className="text-white/90 text-lg italic font-serif leading-relaxed text-center">
                      "A space where heritage meets contemporary luxury. Come explore the artistry of Swastik Gold."
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-gold-deep rounded-full flex items-center justify-center p-4 shadow-xl border-4 border-background animate-float cursor-default z-20">
                <div className="text-center">
                  <div className="text-xs uppercase tracking-tighter text-white/70">Est.</div>
                  <div className="text-2xl font-serif text-white">1998</div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* The Experience Section */}
      <section className="py-20 bg-brand-dark text-white overflow-hidden">
        <div className="container-luxe">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <h2 className="font-serif text-4xl md:text-5xl mb-8 leading-tight">
                A Legacy of <span className="text-gold italic">Excellence</span> Since 1998
              </h2>
              <p className="text-lg text-white/70 mb-8 leading-relaxed">
                Step into a world where every piece tells a story. Our showroom is designed to provide a serene and luxurious environment where you can explore our collections at your own pace.
              </p>

              <div className="space-y-6">
                {[
                  { icon: Diamond, title: "Curated Selection", desc: "Handpicked designs from India's finest artisans." },
                  { icon: Sparkles, title: "Private Viewings", desc: "Experience personalized service in our private lounge." },
                  { icon: CheckCircle, title: "Expert Guidance", desc: "Our consultants help you find the perfect piece for any occasion." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-6 h-6 text-gold" />
                    </div>
                    <div>
                      <h4 className="font-serif text-xl text-white">{item.title}</h4>
                      <p className="text-white/60">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="lg:w-1/2 relative"
            >
              <div className="aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <img
                  src="/showroom-interior.png"
                  alt="Showroom Interior"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-gradient-gold p-8 rounded-2xl shadow-xl hidden md:block">
                <p className="text-white font-serif text-2xl italic">"Elegance in every detail."</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-background">
        <div className="container-luxe">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-3xl md:text-5xl mb-6">Our Showroom Services</h2>
            <p className="text-muted-foreground text-lg">
              Beyond just selling jewellery, we offer a range of services to ensure your treasures remain as beautiful as the day you bought them.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: CheckCircle,
                title: "100% BIS Hallmarked",
                desc: "Every piece of gold is certified for purity and authenticity."
              },
              {
                icon: Sparkles,
                title: "Professional Cleaning",
                desc: "Complimentary cleaning services for all Swastik Gold jewellery."
              },
              {
                icon: RotateCcw,
                title: "Transparent Exchange",
                desc: "Best-in-class buyback and exchange policies on your old gold."
              },
              {
                icon: Diamond,
                title: "Custom Orders",
                desc: "Work with our designers to create a piece that is uniquely yours."
              }
            ].map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-card border border-border hover:border-gold/30 transition-all text-center group"
              >
                <div className="w-16 h-16 rounded-2xl bg-gold/5 flex items-center justify-center mx-auto mb-6 group-hover:bg-gold/10 transition-colors">
                  <service.icon className="w-8 h-8 text-gold" />
                </div>
                <h3 className="font-serif text-xl mb-3">{service.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="pb-24">
        <div className="container-luxe">
          <div className="rounded-3xl overflow-hidden border border-border shadow-soft h-[500px] relative group">
            <iframe
              src={CONTACT_INFO.mapEmbed}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale group-hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute top-10 left-10 p-8 glass rounded-2xl max-w-sm hidden md:block">
              <h3 className="font-serif text-2xl mb-4">How to find us</h3>
              <p className="text-muted-foreground mb-6">
                We are located in the heart of Ahmedabad's historic gold market, Manek Chowk. Easy parking and valet service is available for our customers.
              </p>
              <a
                href={CONTACT_INFO.googleMaps}
                target="_blank"
                rel="noreferrer"
                className="text-gold font-medium inline-flex items-center gap-2 hover:gap-3 transition-all"
              >
                Open in Google Maps <MapPin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingActions />
    </main>
  );
};

export default Showroom;
