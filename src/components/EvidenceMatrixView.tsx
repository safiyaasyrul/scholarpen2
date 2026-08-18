import React, { useState } from 'react';
import { ProjectData, EvidenceExtraction, LiteraturePaper } from '../types';
import { extractEvidenceFromPaper, runFullCorpusSynthesis } from '../utils/synthesisEngine';
import { 
  Table, 
  Download, 
  Search, 
  Filter, 
  Sparkles, 
  ShieldCheck, 
  Eye, 
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';
import { exportEvidenceMatrixCSV } from '../utils/exportUtils';

interface EvidenceMatrixViewProps {
  project: ProjectData;
  onUpdateProject: (updates: Partial<ProjectData>) => void;
}

export const EvidenceMatrixView: React.FC<EvidenceMatrixViewProps> = ({
  project,
  onUpdateProject
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPaperModal, setSelectedPaperModal] = useState<{ paper: LiteraturePaper; extraction: EvidenceExtraction } | null>(null);

  const includedPapers = project.papers.filter(p => !p.isDuplicate);

  const handleExportCSV = () => {
    const csvContent = exportEvidenceMatrixCSV(project);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Systematic_Review_18Column_Evidence_Matrix_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleAutoExtractMatrix = () => {
    const updatedExtractions: Record<string, EvidenceExtraction> = { ...(project.evidenceExtractions || {}) };
    includedPapers.forEach(p => {
      updatedExtractions[p.id] = extractEvidenceFromPaper(p);
    });

    const synthesized = runFullCorpusSynthesis({
      ...project,
      evidenceExtractions: updatedExtractions
    });
    onUpdateProject(synthesized);
  };

  const getExtractionForPaper = (paper: LiteraturePaper): EvidenceExtraction => {
    if (project.evidenceExtractions && project.evidenceExtractions[paper.id]) {
      return project.evidenceExtractions[paper.id];
    }
    return extractEvidenceFromPaper(paper);
  };

  const filteredPapers = (includedPapers || []).filter(paper => {
    const extraction = getExtractionForPaper(paper);
    const authorsStr = Array.isArray(paper.authors) ? paper.authors.join(' ') : '';
    const text = (
      (paper.customId || '') + ' ' +
      (paper.title || '') + ' ' +
      authorsStr + ' ' +
      (extraction?.model || '') + ' ' +
      (extraction?.dataset || '') + ' ' +
      (extraction?.country || '') + ' ' +
      (extraction?.outcome || '')
    ).toLowerCase();
    return text.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <Table className="w-4 h-4" />
            <span>Structured Synthesis</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            18-Column Systematic Evidence Matrix
          </h1>
          <p className="text-sm text-slate-400">
            Standardized tabular evidence matrix spanning bibliographic, architectural, dataset, outcome, and limitation dimensions.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleAutoExtractMatrix}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors shadow-sm"
            title="Auto-extract all 18 parameters across all uploaded studies"
          >
            <Sparkles className="w-4 h-4" />
            <span>Re-Synthesize Matrix ({includedPapers.length} Ingested Studies)</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Matrix to CSV</span>
          </button>
        </div>
      </div>

      {/* Abstract-Only Limitation Evidence Scope Notice */}
      <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-4 flex items-start space-x-3 text-xs">
        <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-amber-300">Evidence Extraction Scope & Verification Notice</h4>
          <p className="text-slate-300 leading-relaxed">
            All 18 parameters are verified against abstract text and indexed bibliographic records. Fine-grained hyperparameter schedules and ablations require retrieval of unredacted full-text articles.
          </p>
        </div>
      </div>

      {/* Search & Statistics Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search across all 18 columns..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
        </div>

        <div className="flex items-center space-x-3 text-xs text-slate-400 font-mono">
          <span>Records: <strong className="text-white">{filteredPapers.length}</strong> / {includedPapers.length}</span>
          <span>Columns: <strong className="text-amber-400">18</strong></span>
        </div>
      </div>

      {/* Interactive 18-Column Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto max-h-[600px]">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] sticky top-0 z-10 border-b border-slate-800">
              <tr>
                <th className="py-3 px-3 w-16 bg-slate-950 border-r border-slate-800">ID</th>
                <th className="py-3 px-3 min-w-[200px] bg-slate-950 border-r border-slate-800">Authors & Year</th>
                <th className="py-3 px-4 min-w-[240px] bg-slate-950 border-r border-slate-800">Title</th>
                <th className="py-3 px-3 min-w-[140px] bg-slate-950 border-r border-slate-800">Journal</th>
                <th className="py-3 px-3 min-w-[100px] bg-slate-950 border-r border-slate-800">Country</th>
                <th className="py-3 px-3 min-w-[160px] bg-slate-950 border-r border-slate-800">Objective</th>
                <th className="py-3 px-3 min-w-[160px] bg-slate-950 border-r border-slate-800">Problem</th>
                <th className="py-3 px-3 min-w-[140px] bg-slate-950 border-r border-slate-800">Context</th>
                <th className="py-3 px-3 min-w-[140px] bg-slate-950 border-r border-slate-800">Methodology</th>
                <th className="py-3 px-3 min-w-[150px] bg-slate-950 border-r border-slate-800">Dataset</th>
                <th className="py-3 px-3 min-w-[120px] bg-slate-950 border-r border-slate-800">Sample</th>
                <th className="py-3 px-3 min-w-[140px] bg-slate-950 border-r border-slate-800">Variables</th>
                <th className="py-3 px-3 min-w-[160px] bg-slate-950 border-r border-slate-800 text-sky-400">AI / ML Model</th>
                <th className="py-3 px-3 min-w-[160px] bg-slate-950 border-r border-slate-800 text-emerald-400">Outcome</th>
                <th className="py-3 px-3 min-w-[220px] bg-slate-950 border-r border-slate-800">Findings</th>
                <th className="py-3 px-3 min-w-[180px] bg-slate-950 border-r border-slate-800 text-rose-400">Limitations</th>
                <th className="py-3 px-3 min-w-[180px] bg-slate-950 border-r border-slate-800 text-purple-400">Research Gap</th>
                <th className="py-3 px-3 w-16 bg-slate-950 text-center">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredPapers.map((paper) => {
                const ext = getExtractionForPaper(paper);

                return (
                  <tr key={paper.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-400 border-r border-slate-800/60 bg-slate-950/40">
                      {paper.customId}
                    </td>

                    <td className="py-2.5 px-3 border-r border-slate-800/60 font-medium text-slate-200">
                      {(paper.authors || []).slice(0, 2).join(', ')}{(paper.authors && paper.authors.length > 2) ? ' et al.' : ''} ({paper.year})
                    </td>

                    <td className="py-2.5 px-4 border-r border-slate-800/60 text-white font-medium">
                      {paper.title}
                    </td>

                    <td className="py-2.5 px-3 border-r border-slate-800/60 italic text-slate-400">
                      {paper.journal}
                    </td>

                    <td className="py-2.5 px-3 border-r border-slate-800/60">
                      {ext.country}
                    </td>

                    <td className="py-2.5 px-3 border-r border-slate-800/60 truncate max-w-xs" title={ext.objective}>
                      {ext.objective}
                    </td>

                    <td className="py-2.5 px-3 border-r border-slate-800/60 truncate max-w-xs" title={ext.problem}>
                      {ext.problem}
                    </td>

                    <td className="py-2.5 px-3 border-r border-slate-800/60 truncate max-w-xs" title={ext.context}>
                      {ext.context}
                    </td>

                    <td className="py-2.5 px-3 border-r border-slate-800/60">
                      {ext.methodology}
                    </td>

                    <td className="py-2.5 px-3 border-r border-slate-800/60">
                      {ext.dataset}
                    </td>

                    <td className="py-2.5 px-3 border-r border-slate-800/60">
                      {ext.sample}
                    </td>

                    <td className="py-2.5 px-3 border-r border-slate-800/60">
                      {ext.variables}
                    </td>

                    <td className="py-2.5 px-3 border-r border-slate-800/60 font-mono text-sky-300 font-semibold">
                      {ext.model}
                    </td>

                    <td className="py-2.5 px-3 border-r border-slate-800/60 font-mono text-emerald-300 font-semibold">
                      {ext.outcome}
                    </td>

                    <td className="py-2.5 px-3 border-r border-slate-800/60 truncate max-w-xs" title={ext.findings}>
                      {ext.findings}
                    </td>

                    <td className="py-2.5 px-3 border-r border-slate-800/60 text-rose-300 truncate max-w-xs" title={ext.limitations}>
                      {ext.limitations}
                    </td>

                    <td className="py-2.5 px-3 border-r border-slate-800/60 text-purple-300 truncate max-w-xs" title={ext.researchGap}>
                      {ext.researchGap}
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => setSelectedPaperModal({ paper, extraction: ext })}
                        className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-amber-400"
                        title="View complete extraction detail"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Modal on Eye click */}
      {selectedPaperModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-2xl w-full space-y-4 shadow-2xl text-xs max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-amber-400 px-2 py-0.5 bg-slate-950 rounded border border-slate-800">
                  {selectedPaperModal.paper.customId}
                </span>
                <h3 className="font-bold text-white text-sm">Full 18-Column Evidence Profile</h3>
              </div>
              <button
                onClick={() => setSelectedPaperModal(null)}
                className="text-slate-400 hover:text-white px-2 py-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-slate-300">
              <div>
                <span className="font-semibold text-slate-400 block">Title:</span>
                <p className="text-white font-medium">{selectedPaperModal.paper.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="font-semibold text-slate-400 block">Authors:</span>
                  <p>{selectedPaperModal.paper.authors.join(', ')}</p>
                </div>
                <div>
                  <span className="font-semibold text-slate-400 block">Journal & Year:</span>
                  <p>{selectedPaperModal.paper.journal} ({selectedPaperModal.paper.year})</p>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                <p><strong>Country:</strong> {selectedPaperModal.extraction.country}</p>
                <p><strong>Objective:</strong> {selectedPaperModal.extraction.objective}</p>
                <p><strong>Research Problem:</strong> {selectedPaperModal.extraction.problem}</p>
                <p><strong>Methodology:</strong> {selectedPaperModal.extraction.methodology}</p>
                <p><strong>AI/ML Model:</strong> <span className="text-sky-300 font-mono">{selectedPaperModal.extraction.model}</span></p>
                <p><strong>Dataset:</strong> {selectedPaperModal.extraction.dataset}</p>
                <p><strong>Target Outcome:</strong> <span className="text-emerald-300 font-mono">{selectedPaperModal.extraction.outcome}</span></p>
                <p><strong>Findings:</strong> {selectedPaperModal.extraction.findings}</p>
                <p><strong>Limitations:</strong> <span className="text-rose-300">{selectedPaperModal.extraction.limitations}</span></p>
                <p><strong>Research Gap:</strong> <span className="text-purple-300">{selectedPaperModal.extraction.researchGap}</span></p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedPaperModal(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
