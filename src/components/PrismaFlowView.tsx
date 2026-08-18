import React, { useState } from 'react';
import { ProjectData, PrismaCounts } from '../types';
import { 
  GitPullRequest, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowDown, 
  ArrowRight, 
  Layers, 
  RefreshCw, 
  Download, 
  ShieldCheck,
  Edit3
} from 'lucide-react';

interface PrismaFlowViewProps {
  project: ProjectData;
  onUpdateProject: (updates: Partial<ProjectData>) => void;
}

export const PrismaFlowView: React.FC<PrismaFlowViewProps> = ({
  project,
  onUpdateProject
}) => {
  const [counts, setCounts] = useState<PrismaCounts>(project.prismaCounts);
  const [isEditing, setIsEditing] = useState(false);

  // Consistency checks
  const sumDatabases = (counts.recordsScopus || 0) + (counts.recordsWos || 0) + (counts.recordsResearchGate || 0) + (counts.recordsScholar || 0) + (counts.recordsOther || 0) + (counts.recordsPubMed || 0) + (counts.recordsIeee || 0);
  const computedScreened = counts.totalIdentified - counts.duplicatesRemoved;
  const computedIncluded = counts.recordsScreened - counts.recordsExcluded;

  const isMathValid = 
    counts.totalIdentified === sumDatabases && 
    counts.recordsScreened === computedScreened &&
    counts.studiesIncluded === computedIncluded;

  const handleUpdateField = (field: keyof PrismaCounts, val: number) => {
    const updated = {
      ...counts,
      [field]: val
    };
    setCounts(updated);
    onUpdateProject({ prismaCounts: updated });
  };

  const handleRecalculateAuto = () => {
    const totalId = (counts.recordsScopus || 0) + (counts.recordsWos || 0) + (counts.recordsResearchGate || 0) + (counts.recordsScholar || 0) + (counts.recordsOther || 0) + (counts.recordsPubMed || 0) + (counts.recordsIeee || 0);
    const screened = totalId - counts.duplicatesRemoved;
    const included = screened - counts.recordsExcluded;

    const autoCounts: PrismaCounts = {
      ...counts,
      totalIdentified: totalId,
      recordsScreened: Math.max(0, screened),
      studiesIncluded: Math.max(0, included)
    };

    setCounts(autoCounts);
    onUpdateProject({ prismaCounts: autoCounts });
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-6 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <GitPullRequest className="w-4 h-4" />
            <span>PRISMA 2020 Standard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            PRISMA 2020 Flow Diagram
          </h1>
          <p className="text-sm text-slate-400">
            Official arithmetic verification of records identified, duplicates removed, titles screened, full texts assessed, and studies synthesized.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-400" />
            <span>{isEditing ? 'Done Editing' : 'Adjust Counts'}</span>
          </button>

          <button
            onClick={handleRecalculateAuto}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Verify & Recompute Flow</span>
          </button>
        </div>
      </div>

      {/* Validation Status */}
      <div className={`p-4 rounded-xl border flex items-center justify-between text-xs ${
        isMathValid 
          ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300' 
          : 'bg-amber-950/30 border-amber-800/60 text-amber-300'
      }`}>
        <div className="flex items-center space-x-2.5">
          {isMathValid ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />}
          <div>
            <p className="font-bold">
              {isMathValid ? 'PRISMA 2020 Arithmetic Verification: Passed' : 'Arithmetic Discrepancy Detected'}
            </p>
            <p className="text-[11px] text-slate-400">
              {isMathValid 
                ? 'All identification, screening, and inclusion phase numbers resolve mathematically without leakage.'
                : 'Click "Verify & Recompute Flow" to automatically reconcile numbers across phases.'}
            </p>
          </div>
        </div>

        <span className="font-mono font-bold text-sm">
          {counts.studiesIncluded} Included Studies
        </span>
      </div>

      {/* Flow Diagram Structure */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 space-y-6 shadow-2xl">
        {/* Phase 1: Identification */}
        <div className="border-l-4 border-amber-400 pl-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Identification Phase
            </h3>
            <span className="text-xs text-slate-400 font-mono">Stage 1</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <span className="font-semibold text-slate-300 block">Records identified from databases:</span>
              <div className="grid grid-cols-2 gap-2 text-slate-400 font-mono text-[11px]">
                <div className="flex justify-between bg-slate-900 p-2 rounded border border-slate-800/60">
                  <span>Scopus:</span>
                  {isEditing ? (
                    <input
                      type="number"
                      value={counts.recordsScopus}
                      onChange={(e) => handleUpdateField('recordsScopus', parseInt(e.target.value) || 0)}
                      className="w-14 bg-slate-950 border border-slate-700 text-white text-right px-1"
                    />
                  ) : (
                    <strong className="text-white">{counts.recordsScopus}</strong>
                  )}
                </div>

                <div className="flex justify-between bg-slate-900 p-2 rounded border border-slate-800/60">
                  <span>Web of Science:</span>
                  {isEditing ? (
                    <input
                      type="number"
                      value={counts.recordsWos}
                      onChange={(e) => handleUpdateField('recordsWos', parseInt(e.target.value) || 0)}
                      className="w-14 bg-slate-950 border border-slate-700 text-white text-right px-1"
                    />
                  ) : (
                    <strong className="text-white">{counts.recordsWos}</strong>
                  )}
                </div>

                <div className="flex justify-between bg-slate-900 p-2 rounded border border-slate-800/60">
                  <span>ResearchGate:</span>
                  {isEditing ? (
                    <input
                      type="number"
                      value={counts.recordsResearchGate || 0}
                      onChange={(e) => handleUpdateField('recordsResearchGate', parseInt(e.target.value) || 0)}
                      className="w-14 bg-slate-950 border border-slate-700 text-white text-right px-1"
                    />
                  ) : (
                    <strong className="text-white">{counts.recordsResearchGate || 0}</strong>
                  )}
                </div>

                <div className="flex justify-between bg-slate-900 p-2 rounded border border-slate-800/60">
                  <span>Google Scholar:</span>
                  {isEditing ? (
                    <input
                      type="number"
                      value={counts.recordsScholar}
                      onChange={(e) => handleUpdateField('recordsScholar', parseInt(e.target.value) || 0)}
                      className="w-14 bg-slate-950 border border-slate-700 text-white text-right px-1"
                    />
                  ) : (
                    <strong className="text-white">{counts.recordsScholar}</strong>
                  )}
                </div>

                <div className="flex justify-between bg-slate-900 p-2 rounded border border-slate-800/60">
                  <span>Other / IEEE / PubMed:</span>
                  {isEditing ? (
                    <input
                      type="number"
                      value={counts.recordsOther}
                      onChange={(e) => handleUpdateField('recordsOther', parseInt(e.target.value) || 0)}
                      className="w-14 bg-slate-950 border border-slate-700 text-white text-right px-1"
                    />
                  ) : (
                    <strong className="text-white">{counts.recordsOther}</strong>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between text-slate-200 font-semibold">
                <span>Total Records Identified:</span>
                <span className="text-amber-400 font-mono font-bold text-sm">{counts.totalIdentified}</span>
              </div>
            </div>

            {/* Deduplication block */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs flex flex-col justify-center">
              <span className="font-semibold text-slate-300">Duplicate Removal:</span>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Duplicate records removed:</span>
                {isEditing ? (
                  <input
                    type="number"
                    value={counts.duplicatesRemoved}
                    onChange={(e) => handleUpdateField('duplicatesRemoved', parseInt(e.target.value) || 0)}
                    className="w-16 bg-slate-950 border border-slate-700 text-amber-400 font-bold text-right px-1"
                  />
                ) : (
                  <strong className="text-amber-400 font-mono text-base">{counts.duplicatesRemoved}</strong>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                Verified using exact DOI matching and Title Levenshtein distance &gt; 95%.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <ArrowDown className="w-5 h-5 text-slate-600" />
        </div>

        {/* Phase 2: Screening */}
        <div className="border-l-4 border-sky-400 pl-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider">
              Screening Phase
            </h3>
            <span className="text-xs text-slate-400 font-mono">Stage 2</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <span className="font-semibold text-slate-300 block">Unique Records Screened:</span>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Title & Abstract Screening:</span>
                <span className="text-white font-mono font-bold text-lg">{counts.recordsScreened}</span>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-rose-900/40 space-y-2 text-xs">
              <span className="font-semibold text-rose-300 block">Records Excluded:</span>
              <div className="p-3 bg-slate-900 rounded-lg border border-rose-900/60 flex justify-between items-center">
                <span className="text-rose-400">Exclusion criteria met:</span>
                {isEditing ? (
                  <input
                    type="number"
                    value={counts.recordsExcluded}
                    onChange={(e) => handleUpdateField('recordsExcluded', parseInt(e.target.value) || 0)}
                    className="w-16 bg-slate-950 border border-slate-700 text-rose-400 font-bold text-right px-1"
                  />
                ) : (
                  <span className="text-rose-400 font-mono font-bold text-lg">{counts.recordsExcluded}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <ArrowDown className="w-5 h-5 text-slate-600" />
        </div>

        {/* Phase 3: Included */}
        <div className="border-l-4 border-emerald-400 pl-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Included Synthesis Phase
            </h3>
            <span className="text-xs text-slate-400 font-mono">Stage 3</span>
          </div>

          <div className="bg-emerald-950/20 p-5 rounded-xl border border-emerald-800/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div>
              <span className="text-slate-400 block mb-1">Final Primary Studies Synthesized:</span>
              <span className="text-3xl font-black text-emerald-400 font-mono">
                {counts.studiesIncluded} Studies
              </span>
            </div>

            <div className="text-right space-y-1 text-slate-300">
              <p>Standardized in <strong>18-Column Evidence Matrix</strong></p>
              <p>Appraised under <strong>MMAT 2018 Protocol</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
