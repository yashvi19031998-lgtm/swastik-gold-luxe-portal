import type { Metadata } from "next";
import { SaleForm } from "@/components/sales/SaleForm";

export const metadata: Metadata = {
  title: "Create Sale | Swastik Gold Admin",
  description: "Create a new wholesale jewellery sale invoice",
};

export default function CreateSalePage() {
  return <SaleForm />;
}
