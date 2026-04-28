"use client";

import { useState } from "react";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const schema = z.object({
  name: z.string().trim().min(2, "Name required").max(80),
  mobile: z.string().trim().regex(/^[0-9+\-\s]{7,15}$/, "Invalid mobile"),
  city: z.string().trim().min(2).max(60),
  business: z.string().trim().max(80).optional().or(z.literal("")),
  product: z.string().trim().max(120),
  quantity: z.string().trim().max(20),
  message: z.string().trim().max(500).optional().or(z.literal("")),
});

const WHATSAPP = "919876543210";

export const QuoteDialog = ({
  open,
  onOpenChange,
  productName = "",
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  productName?: string;
}) => {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    city: "",
    business: "",
    product: productName,
    quantity: "1",
    message: "",
  });

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      toast({ title: "Please check the form", description: result.error.issues[0]?.message, variant: "destructive" });
      return;
    }
    const text =
      `*New Quote Request — Swastik Gold*%0A` +
      `Name: ${encodeURIComponent(form.name)}%0A` +
      `Mobile: ${encodeURIComponent(form.mobile)}%0A` +
      `City: ${encodeURIComponent(form.city)}%0A` +
      `Business: ${encodeURIComponent(form.business || "-")}%0A` +
      `Product: ${encodeURIComponent(form.product)}%0A` +
      `Quantity: ${encodeURIComponent(form.quantity)}%0A` +
      `Message: ${encodeURIComponent(form.message || "-")}`;
    window.open(`https://wa.me/${WHATSAPP}?text=${text}`, "_blank");
    toast({ title: "Inquiry sent", description: "We'll contact you shortly." });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-card">
        <DialogHeader>
          <div className="text-[10px] tracking-[0.3em] uppercase text-gold-deep mb-1">Request a Quote</div>
          <DialogTitle className="font-serif text-3xl text-foreground">Wholesale Inquiry</DialogTitle>
          <DialogDescription>Share your details — our team will respond within 12 hours.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="Full name" value={form.name} onChange={update("name")} required />
            <Input placeholder="Mobile number" value={form.mobile} onChange={update("mobile")} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="City" value={form.city} onChange={update("city")} required />
            <Input placeholder="Business name" value={form.business} onChange={update("business")} />
          </div>
          <Input placeholder="Product" value={form.product} onChange={update("product")} required />
          <Input placeholder="Quantity" value={form.quantity} onChange={update("quantity")} required />
          <Textarea placeholder="Message (optional)" value={form.message} onChange={update("message")} rows={3} />
          <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground hover:shadow-elegant">
            Send via WhatsApp
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
