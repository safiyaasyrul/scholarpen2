import React, { useState } from 'react';
import { ProjectData, LiteraturePaper } from '../types';
import { runFullCorpusSynthesis } from '../utils/synthesisEngine';
import { 
  FileText, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink, 
  ChevronRight, 
  Info, 
  Search,
  BookOpen,
  RefreshCw
} from 'lucide-react';
import { exportManuscriptMarkdown } from '../utils/exportUtils';

interface Step9ReviewPaperProps {
  project: ProjectData;
  onUpdateProject: (updates: Partial<ProjectData>) => void;
}

export const Step9ReviewPaper: React.FC<Step9ReviewPaperProps> = ({
  project,
  onUpdateProject
}) => {
  const [selectedCitation, setSelectedCitation] = useState<LiteraturePaper | null>(null);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [auditMode, setAuditMode] = useState(true);

  const handleCitationClick = (customId: string) => {
    const paper = project.papers.find(p => p.customId === customId);
    if (paper) {
      setSelectedCitation(paper);
    }
  };

  const handleReSynthesizePaper = () => {
    const synthesized = runFullCorpusSynthesis(project);
    onUpdateProject(synthesized);
  };

  const handleCopyMarkdown = () => {
    const md = exportManuscriptMarkdown(project);
    navigator.clipboard.writeText(md);
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const md = exportManuscriptMarkdown(project);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Systematic_Review_Manuscript_${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Helper to render text with clickable citation badges like [SP001]
  const renderInteractiveText = (text: string) => {
    const parts = text.split(/(\[SP\d{3}\])/g);
    return parts.map((part, index) => {
      const match = part.match(/\[(SP\d{3})\]/);
      if (match) {
        const code = match[1];
        const isSelected = selectedCitation?.customId === code;
        return (
          <button
            key={index}
            onClick={() => handleCitationClick(code)}
            className={`inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded font-mono font-bold text-xs transition-all ${
              isSelected 
                ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300' 
                : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700'
            }`}
            title={`Inspect citation ${code}`}
          >
            {part}
          </button>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-6 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <FileText className="w-4 h-4" />
            <span>Step 9 of 9</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Systematic Review Paper Manuscript
          </h1>
          <p className="text-sm text-slate-400">
            PRISMA 2020-compliant synthesis manuscript with interactive evidence claims and bibliographic citation auditing.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleReSynthesizePaper}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-sm"
            title="Re-synthesize manuscript sections and interactive citations from all uploaded papers"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Re-Synthesize Paper ({project.papers.filter(p => !p.isDuplicate).length} Ingested Papers)</span>
          </button>

          <button
            onClick={handleCopyMarkdown}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
          >
            {copiedMarkdown ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedMarkdown ? 'Copied' : 'Copy Markdown'}</span>
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Manuscript (.md)</span>
          </button>
        </div>
      </div>

      {/* Abstract-Only Scope & Claim Verification Banner */}
      <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-4 flex items-start space-x-3 text-xs">
        <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-amber-300">Abstract-Only Evidence Scope & Claim Verification</h4>
          <p className="text-slate-300 leading-relaxed">
            Click any interactive citation tag (e.g., <span className="font-mono text-amber-400 font-bold">[SP001]</span>) to view the ground-truth extracted evidence matrix, study metrics, and abstract telemetry.
          </p>
        </div>
      </div>

      {/* Main Manuscript Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Manuscript Document */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 space-y-8 shadow-2xl text-slate-200">
            {/* Title & Metadata */}
            <div className="space-y-4 border-b border-slate-800 pb-6 text-center">
              <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl leading-tight">
                {project.protocol.title}
              </h2>
              <div className="text-xs text-slate-400 space-y-1">
                <p className="font-semibold text-slate-300">
                  Comprehensive PRISMA 2020 Systematic Review & Evidence Synthesis
                </p>
                <p className="font-mono text-[11px] text-amber-400">
                  Corpus: {project.prismaCounts.studiesIncluded} Included Primary Studies • 5 Databases Synthesized
                </p>
              </div>
            </div>

            {/* Manuscript Sections */}
            {(project.reviewDraftSections || []).map((section) => (
              <div key={section.id} className="space-y-3">
                <h3 className="text-lg font-bold text-white flex items-center space-x-2 border-b border-slate-800/80 pb-1.5">
                  <span className="font-mono text-amber-400 text-sm">§{section.number}</span>
                  <span>{section.title}</span>
                </h3>

                <div className="text-xs text-slate-300 leading-relaxed text-justify space-y-3">
                  <p>{renderInteractiveText(section.content || '')}</p>
                </div>

                {section.subsections && (
                  <div className="space-y-3 pl-3 border-l-2 border-slate-800 mt-2">
                    {section.subsections.map((sub, idx) => (
                      <div key={idx} className="space-y-1 text-xs">
                        <h4 className="font-semibold text-amber-300 text-xs">
                          {sub.number} {sub.title}
                        </h4>
                        <p className="text-slate-300 leading-relaxed">
                          {renderInteractiveText(sub.content || '')}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* References Section */}
            <div className="pt-6 border-t border-slate-800 space-y-3">
              <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Synthesized Primary References ({(project.papers || []).filter(p => !p.isDuplicate).length})</span>
              </h3>

              <div className="space-y-2.5 text-[11px] text-slate-400 font-mono">
                {(project.papers || []).filter(p => !p.isDuplicate).map((paper) => (
                  <div 
                    key={paper.id}
                    onClick={() => setSelectedCitation(paper)}
                    className="p-2.5 rounded bg-slate-950/60 hover:bg-slate-950 border border-slate-800/60 cursor-pointer transition-colors space-y-0.5"
                  >
                    <span className="text-amber-400 font-bold mr-2">[{paper.customId}]</span>
                    <span className="text-slate-200">{(paper.authors || []).join(', ')} ({paper.year}). </span>
                    <span className="text-white font-sans font-semibold">{paper.title}. </span>
                    <span className="italic text-slate-400 font-sans">{paper.journal}. </span>
                    {paper.doi && <span className="text-sky-400">doi:{paper.doi}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Interactive Citation Inspector / Claim Verification Panel */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl sticky top-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                  Citation & Claim Verification Audit
                </h3>
              </div>
              {selectedCitation && (
                <span className="font-mono text-xs font-bold text-amber-400 px-2 py-0.5 bg-slate-950 rounded border border-slate-800">
                  {selectedCitation.customId}
                </span>
              )}
            </div>

            {selectedCitation ? (
              <div className="space-y-4 text-xs">
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-sm leading-snug">
                    {selectedCitation.title}
                  </h4>
                  <p className="text-slate-400 text-[11px]">
                    {(selectedCitation.authors || []).join(', ')} • {selectedCitation.year}
                  </p>
                  <p className="text-slate-400 text-[11px] italic">
                    {selectedCitation.journal}
                  </p>
                </div>

                {/* Ground-truth Abstract */}
                <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                    Source Abstract Telemetry
                  </span>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    {selectedCitation.abstract}
                  </p>
                </div>

                {/* Extracted Evidence Parameters */}
                {project.evidenceExtractions?.[selectedCitation.id] && (
                  <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2 text-[11px]">
                    <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">
                      18-Column Extracted Parameters
                    </span>
                    <div className="space-y-1.5 text-slate-300">
                      <p><strong>Model:</strong> <span className="text-sky-300 font-mono">{project.evidenceExtractions[selectedCitation.id].model}</span></p>
                      <p><strong>Dataset:</strong> {project.evidenceExtractions[selectedCitation.id].dataset}</p>
                      <p><strong>Outcome:</strong> <span className="text-emerald-300 font-mono">{project.evidenceExtractions[selectedCitation.id].outcome}</span></p>
                      <p><strong>Limitation:</strong> <span className="text-rose-300">{project.evidenceExtractions[selectedCitation.id].limitations}</span></p>
                    </div>
                  </div>
                )}

                {/* Quality Appraisal result */}
                {project.qualityAssessments?.[selectedCitation.id] && (
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-semibold">MMAT Quality Score:</span>
                    <span className="font-mono font-bold text-amber-400">
                      {project.qualityAssessments[selectedCitation.id].overallScorePercentage}% ({project.qualityAssessments[selectedCitation.id].riskOfBias.replace('_', ' ')})
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 space-y-2">
                <Info className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-xs">
                  Click any in-text reference citation like <span className="text-amber-400 font-mono">[SP001]</span> in the manuscript to inspect empirical grounding.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
