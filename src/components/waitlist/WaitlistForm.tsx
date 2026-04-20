"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  Loader2,
  ChevronRight,
  Home,
  Briefcase
} from "lucide-react";
import { WAITLIST_AREAS, WAITLIST_SERVICES } from "@/constants/waitlist";
import { createClient } from "@/utils/supabase/client";

export default function WaitlistForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    email: "",
    city: "",
    town: "",
    street: "",
    landmark: "",
    house_number: "",
    service_needed: "",
    user_type: "home" as "home" | "business",
  });

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();
      if (!supabase) throw new Error("Supabase not configured");

      const { error: submitError } = await supabase
        .from("waitlist_entries")
        .insert([
          {
            full_name: formData.full_name,
            phone_number: formData.phone_number,
            email: formData.email,
            city: formData.city,
            town: formData.town,
            street: formData.street,
            landmark: formData.landmark,
            house_number: formData.house_number,
            area: `${formData.city}, ${formData.town}`, // Populate legacy area field
            service_needed: formData.service_needed,
            user_type: formData.user_type,
          },
        ]);

      if (submitError) throw submitError;

      setIsSuccess(true);
    } catch (err: any) {
      console.error("Waitlist error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 px-6"
      >
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-3xl font-black text-foreground mb-4">You're on the list!</h2>
        <p className="text-muted text-lg mb-8">
          Thank you for joining TaskGH early access. We'll send you an SMS and email as soon as we launch in your area.
        </p>
        <button 
          onClick={() => setIsSuccess(false)}
          className="text-primary font-bold hover:underline"
        >
          Add another entry
        </button>
      </motion.div>
    );
  }

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div 
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
              i <= step ? "bg-primary shadow-[0_0_10px_rgba(22,163,74,0.3)]" : "bg-border"
            }`}
          />
        ))}
      </div>

      <form onSubmit={handleWaitlistSubmit}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="relative">
                  <label className="block text-xs font-black text-primary uppercase tracking-widest mb-2 px-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted/50" />
                    <input
                      required
                      value={formData.full_name}
                      onChange={(e) => updateField("full_name", e.target.value)}
                      placeholder="e.g. Sandra Asante"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-border focus:border-primary outline-none transition-all bg-background text-foreground font-medium"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-xs font-black text-primary uppercase tracking-widest mb-2 px-1">Phone Number</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pr-2 border-r-2 border-border text-foreground font-bold">
                        <span className="text-xl">🇬🇭</span>
                        <span className="text-sm">+233</span>
                    </div>
                    <input
                      required
                      type="tel"
                      value={formData.phone_number}
                      onChange={(e) => updateField("phone_number", e.target.value)}
                      placeholder="054 XXX XXXX"
                      className="w-full pl-28 pr-4 py-4 rounded-2xl border-2 border-border focus:border-primary outline-none transition-all bg-background text-foreground font-medium"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-xs font-black text-primary uppercase tracking-widest mb-2 px-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted/50" />
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-border focus:border-primary outline-none transition-all bg-background text-foreground font-medium"
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={nextStep}
                disabled={!formData.full_name || !formData.phone_number || !formData.email}
                className="w-full bg-primary hover:bg-primary-dark text-white font-black py-5 rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
              >
                Continue <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <label className="block text-xs font-black text-primary uppercase tracking-widest px-1 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Precise Location
                </label>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-muted uppercase tracking-tight">City</label>
                    <input
                      required
                      value={formData.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      placeholder="e.g. Accra"
                      className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary outline-none transition-all bg-background text-sm font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-muted uppercase tracking-tight">Town</label>
                    <input
                      required
                      value={formData.town}
                      onChange={(e) => updateField("town", e.target.value)}
                      placeholder="e.g. Osu"
                      className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary outline-none transition-all bg-background text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-muted uppercase tracking-tight">Street Name</label>
                  <input
                    required
                    value={formData.street}
                    onChange={(e) => updateField("street", e.target.value)}
                    placeholder="e.g. Oxford Street"
                    className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary outline-none transition-all bg-background text-sm font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-muted uppercase tracking-tight">Landmark (Optional)</label>
                  <input
                    value={formData.landmark}
                    onChange={(e) => updateField("landmark", e.target.value)}
                    placeholder="e.g. Near Shoprite"
                    className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary outline-none transition-all bg-background text-sm font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-muted uppercase tracking-tight">House Number (Optional)</label>
                  <div className="relative">
                    <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted/50" />
                    <input
                      value={formData.house_number}
                      onChange={(e) => updateField("house_number", e.target.value)}
                      placeholder="e.g. GA-123-4567"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-border focus:border-primary outline-none transition-all bg-background text-sm font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 border-2 border-border text-muted font-black py-4 rounded-2xl hover:bg-muted/5 transition-all"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!formData.city || !formData.town || !formData.street}
                  className="flex-[2] bg-primary hover:bg-primary-dark text-white font-black py-4 rounded-2xl shadow-xl shadow-primary/20 transition-all disabled:opacity-50 active:scale-95"
                >
                  Next Step
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-xs font-black text-primary uppercase tracking-widest mb-4 px-1">
                  What service do you need most?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {WAITLIST_SERVICES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => updateField("service_needed", s.name)}
                      className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                        formData.service_needed === s.name
                          ? "bg-primary/5 border-primary text-primary shadow-lg scale-105"
                          : "bg-foreground/[0.02] border-border text-muted hover:border-primary/30"
                      }`}
                    >
                      <s.icon className={`w-6 h-6 ${formData.service_needed === s.name ? "text-primary" : "text-muted/50"}`} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{s.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 border-2 border-border text-muted font-black py-4 rounded-2xl hover:bg-muted/5 transition-all"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!formData.service_needed}
                  className="flex-[2] bg-primary hover:bg-primary-dark text-white font-black py-4 rounded-2xl shadow-xl shadow-primary/20 transition-all disabled:opacity-50 active:scale-95"
                >
                  Next Step
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div>
                <label className="block text-xs font-black text-primary uppercase tracking-widest mb-4 text-center">
                  Household or Business?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => updateField("user_type", "home")}
                    className={`flex flex-col items-center gap-4 p-6 rounded-3xl border-2 transition-all ${
                      formData.user_type === "home"
                        ? "bg-primary/5 border-primary text-primary shadow-xl"
                        : "bg-foreground/[0.02] border-border text-muted"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-3xl ${formData.user_type === "home" ? "bg-primary/10" : "bg-muted/10 opacity-50"}`}>
                      🏠
                    </div>
                    <span className="font-black text-sm uppercase tracking-widest">Home</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateField("user_type", "business")}
                    className={`flex flex-col items-center gap-4 p-6 rounded-3xl border-2 transition-all ${
                      formData.user_type === "business"
                        ? "bg-primary/5 border-primary text-primary shadow-xl"
                        : "bg-foreground/[0.02] border-border text-muted"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-3xl ${formData.user_type === "business" ? "bg-primary/10" : "bg-muted/10 opacity-50"}`}>
                      🏢
                    </div>
                    <span className="font-black text-sm uppercase tracking-widest">Business</span>
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold rounded-xl text-center">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-black py-5 rounded-2xl shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-6 h-6 animate-spin" /> Submitting...</>
                  ) : (
                    <>Get Early Access <ChevronRight className="w-5 h-5" /></>
                  )}
                </button>
                <button
                  type="button"
                  onClick={prevStep}
                  className="text-muted font-black text-xs uppercase tracking-widest hover:text-primary transition-colors"
                >
                  Wait, Go Back
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
