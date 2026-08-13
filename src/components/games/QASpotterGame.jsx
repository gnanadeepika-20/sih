import React, { useState } from "react";
import { ShieldCheck, AlertCircle, CheckCircle2, Search } from "lucide-react";
import { QA_SPOTTER_DATASETS } from "../../data/gameData";

export default function QASpotterGame({ onComplete }) {
  const [datasetIdx, setDatasetIdx] = useState(0);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const dataset = QA_SPOTTER_DATASETS[datasetIdx];

  const handleRowClick = (row) => {
    if (showExplanation) return;

    setSelectedRowId(row.id);
    setShowExplanation(true);

    const isBug = !!row.isBug;
    const newCorrect = isBug ? correctCount + 1 : correctCount;

    setTimeout(() => {
      if (datasetIdx < QA_SPOTTER_DATASETS.length - 1) {
        setCorrectCount(newCorrect);
        setDatasetIdx((i) => i + 1);
        setSelectedRowId(null);
        setShowExplanation(false);
      } else {
        const finalScore = Math.round((newCorrect / QA_SPOTTER_DATASETS.length) * 100);
        onComplete(finalScore);
      }
    }, 1800);
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-[#1B1E52] border border-[#33366E] rounded-2xl p-5 sm:p-7 animate-fade-in shadow-xl">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#33366E]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#34D1BF]/20 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-[#34D1BF]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#F5F3ED] font-heading">
              Game 5: QA & Data Anomaly Spotter
            </h3>
            <p className="text-xs text-[#9497C9]">Attention to detail & data integrity check</p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#242868] text-[#34D1BF] border border-[#33366E]">
          Set {datasetIdx + 1} / {QA_SPOTTER_DATASETS.length}
        </span>
      </div>

      <div className="mb-4">
        <h4 className="text-xs font-mono font-bold text-[#34D1BF] uppercase tracking-wider">
          {dataset.title}
        </h4>
        <p className="text-xs text-[#9497C9] mt-1">{dataset.instruction}</p>
      </div>

      {/* Table Display */}
      <div className="bg-[#12143A] rounded-xl border border-[#33366E] overflow-hidden mb-4 shadow-inner">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-[#1B1E52] border-b border-[#33366E] text-[#9497C9]">
                {Object.keys(dataset.rows[0])
                  .filter((k) => k !== "isBug" && k !== "bugReason")
                  .map((key) => (
                    <th key={key} className="p-3 uppercase font-semibold">
                      {key}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#33366E]/50">
              {dataset.rows.map((row) => {
                const isSelected = selectedRowId === row.id;
                const isTargetBug = showExplanation && row.isBug;

                return (
                  <tr
                    key={row.id}
                    onClick={() => handleRowClick(row)}
                    className={`cursor-pointer transition-all ${
                      isTargetBug
                        ? "bg-[#FF7A6B]/25 text-[#F5F3ED] font-bold"
                        : isSelected
                        ? "bg-[#FFB238]/20 text-[#F5F3ED]"
                        : "hover:bg-[#242868] text-[#9497C9] hover:text-[#F5F3ED]"
                    }`}
                  >
                    {Object.entries(row)
                      .filter(([k]) => k !== "isBug" && k !== "bugReason")
                      .map(([key, val]) => (
                        <td key={key} className="p-3 whitespace-nowrap">
                          {String(val)}
                        </td>
                      ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Explanation Banner */}
      {showExplanation && (
        <div className="p-3.5 rounded-xl bg-[#34D1BF]/15 border border-[#34D1BF]/40 text-[#34D1BF] text-xs font-semibold animate-fade-in">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-4 h-4 text-[#34D1BF]" />
            <span>
              {dataset.rows.find((r) => r.id === selectedRowId)?.isBug
                ? "Excellent Spot! Anomaly Caught."
                : "Anomaly details logged."}
            </span>
          </div>
          <p className="text-[#F5F3ED]/90 text-[11px] font-mono mt-1">
            Reason: {dataset.rows.find((r) => r.isBug)?.bugReason}
          </p>
        </div>
      )}
    </div>
  );
}
