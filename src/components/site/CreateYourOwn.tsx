import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { toast } from "sonner";
import { Sparkles, Upload, PencilRuler, FileImage, IndianRupee, Image as ImageIcon, MessageSquare, Truck, Hammer, ClipboardCheck, X } from "lucide-react";

const baseSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(80),
  phone: z.string().trim().regex(/^[+0-9\s\-()]{7,20}$/, "Enter a valid phone number"),
  email: z.string().trim().email("Enter a valid email").max(120),
  budget: z.string().trim().max(40).optional().or(z.literal("")),
  details: z.string().trim().min(10, "Please share more design details").max(800),
  terms: z.literal(true, { errorMap: () => ({ message: "Please accept the terms" }) }),
});

const customizeSchema = baseSchema.extend({
  productCode: z.string().trim().min(2, "Product code is required").max(40),
});

const STEPS = [
  { icon: PencilRuler, title: "Step 1", text: "Share your design or choose from ours" },
  { icon: ClipboardCheck, title: "Step 2", text: "After assessing your requirement, we will send you an estimate" },
  { icon: IndianRupee, title: "Step 3", text: "Confirm your order by making secure payment" },
  { icon: Hammer, title: "Step 4", text: "We will start crafting your custom jewellery" },
  { icon: Truck, title: "Step 5", text: "Your jewellery will be shipped for home delivery" },
];

type Mode = "upload" | "customize";

const StepCard = ({ s, i }: { s: typeof STEPS[0]; i: number }) => {
  const Icon = s.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: i * 0.1 }}
      className="group relative bg-card rounded-2xl p-6 text-center shadow-card hover:shadow-elegant border border-border hover:border-gold/40 transition-all duration-500 hover:-translate-y-1"
    >
      <div className="absolute -top-3 right-4 text-[10px] tracking-[0.3em] uppercase text-gold-deep">0{i + 1}</div>
      <div className="mx-auto w-16 h-16 rounded-full bg-gradient-gold/10 border border-gold/30 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
        <Icon className="w-7 h-7 text-gold-deep" strokeWidth={1.5} />
      </div>
      <h3 className="font-serif text-xl text-foreground">{s.title}:</h3>
      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{s.text}</p>
    </motion.div>
  );
};

export const CreateYourOwn = () => {
  const [mode, setMode] = useState<Mode>("upload");
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    budget: "",
    details: "",
    productCode: "",
    terms: false,
  });
  const fileRef = useRef<HTMLInputElement>(null);

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const v = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm((f) => ({ ...f, [k]: v as never }));
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const schema = mode === "customize" ? customizeSchema : baseSchema;
    const r = schema.safeParse(form);
    if (!r.success) {
      toast.error(r.error.issues[0].message);
      return;
    }
    if (mode === "upload" && !preview) {
      toast.error("Please upload your design reference");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Inquiry received — our atelier will contact you within 24 hours.");
      setForm({ name: "", phone: "", email: "", budget: "", details: "", productCode: "", terms: false });
      setPreview(null);
      if (fileRef.current) fileRef.current.value = "";
      setSubmitting(false);
    }, 700);
  };

  const input =
    "w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all text-foreground placeholder:text-muted-foreground/70";

  return (
    <section id="custom" className="py-24 bg-gradient-hero relative overflow-hidden">
      <div className="absolute -top-32 -right-32 w-[36rem] h-[36rem] rounded-full bg-gold/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[36rem] h-[36rem] rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      <div className="container-luxe relative">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-5">
            <Sparkles className="w-3.5 h-3.5 text-gold-deep" />
            <span className="text-xs tracking-[0.2em] uppercase text-foreground/70">Bespoke Atelier</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground leading-tight">
            Create Your Own <span className="italic text-gold-gradient">Signature Piece</span>
          </h2>
          <div className="gold-divider w-32 mx-auto my-6" />
          <p className="text-muted-foreground text-lg">
            From the spark of an idea to the heirloom in your hand — our master craftsmen bring every vision to life in five carefully orchestrated steps.
          </p>
        </motion.div>

        {/* 5 step process */}
        <div className="mt-16 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.slice(0, 3).map((s, i) => (
              <StepCard key={s.title} s={s} i={i} />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {STEPS.slice(3).map((s, i) => (
              <StepCard key={s.title} s={s} i={i + 3} />
            ))}
          </div>
        </div>

        {/* Form section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20 bg-card/95 backdrop-blur rounded-3xl shadow-elegant border border-gold/20 overflow-hidden"
        >
          <div className="p-8 md:p-12">
            <h3 className="font-serif text-3xl md:text-4xl text-foreground text-center">
              Make your own <span className="italic text-gold-gradient">custom & personalized</span> jewellery
            </h3>
            <p className="text-center text-muted-foreground mt-3">Choose how you'd like to begin your bespoke journey</p>

            {/* Tabs */}
            <div className="mt-8 flex justify-center">
              <div className="inline-flex p-1.5 bg-secondary rounded-full border border-border">
                {([
                  { k: "upload", label: "Upload Any Design", icon: Upload },
                  { k: "customize", label: "Customize Existing Design", icon: PencilRuler },
                ] as const).map((t) => {
                  const Icon = t.icon;
                  const active = mode === t.k;
                  return (
                    <button
                      key={t.k}
                      onClick={() => setMode(t.k)}
                      className={`relative px-5 md:px-7 py-2.5 rounded-full text-sm tracking-wide transition-all duration-500 inline-flex items-center gap-2 ${
                        active ? "bg-gradient-primary text-primary-foreground shadow-soft" : "text-foreground/70 hover:text-primary"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.form
                key={mode}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4 }}
                onSubmit={onSubmit}
                className="mt-10 grid lg:grid-cols-3 gap-8"
              >
                {/* Left: form fields */}
                <div className="lg:col-span-2 grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs tracking-wider uppercase text-foreground/70 mb-2 block">Full Name *</label>
                    <input className={input} placeholder="Enter full name" value={form.name} onChange={update("name")} maxLength={80} />
                  </div>
                  <div>
                    <label className="text-xs tracking-wider uppercase text-foreground/70 mb-2 block">Phone Number *</label>
                    <input className={input} placeholder="+91 98765 43210" value={form.phone} onChange={update("phone")} maxLength={20} />
                  </div>
                  <div>
                    <label className="text-xs tracking-wider uppercase text-foreground/70 mb-2 block">Email Address *</label>
                    <input type="email" className={input} placeholder="you@business.com" value={form.email} onChange={update("email")} maxLength={120} />
                  </div>
                  <div>
                    <label className="text-xs tracking-wider uppercase text-foreground/70 mb-2 block">Your Budget (₹)</label>
                    <input className={input} placeholder="e.g. 1,50,000" value={form.budget} onChange={update("budget")} maxLength={40} />
                  </div>

                  {mode === "customize" && (
                    <div className="sm:col-span-2">
                      <label className="text-xs tracking-wider uppercase text-foreground/70 mb-2 block">Product Code *</label>
                      <div className="flex gap-2">
                        <input
                          className={input}
                          placeholder="e.g. SG-1042 (find from our catalogue)"
                          value={form.productCode}
                          onChange={update("productCode")}
                          maxLength={40}
                        />
                        <button 
                          type="button" 
                          className="px-6 rounded-xl bg-secondary border border-border text-foreground hover:bg-gold/10 transition-colors shrink-0"
                        >
                          Find Image
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="sm:col-span-2">
                    <label className="text-xs tracking-wider uppercase text-foreground/70 mb-2 block">
                      Details of Customized Design *
                    </label>
                    <textarea
                      className={`${input} min-h-[140px] resize-none`}
                      placeholder="Describe stones, weight, finish, motifs, references…"
                      value={form.details}
                      onChange={update("details")}
                      maxLength={800}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <div className="p-4 bg-secondary/50 border border-border rounded-xl flex items-center justify-between group cursor-pointer hover:border-gold/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border-2 border-border group-hover:border-gold/50 rounded bg-background transition-colors" />
                        <span className="text-sm font-medium">I'm not a robot</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" alt="reCAPTCHA" className="w-8 h-8 opacity-70" />
                        <span className="text-[10px] text-muted-foreground">reCAPTCHA</span>
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-2 flex items-start gap-3">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={form.terms}
                      onChange={update("terms")}
                      className="mt-1 w-4 h-4 accent-primary"
                    />
                    <label htmlFor="terms" className="text-sm text-muted-foreground">
                      I have read and agree to the website{" "}
                      <a href="#" className="text-primary hover:text-gold-deep underline-offset-2 hover:underline">Terms and Conditions</a>.
                    </label>
                  </div>

                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center justify-center px-10 py-4 rounded-full bg-gradient-primary text-primary-foreground tracking-wide shadow-soft hover:shadow-elegant hover:-translate-y-0.5 transition-all duration-500 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitting ? "Sending…" : mode === "upload" ? "Submit Design Inquiry" : "Submit Customisation Request"}
                    </button>
                    <p className="text-xs text-muted-foreground mt-3 inline-flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-gold-deep" />
                      Our atelier will respond within 12 hours.
                    </p>
                  </div>
                </div>

                {/* Right: upload / reference panel */}
                <div className="lg:col-span-1">
                  <div className="text-xs tracking-wider uppercase text-foreground/70 mb-3 block">
                    {mode === "upload" ? "Upload Your Design" : "Reference Image (optional)"}
                  </div>

                  <label
                    htmlFor="design-file"
                    className="group relative block aspect-square rounded-2xl border-2 border-dashed border-gold/40 bg-gradient-to-br from-secondary/40 to-gold-soft/30 overflow-hidden cursor-pointer hover:border-gold transition-all duration-500"
                  >
                    {preview ? (
                      <>
                        <img src={preview} alt="Design preview" className="absolute inset-0 w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setPreview(null);
                            if (fileRef.current) fileRef.current.value = "";
                          }}
                          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-background/90 hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                        <div className="w-16 h-16 rounded-full bg-gradient-gold/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          {mode === "upload" ? (
                            <Upload className="w-7 h-7 text-gold-deep" strokeWidth={1.5} />
                          ) : (
                            <ImageIcon className="w-7 h-7 text-gold-deep" strokeWidth={1.5} />
                          )}
                        </div>
                        <p className="font-serif text-xl text-foreground">
                          {mode === "upload" ? "Drop your design" : "Add a reference"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG or GIF • up to 5 MB</p>
                        <span className="mt-4 inline-flex items-center gap-1.5 text-xs tracking-wider text-primary group-hover:text-gold-deep transition-colors">
                          <FileImage className="w-3.5 h-3.5" /> Choose File
                        </span>
                      </div>
                    )}
                    <input
                      id="design-file"
                      ref={fileRef}
                      type="file"
                      accept="image/png,image/jpeg,image/gif"
                      onChange={onFile}
                      className="sr-only"
                    />
                  </label>

                  <ul className="mt-5 space-y-2.5 text-sm text-muted-foreground">
                    {[
                      "CAD preview before crafting",
                      "Bulk customisation available",
                      "100% BIS hallmarked gold",
                    ].map((f) => (
                      <li key={f} className="flex items-center gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.form>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
