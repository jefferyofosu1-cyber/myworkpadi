import { CheckCircle, Shield, Clock, Star, HeadphonesIcon } from "lucide-react";

const signals = [
  { icon: CheckCircle, label: "Verified Professionals", color: "text-green-500" },
  { icon: Shield, label: "Secure Payment", color: "text-blue-500" },
  { icon: Clock, label: "No Signup Needed", color: "text-orange-500" },
  { icon: Star, label: "Rated by Real Customers", color: "text-yellow-500" },
  { icon: HeadphonesIcon, label: "24/7 Customer Support", color: "text-purple-500" },
];

export default function TrustBar({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium text-slate-500">
        {signals.map(({ icon: Icon, label, color }) => (
          <span key={label} className="flex items-center gap-1.5 whitespace-nowrap">
            <Icon className={`w-4 h-4 ${color} flex-shrink-0`} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
