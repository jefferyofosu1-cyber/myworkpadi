"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import TrustBar from "@/components/TrustBar";
import { createClient } from "@/utils/supabase/client";
import { calculateTotal, formatGHS, BOOKING_PROTECTION, EMERGENCY_SURCHARGE } from "@/lib/pricing";
import {
  Wrench, Zap, Home, Truck, Brush, Wind, Hammer, Tv, MoreHorizontal,
  ArrowRight, ArrowLeft, Upload, MapPin, Calendar, Clock, AlertCircle,
  User, CheckCircle, Loader2, Crosshair, Star, X, Phone, Mail,
  ShieldCheck, CreditCard, Smartphone, ChevronRight
} from "lucide-react";

// ─── Categories ────────────────────────────────────────────────────────────────
const categories = [
  { id: "plumbing", label: "Plumbing", icon: Wrench, color: "bg-primary/10 border-primary/20 text-primary", bg: "bg-primary", emoji: "🔧" },
  { id: "electrical", label: "Electrical", icon: Zap, color: "bg-accent/10 border-accent/20 text-accent", bg: "bg-accent", emoji: "⚡" },
  { id: "cleaning", label: "Cleaning", icon: Home, color: "bg-primary/10 border-primary/20 text-primary", bg: "bg-primary", emoji: "🧹" },
  { id: "ac-repair", label: "AC Repair", icon: Wind, color: "bg-accent/10 border-accent/20 text-accent", bg: "bg-accent", emoji: "❄️" },
  { id: "carpentry", label: "Carpentry", icon: Hammer, color: "bg-primary/10 border-primary/20 text-primary", bg: "bg-primary", emoji: "🪛" },
  { id: "painting", label: "Painting", icon: Brush, color: "bg-accent/10 border-accent/20 text-accent", bg: "bg-accent", emoji: "🎨" },
  { id: "moving", label: "Moving Help", icon: Truck, color: "bg-primary/10 border-primary/20 text-primary", bg: "bg-primary", emoji: "📦" },
  { id: "appliance", label: "Appliance Repair", icon: Tv, color: "bg-accent/10 border-accent/20 text-accent", bg: "bg-accent", emoji: "📱" },
  { id: "others", label: "Others", icon: MoreHorizontal, color: "bg-foreground/5 border-border text-muted", bg: "bg-foreground/10", emoji: "❓" },
];

const urgencyOptions = [
  { id: "asap", label: "ASAP", desc: "Within 2 hours", icon: AlertCircle, color: "text-red-500 border-red-500/30 bg-red-500/10", surcharge: true },
  { id: "today", label: "Today", desc: "Later today", icon: Clock, color: "text-accent border-accent/30 bg-accent/10", surcharge: false },
  { id: "this-week", label: "This Week", desc: "Within 7 days", icon: Calendar, color: "text-primary border-primary/30 bg-primary/10", surcharge: false },
  { id: "flexible", label: "Flexible", desc: "I'm not in a rush", icon: CheckCircle, color: "text-green-500 border-green-500/30 bg-green-500/10", surcharge: false },
];

const STEPS = ["Category", "Describe", "Details", "Pick Worker", "Review"];

// ─── Location Picker ────────────────────────────────────────────────────────────
function LocationPicker({ location, setLocation }: { location: string; setLocation: (v: string) => void }) {
  const [query, setQuery] = useState(location);
  const [results, setResults] = useState<{ place_id: number; display_name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [geolocating, setGeolocating] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (location && !query) setQuery(location);
  }, [location, query]);

  useEffect(() => {
    if (!query || query === location) { setResults([]); setShowDropdown(false); return; }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=gh`);
        const data = await r.json();
        setResults(data); setShowDropdown(true);
      } catch {}
      setLoading(false);
    }, 600);
    return () => clearTimeout(t);
  }, [query, location]);

  const handleSelect = (address: string) => { setQuery(address); setLocation(address); setShowDropdown(false); };

  const handleGeo = () => {
    if (!navigator.geolocation) return;
    setGeolocating(true);
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`);
        const d = await r.json();
        const addr = d.display_name || "Current Location";
        setQuery(addr); setLocation(addr);
      } catch {}
      setGeolocating(false);
    }, () => setGeolocating(false));
  };

  return (
    <div className="relative">
      <div className="relative flex items-center">
        <MapPin className="absolute left-3.5 w-4 h-4 text-muted" />
        <input
          value={query}
          onChange={e => { setQuery(e.target.value); setLocation(e.target.value); }}
          placeholder="e.g. East Legon, Accra"
          className="w-full pl-10 pr-12 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none text-sm text-foreground placeholder:text-muted transition-all"
        />
        <button type="button" onClick={handleGeo} title="Use current location"
          className="absolute right-3 p-1.5 rounded-lg text-muted hover:text-primary hover:bg-foreground/5 transition-colors">
          {geolocating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crosshair className="w-4 h-4" />}
        </button>
      </div>
      {showDropdown && results.length > 0 && (
        <ul className="absolute z-60 w-full mt-1 bg-background border border-border rounded-xl shadow-2xl max-h-56 overflow-auto">
          {results.map(r => (
            <li key={r.place_id} onClick={() => handleSelect(r.display_name)}
              className="px-4 py-3 flex gap-2 text-sm text-foreground hover:bg-foreground/5 cursor-pointer border-b border-border/50 last:border-0">
              <MapPin className="w-4 h-4 text-muted flex-shrink-0 mt-0.5" />
              <span>{r.display_name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Pricing Summary ────────────────────────────────────────────────────────────
function PricingSummary({ serviceAmount, urgency, selectedTasker }: { serviceAmount: number; urgency: string; selectedTasker: any }) {
  const pricing = calculateTotal(serviceAmount, urgency);
  const hasEmergency = urgency === "asap";

  return (
    <div className="bg-foreground/[0.02] border border-border rounded-2xl overflow-hidden shadow-md transition-all">
      <div className="bg-gradient-to-r from-primary to-primary-dark px-6 py-4">
        <h3 className="text-white font-black text-sm uppercase tracking-wider">Cost Breakdown</h3>
      </div>

      {selectedTasker && (
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border/50">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 text-primary font-black">
            {selectedTasker.profiles?.full_name?.[0] || "T"}
          </div>
          <div>
            <p className="font-black text-sm text-foreground">{selectedTasker.profiles?.full_name || "Your Worker"}</p>
            <p className="text-xs text-muted">⭐ {selectedTasker.profiles?.rating?.toFixed(1) || "New"}</p>
          </div>
        </div>
      )}

      <div className="px-6 py-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted font-medium">Service Cost</span>
          <span className="font-black text-foreground">{formatGHS(pricing.serviceAmount)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Booking Protection
          </span>
          <span className="font-black text-foreground">{formatGHS(pricing.bookingProtection)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted font-medium flex items-center gap-1">
            <CreditCard className="w-3.5 h-3.5 text-primary" /> Service Fee
          </span>
          <span className="font-black text-foreground">{formatGHS(pricing.secureServiceCharge)}</span>
        </div>

        {hasEmergency && (
          <div className="border-t border-border pt-3">
            <div className="flex justify-between text-sm">
              <span className="text-red-500 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Rush Fee (2h)
              </span>
              <span className="font-black text-red-500">+{formatGHS(EMERGENCY_SURCHARGE)}</span>
            </div>
          </div>
        )}

        <div className="border-t border-border pt-3 flex justify-between">
          <span className="font-black text-foreground uppercase text-xs tracking-wider">Total Amount</span>
          <span className="font-black text-primary text-lg">{formatGHS(pricing.total)}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Step Progress Component ────────────────────────────────────────────────────
function StepProgress({ current, total }: { current: number; total: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        {STEPS.map((step, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs transition-all mb-2 ${
              i < current ? "bg-primary text-white" :
              i === current ? "bg-primary text-white ring-4 ring-primary/20" :
              "bg-foreground/10 text-muted"
            }`}>
              {i < current ? <CheckCircle className="w-5 h-5" /> : i + 1}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-wider text-center ${
              i <= current ? "text-foreground" : "text-muted"
            }`} style={{ maxWidth: "60px" }}>
              {step}
            </span>
          </div>
        ))}
      </div>
      <div className="w-full h-1 bg-border rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-primary to-accent-dark transition-all" style={{ width: `${(current + 1) / total * 100}%` }} />
      </div>
    </div>
  );
}

// ─── Tasker Card Component ────────────────────────────────────────────────────────
function TaskerCard({ tasker, selected, onSelect }: { tasker: any; selected: boolean; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
        selected
          ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
          : "border-border bg-foreground/[0.02] hover:border-primary/30 hover:shadow-md"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl flex-shrink-0 ${
          selected ? "bg-primary text-white" : "bg-foreground/10 text-foreground"
        }`}>
          {tasker.profiles?.full_name?.[0] || "T"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-black text-foreground truncate">{tasker.profiles?.full_name}</p>
          <p className="text-xs text-muted font-medium mb-2">⭐ {tasker.profiles?.rating?.toFixed(1) || "New"} · {tasker.profiles?.verified ? "✓ Verified" : "Unverified"}</p>
          <p className="text-xs text-muted line-clamp-2">{tasker.profiles?.bio || "No bio available"}</p>
        </div>
        {selected && <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />}
      </div>
    </button>
  );
}

// ─── Main Booking Component ────────────────────────────────────────────────────────
function BookingContent() {
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(0);
  const [category, setCategory] = useState(searchParams?.get("category") || "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState("flexible");
  const [images, setImages] = useState<File[]>([]);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [selectedTasker, setSelectedTasker] = useState<any>(null);
  const [taskers, setTaskers] = useState<any[]>([]);
  const [loadingTaskers, setLoadingTaskers] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState("");
  const [showSaveModal, setShowSaveModal] = useState(false);

  const serviceAmount = 150;
  const pricing = calculateTotal(serviceAmount, urgency);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 5 - images.length);
    setImages(prev => [...prev, ...files]);
  };

  const fetchTaskers = async () => {
    setLoadingTaskers(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("tasker_profiles")
      .select("*, profiles(full_name, bio, rating, avatar_url, verified)")
      .eq("specialties", category)
      .limit(5);
    setTaskers(data || []);
    setLoadingTaskers(false);
  };

  useEffect(() => {
    if (step === 3 && category) fetchTaskers();
  }, [step, category]);

  const handleSubmit = async () => {
    setSubmitting(true);
    const supabase = createClient();

    const ref = `TGH-${Date.now().toString(36).toUpperCase()}`;
    setBookingRef(ref);

    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();

      await supabase.from("bookings").insert({
        customer_id: user?.id || null,
        tasker_id: selectedTasker?.id || null,
        category,
        title: title || `${category} service request`,
        description,
        location,
        scheduled_at: date && time ? new Date(`${date}T${time}`).toISOString() : null,
        booking_type: "instant",
        status: "pending",
        urgency,
        guest_name: user ? null : fullName,
        guest_phone: user ? null : phone,
        guest_email: user ? null : email,
        is_guest: !user,
        booking_protection_fee: BOOKING_PROTECTION,
        secure_service_charge: pricing.secureServiceCharge,
        total_amount: pricing.total,
        payment_status: "pending",
        amount: serviceAmount,
      });
    }

    setSubmitting(false);
    setSubmitted(true);
    setShowSaveModal(true);
  };

  // ────── Confirmation View ──────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 transition-colors duration-300">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-accent/5 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-md w-full relative z-10">
          <div className="bg-foreground/[0.02] border border-border rounded-3xl backdrop-blur-xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-12 text-center">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-3xl font-black text-white mb-2" style={{ fontFamily: "var(--font-jakarta)" }}>
                Booking Confirmed!
              </h1>
              <p className="text-white/80 text-sm font-medium">Your worker will contact you shortly.</p>
            </div>
            <div className="px-6 py-8">
              <div className="bg-foreground/5 border border-border rounded-2xl px-5 py-4 mb-6 text-center">
                <p className="text-[10px] text-muted mb-1 uppercase tracking-widest font-black">Reference Number</p>
                <p className="text-2xl font-black text-primary tracking-wider">{bookingRef}</p>
              </div>

              {selectedTasker && (
                <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-2xl p-4 mb-6">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {selectedTasker.profiles?.full_name?.[0] || "W"}
                  </div>
                  <div>
                    <p className="font-black text-foreground text-sm">{selectedTasker.profiles?.full_name}</p>
                    <p className="text-xs text-muted">Your worker · Will contact soon</p>
                  </div>
                </div>
              )}

              {showSaveModal && (
                <div className="border border-border bg-foreground/5 rounded-2xl p-4 mb-6">
                  <p className="font-black text-foreground text-sm mb-1">Save for next time?</p>
                  <p className="text-xs text-muted mb-4">Create an account for faster bookings & history.</p>
                  <div className="flex gap-2">
                    <Link href="/signup" className="flex-1 bg-primary hover:bg-primary-dark text-white text-xs font-black py-3 rounded-xl text-center transition-all">
                      Create Account
                    </Link>
                    <button onClick={() => setShowSaveModal(false)} className="flex-1 bg-foreground/5 border border-border text-foreground text-xs font-black py-3 rounded-xl transition-all hover:bg-foreground/10">
                      Not Now
                    </button>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <Link href="/" className="w-full flex items-center justify-center gap-2 bg-foreground/5 border border-border text-foreground text-sm font-black py-3 rounded-xl transition-all hover:bg-foreground/10">
                  <ArrowLeft className="w-4 h-4" /> Back Home
                </Link>
                <a href={`https://wa.me/?text=I%20booked%20a%20${category}%20service%20on%20TaskGH!%20Ref:%20${bookingRef}`}
                  target="_blank" rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-black py-3 rounded-xl transition-all">
                  <CheckCircle className="w-4 h-4" /> Share on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="max-w-2xl mx-auto px-4 pt-20 pb-16">
        <TrustBar className="mb-10" />

        <div className="bg-foreground/[0.02] border border-border rounded-3xl backdrop-blur-xl shadow-xl p-8">
          <StepProgress current={step} total={STEPS.length} />

          {/* ── STEP 0: Category ──────────────────────────────────────────── */}
          {step === 0 && (
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-foreground mb-3" style={{ fontFamily: "var(--font-jakarta)" }}>
                What do you need?
              </h1>
              <p className="text-muted text-base mb-8">Select a service to get started. No account required.</p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {categories.map(cat => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.id;
                  return (
                    <button key={cat.id} onClick={() => { setCategory(cat.id); setStep(1); }}
                      className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all hover:scale-105 shadow-sm ${
                        isSelected 
                          ? "border-primary bg-primary/10 shadow-lg shadow-primary/20" 
                          : "border-border bg-background hover:border-primary/20 hover:shadow-md"
                      }`}>
                      <div className={`w-14 h-14 rounded-2xl ${isSelected ? "bg-primary" : cat.bg} flex items-center justify-center shadow-lg text-2xl`}>
                        {cat.emoji}
                      </div>
                      <span className={`text-xs font-black text-center leading-tight ${isSelected ? "text-primary" : "text-foreground"}`}>
                        {cat.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── STEP 1: Describe ──────────────────────────────────────────── */}
          {step === 1 && (
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-foreground mb-2" style={{ fontFamily: "var(--font-jakarta)" }}>
                Describe the job
              </h1>
              <p className="text-muted text-base mb-8">More details = Better matches with workers</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-muted mb-2 uppercase tracking-widest">Title</label>
                  <input value={title} onChange={e => setTitle(e.target.value)}
                    placeholder={`e.g. ${categories.find(c => c.id === category)?.label} needed`}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none text-sm text-foreground placeholder:text-muted font-medium" />
                </div>

                <div>
                  <label className="block text-xs font-black text-muted mb-2 uppercase tracking-widest">Description</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4}
                    placeholder="Describe the issue — what happened, what you've tried, timeline, budget range..."
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none text-sm text-foreground placeholder:text-muted resize-none" />
                </div>

                <div>
                  <label className="block text-xs font-black text-muted mb-3 uppercase tracking-widest">When do you need it?</label>
                  <div className="grid grid-cols-2 gap-3">
                    {urgencyOptions.map(u => {
                      const Icon = u.icon;
                      return (
                        <button key={u.id} onClick={() => setUrgency(u.id)}
                          className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                            urgency === u.id 
                              ? u.color.replace("border", "border-2 border").replace("bg-", "bg-") + " border-current" 
                              : "border-border bg-background text-muted hover:border-muted/30"
                          }`}>
                          <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-black uppercase tracking-tight">{u.label}</p>
                            <p className="text-[10px] opacity-70 font-medium">{u.desc}</p>
                            {u.surcharge && <p className="text-[10px] font-black text-red-500 mt-1">+{formatGHS(EMERGENCY_SURCHARGE)}</p>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-muted mb-3 uppercase tracking-widest">Photos (Optional, up to 5)</label>
                  <button onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-border hover:border-primary/50 hover:bg-foreground/5 rounded-xl py-8 flex flex-col items-center gap-3 text-muted hover:text-primary transition-all">
                    <Upload className="w-8 h-8 opacity-50" />
                    <span className="text-sm font-black">Click to upload images</span>
                    <span className="text-xs opacity-60">{images.length} of 5 files added</span>
                  </button>
                  <input ref={fileInputRef} type="file" multiple accept="image/*,video/*" className="hidden" onChange={handleImageUpload} />
                  
                  {images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {images.map((f, i) => (
                        <div key={i} className="relative group">
                          <div className="w-20 h-20 bg-foreground/5 border border-border rounded-xl flex items-center justify-center text-xs text-muted overflow-hidden shadow-sm">
                            {f.type.startsWith("image/") ? (
                              <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                            ) : "📹"}
                          </div>
                          <button onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={() => setStep(0)} className="flex items-center gap-2 text-muted font-black px-6 py-3 rounded-xl border border-border hover:bg-foreground/5 transition-all text-sm">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={() => setStep(2)} disabled={!title.trim()}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-40 text-white font-black py-3 rounded-xl transition-all text-sm shadow-xl shadow-primary/20 active:scale-95">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Your Details ──────────────────────────────────────── */}
          {step === 2 && (
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-foreground mb-2" style={{ fontFamily: "var(--font-jakarta)" }}>
                Your contact info
              </h1>
              <p className="text-muted text-base mb-8">We'll use this to connect you with your worker</p>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-black text-muted mb-2 uppercase tracking-widest">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input value={fullName} onChange={e => setFullName(e.target.value)}
                      placeholder="John Mensah"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none text-sm text-foreground placeholder:text-muted font-medium transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-muted mb-2 uppercase tracking-widest">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input value={phone} onChange={e => setPhone(e.target.value)}
                      placeholder="0244 123 456"
                      type="tel"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none text-sm text-foreground placeholder:text-muted font-medium transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-muted mb-2 uppercase tracking-widest">Email (Optional)</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      type="email"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none text-sm text-foreground placeholder:text-muted font-medium transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-muted mb-2 uppercase tracking-widest">Location *</label>
                  <LocationPicker location={location} setLocation={setLocation} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black text-muted mb-2 uppercase tracking-widest">Preferred Date *</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none text-sm text-foreground transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-muted mb-2 uppercase tracking-widest">Time *</label>
                    <input type="time" value={time} onChange={e => setTime(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none text-sm text-foreground transition-all" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={() => setStep(1)} className="flex items-center gap-2 text-muted font-black px-6 py-3 rounded-xl border border-border hover:bg-foreground/5 transition-all text-sm">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={() => setStep(3)} disabled={!fullName.trim() || !phone.trim() || !location.trim() || !date || !time}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-40 text-white font-black py-3 rounded-xl transition-all text-sm shadow-xl shadow-primary/20 active:scale-95">
                  See Workers <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Pick Worker ───────────────────────────────────────── */}
          {step === 3 && (
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-foreground mb-2" style={{ fontFamily: "var(--font-jakarta)" }}>
                Choose your worker
              </h1>
              <p className="text-muted text-base mb-8">Pick from our top-rated verified professionals</p>

              {loadingTaskers ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                  <div className="relative">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                  </div>
                  <p className="text-muted text-sm font-black">Finding workers nearby…</p>
                </div>
              ) : taskers.length === 0 ? (
                <div className="text-center py-16 bg-foreground/[0.03] border border-dashed border-border rounded-2xl">
                  <User className="w-12 h-12 text-muted mx-auto mb-4 opacity-40" />
                  <p className="font-black text-foreground mb-2">Workers are assembling!</p>
                  <p className="text-xs text-muted max-w-xs mx-auto leading-relaxed">
                    We're recruiting in your area. We'll assign our best worker for your job.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 mb-8">
                  {taskers.map(t => (
                    <TaskerCard key={t.id} tasker={t} selected={selectedTasker?.id === t.id} onSelect={() => setSelectedTasker(t)} />
                  ))}
                </div>
              )}

              <div className="flex gap-3 mt-8">
                <button onClick={() => setStep(2)} className="flex items-center gap-2 text-muted font-black px-6 py-3 rounded-xl border border-border hover:bg-foreground/5 transition-all text-sm">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={() => setStep(4)}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-black py-3 rounded-xl transition-all text-sm shadow-xl shadow-primary/20 active:scale-95">
                  {selectedTasker ? "Continue" : "Skip & Continue"} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 4: Review & Checkout ────────────────────────────────── */}
          {step === 4 && (
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-foreground mb-2" style={{ fontFamily: "var(--font-jakarta)" }}>
                Confirm & Pay
              </h1>
              <p className="text-muted text-base mb-8">Review your booking details below</p>

              {/* Summary Card */}
              <div className="bg-foreground/[0.03] border border-border rounded-2xl p-6 mb-8 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-black text-muted uppercase tracking-widest">Service</p>
                    <p className="font-black text-foreground capitalize">{category?.replace("-", " ")}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-muted uppercase tracking-widest mb-1">When</p>
                    <p className="font-black text-foreground text-sm">{date} at {time}</p>
                  </div>
                </div>
                <div className="h-px bg-border/50" />
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-black text-muted uppercase tracking-widest mb-1">Location</p>
                    <p className="font-black text-foreground line-clamp-2">{location}</p>
                  </div>
                  {selectedTasker && (
                    <div className="text-right">
                      <p className="text-xs font-black text-muted uppercase tracking-widest mb-1">Worker</p>
                      <p className="font-black text-foreground">{selectedTasker.profiles?.full_name}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing */}
              <div className="mb-8">
                <PricingSummary serviceAmount={serviceAmount} urgency={urgency} selectedTasker={selectedTasker} />
              </div>

              {/* Payment Method */}
              <div className="mb-8">
                <p className="text-xs font-black text-muted mb-3 uppercase tracking-wider">Payment Method</p>
                <button className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-primary bg-primary/10 text-primary">
                  <Smartphone className="w-5 h-5" />
                  <span className="font-black text-sm uppercase tracking-wider">Mobile Money (GHS)</span>
                  <CheckCircle className="w-5 h-5 ml-auto" />
                </button>
              </div>

              {/* Agreement */}
              <div className="bg-foreground/[0.03] border border-border rounded-xl p-4 mb-8">
                <p className="text-xs text-muted leading-relaxed">
                  By booking, you agree to our Terms of Service. Your payment is protected by Paystack encryption. No additional charges will be added.
                </p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(3)} className="flex items-center gap-2 text-muted font-black px-6 py-3 rounded-xl border border-border hover:bg-foreground/5 transition-all text-sm">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={handleSubmit} disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-black py-3 rounded-xl transition-all text-sm shadow-xl shadow-primary/20 active:scale-95">
                  {submitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" /> Book Now • {formatGHS(pricing.total)}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <BookingContent />
    </Suspense>
  );
}
