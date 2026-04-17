"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/client";
import {
  Wrench, Zap, Home, Truck, Brush, Wind, Hammer, MoreHorizontal,
  ArrowRight, ArrowLeft, Upload, MapPin, Calendar, Clock,
  User, CheckCircle, Loader2, Crosshair
} from "lucide-react";

const categories = [
  { id: "plumbing", label: "Plumbing", icon: Wrench, color: "bg-blue-50 border-blue-200 text-blue-700" },
  { id: "electrical", label: "Electrical", icon: Zap, color: "bg-yellow-50 border-yellow-200 text-yellow-700" },
  { id: "cleaning", label: "Cleaning", icon: Home, color: "bg-green-50 border-green-200 text-green-700" },
  { id: "moving", label: "Moving", icon: Truck, color: "bg-purple-50 border-purple-200 text-purple-700" },
  { id: "carpentry", label: "Carpentry", icon: Hammer, color: "bg-orange-50 border-orange-200 text-orange-700" },
  { id: "ac-repair", label: "AC Repair", icon: Wind, color: "bg-cyan-50 border-cyan-200 text-cyan-700" },
  { id: "painting", label: "Painting", icon: Brush, color: "bg-pink-50 border-pink-200 text-pink-700" },
  { id: "others", label: "Others", icon: MoreHorizontal, color: "bg-slate-50 border-slate-200 text-slate-700" },
];

const STEPS = ["Category", "Describe", "When & Where", "Review"];

function LocationPicker({ location, setLocation }: { location: string, setLocation: (val: string) => void }) {
  const [query, setQuery] = useState(location);
  const [results, setResults] = useState<{place_id: number, display_name: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [geolocating, setGeolocating] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Sync initial location automatically
  useEffect(() => {
    if (location && !query) {
      setQuery(location);
    }
  }, [location, query]);

  // Debounced OpenStreetMap (Nominatim) search limit to GH
  useEffect(() => {
    if (!query || query === location) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=gh`);
        const data = await res.json();
        setResults(data);
        setShowDropdown(true);
      } catch (error) {
        console.error("OSM Search Error", error);
      }
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [query, location]);

  const handleSelect = (address: string) => {
    setQuery(address);
    setLocation(address);
    setShowDropdown(false);
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setGeolocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          const address = data.display_name || "Unknown Location";
          setQuery(address);
          setLocation(address);
          setShowDropdown(false);
        } catch (error) {
          console.error("OSM Geocoding Error:", error);
        }
        setGeolocating(false);
      },
      () => setGeolocating(false)
    );
  };

  return (
    <div className="relative">
      <div className="relative flex items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. East Legon, Accra"
          className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none text-sm text-slate-800 placeholder-slate-300 transition-all font-medium"
        />
        <button 
          type="button"
          onClick={handleCurrentLocation}
          title="Use Current Location"
          className={`absolute right-3 p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors ${geolocating ? "text-blue-500" : ""}`}
        >
          {geolocating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Crosshair className="w-5 h-5" />}
        </button>
      </div>
      
      {showDropdown && results.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-slate-100 rounded-xl shadow-lg max-h-60 overflow-auto">
          {results.map((result) => (
            <li
              key={result.place_id}
              onClick={() => handleSelect(result.display_name)}
              className="px-4 py-3 flex text-sm text-slate-700 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 font-medium"
            >
              <MapPin className="w-4 h-4 mr-2 text-slate-400 flex-shrink-0 mt-0.5" />
              <span>{result.display_name}</span>
            </li>
          ))}
        </ul>
      )}
      
      {loading && showDropdown && results.length === 0 && (
         <div className="absolute z-10 w-full mt-1 bg-white border border-slate-100 rounded-xl shadow-sm px-4 py-3 text-sm text-slate-400">
           Searching OpenStreetMap...
         </div>
      )}
    </div>
  );
}

function BookingContent() {
  const params = useSearchParams();
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState(0);
  const [category, setCategory] = useState(params.get("category") || "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [bookingType, setBookingType] = useState<"instant" | "quotes">("instant");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  async function submitBooking() {
    setPending(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login?redirectTo=/booking"); return; }

    await supabase.from("bookings").insert({
      customer_id: user.id,
      category,
      title: title || `${category} task`,
      description,
      location,
      scheduled_at: date && time ? new Date(`${date}T${time}`).toISOString() : null,
      booking_type: bookingType,
      status: "pending",
    });

    setDone(true);
    setPending(false);
  }

  if (done) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2" style={{ fontFamily: "var(--font-jakarta)" }}>Booking Submitted!</h2>
          <p className="text-slate-400 text-sm mb-6">Your task has been posted. You'll receive notifications as taskers respond.</p>
          <Link href="/customer/dashboard" className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl text-center transition-colors">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-slate-500">Step {step + 1} of {STEPS.length}</p>
            <p className="text-sm font-bold text-blue-600">{STEPS[step]}</p>
          </div>
          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-8">
          {/* STEP 0: Category */}
          {step === 0 && (
            <div>
              <h1 className="text-xl font-black text-slate-900 mb-1" style={{ fontFamily: "var(--font-jakarta)" }}>What do you need done?</h1>
              <p className="text-slate-400 text-sm mb-6">Choose a category that best fits your task.</p>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCategory(c.id)}
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${
                      category === c.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${c.color.split(" ").slice(0, 1).join(" ")}`}>
                      <c.icon className="w-4 h-4" />
                    </div>
                    <span className={`font-semibold text-sm ${category === c.id ? "text-blue-700" : "text-slate-700"}`}>{c.label}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep(1)}
                disabled={!category}
                className="mt-6 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition-all"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 1: Describe */}
          {step === 1 && (
            <div>
              <h1 className="text-xl font-black text-slate-900 mb-1" style={{ fontFamily: "var(--font-jakarta)" }}>Describe your task</h1>
              <p className="text-slate-400 text-sm mb-6">The more detail you give, the better quotes you'll receive.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Task Title</label>
                  <input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Fix kitchen sink, Paint living room"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none text-sm text-slate-800 placeholder-slate-300 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Description</label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Describe the task in detail — what's broken, size of the area, any special requirements..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none text-sm text-slate-800 placeholder-slate-300 transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Upload Photos (optional)</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all">
                    <Upload className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-400 text-xs">Click to upload or drag & drop</p>
                    <p className="text-slate-300 text-xs mt-0.5">JPG, PNG up to 5MB</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(0)} className="flex items-center gap-2 text-slate-500 hover:text-slate-700 font-semibold px-4 py-3 rounded-xl border border-slate-200 hover:border-slate-300 transition-all text-sm">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={() => setStep(2)} disabled={!description.trim()} className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all text-sm">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: When & Where */}
          {step === 2 && (
            <div>
              <h1 className="text-xl font-black text-slate-900 mb-1" style={{ fontFamily: "var(--font-jakarta)" }}>When & where?</h1>
              <p className="text-slate-400 text-sm mb-6">Set the schedule and location for your task.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide"><MapPin className="w-3.5 h-3.5 inline mr-1" />Location</label>
                  <LocationPicker location={location} setLocation={setLocation} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide"><Calendar className="w-3.5 h-3.5 inline mr-1" />Date</label>
                    <input
                      type="date"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none text-sm text-slate-800 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide"><Clock className="w-3.5 h-3.5 inline mr-1" />Time</label>
                    <input
                      type="time"
                      value={time}
                      onChange={e => setTime(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none text-sm text-slate-800 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Booking Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: "instant" as const, label: "Instant Booking", desc: "We match you immediately" },
                      { id: "quotes" as const, label: "Request Quotes", desc: "Taskers send you prices" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setBookingType(t.id)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${bookingType === t.id ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:border-slate-300"}`}
                      >
                        <p className={`font-bold text-sm mb-0.5 ${bookingType === t.id ? "text-blue-700" : "text-slate-700"}`}>{t.label}</p>
                        <p className="text-xs text-slate-400">{t.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-700 font-semibold px-4 py-3 rounded-xl border border-slate-200 hover:border-slate-300 transition-all text-sm">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={() => setStep(3)} disabled={!location.trim()} className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all text-sm">
                  Review Booking <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Review */}
          {step === 3 && (
            <div>
              <h1 className="text-xl font-black text-slate-900 mb-1" style={{ fontFamily: "var(--font-jakarta)" }}>Review your booking</h1>
              <p className="text-slate-400 text-sm mb-6">Confirm the details below before submitting.</p>
              <div className="space-y-3 mb-6">
                {[
                  { label: "Category", value: categories.find(c => c.id === category)?.label },
                  { label: "Task", value: title || `${category} task` },
                  { label: "Description", value: description },
                  { label: "Location", value: location },
                  { label: "Date & Time", value: date && time ? `${date} at ${time}` : date || "Flexible" },
                  { label: "Booking Type", value: bookingType === "instant" ? "Instant Booking" : "Request Quotes" },
                ].map((row) => (
                  <div key={row.label} className="flex gap-3 py-3 border-b border-slate-100 last:border-0">
                    <span className="text-slate-400 text-sm w-32 flex-shrink-0">{row.label}</span>
                    <span className="text-slate-800 text-sm font-semibold">{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex items-center gap-2 text-slate-500 hover:text-slate-700 font-semibold px-4 py-3 rounded-xl border border-slate-200 hover:border-slate-300 transition-all text-sm">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={submitBooking}
                  disabled={pending}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all text-sm shadow-lg shadow-blue-200"
                >
                  {pending ? <><Loader2 className="w-4 h-4 animate-spin" />Submitting...</> : <>Confirm Booking <CheckCircle className="w-4 h-4" /></>}
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
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent" />
      </div>
    }>
      <BookingContent />
    </Suspense>
  );
}
