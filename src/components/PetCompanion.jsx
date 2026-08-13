import React, { useState, useEffect } from "react";
import { Sparkles, TreePine, Flame, Trophy, Compass, Heart, ArrowRight } from "lucide-react";

export const PET_TYPES = [
  { id: "bunny", name: "Barnaby the Bunny", icon: "🐰", color: "#FF8C42" },
  { id: "kitten", name: "Whiskers the Kitten", icon: "🐱", color: "#34D1BF" },
  { id: "fox", name: "Felix the Fox", icon: "🦊", color: "#FF7A6B" },
  { id: "puppy", name: "Pippin the Puppy", icon: "🐶", color: "#FFB238" }
];

export const PET_STAGES = [
  { stage: 1, name: "Baby Kitten/Bunny", title: "Novice Explorer", size: "w-24 h-24 sm:w-28 sm:h-28", levelReq: 1 },
  { stage: 2, name: "Junior Pet", title: "Logic Apprentice", size: "w-32 h-32 sm:w-36 sm:h-36", levelReq: 2 },
  { stage: 3, name: "Teen Companion", title: "Strategy Prodigy", size: "w-40 h-40 sm:w-48 sm:h-48", levelReq: 3 },
  { stage: 4, name: "Master Beast", title: "Grand Architect", size: "w-48 h-48 sm:w-56 sm:h-56", levelReq: 4 }
];

export default function PetCompanion({ stage = 1, petType = "bunny", isWalking = false, isEvolving = false, onEvolveComplete }) {
  const currentPet = PET_TYPES.find(p => p.id === petType) || PET_TYPES[0];
  const stageData = PET_STAGES.find(s => s.stage === stage) || PET_STAGES[0];

  const [showShimmer, setShowShimmer] = useState(isEvolving);

  useEffect(() => {
    if (isEvolving) {
      setShowShimmer(true);
      const timer = setTimeout(() => {
        setShowShimmer(false);
        if (onEvolveComplete) onEvolveComplete();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isEvolving, onEvolveComplete]);

  // Scaled SVG animal based on stage
  const renderAnimalSVG = () => {
    // Stage 1 (Baby), Stage 2 (Junior), Stage 3 (Teen), Stage 4 (Master)
    const scaleFactor = 0.7 + stage * 0.15;
    const bodyColor = petType === "bunny" ? "#FFFFFF" : petType === "kitten" ? "#FFE8D6" : petType === "fox" ? "#FF7A6B" : "#F4D06F";
    const accentColor = currentPet.color;

    return (
      <svg
        viewBox="0 0 100 100"
        className={`w-full h-full transition-transform duration-700 ${isWalking ? "animate-bounce" : ""}`}
        style={{ transform: `scale(${scaleFactor})` }}
      >
        {/* Shadow */}
        <ellipse cx="50" cy="88" fill="#000000" opacity="0.15" rx={18 * scaleFactor} ry={3}>
          <animate attributeName="rx" dur="2s" repeatCount="indefinite" values={`${18 * scaleFactor}; ${15 * scaleFactor}; ${18 * scaleFactor}`} />
        </ellipse>

        {/* Aura for Master Stage */}
        {stage >= 4 && (
          <circle cx="50" cy="55" r="42" fill="none" stroke={accentColor} strokeWidth="1.5" strokeDasharray="4,4" opacity="0.7">
            <animateTransform attributeName="transform" type="rotate" from="0 50 55" to="360 50 55" dur="10s" repeatCount="indefinite" />
          </circle>
        )}

        {/* Tail */}
        <circle cx="22" cy="70" fill={bodyColor} r={stage >= 3 ? 7 : 5} stroke="#12143A" strokeWidth="0.8">
          <animateTransform attributeName="transform" type="rotate" values="0 22 70; 15 22 70; 0 22 70" dur="2s" repeatCount="indefinite" />
        </circle>

        {/* Body */}
        <path d="M50,85 Q30,85 25,60 Q25,35 50,35 Q75,35 75,60 Q75,85 50,85" fill={bodyColor} stroke="#12143A" strokeWidth="0.8">
          <animateTransform attributeName="transform" type="translate" values="0,0; 0,-2; 0,0" dur="3s" repeatCount="indefinite" />
        </path>

        {/* Ears */}
        {petType === "bunny" ? (
          <>
            <path d="M40,38 Q35,10 42,10 Q48,10 45,38" fill={bodyColor} stroke="#12143A" strokeWidth="0.8">
              <animateTransform attributeName="transform" type="rotate" values="0 40 38; -6 40 38; 0 40 38" dur="3s" repeatCount="indefinite" />
            </path>
            <path d="M55,38 Q50,5 60,5 Q70,5 65,38" fill={bodyColor} stroke="#12143A" strokeWidth="0.8">
              <animateTransform attributeName="transform" type="rotate" values="0 55 38; 6 55 38; 0 55 38" dur="2.5s" repeatCount="indefinite" />
            </path>
          </>
        ) : (
          <>
            {/* Cat/Fox pointy ears */}
            <polygon points="36,40 28,15 44,32" fill={accentColor} stroke="#12143A" strokeWidth="0.8" />
            <polygon points="64,40 72,15 56,32" fill={accentColor} stroke="#12143A" strokeWidth="0.8" />
          </>
        )}

        {/* Eyes */}
        <circle cx="43" cy="52" r={stage >= 3 ? 2.5 : 2} fill="#12143A" />
        <circle cx="57" cy="52" r={stage >= 3 ? 2.5 : 2} fill="#12143A" />
        <circle cx="44" cy="51" r="0.8" fill="#FFFFFF" />
        <circle cx="58" cy="51" r="0.8" fill="#FFFFFF" />

        {/* Nose & Whiskers */}
        <ellipse cx="50" cy="57" rx="1.5" ry="1" fill="#FF7A6B" />
        <path d="M48,60 Q50,63 52,60" fill="none" stroke="#12143A" strokeWidth="0.8" />

        {/* Paws */}
        <circle cx="40" cy="67" r="4" fill={bodyColor} stroke="#12143A" strokeWidth="0.8" />
        <circle cx="60" cy="67" r="4" fill={bodyColor} stroke="#12143A" strokeWidth="0.8" />

        {/* Accessories depending on Stage */}
        {stage === 2 && (
          /* Junior: Holding a glowing star / carrot */
          <g>
            <path d="M46,65 Q50,82 54,65 Z" fill="#FF8C42" stroke="#12143A" strokeWidth="0.5" />
            <path d="M46,65 Q43,60 46,58 Q49,60 49,65 M51,65 Q51,60 54,58 Q57,60 54,65" fill="#34D1BF" />
          </g>
        )}
        {stage === 3 && (
          /* Teen: Adventurer Cap & Backpack */
          <g>
            <path d="M35,32 Q50,22 65,32 L68,36 L32,36 Z" fill="#3525CD" stroke="#12143A" strokeWidth="0.8" />
            <circle cx="50" cy="24" r="2.5" fill="#FFB238" />
          </g>
        )}
        {stage >= 4 && (
          /* Master Crown & Sparkles */
          <g>
            <polygon points="40,28 44,18 50,25 56,18 60,28" fill="#FFB238" stroke="#12143A" strokeWidth="0.8" />
            <circle cx="50" cy="20" r="1.5" fill="#FF7A6B" />
          </g>
        )}
      </svg>
    );
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      {/* Shimmer Evolution Overlay */}
      {showShimmer && (
        <div className="absolute inset-0 z-50 rounded-3xl bg-gradient-to-r from-transparent via-[#FFB238]/30 to-transparent backdrop-blur-md flex flex-col items-center justify-center border border-[#FFB238] animate-pulse">
          <Sparkles className="w-10 h-10 text-[#FFB238] animate-spin mb-2" />
          <span className="font-heading font-bold text-lg text-[#F5F3ED] tracking-wide">
            Evolving to Stage {stage}!
          </span>
          <span className="text-xs text-[#34D1BF] font-mono mt-1">Growth Energy Unlocked ⚡</span>
        </div>
      )}

      {/* Forest Path Backdrop (If walking) */}
      <div className={`relative ${stageData.size} flex items-center justify-center transition-all duration-500`}>
        {/* Glow backdrop */}
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-20 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${currentPet.color}, transparent)` }}
        />

        {renderAnimalSVG()}
      </div>

      {/* Pet Information Tag */}
      <div className="mt-3 text-center bg-[#12143A]/80 border border-[#33366E] rounded-full px-4 py-1.5 backdrop-blur-sm shadow-md">
        <div className="flex items-center justify-center gap-1.5">
          <span className="text-sm">{currentPet.icon}</span>
          <span className="font-heading text-xs font-bold text-[#F5F3ED]">{currentPet.name}</span>
          <span className="text-[10px] bg-[#3525CD] text-[#F5F3ED] px-2 py-0.5 rounded-full font-mono">
            Lvl {stage}
          </span>
        </div>
        <div className="text-[10px] text-[#9497C9] mt-0.5 font-mono tracking-wider uppercase">
          {stageData.title}
        </div>
      </div>
    </div>
  );
}

// ─── FOREST PATH ANIMATION COMPONENT ──────────────────────────────────────────
export function ForestPathTransition({ level, completedLevels, activePet, onCompletePath }) {
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimating(false);
      if (onCompletePath) onCompletePath();
    }, 3500);
    return () => clearTimeout(timer);
  }, [onCompletePath]);

  return (
    <div className="fixed inset-0 z-50 bg-[#0D0F2E] flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Forest Background SVG with Moving Trees */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 600">
          <defs>
            <linearGradient id="forestGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#069488" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0D0F2E" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <rect width="1000" height="600" fill="url(#forestGrad)" />
          {/* Animated Forest Trees passing by */}
          <g className="animate-pulse">
            <polygon points="100,500 150,350 200,500" fill="#069488" opacity="0.6" />
            <polygon points="300,550 360,320 420,550" fill="#3525CD" opacity="0.5" />
            <polygon points="700,520 770,300 840,520" fill="#069488" opacity="0.6" />
            <polygon points="850,560 910,380 970,560" fill="#FF7A6B" opacity="0.4" />
          </g>
          {/* Forest Path Line */}
          <path d="M -50,500 Q 250,400 500,480 T 1050,420" fill="none" stroke="#FFB238" strokeWidth="6" strokeDasharray="12,12" opacity="0.6" />
        </svg>
      </div>

      {/* Shimmer Forest Effect Overlay */}
      <div className="relative z-10 max-w-lg w-full bg-[#1B1E52]/90 border border-[#34D1BF]/40 rounded-3xl p-8 text-center backdrop-blur-xl shadow-2xl shadow-[#34D1BF]/20 animate-scale-in">
        <div className="flex items-center justify-center gap-2 text-[#34D1BF] mb-3 font-mono text-xs uppercase tracking-widest">
          <TreePine className="w-4 h-4" /> Moving Through The Cognitive Forest
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F3ED] font-heading mb-2">
          Assessment Level {level} Cleared!
        </h2>
        <p className="text-sm text-[#9497C9] mb-6">
          Your animal companion is growing stronger as you navigate deeper into the forest.
        </p>

        {/* Animal Hops Forward */}
        <div className="my-6 relative h-40 flex items-center justify-center">
          <div className="animate-bounce">
            <PetCompanion stage={Math.min(4, level + 1)} petType={activePet || "bunny"} isWalking={true} />
          </div>
        </div>

        {/* Shimmer Bar Progress */}
        <div className="w-full bg-[#12143A] h-3 rounded-full overflow-hidden border border-[#33366E] mb-6">
          <div className="h-full bg-gradient-to-r from-[#34D1BF] via-[#FFB238] to-[#FF7A6B] shimmer w-full rounded-full" />
        </div>

        <button
          onClick={() => {
            setAnimating(false);
            if (onCompletePath) onCompletePath();
          }}
          className="w-full bg-[#34D1BF] hover:bg-[#34D1BF]/90 text-[#12143A] font-heading font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#34D1BF]/20 transition-all transform active:scale-95 text-sm sm:text-base"
        >
          <span>Enter Forest Path</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
