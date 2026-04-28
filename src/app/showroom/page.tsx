"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Instagram, Facebook, Youtube, Twitter } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { FloatingActions } from "@/components/site/FloatingActions";
import { useEffect } from "react";
import storeImage from "@/assets/store.jpg";

const Showroom = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Visit Our Showroom | Swastik Gold Luxe";
  }, []);

  const infoItems = [
    {
      icon: MapPin,
      title: "Our Location",
      text: "7-8-9, Ground Floor, Satkar Complex, CG Road, Ahmedabad.",
      href: "https://maps.app.goo.gl/1DSiooakCx4EzJhu6",
    },
    {
      icon: Phone,
      title: "Phone",
      text: "+91 9974878332",
      href: "tel:+919974878332",
    },
    {
      icon: Mail,
      title: "Email",
      text: "info@swastikgold.in",
      href: "mailto:info@swastikgold.in",
    },
    {
      icon: Clock,
      title: "Business Hours",
      text: "Monday - Sunday: 10:30 AM - 8:00 PM",
    },
  ];

  const socials = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
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
                Experience our exquisite collection in person. Our elegant showroom provides the perfect setting to discover your next treasured piece.
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

      <Footer />
      <FloatingActions />
    </main>
  );
};

export default Showroom;
