import React, { useState } from 'react';
import { 
  ProjectData, 
  SearchStrategy, 
  SearchFilters 
} from '../types';
import { 
  Search, 
  Copy, 
  Check, 
  RotateCw, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Filter, 
  BookOpen, 
  AlertCircle,
  FileCheck2
} from 'lucide-react';

interface Step4SearchStrategyProps {
  project: ProjectData;
  onUpdateProject: (updates: Partial<ProjectData>) => void;
  onContinue: () => void;
}

export const Step4SearchStrategy: React.FC<Step4SearchStrategyProps> = ({
  project,
  onUpdateProject,
  onContinue
}) => {
  const [strategy, setStrategy] = useState<SearchStrategy>(
    project.searchStrategy || {
      scopusQuery: '',
      wosQuery: '',
      scholarQuery: '',
      explanation: {
        selectedTermsRationale: '',
        synonymGroups: '',
        booleanStructure: '',
        broadVsNarrow: '',
        recallRisk: '',
        precisionRisk: ''
      },
      qualityRating: 'High',
      titleSuggestions: []
    }
  );

  const [filters, setFilters] = useState<SearchFilters>(
    project.searchFilters || {
      pubTypes: ['Journal Article', 'Conference Proceeding'],
      language: ['English'],
      yearFrom: 2018,
      yearTo: 2026,
      subjectAreas: ['Engineering', 'Computer Science', 'Environmental Science', 'Energy']
    }
  );

  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRegenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/search-strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: project.title,
          taxonomy: project.taxonomy,
          filters
        })
      });
      const data = await res.json();
      if (data.scopusQuery) {
        setStrategy(data);
        onUpdateProject({
          searchStrategy: data,
          searchFilters: filters
        });
      }
    } catch (e) {
      console.error('Error generating search strategy:', e);
    } finally {
      setLoading(false);
    }
  };

  const selectSuggestedTitle = (suggestedTitle: string) => {
    onUpdateProject({
      title: suggestedTitle,
      searchStrategy: {
        ...strategy,
        titleSuggestions: strategy.titleSuggestions.map(ts => ({
          ...ts,
          selected: ts.title === suggestedTitle
        }))
      }
    });
    setStrategy({
      ...strategy,
      titleSuggestions: strategy.titleSuggestions.map(ts => ({
        ...ts,
        selected: ts.title === suggestedTitle
      }))
    });
  };

  const handleSaveAndContinue = () => {
    onUpdateProject({
      searchStrategy: strategy,
      searchFilters: filters
    });
    onContinue();
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-6 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <Search className="w-4 h-4" />
            <span>Step 4 of 9</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Database Search Strategy Agent
          </h1>
          <p className="text-sm text-slate-400">
            Generates precise Boolean query strings formatted specifically for Scopus, Web of Science, and Google Scholar syntax.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleRegenerate}
            disabled={loading}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 border border-slate-700 text-xs font-medium transition-all"
          >
            <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            <span>{loading ? 'Constructing Queries...' : 'Regenerate Strategy'}</span>
          </button>
        </div>
      </div>

      {/* Suggested Review Titles */}
      {strategy.titleSuggestions && strategy.titleSuggestions.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wide">
              <Sparkles className="w-4 h-4" />
              <span>AI Review Title Suggestions</span>
            </div>
            <span className="text-[11px] text-slate-400">Current Title: <strong className="text-slate-200">{project.title}</strong></span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {strategy.titleSuggestions.map((ts) => {
              const isSelected = project.title === ts.title;
              return (
                <div
                  key={ts.id}
                  className={`p-3 rounded-lg border flex items-center justify-between transition-all ${
                    isSelected 
                      ? 'bg-amber-400/10 border-amber-400 text-amber-200' 
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-3 pr-4">
                    <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-amber-400' : 'bg-slate-700'}`} />
                    <span className="text-xs font-medium">{ts.title}</span>
                  </div>
                  <button
                    onClick={() => selectSuggestedTitle(ts.title)}
                    className={`px-3 py-1 rounded text-xs font-semibold shrink-0 transition-colors ${
                      isSelected 
                        ? 'bg-amber-400 text-slate-950' 
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    {isSelected ? 'Active Title' : 'Use Title'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Search Strings Box */}
      <div className="grid grid-cols-1 gap-6">
        {/* Scopus */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <div className="bg-slate-950/80 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">Scopus Query String</span>
              <span className="text-[10px] text-slate-400 font-mono">TITLE-ABS-KEY(...)</span>
            </div>
            <button
              onClick={() => copyToClipboard(strategy.scopusQuery, 'scopus')}
              className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors border border-slate-700"
            >
              {copiedKey === 'scopus' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'scopus' ? 'Copied' : 'Copy Scopus Query'}</span>
            </button>
          </div>
          <div className="p-4 bg-slate-950 font-mono text-xs text-amber-200/90 leading-relaxed overflow-x-auto select-all">
            {strategy.scopusQuery || 'Query is generating...'}
          </div>
        </div>

        {/* Web of Science */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <div className="bg-slate-950/80 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">Web of Science Query String</span>
              <span className="text-[10px] text-slate-400 font-mono">TS=(...)</span>
            </div>
            <button
              onClick={() => copyToClipboard(strategy.wosQuery, 'wos')}
              className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors border border-slate-700"
            >
              {copiedKey === 'wos' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'wos' ? 'Copied' : 'Copy WoS Query'}</span>
            </button>
          </div>
          <div className="p-4 bg-slate-950 font-mono text-xs text-emerald-200/90 leading-relaxed overflow-x-auto select-all">
            {strategy.wosQuery || 'Query is generating...'}
          </div>
        </div>

        {/* Google Scholar */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <div className="bg-slate-950/80 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">Google Scholar Query String</span>
              <span className="text-[10px] text-slate-400 font-mono">Standard Boolean syntax (no tag prefixes)</span>
            </div>
            <button
              onClick={() => copyToClipboard(strategy.scholarQuery, 'scholar')}
              className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors border border-slate-700"
            >
              {copiedKey === 'scholar' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'scholar' ? 'Copied' : 'Copy Scholar Query'}</span>
            </button>
          </div>
          <div className="p-4 bg-slate-950 font-mono text-xs text-blue-200/90 leading-relaxed overflow-x-auto select-all">
            {strategy.scholarQuery || 'Query is generating...'}
          </div>
        </div>
      </div>

      {/* Filters & Methodological Explanation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Search Filters Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-300 uppercase tracking-wide border-b border-slate-800 pb-2">
            <Filter className="w-4 h-4 text-amber-400" />
            <span>Search Delimiters & Filters</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Publication Years</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={filters.yearFrom}
                  onChange={(e) => setFilters({ ...filters, yearFrom: Number(e.target.value) })}
                  className="w-24 px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-white text-xs"
                />
                <span className="text-slate-400">to</span>
                <input
                  type="number"
                  value={filters.yearTo}
                  onChange={(e) => setFilters({ ...filters, yearTo: Number(e.target.value) })}
                  className="w-24 px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Languages</label>
              <div className="flex flex-wrap gap-1.5">
                {['English', 'Spanish', 'Mandarin', 'French'].map((lang) => {
                  const sel = filters.language.includes(lang);
                  return (
                    <button
                      key={lang}
                      onClick={() => {
                        const updated = sel ? filters.language.filter(l => l !== lang) : [...filters.language, lang];
                        setFilters({ ...filters, language: updated });
                      }}
                      className={`px-2 py-0.5 rounded text-[11px] border ${
                        sel ? 'bg-amber-400/20 text-amber-300 border-amber-400/40' : 'bg-slate-950 text-slate-500 border-slate-800'
                      }`}
                    >
                      {lang}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Publication Types</label>
              <div className="flex flex-wrap gap-1.5">
                {['Journal Article', 'Conference Proceeding', 'Review Article', 'Book Chapter'].map((pt) => {
                  const sel = filters.pubTypes.includes(pt);
                  return (
                    <button
                      key={pt}
                      onClick={() => {
                        const updated = sel ? filters.pubTypes.filter(p => p !== pt) : [...filters.pubTypes, pt];
                        setFilters({ ...filters, pubTypes: updated });
                      }}
                      className={`px-2 py-0.5 rounded text-[11px] border ${
                        sel ? 'bg-sky-400/20 text-sky-300 border-sky-400/40' : 'bg-slate-950 text-slate-500 border-slate-800'
                      }`}
                    >
                      {pt}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2">
              <div className="flex items-center justify-between p-2.5 rounded bg-emerald-950/30 border border-emerald-800/40 text-emerald-300">
                <span className="font-semibold text-[11px]">Strategy Quality:</span>
                <span className="font-bold text-xs flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{strategy.qualityRating || 'High'}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Methodological Rationale Card */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-300 uppercase tracking-wide border-b border-slate-800 pb-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Search Strategy Methodological Documentation</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="font-bold text-slate-300">Selected Terms Rationale</span>
              <p className="text-slate-400 text-[11px] leading-relaxed bg-slate-950/50 p-2.5 rounded border border-slate-800/80">
                {strategy.explanation?.selectedTermsRationale || 'Balanced selection covering core maritime operations, machine learning methodologies, and emissions targets.'}
              </p>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-slate-300">Synonym Clustering</span>
              <p className="text-slate-400 text-[11px] leading-relaxed bg-slate-950/50 p-2.5 rounded border border-slate-800/80">
                {strategy.explanation?.synonymGroups || 'Consolidated vessel designations, machine learning paradigms, and decarbonization outcomes.'}
              </p>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-slate-300">Recall vs Precision Balance</span>
              <p className="text-slate-400 text-[11px] leading-relaxed bg-slate-950/50 p-2.5 rounded border border-slate-800/80">
                {strategy.explanation?.broadVsNarrow || 'Boolean structure limits off-topic engineering articles while capturing relevant peer-reviewed studies.'}
              </p>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-slate-300">Methodological Risk Statement</span>
              <p className="text-slate-400 text-[11px] leading-relaxed bg-slate-950/50 p-2.5 rounded border border-slate-800/80">
                Recall Risk: <span className="text-emerald-400">{strategy.explanation?.recallRisk || 'Low'}</span> | Precision Risk: <span className="text-amber-400">{strategy.explanation?.precisionRisk || 'Low'}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Continue */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <div className="text-xs text-slate-400 flex items-center space-x-1.5">
          <FileCheck2 className="w-3.5 h-3.5 text-amber-400" />
          <span>Next: Import citation files (.ris, .csv, .bib) from Scopus/WoS or load the demonstration dataset.</span>
        </div>

        <button
          onClick={handleSaveAndContinue}
          className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-all shadow-md"
        >
          <span>Continue to Literature Import</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
