import React, { useState } from 'react';
import { 
  ProjectData, 
  ReviewDraftSection 
} from '../types';
import { synthesizeManuscriptSections, runFullCorpusSynthesis } from '../utils/synthesisEngine';
import { 
  GitPullRequest, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Edit3, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  FileText, 
  Layers, 
  ArrowDown
} from 'lucide-react';

interface Step8ReviewDraftProps {
  project: ProjectData;
  onUpdateProject: (updates: Partial<ProjectData>) => void;
  onContinue: () => void;
}

export const Step8ReviewDraft: React.FC<Step8ReviewDraftProps> = ({
  project,
  onUpdateProject,
  onContinue
}) => {
  const [sections, setSections] = useState<ReviewDraftSection[]>(project.reviewDraftSections || []);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');

  const pc = project.prismaCounts;

  // PRISMA Flow Consistency Check
  const expectedScreened = pc.totalIdentified - pc.duplicatesRemoved;
  const isPrismaConsistent = 
    expectedScreened === pc.recordsScreened && 
    (pc.recordsScreened - pc.recordsExcluded >= 0);

  const handleEditSection = (sec: ReviewDraftSection) => {
    setEditingSectionId(sec.id);
    setEditingContent(sec.content);
  };

  const handleSaveSection = (secId: string) => {
    const updated = sections.map(s => {
      if (s.id === secId) {
        return { ...s, content: editingContent };
      }
      return s;
    });
    setSections(updated);
    onUpdateProject({ reviewDraftSections: updated });
    setEditingSectionId(null);
  };

  const handleReSynthesizeDraft = () => {
    const newSections = synthesizeManuscriptSections(project);
    setSections(newSections);
    const synthesized = runFullCorpusSynthesis({
      ...project,
      reviewDraftSections: newSections
    });
    onUpdateProject(synthesized);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-6 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <GitPullRequest className="w-4 h-4" />
            <span>Step 8 of 9</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Review Blueprint & PRISMA 2020 Flow
          </h1>
          <p className="text-sm text-slate-400">
            Verify PRISMA 2020 flow consistency and examine the 7-section structured academic review manuscript framework.
          </p>
        </div>

        <button
          onClick={handleReSynthesizeDraft}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-sm self-start sm:self-auto"
          title="Re-generate all 7 PRISMA review draft sections incorporating all uploaded papers"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Re-Generate Draft from Ingested Papers ({project.papers.filter(p => !p.isDuplicate).length})</span>
        </button>
      </div>

      {/* Abstract-Only Limitation Evidence Scope Notice Banner */}
      <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-4 flex items-start space-x-3 text-xs">
        <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-amber-300">Evidence Scope & Methodological Statement</h4>
          <p className="text-slate-300 leading-relaxed">
            Current systematic synthesis is primarily grounded in bibliographic metadata and peer-reviewed abstracts. Detailed statistical hyperparameters, experimental ablation tables, and deep architectural benchmarks require full-text retrieval.
          </p>
        </div>
      </div>

      {/* Visual PRISMA 2020 Flow Diagram */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide">
              PRISMA 2020 Flow Diagram (Live Verification)
            </h3>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            {isPrismaConsistent ? (
              <span className="flex items-center space-x-1 text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Arithmetic Verified Consistent</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1 text-amber-400 font-bold bg-amber-950/60 px-2.5 py-1 rounded border border-amber-800">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Flow Variance Detected</span>
              </span>
            )}
          </div>
        </div>

        {/* PRISMA Diagram Flow Grid */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {/* Phase 1: Identification */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              1. Identification Phase
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                <span className="text-[10px] text-orange-400 font-semibold">Scopus</span>
                <p className="text-base font-bold text-white mt-0.5">{pc.recordsScopus}</p>
              </div>
              <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                <span className="text-[10px] text-emerald-400 font-semibold">Web of Science</span>
                <p className="text-base font-bold text-white mt-0.5">{pc.recordsWos}</p>
              </div>
              <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                <span className="text-[10px] text-blue-400 font-semibold">Google Scholar</span>
                <p className="text-base font-bold text-white mt-0.5">{pc.recordsScholar}</p>
              </div>
              <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold">Other Sources</span>
                <p className="text-base font-bold text-white mt-0.5">{pc.recordsOther}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 p-2.5 bg-slate-900/60 rounded border border-slate-800/80 text-xs">
              <span>Total Records Identified: <strong className="text-white">{pc.totalIdentified}</strong></span>
              <span className="text-amber-400">Duplicates Removed: <strong>{pc.duplicatesRemoved}</strong></span>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-5 h-5 text-slate-600" />
          </div>

          {/* Phase 2: Screening */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              2. Screening Phase (Title & Abstract)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-900 p-3 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Unique Records Screened</span>
                <p className="text-xl font-bold text-white mt-0.5">{pc.recordsScreened}</p>
              </div>

              <div className="bg-rose-950/30 p-3 rounded border border-rose-800/40">
                <span className="text-[10px] text-rose-400 uppercase font-semibold">Records Excluded</span>
                <p className="text-xl font-bold text-rose-400 mt-0.5">{pc.recordsExcluded}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-5 h-5 text-slate-600" />
          </div>

          {/* Phase 3: Inclusion */}
          <div className="bg-emerald-950/20 p-4 rounded-xl border border-emerald-800/40 space-y-2">
            <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
              3. Inclusion & Synthesis Phase
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-slate-950/80 p-3.5 rounded-lg border border-emerald-800/30">
              <div>
                <span className="text-slate-400">Total Studies Included in Review Synthesis:</span>
                <p className="text-2xl font-black text-emerald-400 mt-0.5">{pc.studiesIncluded} Studies</p>
              </div>
              <div className="text-right text-slate-300">
                <p>Synthesized into <strong>{project.themes.length} Thematic Clusters</strong></p>
                <p>Spanning <strong>{project.researchGaps.length} Research Gap Dimensions</strong></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Section Structured Manuscript Framework */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide">
              7-Section Structured Manuscript Outline
            </h3>
          </div>
          <span className="text-xs text-slate-400">PRISMA 2020 Compliant</span>
        </div>

        <div className="space-y-4">
          {sections.map((section) => {
            const isEditing = editingSectionId === section.id;

            return (
              <div 
                key={section.id}
                className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-amber-400 px-2 py-0.5 bg-slate-900 rounded">
                      Section {section.number}
                    </span>
                    <h4 className="font-bold text-white text-sm">{section.title}</h4>
                  </div>
                  <button
                    onClick={() => isEditing ? handleSaveSection(section.id) : handleEditSection(section)}
                    className="p-1.5 rounded hover:bg-slate-900 text-slate-400 hover:text-amber-400 transition-colors"
                  >
                    {isEditing ? <Check className="w-4 h-4 text-emerald-400" /> : <Edit3 className="w-4 h-4" />}
                  </button>
                </div>

                {isEditing ? (
                  <textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    rows={6}
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-amber-400 font-sans"
                  />
                ) : (
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {section.content}
                  </p>
                )}

                {section.subsections && section.subsections.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-900">
                    {section.subsections.map((sub, idx) => (
                      <div key={idx} className="p-2 bg-slate-900/60 rounded border border-slate-800/80 text-[11px]">
                        <span className="font-semibold text-amber-300 mr-1.5">{sub.number}</span>
                        <span className="text-slate-300">{sub.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Continue */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <div className="text-xs text-slate-400 flex items-center space-x-1.5">
          <FileText className="w-3.5 h-3.5 text-amber-400" />
          <span>Next: Review the full synthesized systematic review paper with interactive in-text citations.</span>
        </div>

        <button
          onClick={onContinue}
          className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-all shadow-md"
        >
          <span>Continue to Final Review Paper</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
