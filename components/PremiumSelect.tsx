"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";

type Option = { value: string; label: string } | string;

function normalize(o: Option): { value: string; label: string } {
  return typeof o === "string" ? { value: o, label: o } : o;
}

export default function PremiumSelect({
  name,
  options,
  placeholder = "Select an option",
  required,
  defaultValue = "",
  onChange,
}: {
  name: string;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
  onChange?: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [touched, setTouched] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const normalized = options.map(normalize);
  const selected = normalized.find((o) => o.value === value);
  const showRequiredError = required && touched && !value;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  return (
    <div className="relative" ref={wrapRef}>
      {/* Hidden field carries the value for native FormData submission */}
      <input type="hidden" name={name} value={value} />

      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          setTouched(true);
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`input flex items-center justify-between text-left cursor-pointer ${
          selected ? "text-navy" : "text-navy/35"
        } ${showRequiredError ? "border-red-300" : ""}`}
      >
        <span className="truncate">{selected ? selected.label : placeholder}</span>
        <ChevronDown
          size={16}
          className={`text-navy/45 shrink-0 ml-2 transition-transform duration-200 ${open ? "rotate-180 text-gold-dark" : ""}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute z-30 mt-2 w-full max-h-60 overflow-auto rounded-xl border border-black/10 bg-white shadow-xl shadow-navy/15 p-1.5"
          style={{ animation: "premiumSelectIn 0.14s ease-out" }}
        >
          {normalized.map((o) => {
            const active = o.value === value;
            return (
              <button
                type="button"
                key={o.value}
                role="option"
                aria-selected={active}
                onClick={() => {
                  setValue(o.value);
                  setOpen(false);
                  onChange?.(o.value);
                }}
                className={`w-full flex items-center justify-between gap-2 text-sm text-left px-3 py-2.5 rounded-lg transition-colors ${
                  active
                    ? "bg-gold/15 text-navy font-semibold"
                    : "text-navy/75 hover:bg-navy/5"
                }`}
              >
                <span className="truncate">{o.label}</span>
                {active && <Check size={14} className="text-gold-dark shrink-0" />}
              </button>
            );
          })}
        </div>
      )}

      {showRequiredError && (
        <p className="text-xs text-red-500 mt-1">This field is required.</p>
      )}

      <style jsx>{`
        @keyframes premiumSelectIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
