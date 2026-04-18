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
  ShieldCheck, CreditCard, Smartphone
} from "lucide-react";

// ─── Categories ────────────────────────────────────────────────────────────────
const categories = [
  { id: "plumbing", label: "Plumbing", icon: Wrench, color: "bg-primary/10 border-primary/20 text-primary", bg: "bg-primary" },
  { id: "electrical", label: "Electrical", icon: Zap, color: "bg-accent/10 border-accent/20 text-accent", bg: "bg-accent" },
  { id: "cleaning", label: "Cleaning", icon: Home, color: "bg-primary/10 border-primary/20 text-primary", bg: "bg-primary" },
  { id: "ac-repair", label: "AC Repair", icon: Wind, color: "bg-accent/10 border-accent/20 text-accent", bg: "bg-accent" },
  { id: "carpentry", label: "Carpentry", icon: Hammer, color: "bg-primary/10 border-primary/20 text-primary", bg: "bg-primary" },
  { id: "painting", label: "Painting", icon: Brush, color: "bg-accent/10 border-accent/20 text-accent", bg: "bg-accent" },
  { id: "moving", label: "Moving Help", icon: Truck, color: "bg-primary/10 border-primary/20 text-primary", bg: "bg-primary" },
  { id: "appliance", label: "Appliance Repair", icon: Tv, color: "bg-accent/10 border-accent/20 text-accent", bg: "bg-accent" },
  { id: "others", label: "Others", icon: MoreHorizontal, color: "bg-foreground/5 border-border text-muted", bg: "bg-foreground/10" },
];

const urgencyOptions = [
  { id: "asap", label: "ASAP", desc: "Within 2 hours", icon: AlertCircle, color: "text-red-500 border-red-500/30 bg-red-500/10", surcharge: true },
  { id: "today", label: "Today", desc: "Later today", icon: Clock, color: "text-accent border-accent/30 bg-accent/10", surcharge: false },
  { id: "this-week", label: "This Week", desc: "Within 7 days", icon: Calendar, color: "text-primary border-primary/30 bg-primary/10", surcharge: false },
  { id: "flexible", label: "Flexible", desc: "I'm not in a rush", icon: CheckCircle, color: "text-green-500 border-green-500/30 bg-green-500/10", surcharge: false },
];

const STEPS = ["Category", "Describe", "Your Details", "Pick Tasker", "Checkout"];

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
          className="w-full pl-10 pr-12 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none text-sm text-foreground placeholder-slate-400 transition-all"
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
    <div className="bg-background border border-border rounded-2xl overflow-hidden shadow-2xl transition-colors duration-300">
      <div className="bg-gradient-to-r from-primary to-primary-dark px-5 py-4">
        <h3 className="text-white font-bold text-sm mb-0.5">Booking Summary</h3>
        <p className="text-white/80 text-xs text-secondary italic">Protected by TaskGH Secure Pay</p>
      </div>

      {selectedTasker && (
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 text-primary font-bold">
            {selectedTasker.profiles?.full_name?.[0] || "T"}
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground">{selectedTasker.profiles?.full_name || "Your Tasker"}</p>
            <p className="text-xs text-muted">{selectedTasker.category} · ⭐ {selectedTasker.rating?.toFixed(1) || "New"}</p>
          </div>
        </div>
      )}

      <div className="px-5 py-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted">Service Cost</span>
          <span className="font-semibold text-foreground">{formatGHS(pricing.serviceAmount)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Safe Booking Fee
          </span>
          <span className="font-semibold text-foreground">{formatGHS(pricing.bookingProtection)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted flex items-center gap-1">
            <CreditCard className="w-3.5 h-3.5 text-primary" /> Service Fee
          </span>
          <span className="font-semibold text-foreground">{formatGHS(pricing.secureServiceCharge)}</span>
        </div>
        {hasEmergency && (
          <div className="flex justify-between text-sm">
            <span className="text-primary font-bold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> Emergency Fee
            </span>
            <span className="font-black text-primary">{formatGHS(pricing.emergencySurcharge)}</span>
          </div>
        )}
        <div className="border-t border-border pt-3 flex justify-between">
          <span className="font-bold text-foreground">Total Due</span>
          <span className="font-black text-primary text-lg">{formatGHS(pricing.total)}</span>
        </div>
      </div>

      <div className="px-5 pb-4">
        <p className="text-xs text-muted flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-green-500" />
          Payment held securely until your task is completed
        </p>
      </div>
    </div>
  );
}

// ─── Tasker Card ───────────────────────────────────────────────────────────────
function TaskerCard({ tasker, selected, onSelect }: { tasker: any; selected: boolean; onSelect: () => void }) {
  const name = tasker.profiles?.full_name || "Tasker";
  const initial = name[0].toUpperCase();
  const rating = tasker.rating?.toFixed(1) ?? "New";
  const jobs = tasker.review_count ?? 0;

  return (
    <button onClick={onSelect}
      className={`w-full text-left p-4 rounded-2xl border-2 transition-all group ${
        selected 
          ? "border-primary bg-primary/5 shadow-lg shadow-primary/5" 
          : "border-border bg-foreground/[0.02] hover:border-primary/50 hover:bg-foreground/[0.04]"
      }`}>
      <div className="flex items-start gap-3">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 ${selected ? "bg-primary" : "bg-slate-700"}`}>
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-bold text-foreground text-sm truncate">{name}</p>
            {tasker.is_verified && (
              <span className="flex items-center gap-0.5 text-[10px] uppercase font-black text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full flex-shrink-0">
                <CheckCircle className="w-3 h-3" /> Verified
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted">
            <span className="flex items-center gap-0.5">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> {rating}
            </span>
            <span>{jobs} jobs done</span>
            {tasker.hourly_rate && <span className="text-primary font-semibold">From {formatGHS(tasker.hourly_rate)}/hr</span>}
          </div>
          {tasker.bio && <p className="text-xs text-muted/70 mt-1 line-clamp-2">{tasker.bio}</p>}
        </div>
        {selected && <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />}
      </div>
    </button>
  );
}

// ─── Step Progress Bar ─────────────────────────────────────────────────────────
function StepProgress({ current, total }: { current: number; total: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-muted uppercase tracking-wider">Step {current + 1} of {total}</span>
        <span className="text-xs font-bold text-primary">{STEPS[current]}</span>
      </div>
      <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
        <div className="bg-primary h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${((current + 1) / total) * 100}%` }} />
      </div>
    </div>
  );
}

// ─── Main Booking Flow ─────────────────────────────────────────────────────────
function BookingContent() {
  const params = useSearchParams();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState("");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [category, setCategory] = useState(params.get("category") || "");
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

  const serviceAmount = selectedTasker?.hourly_rate || 150;
  const pricing = calculateTotal(serviceAmount, urgency);

  // Skip to step if category pre-selected
  useEffect(() => {
    if (params.get("category")) setStep(1);
  }, [params]);

  // Fetch real taskers from Supabase when reaching Step 3
  useEffect(() => {
    if (step === 3) {
      setLoadingTaskers(true);
      const supabase = createClient();
      if (!supabase) { setLoadingTaskers(false); return; }

      supabase
        .from("tasker_profiles")
        .select("*, profiles(full_name, avatar_url, email)")
        .eq("is_verified", true)
        .order("rating", { ascending: false })
        .limit(10)
        .then(({ data }: { data: any[] | null }) => {
          const filtered = data?.filter((t: any) => {
            if (!category) return true;
            const cats = t.categories || [];
            return cats.includes(category) || cats.length === 0;
          }) ?? data ?? [];
          setTaskers(filtered.length > 0 ? filtered : (data ?? []));
          setLoadingTaskers(false);
        });
    }
  }, [step, category]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(prev => [...prev, ...files].slice(0, 5));
  };

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

  // ── Submitted / Confirmation View ────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 transition-colors duration-300">
        {/* Background Glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-accent/5 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-md w-full relative z-10">
          <div className="bg-foreground/[0.02] border border-border rounded-3xl backdrop-blur-xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-black text-white mb-2" style={{ fontFamily: "var(--font-jakarta)" }}>Booking Confirmed!</h1>
              <p className="text-white/80 text-sm font-medium">Your tasker will be in touch shortly.</p>
            </div>
            <div className="px-6 py-6">
              <div className="bg-background/50 border border-border rounded-2xl px-5 py-4 mb-5 text-center">
                <p className="text-[10px] text-muted mb-1 uppercase tracking-widest font-black">Booking Reference</p>
                <p className="text-xl font-black text-foreground tracking-widest">{bookingRef}</p>
              </div>

              {selectedTasker && (
                <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-2xl p-4 mb-5">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {selectedTasker.profiles?.full_name?.[0] || "T"}
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">{selectedTasker.profiles?.full_name}</p>
                    <p className="text-xs text-muted">Your tasker · Will contact you soon</p>
                  </div>
                </div>
              )}

              {showSaveModal && (
                <div className="border border-primary/20 bg-primary/5 rounded-2xl p-4 mb-4">
                  <p className="font-bold text-foreground text-sm mb-1">Save your details?</p>
                  <p className="text-xs text-muted mb-3">Create an account for faster future bookings and history.</p>
                  <div className="flex gap-2">
                    <Link href="/signup" className="flex-1 bg-primary hover:bg-primary-dark text-white text-xs font-bold py-2.5 rounded-xl text-center transition-colors">
                      Create Account
                    </Link>
                    <button onClick={() => setShowSaveModal(false)} className="flex-1 bg-background border border-border text-foreground text-xs font-semibold py-2.5 rounded-xl transition-colors hover:bg-foreground/5">
                      Skip for Now
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Link href="/" className="flex-1 bg-foreground/5 border border-border text-foreground text-sm font-semibold py-3 rounded-xl text-center transition-colors">
                  Back to Home
                </Link>
                <a href={`https://wa.me/?text=I just booked a ${category} service on TaskGH! Ref: ${bookingRef}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-3 rounded-xl text-center transition-colors">
                  Share on WhatsApp
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
      <div className="max-w-2xl mx-auto px-4 pt-24 pb-16">
        {/* Trust bar */}
        <TrustBar className="mb-8" />

        <div className="bg-foreground/[0.02] border border-border rounded-[2.5rem] backdrop-blur-xl shadow-2xl p-6 md:p-10">
          <StepProgress current={step} total={STEPS.length} />

          {/* ── STEP 0: Category ──────────────────────────────────────────── */}
          {step === 0 && (
            <div>
              <h1 className="text-3xl font-black text-foreground mb-1 tracking-tight" style={{ fontFamily: "var(--font-jakarta)" }}>
                How can we help?
              </h1>
              <p className="text-muted text-sm mb-8">No account needed. Find a worker in a minute.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {categories.map(cat => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.id;
                  return (
                    <button key={cat.id} onClick={() => { setCategory(cat.id); setStep(1); }}
                      className={`flex flex-col items-center gap-3 p-5 rounded-3xl border-2 transition-all hover:scale-[1.02] hover:shadow-xl ${
                        isSelected 
                          ? "border-primary bg-primary/5 shadow-green" 
                          : "border-border bg-background hover:border-primary/20"
                      }`}>
                      <div className={`w-12 h-12 rounded-2xl ${isSelected ? "bg-primary" : cat.bg} flex items-center justify-center shadow-lg shadow-primary/10`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span className={`text-sm font-black text-center leading-tight ${isSelected ? "text-primary" : "text-foreground"}`}>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── STEP 1: Describe ──────────────────────────────────────────── */}
          {step === 1 && (
            <div>
              <h1 className="text-2xl font-black text-foreground mb-1 tracking-tight" style={{ fontFamily: "var(--font-jakarta)" }}>
                What's the issue?
              </h1>
              <p className="text-muted text-sm mb-8 font-medium">The more detail you give, the better the match.</p>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-muted mb-2 uppercase tracking-widest">Title</label>
                  <input value={title} onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Leaking pipe under kitchen sink"
                    className="w-full px-5 py-4 rounded-2xl border border-border bg-background focus:border-primary focus:ring-primary/5 transition-all outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-black text-muted mb-2 uppercase tracking-widest">Description</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4}
                    placeholder="Describe the problem — what happened, what you've tried, etc."
                    className="w-full px-5 py-4 rounded-2xl border border-border bg-background focus:border-primary focus:ring-primary/5 transition-all outline-none resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-black text-muted mb-2 uppercase tracking-widest">Photos / Videos (optional)</label>
                  <button onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-border hover:border-primary/50 hover:bg-foreground/5 rounded-2xl py-10 flex flex-col items-center gap-2 text-muted hover:text-primary transition-all">
                    <Upload className="w-8 h-8 opacity-50" />
                    <span className="text-sm font-bold">Add images or videos</span>
                    <span className="text-xs opacity-60">Up to 5 files allowed</span>
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
                <div>
                  <label className="block text-xs font-black text-muted mb-3 uppercase tracking-widest">Urgency</label>
                  <div className="grid grid-cols-2 gap-3">
                    {urgencyOptions.map(u => {
                      const Icon = u.icon;
                      return (
                        <button key={u.id} onClick={() => setUrgency(u.id)}
                          className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all ${
                            urgency === u.id 
                              ? u.color + " border-current" 
                              : "border-border bg-background text-muted hover:border-muted/30"
                          }`}>
                          <div className={`p-2 rounded-xl bg-current opacity-10`} />
                          <Icon className="absolute w-4 h-4 ml-2" />
                          <div className="ml-8">
                            <p className="text-xs font-black uppercase tracking-tight">{u.label}</p>
                            <p className="text-[10px] opacity-70 font-bold">{u.desc}</p>
                            {u.surcharge && <p className="text-[10px] font-black text-red-500 mt-0.5">+GH₵{EMERGENCY_SURCHARGE}</p>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mt-10">
                <button onClick={() => setStep(0)} className="flex items-center gap-2 text-muted font-bold px-6 py-4 rounded-2xl border border-border hover:bg-foreground/5 transition-all text-sm">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={() => setStep(2)} disabled={!title.trim()}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-40 text-white font-black py-4 rounded-2xl transition-all text-sm shadow-xl shadow-primary/20 active:scale-95">
                  Next Step <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Customer Details ──────────────────────────────────── */}
          {step === 2 && (
            <div>
              <h1 className="text-2xl font-black text-foreground mb-1 tracking-tight" style={{ fontFamily: "var(--font-jakarta)" }}>
                Contact details
              </h1>
              <p className="text-muted text-sm mb-8 font-medium">We'll use these to connect you with your tasker.</p>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-muted mb-2 uppercase tracking-widest">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="John Mensah"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-background focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none font-medium text-sm text-foreground transition-all" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-muted mb-2 uppercase tracking-widest">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                      <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="0244 000 000" type="tel"
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-background focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none font-medium text-sm text-foreground transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-muted mb-2 uppercase tracking-widest">Email (optional)</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" type="email"
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-background focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none font-medium text-sm text-foreground transition-all" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-muted mb-2 uppercase tracking-widest">Address</label>
                  <LocationPicker location={location} setLocation={setLocation} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-muted mb-2 uppercase tracking-widest">Preferred Date</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-5 py-4 rounded-2xl border border-border bg-background focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none font-medium text-sm text-foreground transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-muted mb-2 uppercase tracking-widest">Time</label>
                    <input type="time" value={time} onChange={e => setTime(e.target.value)}
                      className="w-full px-5 py-4 rounded-2xl border border-border bg-background focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none font-medium text-sm text-foreground transition-all" />
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mt-10">
                <button onClick={() => setStep(1)} className="flex items-center gap-2 text-muted font-bold px-6 py-4 rounded-2xl border border-border hover:bg-foreground/5 transition-all text-sm">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={() => setStep(3)} disabled={!fullName.trim() || !phone.trim() || !location.trim() || !date || !time}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-40 text-white font-black py-4 rounded-2xl transition-all text-sm shadow-xl shadow-primary/20 active:scale-95">
                  See Available Taskers <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Pick Tasker ───────────────────────────────────────── */}
          {step === 3 && (
            <div>
              <h1 className="text-2xl font-black text-foreground mb-1 tracking-tight" style={{ fontFamily: "var(--font-jakarta)" }}>
                Pick a professional
              </h1>
              <p className="text-muted text-sm mb-8 font-medium">Choose from our top-rated verified workers.</p>

              {loadingTaskers ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="relative">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                    <div className="absolute inset-0 bg-primary blur-xl opacity-20 animate-pulse" />
                  </div>
                  <p className="text-muted text-sm font-bold tracking-tight text-primary">Finding nearby help…</p>
                </div>
              ) : taskers.length === 0 ? (
                <div className="text-center py-16 bg-foreground/[0.03] border border-dashed border-border rounded-3xl">
                  <User className="w-12 h-12 text-muted mx-auto mb-4 opacity-50" />
                  <p className="font-black text-foreground mb-2">Almost there!</p>
                  <p className="text-xs text-muted max-w-[240px] mx-auto leading-relaxed">
                    We're currently recruiting in your area. We'll manually assign our best tasker for this job.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 mb-8">
                  {taskers.map(t => (
                    <TaskerCard key={t.id} tasker={t} selected={selectedTasker?.id === t.id} onSelect={() => setSelectedTasker(t)} />
                  ))}
                </div>
              )}

              <div className="flex gap-4 mt-2">
                <button onClick={() => setStep(2)} className="flex items-center gap-2 text-muted font-bold px-6 py-4 rounded-2xl border border-border hover:bg-foreground/5 transition-all text-sm">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={() => setStep(4)}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-black py-4 rounded-2xl transition-all text-sm shadow-xl shadow-primary/20 active:scale-95">
                  {selectedTasker ? "Checkout Now" : "Skip Selection"} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 4: Checkout ──────────────────────────────────────────── */}
          {step === 4 && (
            <div>
              <h1 className="text-2xl font-black text-foreground mb-1 tracking-tight" style={{ fontFamily: "var(--font-jakarta)" }}>
                Final review
              </h1>
              <p className="text-muted text-sm mb-8 font-medium">Almost done! Confirm everything looks correct.</p>

              {/* Booking Details Summary */}
              <div className="bg-foreground/[0.03] border border-border rounded-3xl p-6 mb-8 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
                  <span className="text-muted font-black uppercase tracking-widest text-[10px]">What & Where</span>
                  <div className="text-right">
                    <p className="font-black text-foreground capitalize">{category?.replace("-", " ")}</p>
                    <p className="text-xs text-muted font-medium line-clamp-1">{location}</p>
                  </div>
                </div>
                <div className="h-px bg-border/50" />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
                  <span className="text-muted font-black uppercase tracking-widest text-[10px]">Scheduled For</span>
                  <p className="font-black text-foreground">{date} at {time}</p>
                </div>
                <div className="h-px bg-border/50" />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
                  <span className="text-muted font-black uppercase tracking-widest text-[10px]">Contact</span>
                  <p className="font-black text-foreground">{fullName} · {phone}</p>
                </div>
              </div>

              {/* Pricing Summary */}
              <PricingSummary serviceAmount={serviceAmount} urgency={urgency} selectedTasker={selectedTasker} />

              {/* Payment Methods */}
              <div className="mt-8">
                <p className="text-xs font-black text-muted mb-4 uppercase tracking-[0.2em]">Select Payment</p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <button className="flex flex-col items-center gap-2 p-5 rounded-2xl border-2 border-primary bg-primary/5 text-primary">
                    <Smartphone className="w-6 h-6" />
                    <span className="text-xs font-black uppercase tracking-tight">Mobile Money</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 p-5 rounded-2xl border-2 border-border bg-background text-muted hover:border-muted/30 transition-all">
                    <CreditCard className="w-6 h-6" />
                    <span className="text-xs font-black uppercase tracking-tight">Debit/Credit</span>
                  </button>
                </div>

                <button onClick={handleSubmit} disabled={submitting}
                  className="w-full flex items-center justify-center gap-3 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-black py-5 rounded-[1.5rem] transition-all text-lg shadow-2xl shadow-primary/30 active:scale-95 group">
                  {submitting ? (
                    <><Loader2 className="w-6 h-6 animate-spin" /> Processing…</>
                  ) : (
                    <>
                      <ShieldCheck className="w-6 h-6 group-hover:scale-110 transition-transform" /> 
                      Confirm & Pay {formatGHS(pricing.total)}
                    </>
                  )}
                </button>

                <p className="text-center text-[10px] text-muted mt-5 font-bold flex items-center justify-center gap-1.5 uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                  Secured by Paystack · Data Encrypted
                </p>
              </div>

              <div className="mt-6 text-center">
                <button onClick={() => setStep(3)} className="text-muted text-xs font-bold hover:text-foreground transition-all">
                  ← Back to tasker selection
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
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <div className="absolute inset-0 bg-primary blur-xl opacity-20 animate-pulse" />
        </div>
      </div>
    }>
      <BookingContent />
    </Suspense>
  );
}
