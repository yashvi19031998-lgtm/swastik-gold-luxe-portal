import { Instagram, Facebook, Mail, Phone } from "lucide-react";

const cols = [
  { title: "Explore", links: ["Home", "Shop", "Collection", "Create Your Own", "Contact Us"] },
  { title: "Collections", links: ["Necklaces", "Rings", "Earrings", "Bangles", "Chains"] },
  { title: "Trade", links: ["Wholesale Inquiry", "Bulk Orders", "Custom Designs", "Catalogue", "Hallmark Info"] },
];

export const Footer = () => (
  <footer className="relative bg-gradient-to-b from-secondary/40 to-primary-soft/40 border-t border-gold/20">
    <div className="container-luxe py-16">
      <div className="grid lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-5">
            <span className="font-serif text-3xl font-semibold text-primary">Swastik</span>
            <span className="font-serif text-3xl font-light text-gold-gradient">Gold</span>
          </div>
          <p className="text-muted-foreground leading-relaxed max-w-sm">
            India's trusted wholesale partner for hallmarked gold jewellery. Crafting timeless pieces for the country's finest retail boutiques since 1998.
          </p>
          <div className="mt-6 flex items-center gap-3">
            {[Instagram, Facebook, Mail, Phone].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-10 h-10 rounded-full glass flex items-center justify-center text-foreground/70 hover:text-primary hover:border-gold/60 transition-all duration-500 hover:-translate-y-0.5"
              >
                <Icon className="w-4 h-4" strokeWidth={1.5} />
              </a>
            ))}
          </div>
        </div>

        {cols.map((c) => (
          <div key={c.title}>
            <div className="text-xs tracking-[0.25em] uppercase text-gold-deep mb-5">{c.title}</div>
            <ul className="space-y-3">
              {c.links.map((l) => (
                <li key={l}>
                  <a href="#" className="text-foreground/75 hover:text-primary transition-colors text-sm">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="gold-divider mt-14 mb-6" />
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div>© {new Date().getFullYear()} Swastik Gold. All rights reserved.</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms</a>
          <a href="#" className="hover:text-primary transition-colors">Hallmarking</a>
        </div>
      </div>
    </div>
  </footer>
);
