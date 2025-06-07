"use client";

import { useTheme } from "@/contexts/ThemeContext";

const THEMES = [
  "light", "dark", "cupcake", "bumblebee", "emerald", "corporate",
  "synthwave", "retro", "cyberpunk", "valentine", "halloween",
  "garden", "forest", "aqua", "lofi", "pastel", "fantasy",
  "wireframe", "black", "luxury", "dracula", "cmyk", "autumn",
  "business", "acid", "lemonade", "night", "coffee", "winter",
  "dim", "nord", "sunset"
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-8">설정</h1>
      
      <div className="card bg-base-200">
        <div className="card-body">
          <h2 className="card-title mb-4">테마 설정</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {THEMES.map((themeName) => (
              <button
                key={themeName}
                onClick={() => setTheme(themeName)}
                className={`flex items-center justify-between p-4 rounded-lg hover:bg-base-300 transition-colors ${
                  theme === themeName ? "bg-base-300 ring-2 ring-primary" : "bg-base-100"
                }`}
                data-theme={themeName}
              >
                <span className="capitalize">{themeName}</span>
                <div className="flex gap-1">
                  <div className="h-4 w-4 rounded-full bg-primary" />
                  <div className="h-4 w-4 rounded-full bg-secondary" />
                  <div className="h-4 w-4 rounded-full bg-accent" />
                  <div className="h-4 w-4 rounded-full bg-neutral" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 