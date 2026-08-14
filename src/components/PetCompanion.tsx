import React, { useState, useEffect } from 'react';
import { Sparkles, TreePine, ArrowRight, Heart } from 'lucide-react';

export interface PetType {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export const PET_TYPES: PetType[] = [
  { id: 'bunny', name: 'Barnaby the Bunny', icon: '🐰', color: '#ff6b50' },
  { id: 'kitten', name: 'Whiskers the Kitten', icon: '🐱', color: '#0d9488' },
  { id: 'fox', name: 'Felix the Fox', icon: '🦊', color: '#f59e0b' },
  { id: 'puppy', name: 'Pippin the Puppy', icon: '🐶', color: '#3b82f6' },
];

export interface PetStage {
  stage: number;
  name: string;
  title: string;
  size: string;
  levelReq: number;
}

export const PET_STAGES: PetStage[] = [
  { stage: 1, name: 'Novice Buddy', title: 'Novice Explorer', size: 'w-24 h-24 sm:w-28 sm:h-28', levelReq: 1 },
  { stage: 2, name: 'Junior Companion', title: 'Logic Apprentice', size: 'w-32 h-32 sm:w-36 sm:h-36', levelReq: 2 },
  { stage: 3, name: 'Teen Companion', title: 'Strategy Prodigy', size: 'w-40 h-40 sm:w-44 sm:h-44', levelReq: 3 },
  { stage: 4, name: 'Master Companion', title: 'Grand Architect', size: 'w-44 h-44 sm:w-52 sm:h-52', levelReq: 4 },
];

interface PetCompanionProps {
  stage?: number;
  petType?: string;
  isWalking?: boolean;
  isEvolving?: boolean;
  onEvolveComplete?: () => void;
  onPetChange?: (petId: string) => void;
  interactive?: boolean;
}

export function PetCompanion({
  stage = 1,
  petType = 'bunny',
  isWalking = false,
  isEvolving = false,
  onEvolveComplete,
  onPetChange,
  interactive = true,
}: PetCompanionProps) {
  const currentPet = PET_TYPES.find((p) => p.id === petType) || PET_TYPES[0];
  const stageData = PET_STAGES.find((s) => s.stage === stage) || PET_STAGES[0];

  const [showShimmer, setShowShimmer] = useState(isEvolving);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [bounce, setBounce] = useState(false);
  const [showSelector, setShowSelector] = useState(false);

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

  const handlePetClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    setBounce(true);
    setTimeout(() => setBounce(false), 800);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newHeart = { id: Date.now(), x, y };
    setHearts((prev) => [...prev, newHeart]);

    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1200);
  };

  const renderAnimalSVG = () => {
    const scaleFactor = 0.75 + stage * 0.12;
    const bodyColor =
      petType === 'bunny'
        ? '#FFFFFF'
        : petType === 'kitten'
        ? '#FFF7ED'
        : petType === 'fox'
        ? '#FFEDD5'
        : '#FEF3C7';
    const accentColor = currentPet.color;

    return (
      <svg
        viewBox="0 0 100 100"
        className={`w-full h-full transition-transform duration-500 ${
          isWalking || bounce ? 'animate-bounce' : ''
        }`}
        style={{ transform: `scale(${scaleFactor})` }}
      >
        {/* Shadow */}
        <ellipse cx="50" cy="88" fill="#0f172a" opacity="0.12" rx={18 * scaleFactor} ry={3}>
          <animate
            attributeName="rx"
            dur="2s"
            repeatCount="indefinite"
            values={`${18 * scaleFactor}; ${15 * scaleFactor}; ${18 * scaleFactor}`}
          />
        </ellipse>

        {/* Aura for Master Stage */}
        {stage >= 4 && (
          <circle
            cx="50"
            cy="55"
            r="42"
            fill="none"
            stroke={accentColor}
            strokeWidth="1.5"
            strokeDasharray="4,4"
            opacity="0.7"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 50 55"
              to="360 50 55"
              dur="10s"
              repeatCount="indefinite"
            />
          </circle>
        )}

        {/* Tail */}
        <circle cx="22" cy="70" fill={bodyColor} r={stage >= 3 ? 7 : 5} stroke="#0f172a" strokeWidth="1">
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 22 70; 15 22 70; 0 22 70"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Body */}
        <path
          d="M50,85 Q30,85 25,60 Q25,35 50,35 Q75,35 75,60 Q75,85 50,85"
          fill={bodyColor}
          stroke="#0f172a"
          strokeWidth="1"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0; 0,-2; 0,0"
            dur="3s"
            repeatCount="indefinite"
          />
        </path>

        {/* Ears */}
        {petType === 'bunny' ? (
          <>
            <path d="M40,38 Q35,10 42,10 Q48,10 45,38" fill={bodyColor} stroke="#0f172a" strokeWidth="1">
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 40 38; -6 40 38; 0 40 38"
                dur="3s"
                repeatCount="indefinite"
              />
            </path>
            <path d="M55,38 Q50,5 60,5 Q70,5 65,38" fill={bodyColor} stroke="#0f172a" strokeWidth="1">
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 55 38; 6 55 38; 0 55 38"
                dur="2.5s"
                repeatCount="indefinite"
              />
            </path>
          </>
        ) : (
          <>
            <polygon points="36,40 28,15 44,32" fill={accentColor} stroke="#0f172a" strokeWidth="1" />
            <polygon points="64,40 72,15 56,32" fill={accentColor} stroke="#0f172a" strokeWidth="1" />
          </>
        )}

        {/* Eyes */}
        <circle cx="43" cy="52" r={stage >= 3 ? 2.5 : 2} fill="#0f172a" />
        <circle cx="57" cy="52" r={stage >= 3 ? 2.5 : 2} fill="#0f172a" />
        <circle cx="44" cy="51" r="0.8" fill="#FFFFFF" />
        <circle cx="58" cy="51" r="0.8" fill="#FFFFFF" />

        {/* Nose & Whiskers */}
        <ellipse cx="50" cy="57" rx="1.5" ry="1" fill="#ff6b50" />
        <path d="M48,60 Q50,63 52,60" fill="none" stroke="#0f172a" strokeWidth="0.8" />

        {/* Paws */}
        <circle cx="40" cy="67" r="4" fill={bodyColor} stroke="#0f172a" strokeWidth="1" />
        <circle cx="60" cy="67" r="4" fill={bodyColor} stroke="#0f172a" strokeWidth="1" />

        {/* Accessories depending on Stage */}
        {stage === 2 && (
          <g>
            <path d="M46,65 Q50,82 54,65 Z" fill="#f59e0b" stroke="#0f172a" strokeWidth="0.5" />
            <path d="M46,65 Q43,60 46,58 Q49,60 49,65 M51,65 Q51,60 54,58 Q57,60 54,65" fill="#0d9488" />
          </g>
        )}
        {stage === 3 && (
          <g>
            <path d="M35,32 Q50,22 65,32 L68,36 L32,36 Z" fill="#0d9488" stroke="#0f172a" strokeWidth="1" />
            <circle cx="50" cy="24" r="2.5" fill="#f59e0b" />
          </g>
        )}
        {stage >= 4 && (
          <g>
            <polygon points="40,28 44,18 50,25 56,18 60,28" fill="#f59e0b" stroke="#0f172a" strokeWidth="1" />
            <circle cx="50" cy="20" r="1.5" fill="#ff6b50" />
          </g>
        )}
      </svg>
    );
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      {/* Shimmer Evolution Overlay */}
      {showShimmer && (
        <div className="absolute inset-0 z-50 rounded-3xl bg-gradient-to-r from-amber2-100 via-amber2-200 to-amber2-100 backdrop-blur-md flex flex-col items-center justify-center border-2 border-amber2-400 animate-pulse">
          <Sparkles className="w-10 h-10 text-amber2-600 animate-spin mb-2" />
          <span className="font-bold text-lg text-ink-900 tracking-wide">
            Evolving to Stage {stage}!
          </span>
          <span className="text-xs text-sq-700 font-semibold mt-1">Growth Energy Unlocked ⚡</span>
        </div>
      )}

      {/* Floating interactive hearts */}
      {hearts.map((h) => (
        <div
          key={h.id}
          className="absolute z-40 pointer-events-none animate-fade-in-up text-coral-500 font-bold text-lg"
          style={{ left: h.x, top: h.y - 20 }}
        >
          ❤️ +10 XP
        </div>
      ))}

      {/* Pet graphic */}
      <div
        onClick={handlePetClick}
        className={`relative ${stageData.size} flex items-center justify-center transition-all duration-300 ${
          interactive ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
        }`}
      >
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-25 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${currentPet.color}, transparent)` }}
        />
        {renderAnimalSVG()}
      </div>

      {/* Info Tag */}
      <div className="mt-3 text-center bg-white border border-ink-200 rounded-2xl px-4 py-2 shadow-soft">
        <div className="flex items-center justify-center gap-2">
          <span className="text-base">{currentPet.icon}</span>
          <span className="font-bold text-xs text-ink-900">{currentPet.name}</span>
          <span className="text-[10px] bg-sq-100 text-sq-700 px-2 py-0.5 rounded-full font-extrabold">
            Lv.{stage}
          </span>
        </div>
        <div className="text-[10px] text-ink-400 mt-0.5 font-bold uppercase tracking-wider">
          {stageData.title}
        </div>
      </div>

      {/* Pet selector toggle */}
      {interactive && onPetChange && (
        <div className="mt-3 flex items-center gap-1.5">
          {PET_TYPES.map((p) => (
            <button
              key={p.id}
              onClick={() => onPetChange(p.id)}
              className={`w-7 h-7 rounded-xl flex items-center justify-center text-sm transition-all ${
                p.id === petType
                  ? 'bg-sq-600 text-white shadow-soft scale-110'
                  : 'bg-white text-ink-600 border border-ink-200 hover:border-sq-400'
              }`}
              title={p.name}
            >
              {p.icon}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface ForestPathProps {
  level: number;
  activePet?: string;
  onCompletePath: () => void;
}

export function ForestPathTransition({ level, activePet = 'bunny', onCompletePath }: ForestPathProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onCompletePath();
    }, 3500);
    return () => clearTimeout(timer);
  }, [onCompletePath]);

  return (
    <div className="fixed inset-0 z-50 bg-ink-900 flex flex-col items-center justify-center p-6 overflow-hidden">
      <div className="relative z-10 max-w-lg w-full bg-white border border-ink-100 rounded-3xl p-8 text-center shadow-soft-lg animate-scale-in">
        <div className="flex items-center justify-center gap-2 text-sq-600 mb-3 text-xs font-bold uppercase tracking-widest">
          <TreePine className="w-4 h-4" /> Moving Through The Cognitive Forest
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-ink-900 mb-2">
          Challenge Level {level} Cleared!
        </h2>
        <p className="text-sm text-ink-500 mb-6">
          Your companion is growing stronger as you master new skills.
        </p>

        <div className="my-6 relative h-40 flex items-center justify-center">
          <div className="animate-bounce">
            <PetCompanion stage={Math.min(4, level + 1)} petType={activePet} isWalking={true} interactive={false} />
          </div>
        </div>

        <button
          onClick={onCompletePath}
          className="btn-primary w-full text-base py-3.5"
        >
          <span>Continue Journey</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
