import { useState, useEffect, useCallback } from 'react';
import type { GameComponentProps } from './types';
import { calculateGameStats } from './types';

const TOTAL_ROUNDS = 6;

interface CreativePrompt {
  prompt: string;
  category: string;
}

const PROMPTS: CreativePrompt[] = [
  { prompt: 'You discover a door that wasn\'t there yesterday. What\'s behind it?', category: 'Story' },
  { prompt: 'Invent a new tool that combines a clock and a compass. What does it do?', category: 'Invention' },
  { prompt: 'Design a color that doesn\'t exist yet. Describe it.', category: 'Visual' },
  { prompt: 'What if gravity worked sideways on Tuesdays? Describe a Tuesday morning.', category: 'What-if' },
  { prompt: 'Invent a new word for the feeling of almost remembering something.', category: 'Language' },
  { prompt: 'Design a building shaped like an emotion. Which emotion and what does it look like?', category: 'Design' },
  { prompt: 'Create a new sport that can only be played in zero gravity.', category: 'Invention' },
  { prompt: 'What would a city built entirely by children look like?', category: 'Design' },
];

export function CreativeLab({ onComplete, onRoundChange }: GameComponentProps) {
  const [round, setRound] = useState(0);
  const [startTime] = useState(Date.now());
  const [correct, setCorrect] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [difficulty, setDifficulty] = useState(1);
  const [promptIdx, setPromptIdx] = useState(() => Math.floor(Math.random() * PROMPTS.length));
  const [usedPrompts, setUsedPrompts] = useState<Set<number>>(new Set([promptIdx]));
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const prompt = PROMPTS[promptIdx];

  const handleSubmit = useCallback(() => {
    if (submitted || answer.trim().length < 10) return;
    setSubmitted(true);

    // Score based on response length and word diversity (deterministic)
    const words = answer.trim().toLowerCase().split(/\s+/);
    const uniqueWords = new Set(words);
    const wordCount = words.length;
    const diversity = uniqueWords.size / Math.max(1, wordCount);
    const lengthScore = Math.min(1, wordCount / 40);
    const diversityScore = Math.min(1, diversity / 0.7);

    // "Correct" = good creative effort (length + diversity above threshold)
    const isGood = lengthScore > 0.3 && diversityScore > 0.4;

    if (isGood) {
      setCorrect(c => c + 1);
      setFeedback('correct');
      setDifficulty(d => Math.min(8, d + 1));
    } else {
      setMistakes(m => m + 1);
    }

    setTimeout(() => {
      setFeedback(null);
      setSubmitted(false);
      setAnswer('');
      setRound(r => r + 1);
    }, 2500);
  }, [answer, submitted]);

  useEffect(() => {
    if (round >= TOTAL_ROUNDS) {
      const stats = calculateGameStats(TOTAL_ROUNDS, correct, mistakes, startTime, difficulty);
      onComplete(stats);
    } else {
      let next: number;
      do {
        next = Math.floor(Math.random() * PROMPTS.length);
      } while (usedPrompts.has(next) && usedPrompts.size < PROMPTS.length);
      setPromptIdx(next);
      setUsedPrompts(prev => new Set([...prev, next]));
    }
  }, [round]);

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      <div className="mb-6 text-center">
        <span className="badge bg-purple-50 text-purple-700 border border-purple-200 mb-3">
          {prompt.category}
        </span>
        <p className="text-lg font-bold text-ink-900 text-balance">{prompt.prompt}</p>
      </div>

      {/* Answer area */}
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        disabled={submitted}
        placeholder="Let your imagination flow... write at least a few sentences."
        className="input min-h-[160px] resize-none mb-4 font-medium"
        autoFocus
      />

      <div className="flex items-center gap-3 w-full">
        <span className="text-sm text-ink-400">{answer.trim().split(/\s+/).filter(Boolean).length} words</span>
        <button
          onClick={handleSubmit}
          disabled={submitted || answer.trim().length < 10}
          className="btn-primary ml-auto"
        >
          {submitted ? 'Submitted!' : 'Submit Response'}
        </button>
      </div>

      {/* Feedback */}
      {submitted && (
        <div className={`mt-6 p-4 rounded-xl animate-fade-in w-full ${
          feedback === 'correct' ? 'bg-emerald-50' : 'bg-amber2-50'
        }`}>
          <p className={`font-semibold text-sm ${feedback === 'correct' ? 'text-emerald-700' : 'text-amber2-700'}`}>
            {feedback === 'correct'
              ? 'Beautiful! Your response shows rich creative thinking and originality.'
              : 'Good start! Try to explore the idea more deeply — add more detail and unique connections.'}
          </p>
        </div>
      )}
    </div>
  );
}
