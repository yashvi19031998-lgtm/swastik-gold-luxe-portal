import { useEffect } from "react";
import { Navbar } from "@/components/site/Navbar";
import { CreateYourOwn } from "@/components/site/CreateYourOwn";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { FloatingActions } from "@/components/site/FloatingActions";

const CustomDesign = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Custom Jewellery Design | Swastik Gold Luxe";
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 md:pt-32">
        <CreateYourOwn />
      </div>
      <Contact />
      <Footer />
      <FloatingActions />
    </main>
  );
};

export default CustomDesign;
