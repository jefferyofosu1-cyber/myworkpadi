"use client";

import { useTheme } from "./ThemeProvider";
import { Sun, Moon, Monitor, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options = [
    { value: "light", label: "Daylight", icon: Sun },
    { value: "dark", label: "Night", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ] as const;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-slate-300 hover:text-white"
      >
        {theme === "light" && <Sun className="w-4 h-4" />}
        {theme === "dark" && <Moon className="w-4 h-4" />}
        {theme === "system" && <Monitor className="w-4 h-4" />}
        <span className="text-xs font-bold uppercase tracking-wider hidden lg:inline">
          {theme === "system" ? "Mode" : theme === "light" ? "Daylight" : "Night"}
        </span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-2xl bg-midnight/90 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden z-[60]">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setTheme(opt.value);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                theme === opt.value 
                  ? "bg-primary text-white" 
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <opt.icon className="w-4 h-4" />
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
