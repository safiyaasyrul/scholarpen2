import React, { useState } from 'react';
import { 
  ProjectData, 
  LiteraturePaper, 
  PaperScreening, 
  ExclusionReason 
} from '../types';
import { generatePrismaTextReport, downloadTextFile } from '../utils/exportUtils';
import { 
  CheckSquare, 
  Search, 
  Sparkles, 
  Check, 
  X, 
  HelpCircle, 
  ChevronRight, 
  ChevronLeft, 
  FileText, 
  ArrowRight, 
  Sliders, 
  ShieldAlert, 
  Copy, 
  Download, 
  RotateCw,
  Target
} from 'lucide-react';

interface Step6ScreeningProps {
  project: ProjectData;
  onUpdateProject: (updates: Partial<ProjectData>) => void;
  onContinue: () => void;
}

const EXCLUSION_REASONS: ExclusionReason[] = [
  'Wrong topic / out of domain',
  'Wrong context / operational setting',
  'Wrong population / study object',
  'Wrong outcome / metrics',
  'Wrong methodology / non-computational',
  'Wrong publication type',
  'Outside date range',
  'Language mismatch',
  'Duplicate or redundant record',
  'Insufficient information in abstract',
  'Other'
];

export const Step6Screening: React.FC<Step6ScreeningProps> = ({
  project,
  onUpdateProject,
  onContinue
}) => {
  const uniquePapers = (project.papers || []).filter(p => !p.isDuplicateOf);
  const [screenings, setScreenings] = useState<Record<string, PaperScreening>>(project.screenings || {});
  const [selectedPaper, setSelectedPaper] = useState<LiteraturePaper | null>(null);
  const [filterDecision, setFilterDecision] = useState<'ALL' | 'INCLUDE' | 'EXCLUDE' | 'MAYBE' | 'PENDING'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [batchLoading, setBatchLoading] = useState(false);
  const [showPrismaReport, setShowPrismaReport] = useState(false);
  const [copiedPrisma, setCopiedPrisma] = useState(false);

  // Selected exclusion reason in drawer
  const [currentExclusionReason, setCurrentExclusionReason] = useState<ExclusionReason>(EXCLUSION_REASONS[0]);

  const updateScreeningDecision = (
    paperId: string, 
    decision: 'INCLUDE' | 'EXCLUDE' | 'MAYBE', 
    reason?: ExclusionReason
  ) => {
    const existing = screenings[paperId] || {
      paperId,
      aiDecision: decision,
      confidence: 85,
      aiReason: 'Direct human decision applied.',
      criteriaEvaluations: [],
      humanDecision: 'PENDING',
      screenedAt: new Date().toISOString()
    };

    const updatedScreening: PaperScreening = {
      ...existing,
      humanDecision: decision,
      humanReason: decision === 'EXCLUDE' ? (reason || currentExclusionReason) : undefined,
      screenedAt: new Date().toISOString()
    };

    const updatedMap = { ...screenings, [paperId]: updatedScreening };
    setScreenings(updatedMap);

    // Update PRISMA counts
    const includedCount = Object.values(updatedMap).filter(s => s.humanDecision === 'INCLUDE').length;
    const excludedCount = Object.values(updatedMap).filter(s => s.humanDecision === 'EXCLUDE').length;

    onUpdateProject({
      screenings: updatedMap,
      prismaCounts: {
        ...project.prismaCounts,
        recordsExcluded: excludedCount,
        studiesIncluded: includedCount
      }
    });
  };

  const handleBatchScreen = async () => {
    setBatchLoading(true);
    try {
      const res = await fetch('/api/ai/batch-screen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          papers: uniquePapers,
          researchScope: {
            title: project.title,
            field: project.decomposition?.fieldOfStudy || 'Applied Science',
            problem: project.decomposition?.problemStatement || project.title
          }
        })
      });
      const data = await res.json();
      if (data.screenings) {
        const newMap = { ...screenings };
        data.screenings.forEach((s: PaperScreening) => {
          // Keep existing human decisions if already made
          if (newMap[s.paperId] && newMap[s.paperId].humanDecision !== 'PENDING') {
            newMap[s.paperId] = {
              ...s,
              humanDecision: newMap[s.paperId].humanDecision,
              humanReason: newMap[s.paperId].humanReason
            };
          } else {
            newMap[s.paperId] = s;
          }
        });
        setScreenings(newMap);
        onUpdateProject({ screenings: newMap });
      }
    } catch (e) {
      console.error('Batch screening error:', e);
    } finally {
      setBatchLoading(false);
    }
  };

  const includedCount = Object.values(screenings).filter(s => s.humanDecision === 'INCLUDE').length;
  const excludedCount = Object.values(screenings).filter(s => s.humanDecision === 'EXCLUDE').length;
  const pendingCount = uniquePapers.length - Object.values(screenings).filter(s => s.humanDecision !== 'PENDING').length;

  const filteredList = uniquePapers.filter(paper => {
    const s = screenings[paper.id];
    const matchesSearch = searchQuery === '' ||
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.authors.some(a => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
      paper.customId.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterDecision === 'ALL') return true;
    if (filterDecision === 'PENDING') return !s || s.humanDecision === 'PENDING';
    return s && s.humanDecision === filterDecision;
  });

  const handleCopyPrisma = () => {
    const report = generatePrismaTextReport(project);
    navigator.clipboard.writeText(report);
    setCopiedPrisma(true);
    setTimeout(() => setCopiedPrisma(false), 2000);
  };

  const handleDownloadPrisma = () => {
    const report = generatePrismaTextReport(project);
    downloadTextFile(`PRISMA_Report_${project.name.replace(/\s+/g, '_')}.txt`, report);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <CheckSquare className="w-4 h-4" />
            <span>Step 6 of 9</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            AI-Assisted Abstract Screening
          </h1>
          <p className="text-sm text-slate-400">
            Screen titles and abstracts against inclusion and exclusion criteria. ScholarPen calculates AI confidence and records structured exclusion reasons for PRISMA.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowPrismaReport(true)}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>PRISMA Synthesis Report</span>
          </button>

          <button
            onClick={handleBatchScreen}
            disabled={batchLoading}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 text-xs font-bold transition-all shadow-sm"
          >
            <Sparkles className={`w-3.5 h-3.5 ${batchLoading ? 'animate-spin' : ''}`} />
            <span>{batchLoading ? 'Screening Corpus...' : 'Auto-Screen All (AI)'}</span>
          </button>
        </div>
      </div>

      {/* Target Planning & Progress */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Unique Records</span>
          <div className="text-2xl font-black text-white">{uniquePapers.length}</div>
          <p className="text-[11px] text-slate-500">De-duplicated corpus</p>
        </div>

        <div className="bg-slate-900 border border-emerald-800/40 rounded-xl p-4 space-y-1">
          <span className="text-[10px] font-bold uppercase text-emerald-400">Included Studies</span>
          <div className="text-2xl font-black text-emerald-400">{includedCount}</div>
          <p className="text-[11px] text-slate-400">Target for synthesis: 12–25</p>
        </div>

        <div className="bg-slate-900 border border-rose-800/40 rounded-xl p-4 space-y-1">
          <span className="text-[10px] font-bold uppercase text-rose-400">Excluded Studies</span>
          <div className="text-2xl font-black text-rose-400">{excludedCount}</div>
          <p className="text-[11px] text-slate-500">Documented exclusion reasons</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-[10px] font-bold uppercase text-amber-400">Pending Decision</span>
          <div className="text-2xl font-black text-amber-400">{pendingCount}</div>
          <p className="text-[11px] text-slate-500">Awaiting human confirmation</p>
        </div>
      </div>

      {/* Recommended Evidence Set Target Box */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <Target className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-slate-300">
            <strong>Evidence Target Planner:</strong> Aim for <strong>12 to 25 included studies</strong> for high thematic synthesis depth. Currently <strong>{includedCount} studies</strong> are marked as included.
          </span>
        </div>
        <div className="flex items-center space-x-1.5 font-mono text-[11px]">
          <span className="text-slate-400">Screening Progress:</span>
          <span className="font-bold text-amber-400">{Math.round(((uniquePapers.length - pendingCount) / (uniquePapers.length || 1)) * 100)}%</span>
        </div>
      </div>

      {/* Screening Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative max-w-sm w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, author, ID..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>

          {/* Decision Filter Tabs */}
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            {(['ALL', 'INCLUDE', 'EXCLUDE', 'MAYBE', 'PENDING'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterDecision(tab)}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                  filterDecision === tab 
                    ? 'bg-slate-800 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 w-20">ID</th>
                <th className="py-3 px-4">Title & Authors</th>
                <th className="py-3 px-4 w-24">Year</th>
                <th className="py-3 px-4 w-32">AI Suggestion</th>
                <th className="py-3 px-4 w-32">Human Decision</th>
                <th className="py-3 px-4 w-24 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredList.map((paper) => {
                const s = screenings[paper.id];
                const aiDec = s?.aiDecision || 'PENDING';
                const humanDec = s?.humanDecision || 'PENDING';

                return (
                  <tr 
                    key={paper.id} 
                    onClick={() => setSelectedPaper(paper)}
                    className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-400 align-top">
                      {paper.customId}
                    </td>

                    <td className="py-3.5 px-4 align-top space-y-1">
                      <p className="font-semibold text-slate-100 line-clamp-1">{paper.title}</p>
                      <p className="text-slate-400 text-[11px] line-clamp-1">
                        {paper.authors.join(', ')} • {paper.journal || 'Academic Article'}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 align-top text-slate-400 font-mono">
                      {paper.year}
                    </td>

                    <td className="py-3.5 px-4 align-top">
                      {s ? (
                        <div className="space-y-0.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            aiDec === 'INCLUDE' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                            aiDec === 'EXCLUDE' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                            'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}>
                            {aiDec} ({s.confidence}%)
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-500 italic">Not screened</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 align-top">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        humanDec === 'INCLUDE' ? 'bg-emerald-500 text-slate-950' :
                        humanDec === 'EXCLUDE' ? 'bg-rose-500 text-slate-950' :
                        humanDec === 'MAYBE' ? 'bg-amber-400 text-slate-950' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {humanDec}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right align-top">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPaper(paper);
                        }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition-colors"
                      >
                        Screen
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Abstract Screening Drawer / Modal */}
      {selectedPaper && (() => {
        const s = screenings[selectedPaper.id];
        const currentIndex = uniquePapers.findIndex(p => p.id === selectedPaper.id);

        const navigateNext = () => {
          if (currentIndex < uniquePapers.length - 1) {
            setSelectedPaper(uniquePapers[currentIndex + 1]);
          }
        };

        const navigatePrev = () => {
          if (currentIndex > 0) {
            setSelectedPaper(uniquePapers[currentIndex - 1]);
          }
        };

        return (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
              {/* Drawer Header */}
              <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-xs font-bold text-amber-400 px-2 py-0.5 bg-slate-900 rounded border border-slate-800">
                    {selectedPaper.customId}
                  </span>
                  <span className="text-xs text-slate-400">
                    Study {currentIndex + 1} of {uniquePapers.length}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={navigatePrev}
                    disabled={currentIndex === 0}
                    className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300"
                    title="Previous Paper"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={navigateNext}
                    disabled={currentIndex === uniquePapers.length - 1}
                    className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300"
                    title="Next Paper"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedPaper(null)}
                    className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white ml-2"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
                {/* Bibliographic Block */}
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-white leading-snug">
                    {selectedPaper.title}
                  </h3>
                  <p className="text-slate-300 font-medium">
                    {selectedPaper.authors.join(', ')} ({selectedPaper.year})
                  </p>
                  <div className="flex flex-wrap gap-2 text-[11px] text-slate-400">
                    <span>Journal: <strong className="text-slate-300">{selectedPaper.journal || 'Academic Publication'}</strong></span>
                    {selectedPaper.doi && <span>• DOI: <strong className="text-slate-300">{selectedPaper.doi}</strong></span>}
                    <span>• Sources: <strong className="text-slate-300">{selectedPaper.sources.join(', ')}</strong></span>
                  </div>
                </div>

                {/* Abstract Text */}
                <div className="space-y-1.5">
                  <span className="font-bold text-slate-300 uppercase text-[11px] tracking-wide">
                    Abstract
                  </span>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-300 text-xs leading-relaxed max-h-56 overflow-y-auto">
                    {selectedPaper.abstract || 'No abstract text available for this bibliographic record.'}
                  </div>
                </div>

                {/* AI Screening Assessment */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-amber-900/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span className="font-bold text-slate-200 uppercase text-[11px]">
                        AI Eligibility Assessment
                      </span>
                    </div>
                    {s && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        s.aiDecision === 'INCLUDE' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        s.aiDecision === 'EXCLUDE' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                        'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        AI Suggestion: {s.aiDecision} ({s.confidence}% Confidence)
                      </span>
                    )}
                  </div>

                  <p className="text-slate-300 text-xs leading-relaxed">
                    {s?.aiReason || 'AI analysis evaluating domain alignment, methodology, and empirical evidence.'}
                  </p>

                  {/* Criteria breakdown */}
                  {s?.criteriaEvaluations && s.criteriaEvaluations.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {s.criteriaEvaluations.map((cr, i) => (
                        <div key={i} className="p-2.5 rounded bg-slate-900/70 border border-slate-800 text-[11px] space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-300">{cr.criterion}</span>
                            <span className={cr.satisfied ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                              {cr.satisfied ? 'Satisfied' : 'Not Met'}
                            </span>
                          </div>
                          <p className="text-slate-400 text-[10px]">{cr.reasoning}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Drawer Footer Decision Controls */}
              <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <span className="text-xs font-semibold text-slate-400">If Exclude, Reason:</span>
                  <select
                    value={currentExclusionReason}
                    onChange={(e) => setCurrentExclusionReason(e.target.value as ExclusionReason)}
                    className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  >
                    {EXCLUSION_REASONS.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => {
                      updateScreeningDecision(selectedPaper.id, 'EXCLUDE', currentExclusionReason);
                      navigateNext();
                    }}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 font-bold text-xs flex items-center justify-center space-x-1 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Exclude</span>
                  </button>

                  <button
                    onClick={() => {
                      updateScreeningDecision(selectedPaper.id, 'MAYBE');
                      navigateNext();
                    }}
                    className="flex-1 sm:flex-none px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-semibold text-xs transition-colors"
                  >
                    Maybe
                  </button>

                  <button
                    onClick={() => {
                      updateScreeningDecision(selectedPaper.id, 'INCLUDE');
                      navigateNext();
                    }}
                    className="flex-1 sm:flex-none px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-1 transition-colors shadow-md"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Include in Review</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* PRISMA Report Modal */}
      {showPrismaReport && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-2xl w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <h3 className="text-base font-bold text-white">PRISMA 2020 Synthesis Statement</h3>
              </div>
              <button
                onClick={() => setShowPrismaReport(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl font-mono text-xs text-slate-300 leading-relaxed max-h-80 overflow-y-auto whitespace-pre-wrap select-all border border-slate-800">
              {generatePrismaTextReport(project)}
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={handleCopyPrisma}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                {copiedPrisma ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPrisma ? 'Copied to Clipboard' : 'Copy Statement'}</span>
              </button>
              <button
                onClick={handleDownloadPrisma}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Report (.txt)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Continue */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <div className="text-xs text-slate-400 flex items-center space-x-1.5">
          <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
          <span>{includedCount} studies selected for Thematic Clustering & Synthesis.</span>
        </div>

        <button
          onClick={onContinue}
          disabled={includedCount === 0}
          className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-slate-950 font-bold text-sm transition-all shadow-md"
        >
          <span>Continue to Thematic Clustering</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
