import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visit Our Showroom in Manek Chowk, Ahmedabad | Swastik Gold Luxe",
  description: "Experience the luxury of Swastik Gold in person. Visit our flagship showroom in Ahmedabad's historic gold market for exclusive designs and personalized service.",
  keywords: ["gold showroom Ahmedabad", "Manek Chowk gold shop", "jewellery store Ahmedabad", "Swastik Gold location", "visit showroom"],
  openGraph: {
    title: "Visit Swastik Gold Showroom | Manek Chowk, Ahmedabad",
    description: "Step into the world of luxury. Visit our flagship showroom for the finest hallmarked gold jewellery.",
    type: "website",
  }
};

export default function ShowroomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
