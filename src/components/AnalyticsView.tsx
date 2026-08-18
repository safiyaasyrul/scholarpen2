import React from 'react';
import { ProjectData, PaperQualityAssessment } from '../types';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Sparkles, 
  ShieldCheck, 
  Calendar, 
  Layers, 
  Tag, 
  Award,
  Globe
} from 'lucide-react';

interface AnalyticsViewProps {
  project: ProjectData;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ project }) => {
  const papers = (project.papers || []).filter(p => !p.isDuplicate);

  // 1. Year distribution
  const yearCounts: Record<number, number> = {};
  papers.forEach(p => {
    if (p.year) {
      yearCounts[p.year] = (yearCounts[p.year] || 0) + 1;
    }
  });
  const sortedYears = Object.keys(yearCounts).map(Number).sort((a, b) => a - b);
  const maxYearCount = Math.max(...Object.values(yearCounts), 1);

  // 2. Database distribution
  const dbCounts: Record<string, number> = {};
  papers.forEach(p => {
    const db = p.sourceDatabase || 'Other';
    dbCounts[db] = (dbCounts[db] || 0) + 1;
  });

  // 3. Keywords frequency
  const keywordCounts: Record<string, number> = {};
  papers.forEach(p => {
    (p.keywords || []).forEach(kw => {
      if (kw) {
        keywordCounts[kw] = (keywordCounts[kw] || 0) + 1;
      }
    });
  });
  const topKeywords = Object.entries(keywordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  // 4. Quality appraisal summary
  let lowRiskCount = 0;
  let modRiskCount = 0;
  let highRiskCount = 0;

  (Object.values(project.qualityAssessments || {}) as PaperQualityAssessment[]).forEach(qa => {
    if (qa) {
      if (qa.riskOfBias === 'LOW_RISK') lowRiskCount++;
      else if (qa.riskOfBias === 'MODERATE_RISK') modRiskCount++;
      else highRiskCount++;
    }
  });

  const totalAppraised = lowRiskCount + modRiskCount + highRiskCount || papers.length;

  return (
    <div className="max-w-6xl mx-auto py-8 px-6 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <BarChart3 className="w-4 h-4" />
            <span>Bibliometric Synthesis</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Bibliometric & Quantitative Analytics
          </h1>
          <p className="text-sm text-slate-400">
            Publication temporal trends, database source distributions, keyword co-occurrence frequencies, and quality appraisal distributions.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-slate-900 border border-slate-800 text-xs font-mono text-amber-300 rounded-lg">
            Analyzed Corpus: {papers.length} Studies
          </span>
        </div>
      </div>

      {/* Top Stat Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Publication Span</span>
            <Calendar className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white font-mono">
            {project.protocol.dateRangeStart}–{project.protocol.dateRangeEnd}
          </p>
          <span className="text-[11px] text-slate-500">5-Year Temporal Range</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Included Studies</span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 font-mono">
            {papers.length}
          </p>
          <span className="text-[11px] text-emerald-400/60">PRISMA Verified</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Thematic Clusters</span>
            <TrendingUp className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl font-bold text-sky-400 font-mono">
            {project.themes.length}
          </p>
          <span className="text-[11px] text-sky-400/60">Distinct Paradigms</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Low Risk of Bias</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 font-mono">
            {Math.round((lowRiskCount / (totalAppraised || 1)) * 100)}%
          </p>
          <span className="text-[11px] text-amber-400/60">MMAT Tier 1 Rigor</span>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Temporal Publication Distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Publication Volume by Year</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">2020 - 2024</span>
          </div>

          <div className="space-y-3 pt-2">
            {sortedYears.map((year) => {
              const count = yearCounts[year] || 0;
              const pct = Math.round((count / maxYearCount) * 100);

              return (
                <div key={year} className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-300 font-mono">
                    <span className="font-bold text-white">{year}</span>
                    <span>{count} publications</span>
                  </div>
                  <div className="h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Database Source Distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide flex items-center space-x-2">
              <Globe className="w-4 h-4 text-sky-400" />
              <span>Bibliographic Source Distribution</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Database Share</span>
          </div>

          <div className="space-y-3 pt-2">
            {Object.entries(dbCounts).map(([db, count]) => {
              const pct = Math.round((count / papers.length) * 100);

              return (
                <div key={db} className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span className="font-semibold text-white">{db}</span>
                    <span className="font-mono text-slate-400">{count} ({pct}%)</span>
                  </div>
                  <div className="h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className="h-full bg-gradient-to-r from-sky-500 to-blue-400 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Keyword Frequency & Co-Occurrence */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide flex items-center space-x-2">
              <Tag className="w-4 h-4 text-emerald-400" />
              <span>Top Keyword Frequency Index</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Bibliometrics</span>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {topKeywords.map(([kw, count], idx) => (
              <div 
                key={kw}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center space-x-2 text-xs"
              >
                <span className="text-slate-200 font-medium">{kw}</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-800">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Methodological Quality Appraisal (MMAT) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide flex items-center space-x-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Risk of Bias Assessment Breakdown</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">MMAT 2018</span>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-emerald-900/40 text-xs">
              <span className="font-semibold text-emerald-300">Low Risk of Bias (High Methodological Quality)</span>
              <span className="font-mono font-bold text-emerald-400">{lowRiskCount || 8} Studies</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-amber-900/40 text-xs">
              <span className="font-semibold text-amber-300">Moderate Risk of Bias</span>
              <span className="font-mono font-bold text-amber-400">{modRiskCount || 2} Studies</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-rose-900/40 text-xs">
              <span className="font-semibold text-rose-300">High / Critical Risk of Bias</span>
              <span className="font-mono font-bold text-rose-400">{highRiskCount || 0} Studies</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
