import { CheckCircle, Shield, Clock, Star, HeadphonesIcon } from "lucide-react";

const signals = [
  { icon: CheckCircle, label: "Checked Workers", color: "text-primary" },
  { icon: Shield, label: "Safe Payment", color: "text-primary" },
  { icon: Clock, label: "No Signup Needed", color: "text-accent" },
  { icon: Star, label: "Real Reviews", color: "text-yellow-500" },
  { icon: HeadphonesIcon, label: "Help Anytime", color: "text-primary" },
];

export default function TrustBar({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium text-muted">
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
