"use client";
import { Instagram, Facebook, Mail, Phone } from "lucide-react";
import Link from "next/link";
import logo from "@/assets/swastik-gold-logo-new.png";
import { CONTACT_INFO } from "@/config/contact";

const cols = [
  {
    title: "Explore", links: [
      { label: "Home", to: "/" },
      { label: "Shop", to: "/shop" },
      { label: "Collection", to: "/collection" },
      { label: "Showroom", to: "/showroom" },
      { label: "Contact Us", to: "/#contact" },
    ]
  },
  {
    title: "Collections", links: [
      { label: "Wedding", to: "/collection/wedding" },
      { label: "Engagement", to: "/collection/engagement" },
      { label: "Daily Wear", to: "/collection/daily-wear" },
      { label: "Diamond", to: "/collection/diamond" },
      { label: "Antique", to: "/collection/antique" },
    ]
  },
  {
    title: "Trade", links: [
      { label: "Wholesale Inquiry", to: "/#contact" },
      { label: "Bulk Orders", to: "/#contact" },
      { label: "Custom Designs", to: "/#custom" },
      { label: "Catalogue", to: "/shop" },
      { label: "Hallmark Info", to: "/#contact" },
    ]
  },
];

const SOCIALS = [
  { icon: Instagram, href: CONTACT_INFO.instagram },
  { icon: Facebook, href: CONTACT_INFO.facebook },
  { icon: Mail, href: `mailto:${CONTACT_INFO.email}` },
  { icon: Phone, href: `tel:${CONTACT_INFO.phoneRaw}` },
];

export const Footer = () => (
  <footer className="relative bg-brand-dark text-primary-foreground border-t-2 border-gold/40">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(165_50%_18%/0.6),transparent_70%)] pointer-events-none" />
    <div className="container-luxe py-16 relative">
      <div className="grid lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2">
          <Link href="/" className="inline-block mb-5">
            <img
              src={typeof logo === "string" ? logo : (logo as any).src}
              alt="Swastik Gold logo"
              className="h-40 md:h-56 w-auto drop-shadow-[0_4px_16px_hsl(38_55%_50%/0.4)] brightness-[1.02] contrast-[1.1]"
            />
          </Link>
          <p className="text-primary-foreground/75 leading-relaxed max-w-sm">
            India's trusted wholesaler for hallmarked gold jewellery. Crafting timeless pieces for the country's finest retail boutiques since 1998.
          </p>
          <div className="mt-6 flex items-center gap-3">
            {SOCIALS.map((soc, i) => (
              <a
                key={i}
                href={soc.href}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full border border-gold/40 flex items-center justify-center text-gold hover:bg-gradient-gold hover:text-gold-foreground hover:border-transparent transition-all duration-500 hover:-translate-y-0.5"
              >
                <soc.icon className="w-4 h-4" strokeWidth={1.5} />
              </a>
            ))}
          </div>
        </div>

        {cols.map((c) => (
          <div key={c.title}>
            <div className="text-xs tracking-[0.25em] uppercase text-gold mb-5">{c.title}</div>
            <ul className="space-y-3">
              {c.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.to} className="text-primary-foreground/75 hover:text-gold transition-colors text-sm">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="gold-divider mt-14 mb-6" />
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/60">
        <div>© {new Date().getFullYear()} Swastik Gold. All rights reserved.</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-gold transition-colors">Privacy</a>
          <a href="#" className="hover:text-gold transition-colors">Terms</a>
          <a href="#" className="hover:text-gold transition-colors">Hallmarking</a>
        </div>
      </div>
    </div>
  </footer>
);
