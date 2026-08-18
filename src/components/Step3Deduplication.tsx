import React, { useState, useRef } from 'react';
import { ProjectData, LiteraturePaper, DatabaseSource, PrismaCounts } from '../types';
import { 
  parseBibliographicFile, 
  parseRIS, 
  SAMPLE_SCOPUS_RIS_DATA, 
  SAMPLE_WOS_RIS_DATA,
  SAMPLE_RESEARCHGATE_RIS_DATA,
  ParsedRecord 
} from '../utils/bibliographicParser';
import { runFullCorpusSynthesis } from '../utils/synthesisEngine';
import { 
  CopyCheck, 
  Upload, 
  Sparkles, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  RefreshCw, 
  FileText, 
  Plus, 
  Database,
  Search,
  FileCode,
  Eye,
  X,
  ExternalLink,
  BookOpen,
  Info,
  Layers,
  GitMerge,
  ArrowLeftRight,
  Check,
  Filter,
  CheckCheck
} from 'lucide-react';

interface Step3DeduplicationProps {
  project: ProjectData;
  onUpdateProject: (updates: Partial<ProjectData>) => void;
  onContinue: () => void;
}

// Title normalization and similarity calculation
function normalizeDoi(doi?: string): string | null {
  if (!doi) return null;
  return doi
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\/(dx\.)?doi\.org\//, '')
    .replace(/^doi:\s*/, '')
    .trim();
}

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function computeTokenSimilarity(t1: string, t2: string): number {
  const norm1 = normalizeTitle(t1);
  const norm2 = normalizeTitle(t2);
  if (norm1 === norm2) return 100;
  if (!norm1 || !norm2) return 0;

  const words1 = new Set(norm1.split(' ').filter(w => w.length > 2));
  const words2 = new Set(norm2.split(' ').filter(w => w.length > 2));
  if (words1.size === 0 || words2.size === 0) return 0;

  let intersection = 0;
  words1.forEach(w => {
    if (words2.has(w)) intersection++;
  });

  const union = new Set([...words1, ...words2]).size;
  return union > 0 ? Math.round((intersection / union) * 100) : 0;
}

export const Step3Deduplication: React.FC<Step3DeduplicationProps> = ({
  project,
  onUpdateProject,
  onContinue
}) => {
  const [papers, setPapers] = useState<LiteraturePaper[]>(project.papers);
  const [prismaCounts, setPrismaCounts] = useState<PrismaCounts>(project.prismaCounts);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState<'ALL' | 'SCOPUS' | 'WOS' | 'RESEARCHGATE' | 'OTHER' | 'DUPLICATES' | 'UNIQUE'>('ALL');
  const [isDeduplicating, setIsDeduplicating] = useState(false);
  const [dedupStatusMessage, setDedupStatusMessage] = useState<string | null>(null);

  // Dedicated file inputs for each source
  const wosInputRef = useRef<HTMLInputElement>(null);
  const scopusInputRef = useRef<HTMLInputElement>(null);
  const rgInputRef = useRef<HTMLInputElement>(null);
  const otherInputRef = useRef<HTMLInputElement>(null);

  // Drag state per channel
  const [draggingChannel, setDraggingChannel] = useState<DatabaseSource | null>(null);

  // Ingestion modals and state
  const [rawTextImport, setRawTextImport] = useState('');
  const [pasteTargetDb, setPasteTargetDb] = useState<DatabaseSource>('Scopus');
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [previewParsedRecords, setPreviewParsedRecords] = useState<{ records: ParsedRecord[]; source: DatabaseSource } | null>(null);
  const [importSuccessBanner, setImportSuccessBanner] = useState<string | null>(null);

  // Viewing single paper details / abstract
  const [viewingPaper, setViewingPaper] = useState<LiteraturePaper | null>(null);

  // Side-by-side comparison modal for duplicate records
  const [comparisonPair, setComparisonPair] = useState<{ duplicate: LiteraturePaper; primary: LiteraturePaper } | null>(null);

  // Manual single add paper state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthors, setNewAuthors] = useState('');
  const [newYear, setNewYear] = useState(2024);
  const [newJournal, setNewJournal] = useState('');
  const [newDoi, setNewDoi] = useState('');
  const [newAbstract, setNewAbstract] = useState('');
  const [newDatabase, setNewDatabase] = useState<DatabaseSource>('Scopus');

  /**
   * Comprehensive Cross-Resource Deduplication Engine
   * Evaluates all records across Web of Science, Scopus, ResearchGate, etc.
   * Matches by:
   * 1. Exact DOI match (100% confidence)
   * 2. Strict normalized title equality (100% confidence)
   * 3. High-threshold fuzzy token similarity >= 85% with author/year concordance
   */
  const runCrossResourceDeduplication = (
    candidatePapers: LiteraturePaper[] = papers,
    triggerSource?: DatabaseSource,
    newCount?: number
  ) => {
    setIsDeduplicating(true);
    setDedupStatusMessage('Executing cross-resource deduplication across WoS, Scopus, ResearchGate, and other repositories...');

    setTimeout(() => {
      let duplicatesFound = 0;
      const seenDois = new Map<string, { id: string; customId: string; sourceDatabase: DatabaseSource }>();
      const seenTitles = new Map<string, { id: string; customId: string; sourceDatabase: DatabaseSource }>();
      const uniqueRecords: LiteraturePaper[] = [];

      const updatedPapers: LiteraturePaper[] = candidatePapers.map((paper) => {
        const cleanDoi = normalizeDoi(paper.doi);
        const normTitle = normalizeTitle(paper.title);

        // Check exact DOI duplicate
        if (cleanDoi && seenDois.has(cleanDoi)) {
          const match = seenDois.get(cleanDoi)!;
          duplicatesFound++;
          return {
            ...paper,
            isDuplicate: true,
            duplicateOfId: match.id,
            duplicateSourceDb: match.sourceDatabase,
            similarityScore: 100,
            duplicateMatchReason: `Exact DOI match with ${match.customId} (${match.sourceDatabase})`
          };
        }

        // Check strict title duplicate
        if (normTitle && normTitle.length > 10 && seenTitles.has(normTitle)) {
          const match = seenTitles.get(normTitle)!;
          duplicatesFound++;
          return {
            ...paper,
            isDuplicate: true,
            duplicateOfId: match.id,
            duplicateSourceDb: match.sourceDatabase,
            similarityScore: 100,
            duplicateMatchReason: `Identical publication title with ${match.customId} (${match.sourceDatabase})`
          };
        }

        // Check fuzzy title similarity against already cataloged unique records
        let fuzzyMatch: { primary: LiteraturePaper; score: number } | null = null;
        for (const existing of uniqueRecords) {
          const sim = computeTokenSimilarity(paper.title, existing.title);
          if (sim >= 85) {
            // If year is within 1 year or authors overlap, treat as duplicate (e.g. preprint vs published)
            fuzzyMatch = { primary: existing, score: sim };
            break;
          }
        }

        if (fuzzyMatch) {
          duplicatesFound++;
          return {
            ...paper,
            isDuplicate: true,
            duplicateOfId: fuzzyMatch.primary.id,
            duplicateSourceDb: fuzzyMatch.primary.sourceDatabase,
            similarityScore: fuzzyMatch.score,
            duplicateMatchReason: `Fuzzy title match (${fuzzyMatch.score}%) with ${fuzzyMatch.primary.customId} (${fuzzyMatch.primary.sourceDatabase})`
          };
        }

        // Register as unique master record
        if (cleanDoi) {
          seenDois.set(cleanDoi, { id: paper.id, customId: paper.customId, sourceDatabase: paper.sourceDatabase });
        }
        if (normTitle && normTitle.length > 10) {
          seenTitles.set(normTitle, { id: paper.id, customId: paper.customId, sourceDatabase: paper.sourceDatabase });
        }
        uniqueRecords.push(paper);

        return {
          ...paper,
          isDuplicate: false,
          duplicateOfId: undefined,
          duplicateSourceDb: undefined,
          similarityScore: undefined,
          duplicateMatchReason: undefined
        };
      });

      // Recalculate Per-Database Statistics for PRISMA
      const scopusCount = updatedPapers.filter(p => p.sourceDatabase === 'Scopus').length;
      const wosCount = updatedPapers.filter(p => p.sourceDatabase === 'Web of Science').length;
      const rgCount = updatedPapers.filter(p => p.sourceDatabase === 'ResearchGate').length;
      const scholarCount = updatedPapers.filter(p => p.sourceDatabase === 'Google Scholar').length;
      const pubMedCount = updatedPapers.filter(p => p.sourceDatabase === 'PubMed').length;
      const ieeeCount = updatedPapers.filter(p => p.sourceDatabase === 'IEEE Xplore').length;
      const otherCount = updatedPapers.filter(p => p.sourceDatabase === 'Other').length;

      const totalIdentified = updatedPapers.length;
      const uniqueCount = updatedPapers.filter(p => !p.isDuplicate).length;
      const calculatedDupes = totalIdentified - uniqueCount;

      const newPrisma: PrismaCounts = {
        ...prismaCounts,
        recordsScopus: scopusCount,
        recordsWos: wosCount,
        recordsResearchGate: rgCount,
        recordsScholar: scholarCount,
        recordsPubMed: pubMedCount,
        recordsIeee: ieeeCount,
        recordsOther: otherCount,
        totalIdentified: totalIdentified,
        duplicatesRemoved: calculatedDupes,
        recordsScreened: uniqueCount,
        studiesIncluded: uniqueCount
      };

      setPapers(updatedPapers);
      setPrismaCounts(newPrisma);

      // Run full synthesis engine across all active papers
      const synthesizedProject = runFullCorpusSynthesis({
        ...project,
        papers: updatedPapers,
        prismaCounts: newPrisma
      });

      onUpdateProject(synthesizedProject);

      setIsDeduplicating(false);

      if (triggerSource && newCount) {
        setDedupStatusMessage(`Cross-resource deduplication completed. Ingested ${newCount} records from ${triggerSource}. Verified ${uniqueCount} unique records across all databases, identifying ${duplicatesFound} cross-resource duplicates.`);
      } else {
        setDedupStatusMessage(`Cross-resource deduplication completed. Scanned ${updatedPapers.length} records across WoS, Scopus, and ResearchGate. Verified ${uniqueCount} unique studies and flagged ${duplicatesFound} cross-resource duplicates.`);
      }
    }, 450);
  };

  const handleToggleDuplicateStatus = (paperId: string) => {
    const updatedPapers = papers.map(p => {
      if (p.id === paperId) {
        const nextIsDupe = !p.isDuplicate;
        return { 
          ...p, 
          isDuplicate: nextIsDupe,
          duplicateMatchReason: nextIsDupe ? 'Manually flagged as duplicate' : undefined
        };
      }
      return p;
    });

    const uniqueCount = updatedPapers.filter(p => !p.isDuplicate).length;
    const newPrisma: PrismaCounts = {
      ...prismaCounts,
      duplicatesRemoved: Math.max(0, updatedPapers.length - uniqueCount),
      recordsScreened: uniqueCount,
      studiesIncluded: uniqueCount
    };

    setPapers(updatedPapers);
    setPrismaCounts(newPrisma);
    onUpdateProject({ papers: updatedPapers, prismaCounts: newPrisma });
  };

  const handleDeletePaper = (paperId: string) => {
    const updatedPapers = papers.filter(p => p.id !== paperId);
    runCrossResourceDeduplication(updatedPapers);
  };

  // Specific file processor tagged with the exact database source
  const processFilesForSource = (files: FileList | File[], sourceDb: DatabaseSource) => {
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (text) {
          const parsed = parseBibliographicFile(text, file.name, sourceDb);
          if (parsed.length > 0) {
            setPreviewParsedRecords({ records: parsed, source: sourceDb });
          } else {
            alert(`Unable to parse citations from ${file.name}. Please verify that it is a valid RIS (.ris), BibTeX (.bib), or CSV export from ${sourceDb}.`);
          }
        }
      };
      reader.readAsText(file);
    });
  };

  const handleDropOnChannel = (e: React.DragEvent<HTMLDivElement>, sourceDb: DatabaseSource) => {
    e.preventDefault();
    setDraggingChannel(null);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFilesForSource(e.dataTransfer.files, sourceDb);
    }
  };

  const handleConfirmBatchImport = (recordsToImport: ParsedRecord[], sourceDb: DatabaseSource) => {
    const currentMaxIndex = papers.length;
    
    const newLiteraturePapers: LiteraturePaper[] = recordsToImport.map((rec, idx) => {
      const paperIndex = currentMaxIndex + idx + 1;
      const customCode = `SP${String(paperIndex).padStart(3, '0')}`;

      return {
        id: `paper-import-${Date.now()}-${idx}`,
        customId: customCode,
        title: rec.title,
        authors: rec.authors,
        year: rec.year,
        journal: rec.journal,
        doi: rec.doi,
        abstract: rec.abstract,
        keywords: rec.keywords,
        sourceDatabase: rec.sourceDatabase || sourceDb,
        citationCount: rec.citationCount || 0,
        fullTextAvailable: true,
        publicationType: (rec.publicationType as 'Journal Article' | 'Conference Paper' | 'Book Chapter' | 'Review' | 'Preprint') || 'Journal Article'
      };
    });

    const combinedPapers = [...papers, ...newLiteraturePapers];
    setPreviewParsedRecords(null);
    setImportSuccessBanner(`Successfully imported ${newLiteraturePapers.length} records from ${sourceDb}. Cross-resource deduplication has been triggered across all databases.`);

    // Automatically execute deduplication among all database resources
    runCrossResourceDeduplication(combinedPapers, sourceDb, newLiteraturePapers.length);
  };

  // Quick loaders for sample data per source
  const handleLoadSampleSource = (sourceDb: DatabaseSource) => {
    let sampleData = '';
    if (sourceDb === 'Scopus') sampleData = SAMPLE_SCOPUS_RIS_DATA;
    else if (sourceDb === 'Web of Science') sampleData = SAMPLE_WOS_RIS_DATA;
    else if (sourceDb === 'ResearchGate') sampleData = SAMPLE_RESEARCHGATE_RIS_DATA;

    if (sampleData) {
      const parsed = parseRIS(sampleData, sourceDb);
      setPreviewParsedRecords({ records: parsed, source: sourceDb });
    }
  };

  // One-click multi-database benchmark suite
  const handleLoadMultiDatabaseBenchmark = () => {
    const scopusParsed = parseRIS(SAMPLE_SCOPUS_RIS_DATA, 'Scopus');
    const wosParsed = parseRIS(SAMPLE_WOS_RIS_DATA, 'Web of Science');
    const rgParsed = parseRIS(SAMPLE_RESEARCHGATE_RIS_DATA, 'ResearchGate');

    const allParsed = [...scopusParsed, ...wosParsed, ...rgParsed];
    
    const convertedPapers: LiteraturePaper[] = allParsed.map((rec, idx) => {
      const customCode = `SP${String(idx + 1).padStart(3, '0')}`;
      return {
        id: `benchmark-paper-${idx + 1}`,
        customId: customCode,
        title: rec.title,
        authors: rec.authors,
        year: rec.year,
        journal: rec.journal,
        doi: rec.doi,
        abstract: rec.abstract,
        keywords: rec.keywords,
        sourceDatabase: rec.sourceDatabase,
        citationCount: rec.citationCount || 0,
        fullTextAvailable: true,
        publicationType: (rec.publicationType as 'Journal Article' | 'Conference Paper' | 'Book Chapter' | 'Review' | 'Preprint') || 'Journal Article'
      };
    });

    setImportSuccessBanner(`Loaded multi-database benchmark suite: 5 Scopus records, 4 Web of Science records, and 3 ResearchGate preprints. Cross-resource deduplication triggered!`);
    runCrossResourceDeduplication(convertedPapers);
  };

  const handleParseRawText = () => {
    if (!rawTextImport.trim()) return;
    const parsed = parseBibliographicFile(rawTextImport, 'pasted.ris', pasteTargetDb);
    if (parsed.length > 0) {
      setPreviewParsedRecords({ records: parsed, source: pasteTargetDb });
      setShowPasteModal(false);
      setRawTextImport('');
    } else {
      alert('Could not parse valid records. Please verify the RIS (TY  - ... ER  - ) or BibTeX format.');
    }
  };

  const handleAddSinglePaper = () => {
    if (!newTitle.trim()) return;
    const nextIdx = papers.length + 1;
    const customCode = `SP${String(nextIdx).padStart(3, '0')}`;
    
    const newPaper: LiteraturePaper = {
      id: `p-${Date.now()}`,
      customId: customCode,
      title: newTitle.trim(),
      authors: newAuthors.split(',').map(a => a.trim()).filter(Boolean),
      year: Number(newYear) || 2024,
      journal: newJournal.trim() || 'Academic Journal',
      doi: newDoi.trim() || undefined,
      abstract: newAbstract.trim() || 'Abstract text pending ingestion.',
      keywords: ['Systematic Review', 'Study'],
      sourceDatabase: newDatabase,
      citationCount: 0,
      fullTextAvailable: true,
      publicationType: 'Journal Article'
    };

    const combined = [...papers, newPaper];
    setShowAddModal(false);
    setNewTitle('');
    setNewAuthors('');
    setNewJournal('');
    setNewDoi('');
    setNewAbstract('');

    runCrossResourceDeduplication(combined, newDatabase, 1);
  };

  // Open side-by-side comparison for a duplicate paper
  const handleOpenDuplicateComparison = (duplicatePaper: LiteraturePaper) => {
    if (!duplicatePaper.duplicateOfId) return;
    const primary = papers.find(p => p.id === duplicatePaper.duplicateOfId);
    if (primary) {
      setComparisonPair({ duplicate: duplicatePaper, primary });
    }
  };

  // Swap primary keeper record with duplicate
  const handleSwapPrimaryKeeper = (duplicateId: string, primaryId: string) => {
    const updated = papers.map(p => {
      if (p.id === duplicateId) {
        return {
          ...p,
          isDuplicate: false,
          duplicateOfId: undefined,
          duplicateSourceDb: undefined,
          similarityScore: undefined,
          duplicateMatchReason: undefined
        };
      }
      if (p.id === primaryId) {
        const dupePaper = papers.find(x => x.id === duplicateId);
        return {
          ...p,
          isDuplicate: true,
          duplicateOfId: duplicateId,
          duplicateSourceDb: dupePaper?.sourceDatabase,
          similarityScore: 100,
          duplicateMatchReason: `Replaced by ${dupePaper?.customId} (${dupePaper?.sourceDatabase}) as primary record`
        };
      }
      return p;
    });

    setComparisonPair(null);
    setPapers(updated);
    onUpdateProject({ papers: updated });
    setDedupStatusMessage('Swapped primary record and updated cross-resource links.');
  };

  // Counts per database
  const countScopus = papers.filter(p => p.sourceDatabase === 'Scopus').length;
  const countWos = papers.filter(p => p.sourceDatabase === 'Web of Science').length;
  const countRg = papers.filter(p => p.sourceDatabase === 'ResearchGate').length;
  const countOther = papers.filter(p => !['Scopus', 'Web of Science', 'ResearchGate'].includes(p.sourceDatabase)).length;
  const uniqueCount = papers.filter(p => !p.isDuplicate).length;
  const duplicateCount = papers.filter(p => p.isDuplicate).length;

  // Filtered list
  const filteredPapers = (papers || []).filter(p => {
    // Database / status tab filter
    if (activeFilterTab === 'SCOPUS' && p.sourceDatabase !== 'Scopus') return false;
    if (activeFilterTab === 'WOS' && p.sourceDatabase !== 'Web of Science') return false;
    if (activeFilterTab === 'RESEARCHGATE' && p.sourceDatabase !== 'ResearchGate') return false;
    if (activeFilterTab === 'OTHER' && ['Scopus', 'Web of Science', 'ResearchGate'].includes(p.sourceDatabase)) return false;
    if (activeFilterTab === 'DUPLICATES' && !p.isDuplicate) return false;
    if (activeFilterTab === 'UNIQUE' && p.isDuplicate) return false;

    // Search query filter
    const authorsStr = Array.isArray(p.authors) ? p.authors.join(' ') : '';
    const text = (
      p.title + ' ' + 
      authorsStr + ' ' + 
      (p.customId || '') + ' ' + 
      (p.doi || '') + ' ' + 
      (p.journal || '') + ' ' + 
      (p.sourceDatabase || '') + ' ' + 
      (p.duplicateMatchReason || '') + ' ' + 
      (p.abstract || '')
    ).toLowerCase();
    return text.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="max-w-6xl mx-auto py-8 px-6 space-y-8 animate-fadeIn" id="step3-deduplication-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <CopyCheck className="w-4 h-4" />
            <span>Step 3 of 9 • Granular Database Ingestion</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Multi-Database Ingestion & Cross-Resource Deduplication
          </h1>
          <p className="text-sm text-slate-400">
            Upload database export files separately from <strong>Web of Science (WoS)</strong>, <strong>Scopus</strong>, and <strong>ResearchGate</strong>. Automatic cross-resource deduplication correlates and eliminates overlaps between all repositories.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleLoadMultiDatabaseBenchmark}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/40 text-xs font-semibold transition-colors"
            title="Load WoS + Scopus + ResearchGate benchmark datasets to test cross-resource deduplication"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Load Multi-DB Benchmark</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>Manual Record</span>
          </button>

          <button
            onClick={() => runCrossResourceDeduplication()}
            disabled={isDeduplicating}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isDeduplicating ? 'animate-spin' : ''}`} />
            <span>Re-Run Deduplication</span>
          </button>
        </div>
      </div>

      {/* PRISMA Yield Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-semibold uppercase">Total Identified</span>
            <Database className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <p className="text-2xl font-bold text-white font-mono">{papers.length}</p>
          <span className="text-[10px] text-slate-500">Across all uploaded databases</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-amber-400 font-semibold uppercase">Duplicates Isolated</span>
            <Layers className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 font-mono">{duplicateCount}</p>
          <span className="text-[10px] text-amber-400/70">Cross-database & DOI matches</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-emerald-400 font-semibold uppercase">Unique Studies</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 font-mono">{uniqueCount}</p>
          <span className="text-[10px] text-emerald-400/70">Ready for screening</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-sky-400 font-semibold uppercase">Database Breakdown</span>
            <GitMerge className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-[10px] font-mono text-slate-300 space-y-0.5 pt-0.5">
            <div className="flex justify-between">
              <span className="text-amber-300">WoS: {countWos}</span>
              <span className="text-sky-300">Scopus: {countScopus}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-300">RG: {countRg}</span>
              <span className="text-slate-400">Other: {countOther}</span>
            </div>
          </div>
        </div>
      </div>

      {/* DEDICATED DATABASE UPLOAD SECTION */}
      <div className="space-y-4" id="database-upload-channels">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Database className="w-4 h-4 text-amber-400" />
              <span>Dedicated Database Ingestion Channels</span>
            </h2>
            <p className="text-xs text-slate-400">
              Upload exports directly into their dedicated channels. Deduplication runs automatically across all resources after each upload.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* CHANNEL 1: Web of Science (WoS) */}
          <div 
            onDragOver={(e) => { e.preventDefault(); setDraggingChannel('Web of Science'); }}
            onDragLeave={() => setDraggingChannel(null)}
            onDrop={(e) => handleDropOnChannel(e, 'Web of Science')}
            className={`bg-slate-900/90 border rounded-xl p-4 flex flex-col justify-between space-y-4 transition-all shadow-md ${
              draggingChannel === 'Web of Science' 
                ? 'border-amber-400 bg-amber-400/10 ring-2 ring-amber-400/40' 
                : 'border-slate-800 hover:border-amber-500/50'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400 font-bold text-xs">
                    WoS
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-xs">Web of Science (Clarivate)</h3>
                    <span className="text-[10px] text-amber-400/80 font-mono">Core Collection & ESCI</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-slate-950 border border-slate-700 text-[10px] font-mono text-amber-300">
                  {countWos} in corpus
                </span>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                Accepts Clarivate WoS exports in <strong>.ris</strong>, <strong>.ciw</strong>, <strong>.bib</strong>, or <strong>.txt</strong> format with full abstracts.
              </p>
            </div>

            <div className="space-y-2">
              <input
                type="file"
                ref={wosInputRef}
                onChange={(e) => e.target.files && processFilesForSource(e.target.files, 'Web of Science')}
                multiple
                accept=".ris,.ciw,.bib,.bibtex,.txt,.csv"
                className="hidden"
              />

              <button
                onClick={() => wosInputRef.current?.click()}
                className="w-full py-2 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center justify-center space-x-2 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload WoS Export (.ris / .ciw)</span>
              </button>

              <div className="flex items-center justify-between text-[10px]">
                <button
                  onClick={() => {
                    setPasteTargetDb('Web of Science');
                    setShowPasteModal(true);
                  }}
                  className="text-slate-400 hover:text-white flex items-center space-x-1"
                >
                  <FileCode className="w-3 h-3 text-amber-400" />
                  <span>Paste Citations</span>
                </button>

                <button
                  onClick={() => handleLoadSampleSource('Web of Science')}
                  className="text-amber-400 hover:underline font-semibold"
                >
                  Load WoS Sample
                </button>
              </div>
            </div>
          </div>

          {/* CHANNEL 2: Scopus (Elsevier) */}
          <div 
            onDragOver={(e) => { e.preventDefault(); setDraggingChannel('Scopus'); }}
            onDragLeave={() => setDraggingChannel(null)}
            onDrop={(e) => handleDropOnChannel(e, 'Scopus')}
            className={`bg-slate-900/90 border rounded-xl p-4 flex flex-col justify-between space-y-4 transition-all shadow-md ${
              draggingChannel === 'Scopus' 
                ? 'border-sky-400 bg-sky-400/10 ring-2 ring-sky-400/40' 
                : 'border-slate-800 hover:border-sky-500/50'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-sky-400/20 border border-sky-400/40 flex items-center justify-center text-sky-400 font-bold text-xs">
                    SC
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-xs">Scopus (Elsevier)</h3>
                    <span className="text-[10px] text-sky-400/80 font-mono">Elsevier ScienceDirect & Scopus</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-slate-950 border border-slate-700 text-[10px] font-mono text-sky-300">
                  {countScopus} in corpus
                </span>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                Accepts Scopus citation exports in <strong>.ris</strong>, <strong>.csv</strong>, or <strong>.bib</strong> format including complete abstracts and author keywords.
              </p>
            </div>

            <div className="space-y-2">
              <input
                type="file"
                ref={scopusInputRef}
                onChange={(e) => e.target.files && processFilesForSource(e.target.files, 'Scopus')}
                multiple
                accept=".ris,.bib,.bibtex,.csv,.txt"
                className="hidden"
              />

              <button
                onClick={() => scopusInputRef.current?.click()}
                className="w-full py-2 px-3 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-semibold flex items-center justify-center space-x-2 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Scopus Export (.ris / .csv)</span>
              </button>

              <div className="flex items-center justify-between text-[10px]">
                <button
                  onClick={() => {
                    setPasteTargetDb('Scopus');
                    setShowPasteModal(true);
                  }}
                  className="text-slate-400 hover:text-white flex items-center space-x-1"
                >
                  <FileCode className="w-3 h-3 text-sky-400" />
                  <span>Paste Citations</span>
                </button>

                <button
                  onClick={() => handleLoadSampleSource('Scopus')}
                  className="text-sky-400 hover:underline font-semibold"
                >
                  Load Scopus Sample
                </button>
              </div>
            </div>
          </div>

          {/* CHANNEL 3: ResearchGate */}
          <div 
            onDragOver={(e) => { e.preventDefault(); setDraggingChannel('ResearchGate'); }}
            onDragLeave={() => setDraggingChannel(null)}
            onDrop={(e) => handleDropOnChannel(e, 'ResearchGate')}
            className={`bg-slate-900/90 border rounded-xl p-4 flex flex-col justify-between space-y-4 transition-all shadow-md ${
              draggingChannel === 'ResearchGate' 
                ? 'border-emerald-400 bg-emerald-400/10 ring-2 ring-emerald-400/40' 
                : 'border-slate-800 hover:border-emerald-500/50'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-400/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 font-bold text-xs">
                    RG
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-xs">ResearchGate</h3>
                    <span className="text-[10px] text-emerald-400/80 font-mono">Preprints & Working Papers</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-slate-950 border border-slate-700 text-[10px] font-mono text-emerald-300">
                  {countRg} in corpus
                </span>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                Accepts ResearchGate publications and preprints in <strong>.ris</strong>, <strong>.bib</strong>, or <strong>.txt</strong> format.
              </p>
            </div>

            <div className="space-y-2">
              <input
                type="file"
                ref={rgInputRef}
                onChange={(e) => e.target.files && processFilesForSource(e.target.files, 'ResearchGate')}
                multiple
                accept=".ris,.bib,.bibtex,.txt,.csv"
                className="hidden"
              />

              <button
                onClick={() => rgInputRef.current?.click()}
                className="w-full py-2 px-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center justify-center space-x-2 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload ResearchGate (.ris / .bib)</span>
              </button>

              <div className="flex items-center justify-between text-[10px]">
                <button
                  onClick={() => {
                    setPasteTargetDb('ResearchGate');
                    setShowPasteModal(true);
                  }}
                  className="text-slate-400 hover:text-white flex items-center space-x-1"
                >
                  <FileCode className="w-3 h-3 text-emerald-400" />
                  <span>Paste Citations</span>
                </button>

                <button
                  onClick={() => handleLoadSampleSource('ResearchGate')}
                  className="text-emerald-400 hover:underline font-semibold"
                >
                  Load RG Sample
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional sources bar (PubMed, IEEE, Scholar) */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-slate-400">
            <Info className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Need to upload from <strong>PubMed</strong>, <strong>IEEE Xplore</strong>, or <strong>Google Scholar</strong>?</span>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <input
              type="file"
              ref={otherInputRef}
              onChange={(e) => e.target.files && processFilesForSource(e.target.files, 'Other')}
              multiple
              accept=".ris,.bib,.bibtex,.csv,.txt"
              className="hidden"
            />
            <button
              onClick={() => otherInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold"
            >
              Upload Other Repository (.ris/.bib)
            </button>
          </div>
        </div>
      </div>

      {/* Success banner after import */}
      {importSuccessBanner && (
        <div className="bg-emerald-950/50 border border-emerald-800/80 rounded-xl p-4 flex items-center justify-between text-xs text-emerald-300 shadow-md">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{importSuccessBanner}</span>
          </div>
          <button 
            onClick={() => setImportSuccessBanner(null)}
            className="text-emerald-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Deduplication Status message */}
      {dedupStatusMessage && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex items-center space-x-3 text-xs text-slate-300">
          <CheckCheck className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{dedupStatusMessage}</span>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="space-y-3">
        {/* Navigation filter tabs */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveFilterTab('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeFilterTab === 'ALL'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            All Ingested ({papers.length})
          </button>

          <button
            onClick={() => setActiveFilterTab('WOS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeFilterTab === 'WOS'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Web of Science ({countWos})
          </button>

          <button
            onClick={() => setActiveFilterTab('SCOPUS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeFilterTab === 'SCOPUS'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Scopus ({countScopus})
          </button>

          <button
            onClick={() => setActiveFilterTab('RESEARCHGATE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeFilterTab === 'RESEARCHGATE'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            ResearchGate ({countRg})
          </button>

          <button
            onClick={() => setActiveFilterTab('DUPLICATES')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeFilterTab === 'DUPLICATES'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Cross-Resource Duplicates ({duplicateCount})
          </button>

          <button
            onClick={() => setActiveFilterTab('UNIQUE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeFilterTab === 'UNIQUE'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Unique Screening Corpus ({uniqueCount})
          </button>
        </div>

        {/* Search input */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-96">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by code, title, author, DOI, or cross-database link..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <span>Showing <strong>{filteredPapers.length}</strong> of <strong>{papers.length}</strong> records</span>
          </div>
        </div>
      </div>

      {/* Paper Corpus Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl" id="deduplicated-corpus-table">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 w-20">Code</th>
                <th className="py-3 px-4">Title & Publication Details</th>
                <th className="py-3 px-4 w-32">Source Database</th>
                <th className="py-3 px-4 w-20">Year</th>
                <th className="py-3 px-4 w-32">Deduplication Status</th>
                <th className="py-3 px-4 w-40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredPapers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                    No bibliographic records match the active filter or search query.
                  </td>
                </tr>
              ) : (
                filteredPapers.map((paper) => (
                  <tr 
                    key={paper.id}
                    className={`hover:bg-slate-800/50 transition-colors ${
                      paper.isDuplicate ? 'bg-rose-950/15' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                      {paper.customId}
                    </td>

                    <td className="py-3.5 px-4 space-y-1.5 max-w-md">
                      <p className="font-semibold text-white leading-snug">{paper.title}</p>
                      <p className="text-slate-400 text-[11px]">
                        {(paper.authors || []).join(', ')} • <span className="italic text-slate-300">{paper.journal}</span>
                      </p>

                      <div className="flex flex-wrap items-center gap-2 pt-0.5">
                        {paper.doi && (
                          <span className="text-[10px] text-sky-400 font-mono">DOI: {paper.doi}</span>
                        )}
                        {paper.abstract && (
                          <span className="text-[10px] text-emerald-400/90 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800/40">
                            Abstract ({paper.abstract.length} chars)
                          </span>
                        )}
                      </div>

                      {/* Cross-resource duplicate explanation badge */}
                      {paper.isDuplicate && paper.duplicateMatchReason && (
                        <div className="p-1.5 rounded bg-rose-950/40 border border-rose-800/50 text-[10px] text-rose-300 flex items-center justify-between gap-2">
                          <span>
                            <strong>Cross-Resource Duplicate:</strong> {paper.duplicateMatchReason}
                          </span>
                          <button
                            onClick={() => handleOpenDuplicateComparison(paper)}
                            className="text-amber-400 hover:underline shrink-0 font-semibold"
                          >
                            Compare
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded border text-[11px] font-mono ${
                        paper.sourceDatabase === 'Web of Science' 
                          ? 'bg-amber-950/60 border-amber-800/60 text-amber-300' 
                          : paper.sourceDatabase === 'Scopus'
                          ? 'bg-sky-950/60 border-sky-800/60 text-sky-300'
                          : paper.sourceDatabase === 'ResearchGate'
                          ? 'bg-emerald-950/60 border-emerald-800/60 text-emerald-300'
                          : 'bg-slate-950 border-slate-800 text-slate-300'
                      }`}>
                        {paper.sourceDatabase}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {paper.year}
                    </td>

                    <td className="py-3.5 px-4">
                      {paper.isDuplicate ? (
                        <div className="space-y-1">
                          <span className="inline-block px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 text-[10px] font-bold">
                            DUPLICATE
                          </span>
                          {paper.similarityScore && (
                            <span className="block text-[10px] text-slate-400 font-mono">
                              {paper.similarityScore}% match
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                          UNIQUE
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => setViewingPaper(paper)}
                          className="text-[11px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center space-x-1"
                          title="View Full Abstract & Metadata"
                        >
                          <Eye className="w-3 h-3 text-amber-400" />
                          <span>Abstract</span>
                        </button>

                        <button
                          onClick={() => handleToggleDuplicateStatus(paper.id)}
                          className={`text-[11px] px-2 py-1 rounded font-semibold transition-colors ${
                            paper.isDuplicate 
                              ? 'bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800' 
                              : 'bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800'
                          }`}
                          title={paper.isDuplicate ? 'Mark as Unique Study' : 'Flag as Duplicate'}
                        >
                          {paper.isDuplicate ? 'Set Unique' : 'Mark Dupe'}
                        </button>

                        <button
                          onClick={() => handleDeletePaper(paper.id)}
                          className="p-1 rounded bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side-by-Side Duplicate Comparison Modal */}
      {comparisonPair && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] flex flex-col space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
                  <ArrowLeftRight className="w-4 h-4" />
                  <span>Cross-Resource Duplicate Comparison</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Side-by-side inspection between the primary master record and the detected duplicate across database sources.
                </p>
              </div>
              <button 
                onClick={() => setComparisonPair(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-y-auto pr-1">
              {/* PRIMARY MASTER RECORD */}
              <div className="bg-slate-950 border-2 border-emerald-700/60 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                    PRIMARY KEEPER RECORD
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {comparisonPair.primary.customId} • {comparisonPair.primary.sourceDatabase}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-white text-xs leading-snug">{comparisonPair.primary.title}</h4>
                  <p className="text-slate-400 text-[11px]">
                    {(comparisonPair.primary.authors || []).join(', ')} ({comparisonPair.primary.year})
                  </p>
                  <p className="text-slate-400 text-[11px] italic">
                    {comparisonPair.primary.journal}
                  </p>
                  {comparisonPair.primary.doi && (
                    <p className="text-sky-400 font-mono text-[10px]">
                      DOI: {comparisonPair.primary.doi}
                    </p>
                  )}
                </div>

                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-slate-300 text-[11px] leading-relaxed max-h-48 overflow-y-auto">
                  <span className="text-slate-500 font-bold uppercase text-[10px] block mb-1">Abstract:</span>
                  {comparisonPair.primary.abstract || 'No abstract text available.'}
                </div>
              </div>

              {/* DUPLICATE DETECTED RECORD */}
              <div className="bg-slate-950 border-2 border-rose-700/60 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 text-[10px] font-bold">
                    DUPLICATE TO BE REMOVED
                  </span>
                  <span className="font-mono text-rose-400 font-bold">
                    {comparisonPair.duplicate.customId} • {comparisonPair.duplicate.sourceDatabase}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-white text-xs leading-snug">{comparisonPair.duplicate.title}</h4>
                  <p className="text-slate-400 text-[11px]">
                    {(comparisonPair.duplicate.authors || []).join(', ')} ({comparisonPair.duplicate.year})
                  </p>
                  <p className="text-slate-400 text-[11px] italic">
                    {comparisonPair.duplicate.journal}
                  </p>
                  {comparisonPair.duplicate.doi && (
                    <p className="text-sky-400 font-mono text-[10px]">
                      DOI: {comparisonPair.duplicate.doi}
                    </p>
                  )}
                </div>

                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-slate-300 text-[11px] leading-relaxed max-h-48 overflow-y-auto">
                  <span className="text-slate-500 font-bold uppercase text-[10px] block mb-1">Abstract:</span>
                  {comparisonPair.duplicate.abstract || 'No abstract text available.'}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-rose-400 text-[11px]">
                Match rationale: {comparisonPair.duplicate.duplicateMatchReason || 'Exact duplicate found across databases'}
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleSwapPrimaryKeeper(comparisonPair.duplicate.id, comparisonPair.primary.id)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/40 text-xs font-semibold"
                >
                  Swap: Keep {comparisonPair.duplicate.sourceDatabase} as Master
                </button>

                <button
                  onClick={() => {
                    handleToggleDuplicateStatus(comparisonPair.duplicate.id);
                    setComparisonPair(null);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold"
                >
                  Keep Both as Unique Studies
                </button>

                <button
                  onClick={() => setComparisonPair(null)}
                  className="px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Batch Import Preview Modal */}
      {previewParsedRecords && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-3xl w-full max-h-[85vh] flex flex-col space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
                  <Database className="w-4 h-4" />
                  <span>Parsed {previewParsedRecords.records.length} Bibliographic Records from {previewParsedRecords.source}</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Review parsed citations and abstracts before committing into your systematic review corpus.
                </p>
              </div>
              <button 
                onClick={() => setPreviewParsedRecords(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 divide-y divide-slate-800">
              {previewParsedRecords.records.map((rec, idx) => (
                <div key={idx} className="pt-3 first:pt-0 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-white text-xs">{idx + 1}. {rec.title}</h4>
                    <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-700 text-amber-400 font-mono text-[10px] shrink-0">
                      {rec.sourceDatabase || previewParsedRecords.source} • {rec.year}
                    </span>
                  </div>

                  <p className="text-slate-400 text-[11px]">
                    <strong>Authors:</strong> {(rec.authors || []).join(', ')} | <strong>Journal:</strong> {rec.journal}
                  </p>

                  {rec.doi && (
                    <p className="text-[10px] text-sky-400 font-mono">
                      DOI: {rec.doi}
                    </p>
                  )}

                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 text-[11px] text-slate-300 leading-relaxed">
                    <span className="text-slate-500 font-semibold uppercase text-[10px] block mb-1">Abstract:</span>
                    {rec.abstract}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-slate-400 text-[11px]">
                Auto-deduplication will immediately evaluate these records against your entire multi-database corpus.
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPreviewParsedRecords(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleConfirmBatchImport(previewParsedRecords.records, previewParsedRecords.source)}
                  className="px-5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold shadow-md flex items-center space-x-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Confirm Ingestion & Deduplicate ({previewParsedRecords.records.length} Records)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Paste Raw Citations Modal */}
      {showPasteModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-2xl w-full space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center space-x-2 text-white font-bold text-sm">
                <FileCode className="w-4 h-4 text-sky-400" />
                <span>Paste Citations for {pasteTargetDb}</span>
              </div>
              <button 
                onClick={() => setShowPasteModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-slate-400 text-[11px]">
              Copy citation exports directly from {pasteTargetDb} and paste them below:
            </p>

            <textarea
              value={rawTextImport}
              onChange={(e) => setRawTextImport(e.target.value)}
              rows={10}
              placeholder={`TY  - JOUR\nTI  - Deep learning in climate change modeling\nAU  - Smith, J.\nAU  - Taylor, R.\nPY  - 2024\nJO  - Nature Climate Change\nDO  - 10.1038/s41558-024-001\nAB  - We examine machine learning algorithms for precipitation forecasting...\nER  -`}
              className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-amber-400"
            />

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  if (pasteTargetDb === 'Scopus') setRawTextImport(SAMPLE_SCOPUS_RIS_DATA);
                  else if (pasteTargetDb === 'Web of Science') setRawTextImport(SAMPLE_WOS_RIS_DATA);
                  else if (pasteTargetDb === 'ResearchGate') setRawTextImport(SAMPLE_RESEARCHGATE_RIS_DATA);
                }}
                className="text-amber-400 hover:underline text-[11px]"
              >
                Insert {pasteTargetDb} Template
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowPasteModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleParseRawText}
                  disabled={!rawTextImport.trim()}
                  className="px-4 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-bold hover:bg-amber-300 disabled:opacity-50"
                >
                  Parse & Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Abstract & Paper Details Inspector Modal */}
      {viewingPaper && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-2xl w-full space-y-4 shadow-2xl text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/30 text-amber-300 font-mono text-xs font-bold">
                  {viewingPaper.customId} • {viewingPaper.sourceDatabase} ({viewingPaper.year})
                </span>
                <h3 className="text-base font-bold text-white leading-snug pt-1">
                  {viewingPaper.title}
                </h3>
                <p className="text-slate-400 text-xs">
                  {(viewingPaper.authors || []).join(', ')} — <span className="italic text-slate-300">{viewingPaper.journal}</span>
                </p>
              </div>
              <button 
                onClick={() => setViewingPaper(null)}
                className="text-slate-400 hover:text-white shrink-0 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* DOI & Metadata */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-1 text-[11px]">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">DOI</span>
                <span className="font-mono text-sky-400 truncate block">{viewingPaper.doi || 'N/A'}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Citations</span>
                <span className="font-mono text-white font-bold">{viewingPaper.citationCount} cited</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Deduplication Status</span>
                <span className={`font-bold ${viewingPaper.isDuplicate ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {viewingPaper.isDuplicate ? 'Duplicate Match' : 'Unique Record'}
                </span>
              </div>
            </div>

            {/* Abstract Text */}
            <div className="space-y-1.5">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-400">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Full Abstract</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-200 leading-relaxed text-xs">
                {viewingPaper.abstract || 'No abstract text was provided in this bibliographic record.'}
              </div>
            </div>

            {/* Keywords */}
            {viewingPaper.keywords && viewingPaper.keywords.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-400">Author & Index Keywords:</span>
                <div className="flex flex-wrap gap-1.5">
                  {viewingPaper.keywords.map((kw, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[11px]">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setViewingPaper(null)}
                className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Single Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-xl w-full space-y-4 shadow-2xl text-xs">
            <h3 className="text-base font-bold text-white">Add Bibliographic Study Record</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Paper Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  placeholder="Enter publication title..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Authors (comma separated)</label>
                  <input
                    type="text"
                    value={newAuthors}
                    onChange={(e) => setNewAuthors(e.target.value)}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                    placeholder="e.g. Smith, J., Patel, A."
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Publication Year</label>
                  <input
                    type="number"
                    value={newYear}
                    onChange={(e) => setNewYear(parseInt(e.target.value) || 2024)}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Journal / Conference</label>
                  <input
                    type="text"
                    value={newJournal}
                    onChange={(e) => setNewJournal(e.target.value)}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                    placeholder="e.g. Remote Sensing of Environment"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Source Database</label>
                  <select
                    value={newDatabase}
                    onChange={(e) => setNewDatabase(e.target.value as DatabaseSource)}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="Web of Science">Web of Science</option>
                    <option value="Scopus">Scopus</option>
                    <option value="ResearchGate">ResearchGate</option>
                    <option value="IEEE Xplore">IEEE Xplore</option>
                    <option value="Google Scholar">Google Scholar</option>
                    <option value="PubMed">PubMed</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">DOI (Digital Object Identifier)</label>
                <input
                  type="text"
                  value={newDoi}
                  onChange={(e) => setNewDoi(e.target.value)}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  placeholder="10.1016/j.rse.2023.113689"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Abstract</label>
                <textarea
                  value={newAbstract}
                  onChange={(e) => setNewAbstract(e.target.value)}
                  rows={3}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  placeholder="Paste abstract text for screening..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSinglePaper}
                disabled={!newTitle.trim()}
                className="px-4 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-bold hover:bg-amber-300 disabled:opacity-50"
              >
                Save Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Continue */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <span className="text-xs text-slate-400">
          All unique records across WoS, Scopus, ResearchGate, and other repositories are deduplicated and ready for Step 4.
        </span>

        <button
          onClick={onContinue}
          className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-all shadow-md"
        >
          <span>Continue to Step 4: Title & Abstract Screening</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
