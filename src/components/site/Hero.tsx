import { motion } from "framer-motion";
import heroImage from "@/assets/hero-jewellery.jpg";

export const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden bg-gradient-hero"
    >
      {/* ambient gold orbs */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-gold/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[32rem] h-[32rem] rounded-full bg-primary/15 blur-3xl" />

      <div className="container-luxe relative grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            <span className="text-xs tracking-[0.2em] uppercase text-foreground/70">
              Wholesale Since 1998
            </span>
          </motion.div>

          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[1.05] text-foreground">
            Trusted Wholesale
            <br />
            <span className="italic text-gold-gradient">Gold Jewellery</span>
          </h1>

          <div className="gold-divider w-32 my-8" />

          <p className="text-lg md:text-xl text-muted-foreground font-light tracking-wide max-w-xl">
            Purity. Trust. Wholesale. — Crafting timeless gold jewellery for
            India's finest retail boutiques and trade partners.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#collections"
              className="group relative inline-flex items-center px-8 py-4 rounded-full bg-gradient-primary text-primary-foreground tracking-wide overflow-hidden shadow-soft hover:shadow-elegant transition-all duration-500 hover:-translate-y-0.5 shimmer"
            >
              <span className="relative z-10">Shop Now</span>
            </a>
            <a
              href="#collections"
              className="inline-flex items-center px-8 py-4 rounded-full border border-gold/60 text-foreground hover:bg-gold/10 hover:border-gold transition-all duration-500 tracking-wide"
            >
              Explore Collection
            </a>
          </div>

          <div className="mt-14 grid grid-cols-3 gap-8 max-w-lg">
            {[
              { n: "25+", l: "Years of Trust" },
              { n: "500+", l: "Retail Partners" },
              { n: "100%", l: "Hallmarked" },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-serif text-3xl text-gold-gradient">{s.n}</div>
                <div className="text-xs tracking-wider uppercase text-muted-foreground mt-1">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="absolute -inset-6 rounded-[2rem] bg-gradient-gold opacity-30 blur-2xl" />
          <div className="relative rounded-[1.75rem] overflow-hidden shadow-elegant border border-gold/30 animate-float">
            <img
              src={heroImage}
              alt="Luxury gold necklace with diamond accents on sea green silk"
              width={1536}
              height={1024}
              className="w-full h-[28rem] lg:h-[36rem] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
          </div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="absolute -bottom-6 -left-6 glass rounded-2xl p-5 shadow-card max-w-[14rem]"
          >
            <div className="text-xs tracking-[0.2em] uppercase text-gold-deep mb-1">
              BIS Hallmarked
            </div>
            <div className="font-serif text-xl text-primary">22K & 18K Gold</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
