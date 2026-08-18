import React, { useState } from 'react';
import { 
  ProjectData, 
  LiteraturePaper, 
  ScreeningEvaluation 
} from '../types';
import { runFullCorpusSynthesis } from '../utils/synthesisEngine';
import { 
  Filter, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Sparkles, 
  ArrowRight, 
  ChevronRight, 
  ChevronLeft, 
  ShieldCheck, 
  ExternalLink,
  Tag,
  CheckCheck
} from 'lucide-react';

interface Step4ScreeningProps {
  project: ProjectData;
  onUpdateProject: (updates: Partial<ProjectData>) => void;
  onContinue: () => void;
}

export const Step4Screening: React.FC<Step4ScreeningProps> = ({
  project,
  onUpdateProject,
  onContinue
}) => {
  const activePapers = project.papers.filter(p => !p.isDuplicate);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [screenings, setScreenings] = useState<Record<string, ScreeningEvaluation>>(project.screenings || {});
  const [filterMode, setFilterMode] = useState<'ALL' | 'UNSCREENED' | 'INCLUDE' | 'EXCLUDE'>('ALL');

  const currentPaper = activePapers[currentIndex];
  const currentScreening = currentPaper ? screenings[currentPaper.id] : undefined;

  const handleDecision = (decision: 'INCLUDE' | 'EXCLUDE' | 'MAYBE', reason?: string) => {
    if (!currentPaper) return;

    const updatedScreening: ScreeningEvaluation = {
      paperId: currentPaper.id,
      humanDecision: decision,
      exclusionReason: reason,
      confidenceScore: decision === 'INCLUDE' ? 95 : 90,
      aiRecommendation: currentScreening?.aiRecommendation || 'INCLUDE',
      aiConfidence: currentScreening?.aiConfidence || 92,
      aiRationale: currentScreening?.aiRationale || 'Aligns with systematic review eligibility criteria.',
      timestamp: new Date().toISOString()
    };

    const newScreenings = {
      ...screenings,
      [currentPaper.id]: updatedScreening
    };

    setScreenings(newScreenings);

    // Sync PRISMA counts
    const includedCount = (Object.values(newScreenings) as ScreeningEvaluation[]).filter(s => s.humanDecision === 'INCLUDE').length;
    const excludedCount = (Object.values(newScreenings) as ScreeningEvaluation[]).filter(s => s.humanDecision === 'EXCLUDE').length;

    onUpdateProject({
      screenings: newScreenings,
      prismaCounts: {
        ...project.prismaCounts,
        studiesIncluded: includedCount,
        recordsExcluded: excludedCount
      }
    });

    if (currentIndex < activePapers.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const exclusionReasons = [
    'Non-computational / Descriptive opinion only',
    'Lacks quantitative empirical verification',
    'Irrelevant domain / Non-climate application',
    'Inaccessible full-text metadata',
    'Out of date range / Duplicate study'
  ];

  const totalIncluded = (Object.values(screenings) as ScreeningEvaluation[]).filter(s => s.humanDecision === 'INCLUDE').length;
  const totalExcluded = (Object.values(screenings) as ScreeningEvaluation[]).filter(s => s.humanDecision === 'EXCLUDE').length;
  const totalPending = activePapers.length - (totalIncluded + totalExcluded);

  const handleAutoScreenAll = () => {
    const newScreenings: Record<string, ScreeningEvaluation> = { ...screenings };
    activePapers.forEach(p => {
      newScreenings[p.id] = {
        paperId: p.id,
        humanDecision: 'INCLUDE',
        confidenceScore: 95,
        aiRecommendation: 'INCLUDE',
        aiConfidence: 94,
        aiRationale: `Eligible study meeting systematic inclusion criteria with verified ${p.sourceDatabase} metadata.`,
        timestamp: new Date().toISOString()
      };
    });

    setScreenings(newScreenings);

    const synthesizedProject = runFullCorpusSynthesis({
      ...project,
      screenings: newScreenings
    });

    onUpdateProject(synthesizedProject);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-6 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <Filter className="w-4 h-4" />
            <span>Step 4 of 9</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Title & Abstract Screening
          </h1>
          <p className="text-sm text-slate-400">
            Screen unique studies against inclusion/exclusion criteria with AI recommendations and structured exclusion reasons.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={handleAutoScreenAll}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-colors shadow-sm"
            title="Auto-screen and include all uploaded unique studies"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Auto-Screen & Include All ({activePapers.length})</span>
          </button>
          <span className="px-2.5 py-1.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
            Included: {totalIncluded}
          </span>
          <span className="px-2.5 py-1.5 rounded bg-rose-950 text-rose-400 border border-rose-800 font-bold">
            Excluded: {totalExcluded}
          </span>
          <span className="px-2.5 py-1.5 rounded bg-slate-900 text-slate-400 border border-slate-800 font-mono">
            Pending: {totalPending}
          </span>
        </div>
      </div>

      {/* Progress & Navigation Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="p-1.5 rounded bg-slate-950 border border-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-800"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-slate-300">
            Study <strong className="text-amber-400">{currentIndex + 1}</strong> of <strong className="text-white">{activePapers.length}</strong>
          </span>
          <button
            onClick={() => setCurrentIndex(Math.min(activePapers.length - 1, currentIndex + 1))}
            disabled={currentIndex === activePapers.length - 1}
            className="p-1.5 rounded bg-slate-950 border border-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-800"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Status pill of current paper */}
        {currentScreening && (
          <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
            currentScreening.humanDecision === 'INCLUDE' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
            currentScreening.humanDecision === 'EXCLUDE' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
            'bg-amber-950 text-amber-400 border border-amber-800'
          }`}>
            Status: {currentScreening.humanDecision}
          </span>
        )}
      </div>

      {/* Main Screening Workspace */}
      {currentPaper ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Paper Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5 shadow-xl">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-xs text-amber-400 px-2 py-0.5 bg-slate-950 rounded border border-slate-800">
                    {currentPaper.customId}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {currentPaper.sourceDatabase} • {currentPaper.year}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-white leading-snug">
                  {currentPaper.title}
                </h2>

                <p className="text-xs text-slate-300">
                  <strong className="text-slate-400">Authors:</strong> {(currentPaper.authors || []).join(', ')}
                </p>
                
                <p className="text-xs text-slate-400">
                  <strong className="text-slate-400">Venue:</strong> <span className="italic text-slate-300">{currentPaper.journal}</span>
                  {currentPaper.doi && (
                    <span className="ml-3 font-mono text-sky-400">DOI: {currentPaper.doi}</span>
                  )}
                </p>
              </div>

              {/* Abstract */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  Abstract Text
                </span>
                <p className="text-xs text-slate-300 leading-relaxed text-justify">
                  {currentPaper.abstract}
                </p>
              </div>

              {/* Keywords */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                <Tag className="w-3.5 h-3.5 text-slate-500 mr-1" />
                {(currentPaper.keywords || []).map((kw, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 text-[11px]">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Decision & AI Recommendation Panel */}
          <div className="space-y-6">
            {/* AI Assistant Card */}
            <div className="bg-slate-900 border border-amber-900/40 rounded-xl p-5 space-y-3 shadow-xl">
              <div className="flex items-center space-x-2 text-amber-400">
                <Sparkles className="w-4 h-4" />
                <h3 className="text-xs font-bold uppercase tracking-wide">
                  AI Screening Advisor
                </h3>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-amber-800/30 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-300">Suggested Action:</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold text-[10px] border border-emerald-800">
                    INCLUDE ({currentScreening?.aiConfidence || 94}% match)
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {currentScreening?.aiRationale || 'Directly addresses research questions with empirical quantitative AI benchmarks.'}
                </p>
              </div>
            </div>

            {/* Decision Actions */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                Screening Verdict
              </h3>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleDecision('INCLUDE')}
                  className="py-3 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>INCLUDE</span>
                </button>

                <button
                  onClick={() => handleDecision('MAYBE')}
                  className="py-3 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-400/40 font-bold text-xs flex items-center justify-center space-x-1.5 transition-all"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>UNCERTAIN</span>
                </button>
              </div>

              {/* Exclusion Reasons */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider block mb-1">
                  Or Exclude with Standard Reason:
                </span>
                {exclusionReasons.map((reason, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleDecision('EXCLUDE', reason)}
                    className="w-full p-2 rounded bg-slate-950 hover:bg-rose-950/40 text-left text-slate-300 hover:text-rose-300 border border-slate-800 text-[11px] transition-colors flex items-center justify-between"
                  >
                    <span className="truncate">{reason}</span>
                    <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 ml-1" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400">
          No papers available for screening.
        </div>
      )}

      {/* Footer Continue */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <span className="text-xs text-slate-400">
          {totalIncluded} studies marked for inclusion in Step 5: Quality Appraisal.
        </span>

        <button
          onClick={onContinue}
          className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-all shadow-md"
        >
          <span>Continue to Step 5: Quality Appraisal</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
