"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

/* ── Import local assets ── */
import heroImage    from "@/assets/hero-jewellery.jpg";
import weddingImage from "@/assets/coll-wedding.jpg";
import necklaceImg  from "@/assets/collection-necklaces.jpg";

const getImg = (img: any): string =>
  typeof img === "string" ? img : (img as any).src;

/* ── Slide definitions — only Swastik Gold content ── */
const SLIDES = [
  {
    id: 0,
    tag: "Wholesale Since 1998",
    headline: ["Timeless", "Elegance"],
    accent: "Elegance",
    sub: "BIS Hallmarked. Pan-India Delivery. Premium craftsmanship direct from our atelier to your showroom.",
    cta: { label: "Explore Catalogue", href: "/collection" },
    cta2: { label: "Get a Quote", href: "/#contact" },
    img: heroImage,
    overlay: "from-brand-dark/80 via-brand-dark/40 to-transparent",
    accent2: "bg-gold/20",
    stat: { val: "100%", label: "BIS Hallmarked" },
  },
  {
    id: 1,
    tag: "Bridal Collection",
    headline: ["Crafted for the", "Wedding Season"],
    accent: "Wedding Season",
    sub: "Exquisite bridal sets in 22Kt & 18Kt gold. Necklaces, bangles, mangalsutra — every piece a heirloom.",
    cta: { label: "View Bridal Sets", href: "/shop?cat=necklace" },
    cta2: { label: "Book Appointment", href: "/showroom" },
    img: weddingImage,
    overlay: "from-brand-dark/85 via-brand-dark/50 to-transparent",
    accent2: "bg-primary/20",
    stat: { val: "500+", label: "Retail Partners" },
  },
  {
    id: 2,
    tag: "New Arrivals",
    headline: ["Timeless Designs,", "Wholesale Prices"],
    accent: "Wholesale Prices",
    sub: "From bold necklaces to delicate pendants — shop our latest arrivals freshly hallmarked and ready for your inventory.",
    cta: { label: "Shop Now", href: "/shop" },
    cta2: { label: "Wholesale Partner", href: "/wholesale" },
    img: necklaceImg,
    overlay: "from-brand-dark/80 via-brand-dark/40 to-transparent",
    accent2: "bg-gold-deep/20",
    stat: { val: "25+", label: "Years of Trust" },
  },
];

const AUTOPLAY_MS = 5500;

export const Hero = () => {
  const [current, setCurrent]     = useState(0);
  const [direction, setDirection] = useState(1); // 1=next, -1=prev
  const [paused, setPaused]       = useState(false);

  const goTo = useCallback(
    (idx: number, dir: number) => {
      setDirection(dir);
      setCurrent(idx);
    },
    []
  );

  const next = useCallback(() => goTo((current + 1) % SLIDES.length, 1),  [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + SLIDES.length) % SLIDES.length, -1), [current, goTo]);

  /* Auto-play */
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(next, AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [current, paused, next]);

  const slide = SLIDES[current];

  /* Framer variants */
  const imgVariants = {
    enter:  (dir: number) => ({ x: dir > 0 ? "4%" : "-4%", opacity: 0, scale: 1.08 }),
    center: { x: "0%", opacity: 1, scale: 1.05 }, // Added subtle zoom-in scale 1.05
    exit:   (dir: number) => ({ x: dir > 0 ? "-4%" : "4%", opacity: 0, scale: 1 }),
  };

  const textVariants = {
    enter:  { opacity: 0, y: 30 },
    center: { opacity: 1, y: 0 },
    exit:   { opacity: 0, y: -20 },
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden bg-brand-dark"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Background image slider ── */}
      <AnimatePresence initial={false} custom={direction} mode="sync">
        <motion.div
          key={slide.id}
          custom={direction}
          variants={imgVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 1.1, ease: [0.77, 0, 0.175, 1] }}
          className="absolute inset-0"
        >
          <img
            src={getImg(slide.img)}
            alt="Swastik Gold jewellery"
            className="w-full h-full object-cover object-center"
          />
          {/* Directional gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.overlay}`} />
          {/* Bottom vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* ── Ambient orbs ── */}
      <div className={`pointer-events-none absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full ${slide.accent2} blur-3xl transition-colors duration-1000`} />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[32rem] h-[32rem] rounded-full bg-gold/10 blur-3xl" />

      {/* ── Content ── */}
      <div className="container-luxe relative z-10 pt-28 pb-20">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={`content-${slide.id}`}
            variants={textVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="max-w-2xl"
          >
            {/* Tag pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span className="text-xs tracking-[0.2em] uppercase text-white/80">{slide.tag}</span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[1.05] text-white">
              {slide.headline.map((line, i) =>
                line === slide.accent ? (
                  <span key={i} className="italic text-gold-gradient block">{line}</span>
                ) : (
                  <span key={i} className="block">{line}</span>
                )
              )}
            </h1>

            {/* Divider */}
            <div className="h-px w-28 bg-gradient-to-r from-gold via-gold-deep to-transparent my-7" />

            {/* Sub text */}
            <p className="text-base md:text-lg text-white/75 font-light leading-relaxed max-w-xl">
              {slide.sub}
            </p>

            {/* CTAs */}
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href={slide.cta.href}
                className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-gold text-gold-foreground font-semibold tracking-wide shadow-gold hover:-translate-y-0.5 hover:shadow-elegant transition-all duration-500"
              >
                {slide.cta.label}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href={slide.cta2.href}
                className="inline-flex items-center px-8 py-4 rounded-full border border-white/30 text-white hover:bg-white/10 hover:border-white/60 transition-all duration-500 tracking-wide"
              >
                {slide.cta2.label}
              </Link>
            </div>

            {/* Stat badge */}
            <div className="mt-10 inline-flex flex-col">
              <span className="font-serif text-4xl text-gold">{slide.stat.val}</span>
              <span className="text-[11px] tracking-[0.22em] uppercase text-white/60 mt-0.5">{slide.stat.label}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Navigation arrows ── */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-white hover:bg-gold hover:border-gold hover:text-brand-dark transition-all duration-300"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-white hover:bg-gold hover:border-gold hover:text-brand-dark transition-all duration-300"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* ── Dot indicators ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i, i > current ? 1 : -1)}
            aria-label={`Go to slide ${i + 1}`}
            className="relative h-1 rounded-full overflow-hidden transition-all duration-400"
            style={{ width: i === current ? "2.5rem" : "0.75rem", background: "rgba(255,255,255,0.3)" }}
          >
            {i === current && (
              <motion.div
                className="absolute inset-y-0 left-0 bg-gold"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
                key={`progress-${current}`}
              />
            )}
          </button>
        ))}
      </div>

      {/* ── Slide counter ── */}
      <div className="absolute bottom-8 right-8 z-20 hidden md:flex items-center gap-2 text-white/50 text-xs tracking-[0.2em]">
        <span className="text-white font-medium text-base">{String(current + 1).padStart(2, "0")}</span>
        <span>/</span>
        <span>{String(SLIDES.length).padStart(2, "0")}</span>
      </div>

      {/* ── Scroll hint ── */}
      <div className="absolute bottom-8 left-8 z-20 hidden md:flex flex-col items-center gap-2">
        <div className="h-10 w-px bg-gradient-to-b from-transparent via-white/40 to-transparent animate-pulse" />
        <span className="text-[9px] tracking-[0.3em] uppercase text-white/40 rotate-90 origin-center translate-y-4">Scroll</span>
      </div>
    </section>
  );
};
