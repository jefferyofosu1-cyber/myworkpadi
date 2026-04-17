"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import TrustBar from "@/components/TrustBar";
import { createClient } from "@/utils/supabase/client";
import { calculateTotal, formatGHS, BOOKING_PROTECTION, EMERGENCY_SURCHARGE } from "@/lib/pricing";
import {
  Wrench, Zap, Home, Truck, Brush, Wind, Hammer, Tv, MoreHorizontal,
  ArrowRight, ArrowLeft, Upload, MapPin, Calendar, Clock, AlertCircle,
  User, CheckCircle, Loader2, Crosshair, Star, X, Phone, Mail, ChevronDown,
  ShieldCheck, CreditCard, Banknote, Phone as PhoneIcon
} from "lucide-react";

// ─── Categories ────────────────────────────────────────────────────────────────
const categories = [
  { id: "plumbing", label: "Plumbing", icon: Wrench, color: "bg-blue-50 border-blue-200 text-blue-700", bg: "bg-blue-600" },
  { id: "electrical", label: "Electrical", icon: Zap, color: "bg-yellow-50 border-yellow-200 text-yellow-700", bg: "bg-yellow-500" },
  { id: "cleaning", label: "Cleaning", icon: Home, color: "bg-green-50 border-green-200 text-green-700", bg: "bg-green-600" },
  { id: "ac-repair", label: "AC Repair", icon: Wind, color: "bg-cyan-50 border-cyan-200 text-cyan-700", bg: "bg-cyan-600" },
  { id: "carpentry", label: "Carpentry", icon: Hammer, color: "bg-orange-50 border-orange-200 text-orange-700", bg: "bg-orange-600" },
  { id: "painting", label: "Painting", icon: Brush, color: "bg-pink-50 border-pink-200 text-pink-700", bg: "bg-pink-600" },
  { id: "moving", label: "Moving Help", icon: Truck, color: "bg-purple-50 border-purple-200 text-purple-700", bg: "bg-purple-600" },
  { id: "appliance", label: "Appliance Repair", icon: Tv, color: "bg-red-50 border-red-200 text-red-700", bg: "bg-red-600" },
  { id: "others", label: "Others", icon: MoreHorizontal, color: "bg-slate-50 border-slate-200 text-slate-700", bg: "bg-slate-600" },
];

const urgencyOptions = [
  { id: "asap", label: "ASAP", desc: "Within 2 hours", icon: AlertCircle, color: "text-red-600 border-red-300 bg-red-50", surcharge: true },
  { id: "today", label: "Today", desc: "Later today", icon: Clock, color: "text-orange-600 border-orange-300 bg-orange-50", surcharge: false },
  { id: "this-week", label: "This Week", desc: "Within 7 days", icon: Calendar, color: "text-blue-600 border-blue-300 bg-blue-50", surcharge: false },
  { id: "flexible", label: "Flexible", desc: "I'm not in a rush", icon: CheckCircle, color: "text-green-600 border-green-300 bg-green-50", surcharge: false },
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
        <MapPin className="absolute left-3.5 w-4 h-4 text-slate-400" />
        <input
          value={query}
          onChange={e => { setQuery(e.target.value); setLocation(e.target.value); }}
          placeholder="e.g. East Legon, Accra"
          className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none text-sm text-slate-800 placeholder-slate-300 transition-all"
        />
        <button type="button" onClick={handleGeo} title="Use current location"
          className="absolute right-3 p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
          {geolocating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crosshair className="w-4 h-4" />}
        </button>
      </div>
      {showDropdown && results.length > 0 && (
        <ul className="absolute z-20 w-full mt-1 bg-white border border-slate-100 rounded-xl shadow-lg max-h-56 overflow-auto">
          {results.map(r => (
            <li key={r.place_id} onClick={() => handleSelect(r.display_name)}
              className="px-4 py-3 flex gap-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0">
              <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
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
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4">
        <h3 className="text-white font-bold text-sm mb-0.5">Booking Summary</h3>
        <p className="text-blue-200 text-xs">Protected by TaskGH Secure Pay</p>
      </div>

      {selectedTasker && (
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-blue-700 font-bold">
            {selectedTasker.profiles?.full_name?.[0] || "T"}
          </div>
          <div>
            <p className="font-semibold text-sm text-slate-800">{selectedTasker.profiles?.full_name || "Your Tasker"}</p>
            <p className="text-xs text-slate-400">{selectedTasker.category} · ⭐ {selectedTasker.rating?.toFixed(1) || "New"}</p>
          </div>
        </div>
      )}

      <div className="px-5 py-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Service Cost</span>
          <span className="font-semibold text-slate-800">{formatGHS(pricing.serviceAmount)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> Booking Protection
          </span>
          <span className="font-semibold text-slate-800">{formatGHS(pricing.bookingProtection)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600 flex items-center gap-1">
            <CreditCard className="w-3.5 h-3.5 text-blue-500" /> Secure Service Charge
          </span>
          <span className="font-semibold text-slate-800">{formatGHS(pricing.secureServiceCharge)}</span>
        </div>
        {hasEmergency && (
          <div className="flex justify-between text-sm">
            <span className="text-orange-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> Emergency Surcharge
            </span>
            <span className="font-semibold text-orange-600">{formatGHS(pricing.emergencySurcharge)}</span>
          </div>
        )}
        <div className="border-t border-slate-100 pt-3 flex justify-between">
          <span className="font-bold text-slate-900">Total Due</span>
          <span className="font-black text-blue-700 text-lg">{formatGHS(pricing.total)}</span>
        </div>
      </div>

      <div className="px-5 pb-4">
        <p className="text-xs text-slate-400 flex items-center gap-1">
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
      className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${selected ? "border-blue-600 bg-blue-50 shadow-lg shadow-blue-100" : "border-slate-200 hover:border-blue-300 hover:shadow-md bg-white"}`}>
      <div className="flex items-start gap-3">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 ${selected ? "bg-blue-600" : "bg-slate-700"}`}>
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-bold text-slate-800 text-sm truncate">{name}</p>
            {tasker.is_verified && (
              <span className="flex items-center gap-0.5 text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full flex-shrink-0">
                <CheckCircle className="w-3 h-3" /> Verified
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
            <span className="flex items-center gap-0.5">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> {rating}
            </span>
            <span>{jobs} jobs done</span>
            {tasker.hourly_rate && <span className="text-blue-600 font-semibold">From {formatGHS(tasker.hourly_rate)}/hr</span>}
          </div>
          {tasker.bio && <p className="text-xs text-slate-400 mt-1 line-clamp-2">{tasker.bio}</p>}
        </div>
        {selected && <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />}
      </div>
    </button>
  );
}

// ─── Step Progress Bar ─────────────────────────────────────────────────────────
function StepProgress({ current, total }: { current: number; total: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Step {current + 1} of {total}</span>
        <span className="text-xs font-bold text-blue-600">{STEPS[current]}</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-1.5">
        <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
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
          // Filter by category if possible (categories stored as array or comma list)
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 px-6 py-10 text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-black text-white mb-2" style={{ fontFamily: "var(--font-jakarta)" }}>Booking Confirmed!</h1>
              <p className="text-blue-100 text-sm">Your tasker will be in touch shortly.</p>
            </div>
            <div className="px-6 py-6">
              <div className="bg-slate-50 rounded-2xl px-5 py-4 mb-5 text-center">
                <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider font-semibold">Booking Reference</p>
                <p className="text-xl font-black text-slate-900 tracking-widest">{bookingRef}</p>
              </div>

              {selectedTasker && (
                <div className="flex items-center gap-3 bg-blue-50 rounded-2xl p-4 mb-5">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {selectedTasker.profiles?.full_name?.[0] || "T"}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{selectedTasker.profiles?.full_name}</p>
                    <p className="text-xs text-slate-500">Your tasker · Will contact you soon</p>
                  </div>
                </div>
              )}

              {showSaveModal && (
                <div className="border border-orange-200 bg-orange-50 rounded-2xl p-4 mb-4">
                  <p className="font-bold text-slate-800 text-sm mb-1">Save your details?</p>
                  <p className="text-xs text-slate-500 mb-3">Create an account for faster future bookings and booking history.</p>
                  <div className="flex gap-2">
                    <Link href="/signup" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl text-center transition-colors">
                      Create Account
                    </Link>
                    <button onClick={() => setShowSaveModal(false)} className="flex-1 bg-white border border-slate-200 text-slate-600 text-xs font-semibold py-2.5 rounded-xl transition-colors hover:bg-slate-50">
                      Continue as Guest
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Link href="/" className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold py-3 rounded-xl text-center transition-colors">
                  Back to Home
                </Link>
                <a href={`https://wa.me/?text=I just booked a ${category} service on TaskGH! Ref: ${bookingRef}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-3 rounded-xl text-center transition-colors">
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
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 pt-24 pb-16">
        {/* Trust bar */}
        <TrustBar className="mb-8" />

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8">
          <StepProgress current={step} total={STEPS.length} />

          {/* ── STEP 0: Category ──────────────────────────────────────────── */}
          {step === 0 && (
            <div>
              <h1 className="text-2xl font-black text-slate-900 mb-1" style={{ fontFamily: "var(--font-jakarta)" }}>
                What do you need help with?
              </h1>
              <p className="text-slate-400 text-sm mb-6">No account needed. Book in 60 seconds.</p>
              <div className="grid grid-cols-3 gap-3">
                {categories.map(cat => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.id;
                  return (
                    <button key={cat.id} onClick={() => { setCategory(cat.id); setStep(1); }}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all hover:-translate-y-0.5 hover:shadow-md ${isSelected ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:border-blue-200"}`}>
                      <div className={`w-10 h-10 rounded-xl ${isSelected ? "bg-blue-600" : cat.bg} flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className={`text-xs font-semibold text-center leading-tight ${isSelected ? "text-blue-700" : "text-slate-700"}`}>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── STEP 1: Describe ──────────────────────────────────────────── */}
          {step === 1 && (
            <div>
              <h1 className="text-xl font-black text-slate-900 mb-1" style={{ fontFamily: "var(--font-jakarta)" }}>
                Describe the issue
              </h1>
              <p className="text-slate-400 text-sm mb-6">The more detail you give, the better the match.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Title</label>
                  <input value={title} onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Leaking pipe under kitchen sink"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none text-sm text-slate-800 placeholder-slate-300 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Detailed Description</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4}
                    placeholder="Describe the problem in detail — what happened, what you've tried, etc."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none text-sm text-slate-800 placeholder-slate-300 transition-all resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Photos / Videos (optional)</label>
                  <button onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-slate-200 hover:border-blue-300 rounded-xl py-6 flex flex-col items-center gap-2 text-slate-400 hover:text-blue-500 transition-all">
                    <Upload className="w-6 h-6" />
                    <span className="text-sm font-medium">Click to upload images or videos</span>
                    <span className="text-xs">Up to 5 files</span>
                  </button>
                  <input ref={fileInputRef} type="file" multiple accept="image/*,video/*" className="hidden" onChange={handleImageUpload} />
                  {images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {images.map((f, i) => (
                        <div key={i} className="relative">
                          <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-xs text-slate-500 overflow-hidden">
                            {f.type.startsWith("image/") ? (
                              <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                            ) : "📹"}
                          </div>
                          <button onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white flex items-center justify-center">
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">How urgent is this?</label>
                  <div className="grid grid-cols-2 gap-2">
                    {urgencyOptions.map(u => {
                      const Icon = u.icon;
                      return (
                        <button key={u.id} onClick={() => setUrgency(u.id)}
                          className={`flex items-center gap-2 p-3 rounded-xl border-2 text-left transition-all ${urgency === u.id ? u.color + " border-current" : "border-slate-200 text-slate-600 hover:border-slate-300"}`}>
                          <Icon className="w-4 h-4 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-bold">{u.label}</p>
                            <p className="text-xs opacity-70">{u.desc}</p>
                            {u.surcharge && <p className="text-xs font-bold text-red-600">+GH₵{EMERGENCY_SURCHARGE} surcharge</p>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(0)} className="flex items-center gap-2 text-slate-500 font-semibold px-4 py-3 rounded-xl border border-slate-200 hover:border-slate-300 transition-all text-sm">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={() => setStep(2)} disabled={!title.trim()}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-all text-sm">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Customer Details ──────────────────────────────────── */}
          {step === 2 && (
            <div>
              <h1 className="text-xl font-black text-slate-900 mb-1" style={{ fontFamily: "var(--font-jakarta)" }}>
                Your contact details
              </h1>
              <p className="text-slate-400 text-sm mb-6">We'll use these to match you with a tasker. No spam, ever.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="John Mensah"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="0244 000 000" type="tel"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Email <span className="text-slate-300 font-normal normal-case">(optional)</span></label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" type="email"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Service Address *</label>
                  <LocationPicker location={location} setLocation={setLocation} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Date *</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Time *</label>
                    <input type="time" value={time} onChange={e => setTime(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none text-sm" />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)} className="flex items-center gap-2 text-slate-500 font-semibold px-4 py-3 rounded-xl border border-slate-200 hover:border-slate-300 transition-all text-sm">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={() => setStep(3)} disabled={!fullName.trim() || !phone.trim() || !location.trim() || !date || !time}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-all text-sm">
                  Find Available Taskers <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Pick Tasker ───────────────────────────────────────── */}
          {step === 3 && (
            <div>
              <h1 className="text-xl font-black text-slate-900 mb-1" style={{ fontFamily: "var(--font-jakarta)" }}>
                Choose your tasker
              </h1>
              <p className="text-slate-400 text-sm mb-6">Select a verified professional to handle your task.</p>

              {loadingTaskers ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  <p className="text-slate-400 text-sm">Finding available taskers near you…</p>
                </div>
              ) : taskers.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl">
                  <User className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="font-semibold text-slate-600 mb-1">No taskers available yet</p>
                  <p className="text-sm text-slate-400">We're growing our network — we'll manually assign a top tasker for you.</p>
                </div>
              ) : (
                <div className="space-y-3 mb-6">
                  {taskers.map(t => (
                    <TaskerCard key={t.id} tasker={t} selected={selectedTasker?.id === t.id} onSelect={() => setSelectedTasker(t)} />
                  ))}
                </div>
              )}

              <div className="flex gap-3 mt-2">
                <button onClick={() => setStep(2)} className="flex items-center gap-2 text-slate-500 font-semibold px-4 py-3 rounded-xl border border-slate-200 hover:border-slate-300 transition-all text-sm">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={() => setStep(4)}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all text-sm">
                  {selectedTasker ? "Proceed to Checkout" : "Continue Without Preference"} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 4: Checkout ──────────────────────────────────────────── */}
          {step === 4 && (
            <div>
              <h1 className="text-xl font-black text-slate-900 mb-1" style={{ fontFamily: "var(--font-jakarta)" }}>
                Review & Pay
              </h1>
              <p className="text-slate-400 text-sm mb-6">Confirm your booking details and complete payment.</p>

              {/* Booking Details Summary */}
              <div className="bg-slate-50 rounded-2xl p-4 mb-5 space-y-2">
                <div className="flex gap-2 text-sm">
                  <span className="text-slate-400 w-20 flex-shrink-0">Service</span>
                  <span className="font-semibold text-slate-800 capitalize">{category?.replace("-", " ")}</span>
                </div>
                <div className="flex gap-2 text-sm">
                  <span className="text-slate-400 w-20 flex-shrink-0">Task</span>
                  <span className="font-semibold text-slate-800">{title}</span>
                </div>
                <div className="flex gap-2 text-sm">
                  <span className="text-slate-400 w-20 flex-shrink-0">Location</span>
                  <span className="font-semibold text-slate-800 line-clamp-2">{location}</span>
                </div>
                <div className="flex gap-2 text-sm">
                  <span className="text-slate-400 w-20 flex-shrink-0">When</span>
                  <span className="font-semibold text-slate-800">{date} at {time}</span>
                </div>
                <div className="flex gap-2 text-sm">
                  <span className="text-slate-400 w-20 flex-shrink-0">Contact</span>
                  <span className="font-semibold text-slate-800">{fullName} · {phone}</span>
                </div>
              </div>

              {/* Pricing Summary */}
              <PricingSummary serviceAmount={serviceAmount} urgency={urgency} selectedTasker={selectedTasker} />

              {/* Payment Methods */}
              <div className="mt-5">
                <p className="text-xs font-bold text-slate-600 mb-3 uppercase tracking-wide">Payment Method</p>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <button className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-blue-600 bg-blue-50 text-blue-700">
                    <PhoneIcon className="w-5 h-5" />
                    <span className="text-xs font-bold">Mobile Money</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-slate-200 text-slate-500 hover:border-slate-300 transition-colors">
                    <CreditCard className="w-5 h-5" />
                    <span className="text-xs font-bold">Card Payment</span>
                  </button>
                </div>

                <button onClick={handleSubmit} disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all text-base shadow-lg shadow-blue-200 hover:-translate-y-0.5">
                  {submitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing…</> : <><ShieldCheck className="w-5 h-5" /> Confirm & Pay {formatGHS(pricing.total)}</>}
                </button>

                <p className="text-center text-xs text-slate-400 mt-3 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-green-500" />
                  Secured by Paystack · Payment released only after job completion
                </p>
              </div>

              <div className="mt-4">
                <button onClick={() => setStep(3)} className="flex items-center gap-1 text-slate-400 text-sm hover:text-slate-600 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Change tasker
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    }>
      <BookingContent />
    </Suspense>
  );
}
