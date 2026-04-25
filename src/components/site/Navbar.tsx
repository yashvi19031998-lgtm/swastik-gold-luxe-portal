import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Diamond, Star, Heart, Users, Receipt, Briefcase } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/swastik-gold-logo-new.png";

const links = [
  { label: "Home", to: "/" },
  { label: "Catalogue", to: "/collection" },
  { label: "Shop", to: "/shop", hasMega: true },
  { label: "Wholesale", to: "/#contact" },
  { label: "Custom Design", to: "/custom-design" },
  { label: "Showroom", to: "/showroom" },
  { label: "Contact", to: "/#contact" },
];

const megaMenuData = [
  {
    title: "Shop By Category",
    icon: Menu,
    items: [
      { label: "Anklets", to: "/shop?cat=anklets" },
      { label: "Bangles", to: "/shop?cat=bangles" },
      { label: "Bracelet", to: "/shop?cat=bracelet" },
      { label: "Chain", to: "/shop?cat=chain" },
      { label: "Chain Pendant", to: "/shop?cat=chain-pendant" },
      { label: "Earrings", to: "/shop?cat=earrings" },
      { label: "Kada", to: "/shop?cat=kada" },
      { label: "Mangalsutra", to: "/shop?cat=mangalsutra" },
      { label: "Necklace", to: "/shop?cat=necklace" },
      { label: "Rings", to: "/shop?cat=rings" },
    ],
  },
  {
    title: "Ladies' Jewellery",
    icon: Diamond,
    items: [
      { label: "Pendant Set", to: "/shop?gender=ladies&cat=pendant-set" },
      { label: "Nose Pin", to: "/shop?gender=ladies&cat=nose-pin" },
      { label: "Necklace", to: "/shop?gender=ladies&cat=necklace" },
      { label: "Bangles", to: "/shop?gender=ladies&cat=bangles" },
      { label: "Rings", to: "/shop?gender=ladies&cat=rings" },
      { label: "Earrings", to: "/shop?gender=ladies&cat=earrings" },
      { label: "Bracelet", to: "/shop?gender=ladies&cat=bracelet" },
      { label: "Watch", to: "/shop?gender=ladies&cat=watch" },
    ],
  },
  {
    title: "Men's & Couple",
    icon: Heart,
    items: [
      { label: "Men's Bracelets", to: "/shop?gender=gents&cat=bracelet" },
      { label: "Men's Kadas", to: "/shop?gender=gents&cat=kada" },
      { label: "Men's Rings", to: "/shop?gender=gents&cat=rings" },
      { label: "Men's Chains", to: "/shop?gender=gents&cat=chain" },
      { label: "Couple Rings", to: "/shop?gender=couple&cat=rings" },
      { label: "Couple Watch", to: "/shop?gender=couple&cat=watch" },
    ],
  },
  {
    title: "Special Collections",
    icon: Star,
    items: [
      { label: "Diamond Rings", to: "/shop?cat=diamond-rings" },
      { label: "Diamond Earrings", to: "/shop?cat=diamond-earrings" },
      { label: "Kids Collection", to: "/shop?gender=kids" },
      { label: "Real Polki", to: "/shop?cat=real-polki" },
      { label: "God Idols", to: "/shop?cat=god-idol" },
    ],
  },
  {
    title: "Shop By Purity",
    icon: Receipt,
    items: [
      { label: "24Kt Gold", to: "/shop?purity=24kt" },
      { label: "22Kt Gold", to: "/shop?purity=22kt" },
      { label: "18Kt Gold", to: "/shop?purity=18kt" },
      { label: "Gender: Unisex", to: "/shop?gender=unisex" },
      { label: "Gender: Kids", to: "/shop?gender=kids" },
    ],
  },
  {
    title: "Shop By Price",
    icon: Briefcase,
    items: [
      { label: "Upto ₹10,000", to: "/shop?price=upto10" },
      { label: "₹10K to ₹25K", to: "/shop?price=10-25" },
      { label: "₹25K to ₹50K", to: "/shop?price=25-50" },
      { label: "₹50K to ₹1 Lakh", to: "/shop?price=50-100" },
      { label: "Above ₹1 Lakh", to: "/shop?price=above100" },
    ],
  },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [showMega, setShowMega] = useState(false);
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
      onMouseLeave={() => setShowMega(false)}
    >
      <nav className="container-luxe flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img 
            src={logo} 
            alt="Swastik Gold logo" 
            className={`transition-all duration-500 w-auto group-hover:scale-110 brightness-[1.02] contrast-[1.1] object-contain ${
              scrolled ? "h-14 md:h-16 -my-2" : "h-20 md:h-24 -my-4"
            }`} 
          />
        </Link>

        <ul className="hidden xl:flex items-center gap-7">
          {links.map((l) => (
            <li 
              key={l.label}
              onMouseEnter={() => l.hasMega ? setShowMega(true) : setShowMega(false)}
            >
              <Link
                to={l.to}
                className={`relative text-[13px] font-medium tracking-wider transition-colors duration-300 flex items-center gap-1.5 py-4 after:absolute after:left-0 after:bottom-2 after:h-px after:bg-gradient-gold after:transition-all after:duration-500 hover:after:w-full ${
                  isActive(l.to) ? "text-gold after:w-full" : "text-primary-foreground/85 hover:text-gold after:w-0"
                }`}
              >
                {l.label}
                {l.hasMega && <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${showMega ? "rotate-180" : ""}`} />}
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

      {/* Mega Menu Overlay */}
      <AnimatePresence>
        {showMega && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute top-full inset-x-0 bg-brand-dark border-t border-gold/20 shadow-2xl py-12 hidden xl:block"
            onMouseEnter={() => setShowMega(true)}
          >
            <div className="container-luxe grid grid-cols-6 gap-8">
              {megaMenuData.map((col) => (
                <div key={col.title}>
                  <div className="flex items-center gap-2 text-gold mb-6 group cursor-default">
                    <col.icon className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-[0.2em] font-bold">{col.title}</span>
                  </div>
                  <ul className="space-y-3">
                    {col.items.map((item) => (
                      <li key={item.label}>
                        <Link 
                          to={item.to} 
                          onClick={() => setShowMega(false)}
                          className="text-[13px] text-primary-foreground/70 hover:text-gold transition-colors block py-0.5"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:hidden bg-brand-dark border-t border-gold/20 mt-2 max-h-[80vh] overflow-y-auto"
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
