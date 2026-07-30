"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

const templates = [
  {
    id: "restaurant",
    label: "Restaurant & F&B",
    emoji: "🍽️",
    modules: [
      "POS",
      "Menu Management",
      "Kitchen Display",
      "Table Management",
      "Recipe Management",
      "Waiter",
    ],
  },

  {
    id: "cafe",
    label: "Cafe & Beverages",
    emoji: "☕",
    modules: [
      "POS",
      "Menu Management",
      "Kitchen Display",
      "Table Management",
      "Recipe Management",
      "Waiter",
    ],
  },
];

export function StepIndustryTemplate() {
  const [selected, setSelected] = useState("restaurant");

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {templates.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelected(t.id)}
            className={`text-left rounded-xl border-2 p-4 transition-all ${
              selected === t.id
                ? "border-brand-primary bg-brand-primaryLight"
                : "border-brand-border bg-white hover:border-indigo-200"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{t.emoji}</span>
                <span
                  className={`font-semibold text-sm ${selected === t.id ? "text-brand-primaryDark" : "text-brand-dark"}`}
                >
                  {t.label}
                </span>
              </div>
              {selected === t.id && (
                <CheckCircle2 className="h-5 w-5 text-brand-primary" />
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {t.modules.slice(0, 4).map((m) => (
                <span
                  key={m}
                  className="text-[10px] bg-white border border-brand-border text-brand-muted px-2 py-0.5 rounded-full"
                >
                  {m}
                </span>
              ))}
              {t.modules.length > 4 && (
                <span className="text-[10px] text-brand-placeholder">
                  +{t.modules.length - 4} more
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
