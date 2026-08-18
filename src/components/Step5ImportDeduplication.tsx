import React, { useState, useRef } from 'react';
import { 
  ProjectData, 
  LiteraturePaper, 
  DuplicatePair, 
  CitationSource 
} from '../types';
import { 
  parseBibliographicFile, 
  normalizeDoi, 
  normalizeTitle 
} from '../utils/parsers';
import { runDeduplicationEngine, mergeDuplicatePapers } from '../utils/deduplication';
import { 
  FileCheck, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Trash2, 
  Eye, 
  GitMerge, 
  Search, 
  Sparkles, 
  Filter,
  Check,
  X,
  Clock
} from 'lucide-react';

interface Step5ImportDeduplicationProps {
  project: ProjectData;
  onUpdateProject: (updates: Partial<ProjectData>) => void;
  onContinue: () => void;
}

export const Step5ImportDeduplication: React.FC<Step5ImportDeduplicationProps> = ({
  project,
  onUpdateProject,
  onContinue
}) => {
  const [papers, setPapers] = useState<LiteraturePaper[]>(project.papers || []);
  const [duplicatePairs, setDuplicatePairs] = useState<DuplicatePair[]>(project.duplicatePairs || []);
  const [selectedSource, setSelectedSource] = useState<CitationSource>('Scopus');
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDuplicates, setFilterDuplicates] = useState<'all' | 'unique' | 'duplicates'>('all');
  
  // Comparison modal
  const [selectedDuplicatePair, setSelectedDuplicatePair] = useState<DuplicatePair | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsProcessing(true);

    try {
      const newPapers: LiteraturePaper[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const content = await file.text();
        const parsed = parseBibliographicFile(content, file.name, selectedSource);
        newPapers.push(...parsed);
      }

      const combined = [...papers, ...newPapers];
      // Re-run 5-level deduplication
      const { papers: deduplicatedPapers, pairs } = runDeduplicationEngine(combined);

      setPapers(deduplicatedPapers);
      setDuplicatePairs(pairs);

      // Update PRISMA counts
      const scopusCount = deduplicatedPapers.filter(p => p.sources.includes('Scopus')).length;
      const wosCount = deduplicatedPapers.filter(p => p.sources.includes('Web of Science')).length;
      const scholarCount = deduplicatedPapers.filter(p => p.sources.includes('Google Scholar')).length;
      const otherCount = deduplicatedPapers.filter(p => p.sources.includes('Other')).length;
      const dupCount = deduplicatedPapers.filter(p => p.isDuplicateOf).length;
      const uniqueCount = deduplicatedPapers.length - dupCount;

      onUpdateProject({
        papers: deduplicatedPapers,
        duplicatePairs: pairs,
        prismaCounts: {
          ...project.prismaCounts,
          recordsScopus: scopusCount,
          recordsWos: wosCount,
          recordsScholar: scholarCount,
          recordsOther: otherCount,
          totalIdentified: deduplicatedPapers.length,
          duplicatesRemoved: dupCount,
          recordsScreened: uniqueCount
        }
      });
    } catch (err) {
      console.error('File parsing/dedup failed:', err);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleConfirmDuplicate = (pair: DuplicatePair) => {
    const updatedPairs = duplicatePairs.map(p => {
      if (p.id === pair.id) {
        return { ...p, status: 'confirmed' as const };
      }
      return p;
    });

    const updatedPapers = papers.map(paper => {
      if (paper.id === pair.duplicatePaperId) {
        return { ...paper, isDuplicateOf: pair.masterPaperId };
      }
      return paper;
    });

    setDuplicatePairs(updatedPairs);
    setPapers(updatedPapers);
    setSelectedDuplicatePair(null);

    onUpdateProject({
      duplicatePairs: updatedPairs,
      papers: updatedPapers,
      prismaCounts: {
        ...project.prismaCounts,
        duplicatesRemoved: updatedPapers.filter(p => p.isDuplicateOf).length,
        recordsScreened: updatedPapers.filter(p => !p.isDuplicateOf).length
      }
    });
  };

  const handleKeepBoth = (pair: DuplicatePair) => {
    const updatedPairs = duplicatePairs.map(p => {
      if (p.id === pair.id) {
        return { ...p, status: 'resolved_kept_both' as const };
      }
      return p;
    });

    const updatedPapers = papers.map(paper => {
      if (paper.id === pair.duplicatePaperId && paper.isDuplicateOf === pair.masterPaperId) {
        return { ...paper, isDuplicateOf: undefined };
      }
      return paper;
    });

    setDuplicatePairs(updatedPairs);
    setPapers(updatedPapers);
    setSelectedDuplicatePair(null);

    onUpdateProject({
      duplicatePairs: updatedPairs,
      papers: updatedPapers,
      prismaCounts: {
        ...project.prismaCounts,
        duplicatesRemoved: updatedPapers.filter(p => p.isDuplicateOf).length,
        recordsScreened: updatedPapers.filter(p => !p.isDuplicateOf).length
      }
    });
  };

  const handleReviewLater = (pair: DuplicatePair) => {
    const updatedPairs = duplicatePairs.map(p => {
      if (p.id === pair.id) {
        return { ...p, status: 'pending' as const };
      }
      return p;
    });
    setDuplicatePairs(updatedPairs);
    setSelectedDuplicatePair(null);
    onUpdateProject({ duplicatePairs: updatedPairs });
  };

  const totalRecords = papers.length;
  const duplicateCount = papers.filter(p => p.isDuplicateOf).length;
  const uniqueCount = totalRecords - duplicateCount;

  const filteredPapers = papers.filter(p => {
    const matchesSearch = searchQuery === '' || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.authors.some(a => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.customId.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterDuplicates === 'unique') return !p.isDuplicateOf;
    if (filterDuplicates === 'duplicates') return !!p.isDuplicateOf;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <FileCheck className="w-4 h-4" />
            <span>Step 5 of 9</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Literature Import & Deduplication Engine
          </h1>
          <p className="text-sm text-slate-400">
            Import RIS, BibTeX, or CSV citations from Scopus, Web of Science, or Google Scholar. ScholarPen executes a 5-level hierarchical deduplication engine.
          </p>
        </div>
      </div>

      {/* Dynamic Results Summary Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-200 uppercase tracking-wide">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Bibliographic Dataset Processing Status</span>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/50">
            PRISMA-Aligned
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Records Imported</span>
            <div className="text-2xl font-black text-white mt-1">{totalRecords.toLocaleString()}</div>
            <p className="text-[11px] text-slate-500 mt-1">Across all database citation exports</p>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800">
            <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">Duplicates Detected</span>
            <div className="text-2xl font-black text-amber-400 mt-1">{duplicateCount.toLocaleString()}</div>
            <p className="text-[11px] text-slate-500 mt-1">5-Level automated similarity detection</p>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800">
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Unique Records for Screening</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">{uniqueCount.toLocaleString()}</div>
            <p className="text-[11px] text-slate-500 mt-1">Ready for AI Abstract Screening</p>
          </div>
        </div>
      </div>

      {/* Upload and Import Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-200">Import Citation Files</h3>
            <p className="text-xs text-slate-400">Select source database tag and drop citation export files (.ris, .csv, .bib, .nbib, .txt)</p>
          </div>

          {/* Source Tag Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-400">Database Source:</span>
            {(['Scopus', 'Web of Science', 'Google Scholar', 'Other'] as CitationSource[]).map((src) => (
              <button
                key={src}
                type="button"
                onClick={() => setSelectedSource(src)}
                className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                  selectedSource === src
                    ? 'bg-amber-400 text-slate-950 font-bold border-amber-400'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {src}
              </button>
            ))}
          </div>
        </div>

        {/* Drag & Drop Area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-700 hover:border-amber-400 rounded-xl p-8 text-center cursor-pointer bg-slate-950/40 hover:bg-slate-950/80 transition-all group"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".ris,.csv,.bib,.bibtex,.nbib,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 group-hover:bg-amber-400/20 group-hover:text-amber-400 text-slate-400 mx-auto flex items-center justify-center transition-colors">
              <Upload className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-200">
                Click to upload or drag and drop citation files
              </p>
              <p className="text-xs text-slate-500">
                Supported formats: <strong>.ris</strong> (RIS tags TY, AU, TI, AB, PY, DO, JO, KW, VL, IS, SP, EP, SN, UR), <strong>.csv</strong>, <strong>.bib</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Duplicates Review Center */}
      {duplicatePairs.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <GitMerge className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-slate-200">Deduplication Detection Audit ({duplicatePairs.length} pairs)</h3>
            </div>
            <span className="text-xs text-slate-400">Click any pair to compare side-by-side</span>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {duplicatePairs.map((pair) => {
              const master = papers.find(p => p.id === pair.masterPaperId);
              const duplicate = papers.find(p => p.id === pair.duplicatePaperId);
              if (!master || !duplicate) return null;

              return (
                <div
                  key={pair.id}
                  onClick={() => setSelectedDuplicatePair(pair)}
                  className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 hover:border-amber-400/50 cursor-pointer flex items-center justify-between text-xs transition-colors"
                >
                  <div className="space-y-1 pr-4 truncate">
                    <div className="flex items-center space-x-2">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300">
                        {pair.matchLevel} ({pair.similarityScore}%)
                      </span>
                      <span className="text-slate-400 text-[11px]">{pair.matchBasis}</span>
                    </div>
                    <p className="font-semibold text-slate-200 truncate">{master.title}</p>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      pair.status === 'confirmed' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                      pair.status === 'resolved_kept_both' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                      'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}>
                      {pair.status.replace('_', ' ')}
                    </span>
                    <Eye className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Side-by-Side Comparison Modal */}
      {selectedDuplicatePair && (() => {
        const master = papers.find(p => p.id === selectedDuplicatePair.masterPaperId);
        const dup = papers.find(p => p.id === selectedDuplicatePair.duplicatePaperId);
        if (!master || !dup) return null;

        return (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-4xl w-full space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white">Side-by-Side Duplicate Record Comparison</h3>
                  <p className="text-xs text-slate-400">
                    Match Basis: <span className="text-amber-400 font-semibold">{selectedDuplicatePair.matchBasis}</span> ({selectedDuplicatePair.similarityScore}% match)
                  </p>
                </div>
                <button
                  onClick={() => setSelectedDuplicatePair(null)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Master Record */}
                <div className="bg-slate-950 p-4 rounded-xl border border-emerald-800/40 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-emerald-400/20 text-emerald-300 font-bold font-mono text-[10px]">
                      MASTER RECORD ({master.customId})
                    </span>
                    <span className="text-[11px] text-slate-400">{master.sources.join(', ')}</span>
                  </div>
                  <h4 className="font-bold text-white text-sm">{master.title}</h4>
                  <p className="text-slate-300"><strong>Authors:</strong> {master.authors.join(', ')} ({master.year})</p>
                  <p className="text-slate-300"><strong>Journal:</strong> {master.journal || 'N/A'}</p>
                  <p className="text-slate-300"><strong>DOI:</strong> {master.doi || 'N/A'}</p>
                  <div className="text-slate-400 text-[11px] max-h-32 overflow-y-auto bg-slate-900 p-2.5 rounded border border-slate-800">
                    {master.abstract || 'No abstract available.'}
                  </div>
                </div>

                {/* Candidate Duplicate Record */}
                <div className="bg-slate-950 p-4 rounded-xl border border-amber-800/40 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold font-mono text-[10px]">
                      DUPLICATE CANDIDATE ({dup.customId})
                    </span>
                    <span className="text-[11px] text-slate-400">{dup.sources.join(', ')}</span>
                  </div>
                  <h4 className="font-bold text-white text-sm">{dup.title}</h4>
                  <p className="text-slate-300"><strong>Authors:</strong> {dup.authors.join(', ')} ({dup.year})</p>
                  <p className="text-slate-300"><strong>Journal:</strong> {dup.journal || 'N/A'}</p>
                  <p className="text-slate-300"><strong>DOI:</strong> {dup.doi || 'N/A'}</p>
                  <div className="text-slate-400 text-[11px] max-h-32 overflow-y-auto bg-slate-900 p-2.5 rounded border border-slate-800">
                    {dup.abstract || 'No abstract available.'}
                  </div>
                </div>
              </div>

              {/* Resolution Controls */}
              <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  onClick={() => handleReviewLater(selectedDuplicatePair)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 font-medium"
                >
                  Review Later
                </button>
                <button
                  onClick={() => handleKeepBoth(selectedDuplicatePair)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900 text-xs font-semibold"
                >
                  Keep Both (Distinct Studies)
                </button>
                <button
                  onClick={() => handleConfirmDuplicate(selectedDuplicatePair)}
                  className="px-4 py-1.5 rounded-lg bg-amber-400 text-slate-950 hover:bg-amber-300 text-xs font-bold shadow-sm"
                >
                  Confirm Duplicate (Merge into Master)
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Papers Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-bold text-slate-200">Imported Literature Corpus ({filteredPapers.length})</h3>
          </div>

          <div className="flex items-center space-x-2">
            {/* Search filter */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search title, author, ID..."
                className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>

            {/* Status toggle */}
            <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setFilterDuplicates('all')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium ${filterDuplicates === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilterDuplicates('unique')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium ${filterDuplicates === 'unique' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'text-slate-400'}`}
              >
                Unique ({uniqueCount})
              </button>
              <button
                onClick={() => setFilterDuplicates('duplicates')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium ${filterDuplicates === 'duplicates' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'text-slate-400'}`}
              >
                Duplicates ({duplicateCount})
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 w-24">ID</th>
                <th className="py-3 px-4">Title & Citation</th>
                <th className="py-3 px-4 w-28">Sources</th>
                <th className="py-3 px-4 w-32">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredPapers.map((paper) => {
                const isDup = !!paper.isDuplicateOf;

                return (
                  <tr key={paper.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-amber-400 font-bold text-xs align-top">
                      {paper.customId}
                    </td>

                    <td className="py-3 px-4 align-top space-y-1">
                      <p className="font-semibold text-slate-100">{paper.title}</p>
                      <p className="text-slate-400 text-[11px]">
                        {paper.authors.join(', ')} • {paper.journal ? `${paper.journal}, ` : ''}{paper.year}
                      </p>
                      {paper.doi && (
                        <p className="text-[10px] text-slate-500 font-mono">DOI: {paper.doi}</p>
                      )}
                    </td>

                    <td className="py-3 px-4 align-top">
                      <div className="flex flex-wrap gap-1">
                        {paper.sources.map((src) => (
                          <span
                            key={src}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                              src === 'Scopus' ? 'bg-orange-950 text-orange-300 border border-orange-800' :
                              src === 'Web of Science' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                              src === 'Google Scholar' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                              'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {src}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-4 align-top">
                      {isDup ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-950 text-rose-300 border border-rose-800">
                          Duplicate of {paper.isDuplicateOf}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                          Master / Unique
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Continue */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <div className="text-xs text-slate-400 flex items-center space-x-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>{uniqueCount} unique records ready for AI-assisted abstract screening.</span>
        </div>

        <button
          onClick={onContinue}
          disabled={uniqueCount === 0}
          className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-slate-950 font-bold text-sm transition-all shadow-md"
        >
          <span>Continue to Abstract Screening</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
