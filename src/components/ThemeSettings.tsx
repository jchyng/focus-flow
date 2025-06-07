"use client";
import { useEffect, useState } from "react";
import { Settings } from "lucide-react";

const THEMES = [
  "light", "dark", "cupcake", "bumblebee", "emerald", "corporate",
  "synthwave", "retro", "cyberpunk", "valentine", "halloween",
  "garden", "forest", "aqua", "lofi", "pastel", "fantasy",
  "wireframe", "black", "luxury", "dracula", "cmyk", "autumn",
  "business", "acid", "lemonade", "night", "coffee", "winter",
  "dim", "nord", "sunset"
];

export default function ThemeSettings() {
  const [theme, setTheme] = useState<string>(
    typeof window !== "undefined"
      ? document.body.getAttribute("data-theme") || "winter"
      : "winter"
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="btn btn-circle btn-ghost"
          aria-label="테마 설정"
        >
          <Settings className="h-6 w-6" />
        </button>

        {isOpen && (
          <div className="absolute bottom-full right-0 mb-2 w-80 rounded-lg bg-base-100 p-4 shadow-lg">
            <h3 className="mb-4 text-lg font-bold">테마 설정</h3>
            <div className="max-h-96 overflow-y-auto">
              {THEMES.map((themeName) => (
                <button
                  key={themeName}
                  onClick={() => {
                    setTheme(themeName);
                    setIsOpen(false);
                  }}
                  className={`mb-2 flex w-full items-center justify-between rounded-lg p-2 hover:bg-base-200 ${
                    theme === themeName ? "bg-base-200" : ""
                  }`}
                  data-theme={themeName}
                >
                  <span className="capitalize">{themeName}</span>
                  <div className="flex gap-1">
                    <div className="h-6 w-6 rounded-full bg-primary" />
                    <div className="h-6 w-6 rounded-full bg-secondary" />
                    <div className="h-6 w-6 rounded-full bg-accent" />
                    <div className="h-6 w-6 rounded-full bg-neutral" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
