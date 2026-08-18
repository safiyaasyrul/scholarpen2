import React, { useState } from 'react';
import { ProjectData, SearchQueryString, DatabaseSource } from '../types';
import { 
  Terminal, 
  Plus, 
  Copy, 
  Check, 
  Trash2, 
  Sparkles, 
  ArrowRight, 
  Code, 
  Database, 
  ExternalLink,
  Info
} from 'lucide-react';

interface Step2SearchStringsProps {
  project: ProjectData;
  onUpdateProject: (updates: Partial<ProjectData>) => void;
  onContinue: () => void;
}

export const Step2SearchStrings: React.FC<Step2SearchStringsProps> = ({
  project,
  onUpdateProject,
  onContinue
}) => {
  const [queries, setQueries] = useState<SearchQueryString[]>(project.searchStrings || []);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New query state
  const [selectedDb, setSelectedDb] = useState<DatabaseSource>('Scopus');
  const [queryString, setQueryString] = useState('');
  const [fieldFilters, setFieldFilters] = useState('');
  const [expectedYield, setExpectedYield] = useState<number>(150);
  const [notes, setNotes] = useState('');

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddQuery = () => {
    if (!queryString.trim()) return;
    const newQuery: SearchQueryString = {
      id: `sq-${Date.now()}`,
      database: selectedDb,
      syntaxType: selectedDb === 'Scopus' || selectedDb === 'Web of Science' ? 'Field-Tagged' : 'Boolean',
      queryString: queryString.trim(),
      fieldFilters: fieldFilters.trim(),
      expectedYield: Number(expectedYield) || 0,
      notes: notes.trim(),
      dateTested: new Date().toISOString().split('T')[0]
    };
    const updated = [...queries, newQuery];
    setQueries(updated);
    onUpdateProject({ searchStrings: updated });
    setQueryString('');
    setFieldFilters('');
    setNotes('');
  };

  const handleRemoveQuery = (id: string) => {
    const updated = queries.filter(q => q.id !== id);
    setQueries(updated);
    onUpdateProject({ searchStrings: updated });
  };

  // Pre-configured academic templates
  const applyTemplate = (db: DatabaseSource) => {
    setSelectedDb(db);
    if (db === 'Scopus') {
      setQueryString('TITLE-ABS-KEY(("climate adaptation" OR "climate resilience" OR "flood nowcasting") AND ("deep learning" OR "physics-informed" OR "neural network" OR "foundation model"))');
      setFieldFilters('PUBYEAR > 2019 AND PUBYEAR < 2025 AND LANGUAGE(english) AND DOCTYPE(ar OR cp)');
      setExpectedYield(412);
      setNotes('Scopus title-abstract-keywords indexed search string.');
    } else if (db === 'Web of Science') {
      setQueryString('TS=(("climate adaptation" OR "extreme weather" OR "coastal surge") AND ("physics-informed" OR "neural network" OR "transformer"))');
      setFieldFilters('PY=(2020-2024) AND LA=(English) AND DT=(Article OR Proceedings Paper)');
      setExpectedYield(348);
      setNotes('Web of Science Core Collection topic search (TS).');
    } else if (db === 'IEEE Xplore') {
      setQueryString('("Abstract":"precipitation nowcasting" OR "Abstract":"flood routing") AND ("Abstract":"deep learning" OR "Abstract":"ConvLSTM")');
      setFieldFilters('Year:[2020 TO 2024], ContentType:Conferences|Journals');
      setExpectedYield(184);
      setNotes('IEEE Xplore field query targeting abstract metadata.');
    } else if (db === 'PubMed') {
      setQueryString('("climate change"[MeSH Terms] OR "climate adaptation"[Title/Abstract]) AND ("deep learning"[Title/Abstract] OR "machine learning"[Title/Abstract])');
      setFieldFilters('2020:2024[dp] AND English[la]');
      setExpectedYield(64);
      setNotes('PubMed MeSH term and title/abstract formulation.');
    } else {
      setQueryString('"climate resilience" AND "machine learning" AND "hazard"');
      setFieldFilters('2020-2024');
      setExpectedYield(100);
      setNotes('Standard Boolean query.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-6 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <Terminal className="w-4 h-4" />
            <span>Step 2 of 9</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Search String Formulation & Syntax Translation
          </h1>
          <p className="text-sm text-slate-400">
            Engineer customized Boolean and field-tagged syntax for Scopus, Web of Science, IEEE Xplore, PubMed, and Google Scholar.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 rounded-lg">
            Active Query Strings: <strong className="text-amber-400">{queries.length}</strong>
          </span>
        </div>
      </div>

      {/* Syntax Quick Builder & Presets */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Code className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide">
              Query Builder & Database Syntax Engine
            </h3>
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 text-[11px] mr-1">Load Preset:</span>
            {(['Scopus', 'Web of Science', 'IEEE Xplore', 'PubMed', 'Google Scholar'] as DatabaseSource[]).map((db) => (
              <button
                key={db}
                onClick={() => applyTemplate(db)}
                className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-800 text-[11px] font-medium transition-colors"
              >
                {db}
              </button>
            ))}
          </div>
        </div>

        {/* Builder Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Target Database</label>
            <select
              value={selectedDb}
              onChange={(e) => setSelectedDb(e.target.value as DatabaseSource)}
              className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-medium focus:ring-1 focus:ring-amber-400"
            >
              <option value="Scopus">Scopus (Elsevier)</option>
              <option value="Web of Science">Web of Science (Clarivate)</option>
              <option value="IEEE Xplore">IEEE Xplore</option>
              <option value="Google Scholar">Google Scholar</option>
              <option value="PubMed">PubMed / MEDLINE</option>
              <option value="Other">Other Archive</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Field Filters / Constraints</label>
            <input
              type="text"
              value={fieldFilters}
              onChange={(e) => setFieldFilters(e.target.value)}
              placeholder="e.g. PUBYEAR > 2019 AND LANGUAGE(english)"
              className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:ring-1 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Expected / Tested Record Yield</label>
            <input
              type="number"
              value={expectedYield}
              onChange={(e) => setExpectedYield(parseInt(e.target.value) || 0)}
              className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono focus:ring-1 focus:ring-amber-400"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-slate-300 font-semibold mb-1">
              Constructed Boolean / Field-Tagged Query String
            </label>
            <textarea
              value={queryString}
              onChange={(e) => setQueryString(e.target.value)}
              rows={3}
              placeholder='e.g., TITLE-ABS-KEY(("climate adaptation" OR "flood") AND ("deep learning" OR "PINN"))'
              className="w-full p-3 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-xs leading-relaxed focus:ring-1 focus:ring-amber-400"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-slate-300 font-semibold mb-1">Reviewer Notes & Justification</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Iteration 3 calibrated with expert librarian feedback."
              className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-amber-400"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleAddQuery}
              disabled={!queryString.trim()}
              className="w-full py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>Save & Register Search String</span>
            </button>
          </div>
        </div>
      </div>

      {/* Query List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide flex items-center space-x-2">
          <Database className="w-4 h-4 text-sky-400" />
          <span>Registered Search Strings ({queries.length})</span>
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {queries.map((q) => (
            <div 
              key={q.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold font-mono">
                    {q.database}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                    Syntax: {q.syntaxType}
                  </span>
                  <span className="text-slate-400">Tested: {q.dateTested}</span>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-slate-300 font-mono">
                    Yield: <strong className="text-amber-400">{q.expectedYield}</strong> records
                  </span>
                  <button
                    onClick={() => handleCopy(q.id, q.queryString)}
                    className="p-1.5 rounded bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-800 flex items-center space-x-1"
                    title="Copy search string to clipboard"
                  >
                    {copiedId === q.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="text-[11px]">{copiedId === q.id ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={() => handleRemoveQuery(q.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded"
                    title="Delete query string"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Code Box */}
              <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800/80 font-mono text-xs text-amber-200/90 leading-relaxed overflow-x-auto">
                {q.queryString}
              </div>

              {q.fieldFilters && (
                <p className="text-[11px] text-slate-400">
                  <strong>Filters:</strong> <span className="font-mono text-slate-300">{q.fieldFilters}</span>
                </p>
              )}

              {q.notes && (
                <p className="text-[11px] text-slate-400 italic">
                  <strong>Notes:</strong> {q.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Continue */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <span className="text-xs text-slate-400 flex items-center space-x-1">
          <Info className="w-3.5 h-3.5 text-amber-400" />
          <span>Next step: Import records from databases and execute automated arithmetic deduplication.</span>
        </span>

        <button
          onClick={onContinue}
          className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-all shadow-md"
        >
          <span>Continue to Step 3: Deduplication</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
