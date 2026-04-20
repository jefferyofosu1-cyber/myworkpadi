import { 
  Wrench, 
  Zap, 
  Wind, 
  Brush, 
  Hammer, 
  Truck, 
  Settings,
  ShieldCheck,
  Smartphone
} from "lucide-react";

export const WAITLIST_AREAS = [
  "East Legon",
  "Cantonments",
  "Airport Area",
  "Osu",
  "Spintex",
  "Tema",
  "Adenta",
  "Labone",
  "Dzorwulu",
  "Legon",
  "Madina"
];

export const WAITLIST_SERVICES = [
  { id: "plumbing", name: "Plumbing", icon: Wrench, emoji: "🚰" },
  { id: "electrical", name: "Electrical", icon: Zap, emoji: "⚡" },
  { id: "ac-repair", name: "AC Repair", icon: Wind, emoji: "❄️" },
  { id: "cleaning", name: "Cleaning", icon: Brush, emoji: "🧹" },
  { id: "carpentry", name: "Carpentry", icon: Hammer, emoji: "🪚" },
  { id: "painting", name: "Painting", icon: Brush, emoji: "🎨" },
  { id: "appliance-repair", name: "Appliance Repair", icon: Smartphone, emoji: "🔌" },
  { id: "other", name: "Other", icon: Settings, emoji: "⚙️" },
];

export const WAITLIST_PERKS = [
  {
    id: "priority",
    title: "Priority access on launch day",
    icon: Zap,
    color: "bg-yellow-500",
  },
  {
    id: "discount",
    title: "First booking discount (GHS 10 fee waived)",
    icon: ShieldCheck,
    color: "bg-primary",
  },
  {
    id: "matching",
    title: "Faster artisan matching in your area",
    icon: ShieldCheck,
    color: "bg-accent",
  },
  {
    id: "alerts",
    title: "SMS alert the moment we go live",
    icon: Smartphone,
    color: "bg-blue-500",
  },
];
