import { Metadata } from "next";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { WhyChooseUs } from "@/components/site/WhyChooseUs";
import { Collections } from "@/components/site/Collections";
import { LatestArrivals } from "@/components/site/LatestArrivals";
import { Testimonials } from "@/components/site/Testimonials";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { BannerSection } from "@/components/site/BannerSection";
import { FloatingActions } from "@/components/site/FloatingActions";

export const metadata: Metadata = {
  title: "Swastik Gold — Trusted Wholesale Gold Jewellery in India",
  description: "Swastik Gold — Premium wholesale gold jewellery for retailers. 100% BIS hallmarked, custom designs, pan-India delivery. Necklaces, rings, bangles, earrings & chains.",
  alternates: {
    canonical: "/",
  },
};

const Index = () => {
  const ld = {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    name: "Swastik Gold",
    description: "Wholesale hallmarked gold jewellery manufacturer in India.",
    address: { "@type": "PostalAddress", addressLocality: "Jaipur", addressRegion: "Rajasthan", addressCountry: "IN" },
    telephone: "+91 98765 43210",
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <h1 className="sr-only">Swastik Gold — Trusted Wholesale Gold Jewellery</h1>
      <Hero />
      <WhyChooseUs />
      <Collections />
      <LatestArrivals />
      <Testimonials />
      <BannerSection />
      <Contact />
      <Footer />
      <FloatingActions />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
    </main>
  );
};

export default Index;
