import React, { useState } from "react";
import { MessageSquare, CheckCircle2, AlertCircle, ArrowRight, Sparkles } from "lucide-react";
import { SIGNAL_DECODER_ROUNDS, EXPLAIN_SIMPLE_PROMPTS } from "../../data/gameData";

export default function SignalDecoder({ onComplete }) {
  const [stage, setStage] = useState("sentence"); // sentence -> simple
  const [roundIdx, setRoundIdx] = useState(0);
  const [pickedWords, setPickedWords] = useState([]);
  const [remainingWords, setRemainingWords] = useState(() => SIGNAL_DECODER_ROUNDS[0].scrambled);
  const [feedback, setFeedback] = useState(null);
  const [sentenceScoreAcc, setSentenceScoreAcc] = useState(0);

  // Round 2 state
  const [promptIdx, setPromptIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [simpleScoreAcc, setSimpleScoreAcc] = useState(0);

  const currentRound = SIGNAL_DECODER_ROUNDS[roundIdx];

  const handlePickWord = (word, idx) => {
    if (feedback) return;
    const nextPicked = [...pickedWords, word];
    const nextRemaining = remainingWords.filter((_, i) => i !== idx);

    setPickedWords(nextPicked);
    setRemainingWords(nextRemaining);

    if (nextRemaining.length === 0) {
      const built = nextPicked.join(" ");
      const isRight = built === currentRound.target;
      setFeedback(isRight ? "right" : "wrong");

      const newAcc = isRight ? sentenceScoreAcc + 1 : sentenceScoreAcc;

      setTimeout(() => {
        setFeedback(null);
        if (roundIdx < SIGNAL_DECODER_ROUNDS.length - 1) {
          const nextI = roundIdx + 1;
          setSentenceScoreAcc(newAcc);
          setRoundIdx(nextI);
          setPickedWords([]);
          setRemainingWords(SIGNAL_DECODER_ROUNDS[nextI].scrambled);
        } else {
          setSentenceScoreAcc(newAcc);
          setStage("simple");
        }
      }, 1200);
    }
  };

  const handleOptionSelect = (option) => {
    if (selectedOption) return;
    setSelectedOption(option);
    const newSimpleAcc = simpleScoreAcc + option.score;

    setTimeout(() => {
      if (promptIdx < EXPLAIN_SIMPLE_PROMPTS.length - 1) {
        setSimpleScoreAcc(newSimpleAcc);
        setPromptIdx((i) => i + 1);
        setSelectedOption(null);
      } else {
        const sentencePercent = (sentenceScoreAcc / SIGNAL_DECODER_ROUNDS.length) * 100;
        const simplePercent = (newSimpleAcc / (EXPLAIN_SIMPLE_PROMPTS.length * 100)) * 100;
        const finalCommScore = Math.round(sentencePercent * 0.4 + simplePercent * 0.6);
        onComplete(finalCommScore);
      }
    }, 1800);
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-[#1B1E52] border border-[#33366E] rounded-2xl p-5 sm:p-7 animate-fade-in shadow-xl">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#33366E]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#34D1BF]/20 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-[#34D1BF]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#F5F3ED] font-heading">
              Game 4: Signal Decoder & Communication
            </h3>
            <p className="text-xs text-[#9497C9]">Clarity, Conciseness & Jargon Simplification</p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#242868] text-[#34D1BF] border border-[#33366E]">
          {stage === "sentence" ? `Round ${roundIdx + 1} / 3` : `Explain It Simple`}
        </span>
      </div>

      {/* STAGE 1: WORD RE-ASSEMBLER */}
      {stage === "sentence" && (
        <div className="space-y-4">
          <div className="text-left">
            <span className="text-xs font-mono font-bold text-[#34D1BF] uppercase tracking-wider">
              Level 1: Sentence Reconstruct
            </span>
            <p className="text-xs text-[#9497C9] mt-1">
              Tap the words in order to form the clearest technical instruction:
            </p>
          </div>

          {/* Constructed Output Area */}
          <div className="min-h-[64px] bg-[#12143A] border-2 border-dashed border-[#33366E] rounded-xl p-3 flex flex-wrap gap-2 items-center justify-start">
            {pickedWords.length === 0 && (
              <span className="text-xs text-[#9497C9]/60 font-mono">
                Your reconstructed sentence will appear here...
              </span>
            )}
            {pickedWords.map((w, i) => (
              <span
                key={i}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                  feedback === "right"
                    ? "bg-[#34D1BF]/20 text-[#34D1BF] border border-[#34D1BF]"
                    : feedback === "wrong"
                    ? "bg-[#FF7A6B]/20 text-[#FF7A6B] border border-[#FF7A6B]"
                    : "bg-[#242868] text-[#F5F3ED] border border-[#33366E]"
                }`}
              >
                {w}
              </span>
            ))}
          </div>

          {/* Scrambled Word Pool */}
          <div className="flex flex-wrap gap-2 justify-center pt-2">
            {remainingWords.map((w, idx) => (
              <button
                key={w + idx}
                onClick={() => handlePickWord(w, idx)}
                className="px-3.5 py-2 rounded-xl text-xs font-mono font-semibold bg-[#242868] hover:bg-[#33366E] text-[#F5F3ED] border border-[#33366E] active:scale-95 transition-all shadow-sm"
              >
                {w}
              </button>
            ))}
          </div>

          {feedback && (
            <div
              className={`p-3 rounded-xl border text-xs font-semibold text-center animate-fade-in ${
                feedback === "right"
                  ? "bg-[#34D1BF]/15 border-[#34D1BF] text-[#34D1BF]"
                  : "bg-[#FF7A6B]/15 border-[#FF7A6B] text-[#FF7A6B]"
              }`}
            >
              {feedback === "right" ? "✓ Crystal Clear Sentence!" : `Target: "${currentRound.target}"`}
            </div>
          )}
        </div>
      )}

      {/* STAGE 2: EXPLAIN IT SIMPLE */}
      {stage === "simple" && (
        <div className="space-y-4">
          <div className="text-left">
            <span className="text-xs font-mono font-bold text-[#FFB238] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FFB238]" /> Level 2: Explain It Simple
            </span>
            <p className="text-xs text-[#9497C9] mt-1">
              Select the explanation that communicates the concept most effectively without jargon:
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#12143A] border border-[#33366E]">
            <h4 className="text-sm font-bold text-[#FFB238] font-heading">
              "{EXPLAIN_SIMPLE_PROMPTS[promptIdx].prompt}"
            </h4>
          </div>

          <div className="space-y-2.5">
            {EXPLAIN_SIMPLE_PROMPTS[promptIdx].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleOptionSelect(opt)}
                disabled={!!selectedOption}
                className={`w-full text-left p-4 rounded-xl border transition-all text-xs ${
                  selectedOption === opt
                    ? opt.score >= 80
                      ? "bg-[#34D1BF]/20 border-[#34D1BF] text-[#F5F3ED]"
                      : "bg-[#FF7A6B]/20 border-[#FF7A6B] text-[#F5F3ED]"
                    : "bg-[#12143A] border-[#33366E] text-[#9497C9] hover:text-[#F5F3ED] hover:border-[#FFB238]/40"
                }`}
              >
                <p className="leading-relaxed">{opt.text}</p>
                {selectedOption === opt && (
                  <p className="mt-2 text-[11px] font-mono text-[#34D1BF]">
                    Score: {opt.score}/100 — {opt.feedback}
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
