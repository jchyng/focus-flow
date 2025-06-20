// "use client";

// import { useTheme } from "@/contexts/ThemeContext";

// export const THEMES = [
//   "light",
//   "dark",
//   "cupcake",
//   "bumblebee",
//   "emerald",
//   "corporate",
//   "synthwave",
//   "retro",
//   "cyberpunk",
//   "valentine",
//   "halloween",
//   "garden",
//   "forest",
//   "aqua",
//   "lofi",
//   "pastel",
//   "fantasy",
//   "wireframe",
//   "black",
//   "luxury",
//   "dracula",
//   "cmyk",
//   "autumn",
//   "business",
//   "acid",
//   "lemonade",
//   "night",
//   "coffee",
//   "winter",
//   "dim",
//   "nord",
//   "sunset",
// ];

// export default function SettingsPage() {
//   const { theme, setTheme } = useTheme();

//   return (
//     <>
//       <h2 className="text-2xl font-bold mb-8">설정</h2>

//       <div className="flex flex-col gap-4">
//         <div className="collapse collapse-arrow border border-base-300">
//           <input type="checkbox" />
//           <div className="collapse-title text-xl font-medium">테마 설정</div>
//           <div className="collapse-content">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
//               {THEMES.map((themeName) => (
//                 <button
//                   key={themeName}
//                   onClick={() => setTheme(themeName)}
//                   className={`flex items-center justify-between p-4 rounded-lg hover:bg-base-300 hover:cursor-pointer transition-colors ${
//                     theme === themeName
//                       ? "bg-base-300 ring-2 ring-primary"
//                       : "bg-base-100"
//                   }`}
//                   data-theme={themeName}
//                 >
//                   <span className="capitalize">{themeName}</span>
//                   <div className="flex gap-1">
//                     <div className="h-4 w-4 rounded-full bg-primary" />
//                     <div className="h-4 w-4 rounded-full bg-secondary" />
//                     <div className="h-4 w-4 rounded-full bg-accent" />
//                     <div className="h-4 w-4 rounded-full bg-neutral" />
//                   </div>
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
