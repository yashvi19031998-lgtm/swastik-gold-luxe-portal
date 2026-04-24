import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { FloatingActions } from "@/components/site/FloatingActions";
import { COLLECTIONS } from "@/data/products";

const CollectionPage = () => {
  const featured = COLLECTIONS.find((c) => (c as any).featured) || COLLECTIONS[2];
  const rest = COLLECTIONS.filter((c) => c.slug !== featured.slug);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero banner */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="container-luxe relative grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="text-xs tracking-[0.3em] uppercase text-gold-deep mb-4">Curated Collections</div>
            <h1 className="font-serif text-5xl md:text-6xl text-foreground leading-[1.05]">
              Stories told in <span className="italic text-gold-gradient">gold</span>.
            </h1>
            <p className="mt-5 text-muted-foreground max-w-md">
              Fifteen distinguished collections — from heirloom bridal sets to everyday essentials — each crafted for the discerning retailer.
            </p>
            <Link to="/shop" className="mt-8 inline-flex items-center px-7 py-3 rounded-full bg-gradient-primary text-primary-foreground text-sm tracking-wide shadow-soft hover:shadow-elegant hover:-translate-y-0.5 transition-all">
              Explore Catalogue →
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="relative">
            <div className="absolute -inset-4 bg-gradient-gold opacity-20 blur-3xl rounded-full" />
            <img src={featured.img} alt={featured.name} loading="eager" className="relative rounded-3xl shadow-elegant w-full aspect-[4/3] object-cover" />
            <div className="absolute bottom-6 left-6 right-6 glass rounded-2xl p-5">
              <div className="text-[10px] tracking-[0.3em] uppercase text-gold-deep">Featured</div>
              <h3 className="font-serif text-2xl text-foreground mt-1">{featured.name}</h3>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Masonry grid */}
      <section className="py-20">
        <div className="container-luxe">
          <div className="text-center mb-14">
            <div className="text-xs tracking-[0.3em] uppercase text-gold-deep mb-3">Browse Collections</div>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground">For every <span className="italic text-gold-gradient">occasion</span></h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((c, i) => (
              <motion.div
                key={c.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}
                className={`group relative rounded-2xl overflow-hidden shadow-card hover:shadow-elegant transition-all duration-700 ${i % 5 === 0 ? "sm:col-span-2 sm:row-span-2 min-h-[28rem]" : "min-h-[20rem]"}`}
              >
                <img src={c.img} alt={c.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-gold/0 to-gold/0 group-hover:via-gold/10 group-hover:to-gold/20 transition-all duration-700" />
                <div className="relative h-full flex flex-col justify-end p-6">
                  <h3 className="font-serif text-2xl md:text-3xl text-primary-foreground">{c.name}</h3>
                  <p className="text-sm text-primary-foreground/80 mt-1.5 max-w-xs">{c.desc}</p>
                  <Link to="/shop" className="mt-4 inline-flex items-center w-fit px-5 py-2 rounded-full bg-background/95 text-foreground text-xs tracking-wider hover:bg-gradient-gold hover:text-gold-foreground transition-all">
                    Explore Collection →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <FloatingActions />
    </main>
  );
};

export default CollectionPage;
