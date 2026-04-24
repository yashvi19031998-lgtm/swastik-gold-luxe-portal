import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Home", href: "#home" },
  { label: "Shop", href: "#collections" },
  { label: "Collection", href: "#collections" },
  { label: "Create Your Own", href: "#custom" },
  { label: "Contact Us", href: "#contact" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "glass shadow-soft py-3" : "bg-transparent py-5"
      }`}
    >
      <nav className="container-luxe flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2 group">
          <span className="font-serif text-2xl md:text-3xl font-semibold tracking-tight text-primary">
            Swastik
          </span>
          <span className="font-serif text-2xl md:text-3xl font-light text-gold-gradient">Gold</span>
        </a>

        <ul className="hidden lg:flex items-center gap-10">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="relative text-sm tracking-wide text-foreground/80 hover:text-primary transition-colors duration-300 after:absolute after:left-0 after:-bottom-1.5 after:h-px after:w-0 after:bg-gradient-gold after:transition-all after:duration-500 hover:after:w-full"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="hidden lg:inline-flex items-center px-6 py-2.5 rounded-full bg-gradient-primary text-primary-foreground text-sm tracking-wide shadow-soft hover:shadow-elegant hover:-translate-y-0.5 transition-all duration-500"
        >
          Get a Quote
        </a>

        <button
          aria-label="Toggle menu"
          className="lg:hidden p-2 text-primary"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:hidden glass border-t border-border/40 mt-3"
          >
            <ul className="container-luxe py-6 flex flex-col gap-4">
              {links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block py-2 text-base text-foreground/80 hover:text-primary transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex justify-center px-6 py-3 rounded-full bg-gradient-primary text-primary-foreground text-sm"
              >
                Get a Quote
              </a>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
