import React, { useState } from 'react';
import { 
  ProjectData, 
  ThematicCluster, 
  ResearchGapItem, 
  GapDimension 
} from '../types';
import { 
  FolderTree, 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit3, 
  GitMerge, 
  ArrowRight, 
  Layers, 
  FileText, 
  Check, 
  X, 
  HelpCircle,
  TrendingUp,
  Compass,
  MoveHorizontal
} from 'lucide-react';

interface Step7ThematicClusteringProps {
  project: ProjectData;
  onUpdateProject: (updates: Partial<ProjectData>) => void;
  onContinue: () => void;
}

const GAP_DIMENSION_LABELS: Record<GapDimension, string> = {
  methodological: 'Methodological Gap',
  data: 'Data & Benchmark Gap',
  geographic: 'Geographic / Context Gap',
  technological: 'Technological & Hardware Gap',
  application: 'Operational / Deployment Gap',
  validation: 'Empirical Validation Gap',
  integration: 'Multi-Modal Integration Gap'
};

export const Step7ThematicClustering: React.FC<Step7ThematicClusteringProps> = ({
  project,
  onUpdateProject,
  onContinue
}) => {
  const [themes, setThemes] = useState<ThematicCluster[]>(project.themes || []);
  const [researchGaps, setResearchGaps] = useState<ResearchGapItem[]>(project.researchGaps || []);
  const [activeTab, setActiveTab] = useState<'themes' | 'gaps'>('themes');

  // Included papers
  const includedPapers = (project.papers || []).filter(p => {
    const s = project.screenings?.[p.id];
    return s && s.humanDecision === 'INCLUDE';
  });

  // Modal states
  const [newThemeName, setNewThemeName] = useState('');
  const [showAddTheme, setShowAddTheme] = useState(false);
  const [editingThemeId, setEditingThemeId] = useState<string | null>(null);
  const [editingThemeName, setEditingThemeName] = useState('');

  // Move paper modal
  const [movingPaperId, setMovingPaperId] = useState<string | null>(null);
  const [targetThemeId, setTargetThemeId] = useState<string>('');

  const handleDeleteTheme = (themeId: string) => {
    const updated = themes.filter(t => t.id !== themeId);
    setThemes(updated);
    onUpdateProject({ themes: updated });
  };

  const handleCreateTheme = () => {
    if (!newThemeName.trim()) return;
    const newTheme: ThematicCluster = {
      id: `theme_${Date.now()}`,
      name: newThemeName.trim(),
      description: 'Custom thematic synthesis category created by researcher.',
      paperIds: [],
      paperCount: 0,
      percentage: 0,
      publicationYears: '2024–2026',
      mainMethodologies: ['Machine Learning', 'Applied Analysis'],
      mainDatasets: ['Empirical Telemetry'],
      mainOutcomes: ['Performance Evaluation'],
      countries: ['Global'],
      representativePaperIds: [],
      majorFindings: 'Empirical patterns synthesized across included publications.',
      limitations: 'Limited generalizability across non-standard operating conditions.'
    };

    const updated = [...themes, newTheme];
    setThemes(updated);
    onUpdateProject({ themes: updated });
    setNewThemeName('');
    setShowAddTheme(false);
  };

  const handleSaveThemeName = (themeId: string) => {
    const updated = themes.map(t => {
      if (t.id === themeId) {
        return { ...t, name: editingThemeName };
      }
      return t;
    });
    setThemes(updated);
    onUpdateProject({ themes: updated });
    setEditingThemeId(null);
  };

  const handleMovePaper = () => {
    if (!movingPaperId || !targetThemeId) return;

    const updated = themes.map(t => {
      const filtered = t.paperIds.filter(id => id !== movingPaperId);
      if (t.id === targetThemeId) {
        filtered.push(movingPaperId);
      }
      const count = filtered.length;
      const pct = Math.round((count / (includedPapers.length || 1)) * 100);
      return {
        ...t,
        paperIds: filtered,
        paperCount: count,
        percentage: pct
      };
    });

    setThemes(updated);
    onUpdateProject({ themes: updated });
    setMovingPaperId(null);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <FolderTree className="w-4 h-4" />
            <span>Step 7 of 9</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Thematic Clustering & Research Gap Synthesis
          </h1>
          <p className="text-sm text-slate-400">
            ScholarPen synthesized <strong>{includedPapers.length} included studies</strong> into distinct thematic clusters and 7 systematic research gap dimensions.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('themes')}
            className={`px-3 py-1.5 rounded font-semibold transition-colors ${
              activeTab === 'themes' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Thematic Clusters ({themes.length})
          </button>
          <button
            onClick={() => setActiveTab('gaps')}
            className={`px-3 py-1.5 rounded font-semibold transition-colors ${
              activeTab === 'gaps' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Research Gaps ({researchGaps.length})
          </button>
        </div>
      </div>

      {/* Overview Stat Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold">
            {includedPapers.length}
          </div>
          <div>
            <p className="font-semibold text-slate-200">Included Evidence Corpus</p>
            <p className="text-[11px] text-slate-400">Only papers verified as INCLUDE are processed for synthesis.</p>
          </div>
        </div>

        {activeTab === 'themes' && (
          <button
            onClick={() => setShowAddTheme(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>Add Custom Theme</span>
          </button>
        )}
      </div>

      {/* Tab Content: Thematic Clusters */}
      {activeTab === 'themes' && (
        <div className="grid grid-cols-1 gap-6">
          {themes.map((theme) => {
            const isEditing = editingThemeId === theme.id;
            const themePapers = project.papers.filter(p => theme.paperIds.includes(p.id));

            return (
              <div 
                key={theme.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5 shadow-xl hover:border-slate-700 transition-all"
              >
                {/* Theme Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono font-bold text-[11px]">
                        {theme.paperCount} Studies ({theme.percentage}%)
                      </span>
                      <span className="text-slate-400 text-xs font-mono">• Years: {theme.publicationYears}</span>
                    </div>

                    {isEditing ? (
                      <div className="flex items-center space-x-2 pt-1">
                        <input
                          type="text"
                          value={editingThemeName}
                          onChange={(e) => setEditingThemeName(e.target.value)}
                          className="px-2.5 py-1 bg-slate-950 border border-slate-700 rounded text-white text-sm font-bold focus:outline-none focus:ring-1 focus:ring-amber-400"
                        />
                        <button
                          onClick={() => handleSaveThemeName(theme.id)}
                          className="p-1 rounded bg-amber-400 text-slate-950"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                        <span>{theme.name}</span>
                        <button
                          onClick={() => {
                            setEditingThemeId(theme.id);
                            setEditingThemeName(theme.name);
                          }}
                          className="text-slate-500 hover:text-amber-400 p-1"
                          title="Rename theme"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </h3>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDeleteTheme(theme.id)}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Delete theme"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Theme Description */}
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80">
                  {theme.description}
                </p>

                {/* Synthesis Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Methodologies</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {theme.mainMethodologies.map((m, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 text-[10px] font-medium border border-blue-800">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Main Datasets</span>
                    <p className="text-slate-300 text-[11px] font-medium mt-1">{theme.mainDatasets.join(', ')}</p>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Target Outcomes</span>
                    <p className="text-slate-300 text-[11px] font-medium mt-1">{theme.mainOutcomes.join(', ')}</p>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Geographic Spread</span>
                    <p className="text-slate-300 text-[11px] font-medium mt-1">{theme.countries.join(', ')}</p>
                  </div>
                </div>

                {/* Findings & Limitations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-emerald-950/20 border border-emerald-800/30 p-4 rounded-xl space-y-1.5">
                    <span className="font-bold text-emerald-400 uppercase text-[11px] flex items-center space-x-1">
                      <span>Major Synthesized Findings</span>
                    </span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">{theme.majorFindings}</p>
                  </div>

                  <div className="bg-rose-950/20 border border-rose-800/30 p-4 rounded-xl space-y-1.5">
                    <span className="font-bold text-rose-400 uppercase text-[11px] flex items-center space-x-1">
                      <span>Methodological Limitations</span>
                    </span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">{theme.limitations}</p>
                  </div>
                </div>

                {/* Representative Papers */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">Assigned Papers</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {themePapers.map((p) => (
                      <div 
                        key={p.id}
                        className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between text-xs group"
                      >
                        <div className="truncate pr-2">
                          <span className="font-mono text-amber-400 font-bold mr-1.5">{p.customId}</span>
                          <span className="text-slate-200">{p.title}</span>
                        </div>
                        <button
                          onClick={() => {
                            setMovingPaperId(p.id);
                            setTargetThemeId(themes.find(t => t.id !== theme.id)?.id || theme.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:text-amber-400 text-slate-500 transition-opacity"
                          title="Move to another theme"
                        >
                          <MoveHorizontal className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab Content: Research Gaps */}
      {activeTab === 'gaps' && (
        <div className="grid grid-cols-1 gap-4">
          {researchGaps.map((gap) => (
            <div 
              key={gap.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3.5 shadow-lg hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 font-semibold text-[10px] uppercase border border-sky-800">
                    {GAP_DIMENSION_LABELS[gap.dimension]}
                  </span>
                  <h4 className="font-bold text-white text-sm">{gap.gapStatement}</h4>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  gap.confidence === 'High' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                  gap.confidence === 'Moderate' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                  'bg-purple-950 text-purple-300 border border-purple-800'
                }`}>
                  {gap.confidence} Confidence
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1 bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="font-bold text-slate-400 text-[10px] uppercase">Synthesized Empirical Evidence</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{gap.evidence}</p>
                </div>

                <div className="space-y-1 bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="font-bold text-amber-400 text-[10px] uppercase">Recommended Future Research Direction</span>
                  <p className="text-slate-200 text-[11px] leading-relaxed font-medium">{gap.futureDirection}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-[11px] text-slate-400 pt-1">
                <span>Supporting Literature Citations:</span>
                <div className="flex flex-wrap gap-1">
                  {gap.supportingPaperIds.map((pid) => {
                    const p = project.papers.find(paper => paper.id === pid);
                    return (
                      <span key={pid} className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-mono font-semibold">
                        {p?.customId || pid}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Theme Modal */}
      {showAddTheme && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Create New Thematic Cluster</h3>
            <input
              type="text"
              value={newThemeName}
              onChange={(e) => setNewThemeName(e.target.value)}
              placeholder="e.g. Real-Time Autonomous Voyage Optimization"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none"
              autoFocus
            />
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowAddTheme(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTheme}
                className="px-4 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300"
              >
                Create Theme
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Move Paper Modal */}
      {movingPaperId && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl text-xs">
            <h3 className="text-base font-bold text-white">Move Paper to Another Theme</h3>
            <p className="text-slate-300">
              Moving study: <strong className="text-amber-400">{project.papers.find(p => p.id === movingPaperId)?.customId}</strong> - {project.papers.find(p => p.id === movingPaperId)?.title}
            </p>
            <select
              value={targetThemeId}
              onChange={(e) => setTargetThemeId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none"
            >
              {themes.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setMovingPaperId(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleMovePaper}
                className="px-4 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300"
              >
                Confirm Move
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Continue */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <div className="text-xs text-slate-400 flex items-center space-x-1.5">
          <FolderTree className="w-3.5 h-3.5 text-amber-400" />
          <span>Synthesis complete with {themes.length} themes and {researchGaps.length} research gap dimensions.</span>
        </div>

        <button
          onClick={onContinue}
          className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-all shadow-md"
        >
          <span>Continue to Review Draft & PRISMA</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
