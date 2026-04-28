import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function BannerSection() {
  return (
    <section className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/luxury_jewellery_banner.png"
          alt="Luxury Gold Jewellery Collection"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-center items-start">
        <div className="max-w-xl space-y-6 animate-in fade-in slide-in-from-left duration-1000">
          <span className="inline-block px-4 py-1.5 bg-gold/20 backdrop-blur-md border border-gold/30 text-gold text-xs font-bold uppercase tracking-widest rounded-full">
            Exclusive Collection
          </span>
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-white leading-tight">
            Crafted for <br />
            <span className="text-gold">Timeless Elegance</span>
          </h2>
          <p className="text-slate-300 text-lg md:text-xl max-w-md">
            Discover our latest hallmarked gold masterpieces, designed for those who appreciate pure luxury.
          </p>
          <div className="pt-4">
            <Link 
              href="/shop" 
              className="inline-flex items-center gap-3 bg-gold hover:bg-gold-600 text-slate-950 px-8 py-4 rounded-full font-bold transition-all transform hover:scale-105 shadow-xl shadow-gold/20 group"
            >
              Explore Collection
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Elements for Premium Feel */}
      <div className="absolute bottom-0 right-0 p-8 hidden lg:block">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl max-w-xs">
          <div className="flex gap-4 items-center">
            <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold">
              <span className="font-bold">24K</span>
            </div>
            <div>
              <p className="text-white font-bold">Pure Gold</p>
              <p className="text-slate-400 text-xs">BIS Hallmarked Certified Jewellery</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
