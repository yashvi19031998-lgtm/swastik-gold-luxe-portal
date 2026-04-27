import { useEffect } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { WhyChooseUs } from "@/components/site/WhyChooseUs";
import { Collections } from "@/components/site/Collections";
import { CreateYourOwn } from "@/components/site/CreateYourOwn";
import { Testimonials } from "@/components/site/Testimonials";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { FloatingActions } from "@/components/site/FloatingActions";

const Index = () => {
  useEffect(() => {
    document.title = "Swastik Gold — Trusted Wholesale Gold Jewellery in India";
    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };
    setMeta(
      "description",
      "Swastik Gold — Premium wholesale gold jewellery for retailers. 100% BIS hallmarked, custom designs, pan-India delivery. Necklaces, rings, bangles, earrings & chains."
    );
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.origin + "/";

    // JSON-LD
    const ld = {
      "@context": "https://schema.org",
      "@type": "JewelryStore",
      name: "Swastik Gold",
      description: "Wholesale hallmarked gold jewellery manufacturer in India.",
      address: { "@type": "PostalAddress", addressLocality: "Jaipur", addressRegion: "Rajasthan", addressCountry: "IN" },
      telephone: "+91 98765 43210",
    };
    let script = document.getElementById("ld-jewellery") as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = "ld-jewellery";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.text = JSON.stringify(ld);
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <h1 className="sr-only">Swastik Gold — Trusted Wholesale Gold Jewellery</h1>
      <Hero />
      <WhyChooseUs />
      <Collections />
      <CreateYourOwn />
      <Testimonials />
      <Contact />
      <Footer />
      <FloatingActions />
    </main>
  );
};

export default Index;
