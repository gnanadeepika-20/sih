import React, { useState, useEffect, useRef } from "react";
import { LayoutTemplate, Droplet, Type, Sparkles, CheckCircle2, RefreshCw, Layers, ArrowRight } from "lucide-react";
import { LAYOUT_PAIRS, COLOR_ROUNDS, FONT_PAIRS } from "../../data/gameData";

export default function DesignStudio({ onComplete }) {
  const [designSubStep, setDesignSubStep] = useState("layout"); // layout -> color -> font -> sandbox
  const [designScores, setDesignScores] = useState({ layout: 0, color: 0, font: 0, sandbox: 0 });

  // ---------- SUB-LEVEL 1: LAYOUT MATCHER ----------
  const [layoutSlots, setLayoutSlots] = useState(() =>
    LAYOUT_PAIRS.map((p) => ({ id: p.id, label: p.slot, filled: null }))
  );
  const [layoutChips, setLayoutChips] = useState(() =>
    [...LAYOUT_PAIRS].sort(() => Math.random() - 0.5)
  );
  const [selectedChip, setSelectedChip] = useState(null);

  const handleChipClick = (chip) => setSelectedChip(chip);

  const handleSlotClick = (slot) => {
    if (!selectedChip || slot.filled) return;
    if (selectedChip.id === slot.id) {
      setLayoutSlots((prev) =>
        prev.map((s) => (s.id === slot.id ? { ...s, filled: selectedChip.chip } : s))
      );
      setLayoutChips((prev) => prev.filter((c) => c.id !== selectedChip.id));
      setSelectedChip(null);

      if (layoutChips.length === 1) {
        setDesignScores((s) => ({ ...s, layout: 100 }));
        setTimeout(() => setDesignSubStep("color"), 800);
      }
    }
  };

  // ---------- SUB-LEVEL 2: COLOR CONTRAST ----------
  const [colorRoundIdx, setColorRoundIdx] = useState(0);
  const [colorScoreAcc, setColorScoreAcc] = useState(0);
  const colorRound = COLOR_ROUNDS[colorRoundIdx];

  const handleColorAnswer = (hex) => {
    const isRight = hex === colorRound.correct;
    const newAcc = isRight ? colorScoreAcc + 1 : colorScoreAcc;

    if (colorRoundIdx < COLOR_ROUNDS.length - 1) {
      setColorScoreAcc(newAcc);
      setColorRoundIdx((i) => i + 1);
    } else {
      const finalScore = Math.round((newAcc / COLOR_ROUNDS.length) * 100);
      setDesignScores((s) => ({ ...s, color: finalScore }));
      setTimeout(() => setDesignSubStep("font"), 800);
    }
  };

  // ---------- SUB-LEVEL 3: FONT MATCHER ----------
  const [fontSlots, setFontSlots] = useState(() =>
    FONT_PAIRS.map((p) => ({ id: p.id, label: p.slot, filled: null }))
  );
  const [fontChips, setFontChips] = useState(() =>
    [...FONT_PAIRS].sort(() => Math.random() - 0.5)
  );
  const [selectedFontChip, setSelectedFontChip] = useState(null);

  const handleFontSlotClick = (slot) => {
    if (!selectedFontChip || slot.filled) return;
    if (selectedFontChip.id === slot.id) {
      setFontSlots((prev) =>
        prev.map((s) => (s.id === slot.id ? { ...s, filled: selectedFontChip.chip } : s))
      );
      setFontChips((prev) => prev.filter((c) => c.id !== selectedFontChip.id));
      setSelectedFontChip(null);

      if (fontChips.length === 1) {
        setDesignScores((s) => ({ ...s, font: 100 }));
        setTimeout(() => setDesignSubStep("sandbox"), 800);
      }
    }
  };

  // ---------- SUB-LEVEL 4: POWDER / PIXEL SANDBOX & ROOM BUILDER ----------
  const canvasRef = useRef(null);
  const SAND_ROWS = 14, SAND_COLS = 14;
  const [grid, setGrid] = useState(() =>
    Array(SAND_ROWS).fill(null).map(() => Array(SAND_COLS).fill(0))
  );
  const [activeMaterial, setActiveMaterial] = useState(1); // 1: Sand (Amber), 2: Water (Teal), 3: Wall (Coral)
  const [placedCount, setPlacedCount] = useState(0);
  const [materialsUsed, setMaterialsUsed] = useState(new Set());

  const placeParticle = (r, c) => {
    setGrid((g) => {
      const ng = g.map((row) => [...row]);
      if (ng[r][c] !== activeMaterial) {
        ng[r][c] = activeMaterial;
        setPlacedCount((p) => p + 1);
        setMaterialsUsed((prev) => new Set(prev).add(activeMaterial));
      }
      return ng;
    });
  };

  // Physics loop for sand and water fall simulation
  useEffect(() => {
    if (designSubStep !== "sandbox") return;

    const interval = setInterval(() => {
      setGrid((g) => {
        const ng = g.map((row) => [...row]);
        for (let r = SAND_ROWS - 2; r >= 0; r--) {
          for (let c = 0; c < SAND_COLS; c++) {
            const v = ng[r][c];
            if (v === 1) { // Sand physics
              if (ng[r + 1][c] === 0) { ng[r + 1][c] = 1; ng[r][c] = 0; }
              else if (c > 0 && ng[r + 1][c - 1] === 0) { ng[r + 1][c - 1] = 1; ng[r][c] = 0; }
              else if (c < SAND_COLS - 1 && ng[r + 1][c + 1] === 0) { ng[r + 1][c + 1] = 1; ng[r][c] = 0; }
            } else if (v === 2) { // Water physics
              if (ng[r + 1][c] === 0) { ng[r + 1][c] = 2; ng[r][c] = 0; }
              else if (c > 0 && ng[r + 1][c - 1] === 0) { ng[r + 1][c - 1] = 2; ng[r][c] = 0; }
              else if (c < SAND_COLS - 1 && ng[r + 1][c + 1] === 0) { ng[r + 1][c + 1] = 2; ng[r][c] = 0; }
              else if (c > 0 && ng[r][c - 1] === 0) { ng[r][c - 1] = 2; ng[r][c] = 0; }
              else if (c < SAND_COLS - 1 && ng[r][c + 1] === 0) { ng[r][c + 1] = 2; ng[r][c] = 0; }
            }
          }
        }
        return ng;
      });
    }, 130);

    return () => clearInterval(interval);
  }, [designSubStep]);

  const finishSandbox = () => {
    const score = Math.min(100, Math.round(35 + materialsUsed.size * 20 + Math.min(placedCount, 25)));
    const avgScore = Math.round(
      (designScores.layout + designScores.color + designScores.font + score) / 4
    );
    onComplete(avgScore);
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-[#1B1E52] border border-[#33366E] rounded-2xl p-5 sm:p-7 animate-fade-in shadow-xl">
      {/* Sub-step indicator */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#33366E]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#FF7A6B]/20 flex items-center justify-center">
            <LayoutTemplate className="w-5 h-5 text-[#FF7A6B]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#F5F3ED] font-heading">
              Game 3: UI/UX & Spatial Design
            </h3>
            <p className="text-xs text-[#9497C9]">Layout, Color, Typography & Physics Sandbox</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {["layout", "color", "font", "sandbox"].map((stepKey, idx) => (
            <div
              key={stepKey}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                designSubStep === stepKey
                  ? "bg-[#FF7A6B] scale-125 shadow-md shadow-[#FF7A6B]/40"
                  : "bg-[#242868]"
              }`}
            />
          ))}
        </div>
      </div>

      {/* --- LEVEL 1: LAYOUT MATCHER --- */}
      {designSubStep === "layout" && (
        <div className="space-y-4">
          <div className="text-left">
            <span className="text-xs font-mono font-bold text-[#FF7A6B] uppercase tracking-wider">
              Level 1 / 4: Grid Layout Builder
            </span>
            <p className="text-xs text-[#9497C9] mt-1">
              Select a component chip below and tap its correct position in the web wireframe layout:
            </p>
          </div>

          <div className="space-y-2">
            {layoutSlots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => handleSlotClick(slot)}
                className={`w-full text-left p-3.5 rounded-xl border-2 border-dashed transition-all ${
                  slot.filled
                    ? "bg-[#FF7A6B]/15 border-[#FF7A6B] text-[#F5F3ED]"
                    : "bg-[#12143A] border-[#33366E] text-[#9497C9] hover:border-[#FF7A6B]/40"
                }`}
              >
                {slot.filled ? (
                  <span className="text-xs font-mono font-bold text-[#FF7A6B] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> {slot.filled}
                  </span>
                ) : (
                  <span className="text-xs font-mono">{slot.label}</span>
                )}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 justify-center pt-2">
            {layoutChips.map((chip) => (
              <button
                key={chip.id}
                onClick={() => handleChipClick(chip)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                  selectedChip?.id === chip.id
                    ? "bg-[#FF7A6B] text-[#12143A] shadow-lg scale-105"
                    : "bg-[#242868] text-[#F5F3ED] border border-[#33366E]"
                }`}
              >
                {chip.chip}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* --- LEVEL 2: COLOR CONTRAST --- */}
      {designSubStep === "color" && (
        <div className="space-y-4">
          <div className="text-left">
            <span className="text-xs font-mono font-bold text-[#34D1BF] uppercase tracking-wider">
              Level 2 / 4: Accessible Color Contrast
            </span>
            <p className="text-xs text-[#9497C9] mt-1">
              Select the option with optimal text contrast and WCAG readability:
            </p>
          </div>

          <div
            className="p-6 rounded-2xl border border-[#33366E] shadow-inner space-y-3 transition-colors"
            style={{ backgroundColor: colorRound.bg }}
          >
            <p className="text-xs font-mono font-bold text-[#F5F3ED]/80 mb-2">
              Background: {colorRound.label}
            </p>
            {colorRound.options.map((opt) => (
              <button
                key={opt.name}
                onClick={() => handleColorAnswer(opt.hex)}
                className="w-full text-left p-3.5 rounded-xl border border-white/20 font-bold text-sm bg-white/5 hover:bg-white/10 transition-all flex items-center justify-between"
                style={{ color: opt.hex }}
              >
                <span>{opt.name} — Sample Reading Text</span>
                <span className="text-xs font-mono opacity-80">{opt.hex}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* --- LEVEL 3: FONT MATCHER --- */}
      {designSubStep === "font" && (
        <div className="space-y-4">
          <div className="text-left">
            <span className="text-xs font-mono font-bold text-[#FFB238] uppercase tracking-wider">
              Level 3 / 4: Typography Fit
            </span>
            <p className="text-xs text-[#9497C9] mt-1">
              Match each font family with the UI text role it best communicates:
            </p>
          </div>

          <div className="space-y-2">
            {fontSlots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => handleFontSlotClick(slot)}
                className={`w-full text-left p-3.5 rounded-xl border-2 border-dashed transition-all ${
                  slot.filled
                    ? "bg-[#FFB238]/15 border-[#FFB238] text-[#F5F3ED]"
                    : "bg-[#12143A] border-[#33366E] text-[#9497C9] hover:border-[#FFB238]/40"
                }`}
              >
                {slot.filled ? (
                  <span className="text-xs font-mono font-bold text-[#FFB238] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> {slot.filled}
                  </span>
                ) : (
                  <span className="text-xs font-mono">{slot.label}</span>
                )}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 justify-center pt-2">
            {fontChips.map((chip) => (
              <button
                key={chip.id}
                onClick={() => setSelectedFontChip(chip)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                  selectedFontChip?.id === chip.id
                    ? "bg-[#FFB238] text-[#12143A] shadow-lg scale-105"
                    : "bg-[#242868] text-[#F5F3ED] border border-[#33366E]"
                }`}
              >
                {chip.chip}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* --- LEVEL 4: POWDER SANDBOX & ROOM STUDIO --- */}
      {designSubStep === "sandbox" && (
        <div className="space-y-4">
          <div className="text-left">
            <span className="text-xs font-mono font-bold text-[#34D1BF] uppercase tracking-wider">
              Level 4 / 4: Interactive Powder Physics & Room Builder
            </span>
            <p className="text-xs text-[#9497C9] mt-1">
              Select elements below and tap grid cells to experiment with spatial physics & design layout.
            </p>
          </div>

          {/* Palette Selector */}
          <div className="flex justify-center gap-3">
            {[
              { id: 1, label: "Sand (Amber)", color: "bg-[#FFB238]" },
              { id: 2, label: "Water (Teal)", color: "bg-[#34D1BF]" },
              { id: 3, label: "Wall (Coral)", color: "bg-[#FF7A6B]" }
            ].map((mat) => (
              <button
                key={mat.id}
                onClick={() => setActiveMaterial(mat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 border transition-all ${
                  activeMaterial === mat.id
                    ? "border-white bg-[#242868] text-[#F5F3ED] shadow-md"
                    : "border-[#33366E] text-[#9497C9]"
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${mat.color}`} />
                <span>{mat.label}</span>
              </button>
            ))}
          </div>

          {/* Canvas Simulation Grid */}
          <div className="grid grid-cols-14 gap-1 bg-[#12143A] p-2.5 rounded-2xl max-w-[320px] mx-auto border border-[#33366E] shadow-inner">
            {grid.map((row, r) =>
              row.map((val, c) => (
                <div
                  key={`${r}-${c}`}
                  onClick={() => placeParticle(r, c)}
                  className={`aspect-square rounded-sm cursor-pointer transition-colors ${
                    val === 1
                      ? "bg-[#FFB238] shadow-sm shadow-[#FFB238]/50"
                      : val === 2
                      ? "bg-[#34D1BF] shadow-sm shadow-[#34D1BF]/50"
                      : val === 3
                      ? "bg-[#FF7A6B]"
                      : "bg-[#242868]/40 hover:bg-[#33366E]"
                  }`}
                />
              ))
            )}
          </div>

          <button
            onClick={finishSandbox}
            className="w-full bg-[#34D1BF] hover:bg-[#34D1BF]/90 text-[#12143A] font-heading font-bold py-3 px-5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#34D1BF]/20 transition-all active:scale-95"
          >
            <span>Lock In Design Score & Next Game</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
