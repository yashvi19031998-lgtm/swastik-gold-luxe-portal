import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wholesale Gold Jewellery Inquiry | Swastik Gold B2B",
  description: "Expand your retail business with Swastik Gold. Access our exclusive wholesale catalogue of BIS hallmarked gold jewellery. Submit your inquiry for bulk pricing.",
  keywords: ["wholesale jewellery inquiry", "B2B gold supply", "jewellery bulk orders", "gold retailer support", "wholesale gold catalogue"],
  openGraph: {
    title: "Wholesale Gold Jewellery Inquiry | Swastik Gold B2B",
    description: "Get exclusive B2B pricing and access to our full catalogue. Partner with India's trusted gold wholesaler.",
    type: "website",
  }
};

export default function WholesaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
