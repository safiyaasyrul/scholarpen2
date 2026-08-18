import React, { useState } from 'react';
import { 
  ProjectData, 
  EvidenceExtraction, 
  LiteraturePaper 
} from '../types';
import { extractEvidenceFromPaper, runFullCorpusSynthesis } from '../utils/synthesisEngine';
import { 
  Database, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  FileText, 
  Save,
  Check,
  RefreshCw
} from 'lucide-react';

interface Step6DataExtractionProps {
  project: ProjectData;
  onUpdateProject: (updates: Partial<ProjectData>) => void;
  onContinue: () => void;
}

export const Step6DataExtraction: React.FC<Step6DataExtractionProps> = ({
  project,
  onUpdateProject,
  onContinue
}) => {
  const includedPapers = project.papers.filter(p => {
    const s = project.screenings?.[p.id];
    return s && s.humanDecision === 'INCLUDE';
  });

  const [selectedPaperIndex, setSelectedPaperIndex] = useState(0);
  const [extractions, setExtractions] = useState<Record<string, EvidenceExtraction>>(project.evidenceExtractions || {});
  const [savedSuccess, setSavedSuccess] = useState(false);

  const currentPaper = includedPapers[selectedPaperIndex];

  const defaultExtraction: EvidenceExtraction = {
    paperId: currentPaper?.id || '',
    country: 'Not reported in abstract',
    objective: 'Not reported in abstract',
    problem: 'Not reported in abstract',
    context: 'Not reported in abstract',
    methodology: 'Not reported in abstract',
    dataset: 'Not reported in abstract',
    sample: 'Not reported in abstract',
    variables: 'Not reported in abstract',
    model: 'Not reported in abstract',
    outcome: 'Not reported in abstract',
    findings: 'Not reported in abstract',
    limitations: 'Not reported in abstract',
    researchGap: 'Not reported in abstract',
    statisticalMetrics: 'Not reported in abstract',
    fullTextVerified: false
  };

  const currentExtraction: EvidenceExtraction = (currentPaper && extractions[currentPaper.id]) || defaultExtraction;

  const handleFieldChange = (field: keyof EvidenceExtraction, value: any) => {
    if (!currentPaper) return;

    const updated = {
      ...currentExtraction,
      [field]: value,
      paperId: currentPaper.id
    };

    const newExtractions = {
      ...extractions,
      [currentPaper.id]: updated
    };

    setExtractions(newExtractions);
    onUpdateProject({ evidenceExtractions: newExtractions });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 1500);
  };

  const handleAutoExtractAll = () => {
    const updatedExtractions: Record<string, EvidenceExtraction> = { ...extractions };
    includedPapers.forEach(p => {
      updatedExtractions[p.id] = extractEvidenceFromPaper(p);
    });

    setExtractions(updatedExtractions);
    const synthesized = runFullCorpusSynthesis({
      ...project,
      evidenceExtractions: updatedExtractions
    });
    onUpdateProject(synthesized);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-6 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <Database className="w-4 h-4" />
            <span>Step 6 of 9</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            18-Column Evidence Data Extraction
          </h1>
          <p className="text-sm text-slate-400">
            Extract standardized methodological, contextual, empirical, and outcome parameters across all <strong>{includedPapers.length} included studies</strong>.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleAutoExtractAll}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-sm"
            title="Auto-extract all 18 parameters across all included papers"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Auto-Extract All ({includedPapers.length} Studies)</span>
          </button>

          {savedSuccess && (
            <span className="flex items-center space-x-1 text-emerald-400 text-xs font-semibold bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-800 animate-fadeIn">
              <Check className="w-3.5 h-3.5" />
              <span>Extracted & Saved</span>
            </span>
          )}
        </div>
      </div>

      {/* Abstract-Only Limitation Evidence Scope Notice */}
      <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-4 flex items-start space-x-3 text-xs">
        <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h4 className="font-bold text-amber-300">Evidence Extraction Scope & Verification Notice</h4>
          <p className="text-slate-300 leading-relaxed">
            Data fields extracted below reflect information verified in bibliographic abstracts. Precise hyperparameters, full statistical ablation tables, and deep architectural configurations require full-text verification.
          </p>
        </div>
      </div>

      {/* Paper Switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSelectedPaperIndex(Math.max(0, selectedPaperIndex - 1))}
            disabled={selectedPaperIndex === 0}
            className="p-1.5 rounded bg-slate-950 border border-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-800"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-slate-300">
            Study <strong className="text-amber-400">{selectedPaperIndex + 1}</strong> of <strong className="text-white">{includedPapers.length}</strong>
          </span>
          <button
            onClick={() => setSelectedPaperIndex(Math.min(includedPapers.length - 1, selectedPaperIndex + 1))}
            disabled={selectedPaperIndex === includedPapers.length - 1}
            className="p-1.5 rounded bg-slate-950 border border-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-800"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {currentPaper && (
          <div className="flex items-center space-x-2 text-xs">
            <span className="font-mono font-bold text-amber-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              {currentPaper.customId}
            </span>
            <span className="text-slate-300 font-semibold truncate max-w-xs sm:max-w-md">
              {currentPaper.title}
            </span>
          </div>
        )}
      </div>

      {/* Extraction Form */}
      {currentPaper ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 shadow-xl text-xs">
          {/* Section 1: Bibliographic Context */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-2">
              1. Geographic Context & Research Problem
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Country / Geographic Catchment</label>
                <input
                  type="text"
                  value={currentExtraction.country}
                  onChange={(e) => handleFieldChange('country', e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Empirical Context & Setting</label>
                <input
                  type="text"
                  value={currentExtraction.context}
                  onChange={(e) => handleFieldChange('context', e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1">Primary Study Objective</label>
                <textarea
                  value={currentExtraction.objective}
                  onChange={(e) => handleFieldChange('objective', e.target.value)}
                  rows={2}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white leading-relaxed"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1">Core Research Problem</label>
                <textarea
                  value={currentExtraction.problem}
                  onChange={(e) => handleFieldChange('problem', e.target.value)}
                  rows={2}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Methodology, AI Model & Dataset */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider border-b border-slate-800 pb-2">
              2. Computational Methodology, AI Model & Telemetry Dataset
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Methodology Paradigm</label>
                <input
                  type="text"
                  value={currentExtraction.methodology}
                  onChange={(e) => handleFieldChange('methodology', e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">AI / ML / Computational Model</label>
                <input
                  type="text"
                  value={currentExtraction.model}
                  onChange={(e) => handleFieldChange('model', e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-sky-300 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Dataset Source & Telemetry Resolution</label>
                <input
                  type="text"
                  value={currentExtraction.dataset}
                  onChange={(e) => handleFieldChange('dataset', e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Sample Size / Scope Bounds</label>
                <input
                  type="text"
                  value={currentExtraction.sample}
                  onChange={(e) => handleFieldChange('sample', e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1">Key Input/Output Variables Examined</label>
                <input
                  type="text"
                  value={currentExtraction.variables}
                  onChange={(e) => handleFieldChange('variables', e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Outcomes, Findings & Gaps */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider border-b border-slate-800 pb-2">
              3. Quantitative Outcomes, Synthesized Findings & Research Gaps
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1">Target Quantitative Outcome Metric</label>
                <input
                  type="text"
                  value={currentExtraction.outcome}
                  onChange={(e) => handleFieldChange('outcome', e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-emerald-300 font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1">Synthesized Findings & Key Conclusions</label>
                <textarea
                  value={currentExtraction.findings}
                  onChange={(e) => handleFieldChange('findings', e.target.value)}
                  rows={3}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Methodological Limitations</label>
                <textarea
                  value={currentExtraction.limitations}
                  onChange={(e) => handleFieldChange('limitations', e.target.value)}
                  rows={2}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-rose-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Identified Research Gap</label>
                <textarea
                  value={currentExtraction.researchGap}
                  onChange={(e) => handleFieldChange('researchGap', e.target.value)}
                  rows={2}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-purple-300 text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400">
          No included studies available for evidence extraction.
        </div>
      )}

      {/* Footer Continue */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <span className="text-xs text-slate-400">
          All 18 parameters are synchronized to the global evidence matrix.
        </span>

        <button
          onClick={onContinue}
          className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-all shadow-md"
        >
          <span>Continue to Step 7: Thematic Synthesis</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
