"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, MessageCircle } from "lucide-react";

import { CONTACT_INFO } from "@/config/contact";

export const FloatingActions = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.a
        href={`https://wa.me/${CONTACT_INFO.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed bottom-6 right-6 z-40 group"
      >
        <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping" />
        <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-primary text-primary-foreground shadow-elegant hover:shadow-gold transition-all duration-500 hover:scale-110">
          <MessageCircle className="w-6 h-6" strokeWidth={1.8} />
        </span>
      </motion.a>

      <AnimatePresence>
        {show && (
          <motion.button
            aria-label="Scroll to top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
            className="fixed bottom-24 right-6 z-40 w-12 h-12 rounded-full glass border border-gold/40 text-primary shadow-card hover:shadow-elegant hover:-translate-y-0.5 transition-all duration-500 flex items-center justify-center"
          >
            <ArrowUp className="w-5 h-5" strokeWidth={1.8} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};
