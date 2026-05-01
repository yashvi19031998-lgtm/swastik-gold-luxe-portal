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
import { CONTACT_INFO } from "@/config/contact";

export const metadata: Metadata = {
  title: "Swastik Gold — Premium Wholesale Hallmarked Gold Jewellery Manufacturer",
  description: "Swastik Gold is India's leading B2B gold jewellery manufacturer. Specializing in BIS hallmarked necklaces, bangles, rings, and custom designs with pan-India insured delivery.",
  keywords: ["wholesale gold jewellery", "gold jewellery manufacturer", "BIS hallmarked gold", "B2B jewellery supplier", "custom gold designs", "Ahmedabad gold market", "Manek Chowk jewellery"],
  openGraph: {
    title: "Swastik Gold — Premium Wholesale Gold Jewellery",
    description: "Trusted B2B manufacturer for 100% hallmarked gold jewellery. Bulk orders and custom designs available.",
    url: "https://swastik-gold-luxe-portal.vercel.app/",
    siteName: "Swastik Gold",
    images: [
      {
        url: "/luxury_jewellery_banner.png",
        width: 1200,
        height: 630,
        alt: "Swastik Gold Luxe Collection",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Swastik Gold | Premium Wholesale Jewellery",
    description: "Trusted manufacturer for 100% hallmarked gold jewellery since 1998.",
    images: ["/luxury_jewellery_banner.png"],
  },
  alternates: {
    canonical: "/",
  },
};

const Index = () => {
  const ld = {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    "name": "Swastik Gold",
    "image": "https://swastik-gold-luxe-portal.vercel.app/luxury_jewellery_banner.png",
    "@id": "https://swastik-gold-luxe-portal.vercel.app/",
    "url": "https://swastik-gold-luxe-portal.vercel.app/",
    "telephone": CONTACT_INFO.phone,
    "priceRange": "₹₹₹",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": CONTACT_INFO.address,
      "addressLocality": "Ahmedabad",
      "addressRegion": "Gujarat",
      "postalCode": "380001",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 23.0245,
      "longitude": 72.5891
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "11:00",
      "closes": "20:00"
    },
    "sameAs": [
      CONTACT_INFO.facebook,
      CONTACT_INFO.instagram
    ]
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
