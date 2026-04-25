import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/swastik-gold-logo.png";

const links = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Collection", to: "/collection" },
  { label: "Create Your Own", to: "/#custom" },
  { label: "Contact Us", to: "/#contact" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (to: string) => {
    if (to === "/") return pathname === "/";
    if (to.startsWith("/#")) return false;
    return pathname.startsWith(to);
  };

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 bg-brand-dark shadow-soft ${
        scrolled || pathname !== "/" ? "py-2" : "py-3"
      }`}
    >
      <nav className="container-luxe flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img src={logo} alt="Swastik Gold logo" className="h-14 md:h-16 w-auto drop-shadow-[0_4px_12px_hsl(38_55%_50%/0.35)] transition-transform duration-500 group-hover:scale-105" />
        </Link>

        <ul className="hidden lg:flex items-center gap-10">
          {links.map((l) => (
            <li key={l.label}>
              <Link
                to={l.to}
                className={`relative text-sm tracking-wide transition-colors duration-300 after:absolute after:left-0 after:-bottom-1.5 after:h-px after:bg-gradient-gold after:transition-all after:duration-500 hover:after:w-full ${
                  isActive(l.to) ? "text-gold after:w-full" : "text-primary-foreground/85 hover:text-gold after:w-0"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          to="/#contact"
          className="hidden lg:inline-flex items-center px-6 py-2.5 rounded-full bg-gradient-gold text-gold-foreground text-sm tracking-wide shadow-gold hover:-translate-y-0.5 transition-all duration-500"
        >
          Get a Quote
        </Link>

        <button aria-label="Toggle menu" className="lg:hidden p-2 text-gold" onClick={() => setOpen((v) => !v)}>
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
            className="lg:hidden bg-brand-dark border-t border-gold/20 mt-2"
          >
            <ul className="container-luxe py-6 flex flex-col gap-4">
              {links.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="block py-2 text-base text-primary-foreground/85 hover:text-gold transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <Link
                to="/#contact"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex justify-center px-6 py-3 rounded-full bg-gradient-gold text-gold-foreground text-sm"
              >
                Get a Quote
              </Link>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
