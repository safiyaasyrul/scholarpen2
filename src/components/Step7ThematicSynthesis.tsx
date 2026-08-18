import React, { useState } from 'react';
import { 
  ProjectData, 
  ThematicCluster, 
  ResearchGapDimension 
} from '../types';
import { 
  synthesizeThematicClusters, 
  synthesizeResearchGaps, 
  runFullCorpusSynthesis 
} from '../utils/synthesisEngine';
import { 
  Network, 
  Sparkles, 
  Plus, 
  Trash2, 
  Check, 
  ArrowRight, 
  Layers, 
  AlertCircle, 
  HelpCircle,
  Edit3,
  RefreshCw
} from 'lucide-react';

interface Step7ThematicSynthesisProps {
  project: ProjectData;
  onUpdateProject: (updates: Partial<ProjectData>) => void;
  onContinue: () => void;
}

export const Step7ThematicSynthesis: React.FC<Step7ThematicSynthesisProps> = ({
  project,
  onUpdateProject,
  onContinue
}) => {
  const [themes, setThemes] = useState<ThematicCluster[]>(project.themes || []);
  const [researchGaps, setResearchGaps] = useState<ResearchGapDimension[]>(project.researchGaps || []);

  // New theme state
  const [showAddTheme, setShowAddTheme] = useState(false);
  const [themeName, setThemeName] = useState('');
  const [themeDesc, setThemeDesc] = useState('');
  const [themeColor, setThemeColor] = useState('#f59e0b');

  // New gap state
  const [showAddGap, setShowAddGap] = useState(false);
  const [gapTitle, setGapTitle] = useState('');
  const [gapType, setGapType] = useState<'Methodological' | 'Empirical' | 'Theoretical' | 'Population / Geographic' | 'Technological'>('Methodological');
  const [gapDesc, setGapDesc] = useState('');

  const handleAddTheme = () => {
    if (!themeName.trim()) return;
    const nextIdx = themes.length + 1;
    const newCluster: ThematicCluster = {
      id: `theme-${Date.now()}`,
      name: themeName.trim(),
      code: `TH-0${nextIdx}`,
      color: themeColor,
      description: themeDesc.trim() || 'Synthesized thematic cluster of computational paradigms.',
      paperIds: project.papers.slice(0, 3).map(p => p.id),
      keyThemes: ['Computational Paradigm', 'Empirical Validation'],
      synthesizedTakeaway: 'Synthesized evidence indicates positive predictive gains with emerging operational considerations.'
    };
    const updated = [...themes, newCluster];
    setThemes(updated);
    onUpdateProject({ themes: updated });
    setThemeName('');
    setThemeDesc('');
    setShowAddTheme(false);
  };

  const handleRemoveTheme = (id: string) => {
    const updated = themes.filter(t => t.id !== id);
    setThemes(updated);
    onUpdateProject({ themes: updated });
  };

  const handleAddGap = () => {
    if (!gapTitle.trim()) return;
    const nextIdx = researchGaps.length + 1;
    const newGap: ResearchGapDimension = {
      id: `gap-${Date.now()}`,
      code: `GAP-0${nextIdx}`,
      title: gapTitle.trim(),
      type: gapType,
      description: gapDesc.trim() || 'Identified critical frontier requiring targeted methodological attention.',
      severity: 'Critical',
      supportingPaperIds: project.papers.slice(0, 2).map(p => p.id),
      proposedFutureAgenda: ['Develop cross-domain benchmark datasets', 'Establish standardized reporting guidelines']
    };
    const updated = [...researchGaps, newGap];
    setResearchGaps(updated);
    onUpdateProject({ researchGaps: updated });
    setGapTitle('');
    setGapDesc('');
    setShowAddGap(false);
  };

  const handleRemoveGap = (id: string) => {
    const updated = researchGaps.filter(g => g.id !== id);
    setResearchGaps(updated);
    onUpdateProject({ researchGaps: updated });
  };

  const handleAutoSynthesizeClusters = () => {
    const newThemes = synthesizeThematicClusters(project.papers);
    const newGaps = synthesizeResearchGaps(project.papers);
    setThemes(newThemes);
    setResearchGaps(newGaps);

    const synthesized = runFullCorpusSynthesis({
      ...project,
      themes: newThemes,
      researchGaps: newGaps
    });
    onUpdateProject(synthesized);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-6 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <Network className="w-4 h-4" />
            <span>Step 7 of 9</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Thematic Clustering & Research Gaps
          </h1>
          <p className="text-sm text-slate-400">
            Synthesize extracted evidence into higher-order thematic clusters and formulate structured research gap agendas.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleAutoSynthesizeClusters}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-sm"
            title="Auto-cluster all uploaded papers and formulate gap dimensions"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Re-Synthesize All Ingested Papers ({project.papers.filter(p => !p.isDuplicate).length})</span>
          </button>

          <button
            onClick={() => setShowAddTheme(true)}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>Add Cluster</span>
          </button>

          <button
            onClick={() => setShowAddGap(true)}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Gap</span>
          </button>
        </div>
      </div>

      {/* Thematic Clusters Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide flex items-center space-x-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Thematic Synthesized Clusters ({themes.length})</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">Qualitative Synthesis</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {themes.map((theme) => (
            <div 
              key={theme.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl relative overflow-hidden"
            >
              <div 
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: theme.color }}
              />

              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span 
                      className="font-mono text-xs font-bold px-2 py-0.5 rounded text-slate-950"
                      style={{ backgroundColor: theme.color }}
                    >
                      {theme.code}
                    </span>
                    <h4 className="font-bold text-white text-sm">{theme.name}</h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{theme.description}</p>
                </div>

                <button
                  onClick={() => handleRemoveTheme(theme.id)}
                  className="text-slate-500 hover:text-rose-400 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Synthesized Takeaway Box */}
              <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1 text-xs">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  Synthesized Evidence Takeaway
                </span>
                <p className="text-slate-300 leading-relaxed">{theme.synthesizedTakeaway}</p>
              </div>

              {/* Key Themes tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {theme.keyThemes.map((tag, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Linked Studies count */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Associated Studies: <strong className="text-amber-300 font-mono">{theme.paperIds.length}</strong></span>
                <div className="flex items-center space-x-1 font-mono text-[10px] text-amber-400/80">
                  {theme.paperIds.map(pid => {
                    const p = project.papers.find(x => x.id === pid);
                    return p ? <span key={pid} className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800">{p.customId}</span> : null;
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Research Gaps Section */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>Identified Research Gaps & Future Directions ({researchGaps.length})</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">Frontier Agenda</span>
        </div>

        <div className="space-y-4">
          {researchGaps.map((gap) => (
            <div 
              key={gap.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 shadow-xl text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-rose-400 px-2 py-0.5 bg-rose-950/60 rounded border border-rose-800">
                    {gap.code}
                  </span>
                  <span className="font-semibold text-[11px] px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                    {gap.type}
                  </span>
                  <h4 className="font-bold text-white text-sm">{gap.title}</h4>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-bold text-[10px] border border-amber-800">
                    {gap.severity} Severity
                  </span>
                  <button
                    onClick={() => handleRemoveGap(gap.id)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
                {gap.description}
              </p>

              {/* Proposed Agenda */}
              {gap.proposedFutureAgenda && gap.proposedFutureAgenda.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                    Strategic Research Agenda & Next Steps:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {gap.proposedFutureAgenda.map((agenda, i) => (
                      <div key={i} className="p-2 bg-slate-950/80 rounded border border-slate-800/80 text-[11px] text-slate-300 flex items-start space-x-1.5">
                        <span className="text-amber-400 font-bold">→</span>
                        <span>{agenda}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Theme Modal */}
      {showAddTheme && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-lg w-full space-y-4 shadow-2xl text-xs">
            <h3 className="text-base font-bold text-white">Create Thematic Cluster</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Theme Name</label>
                <input
                  type="text"
                  value={themeName}
                  onChange={(e) => setThemeName(e.target.value)}
                  placeholder="e.g. Physics-Informed Neural Surrogates"
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Cluster Description</label>
                <textarea
                  value={themeDesc}
                  onChange={(e) => setThemeDesc(e.target.value)}
                  rows={3}
                  placeholder="Describe the overarching computational concepts grouped in this cluster..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Theme Accent Color</label>
                <div className="flex items-center space-x-2">
                  {['#f59e0b', '#06b6d4', '#10b981', '#8b5cf6', '#ec4899', '#3b82f6'].map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setThemeColor(col)}
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${
                        themeColor === col ? 'scale-125 border-white' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowAddTheme(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTheme}
                disabled={!themeName.trim()}
                className="px-4 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-bold hover:bg-amber-300 disabled:opacity-50"
              >
                Create Cluster
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Gap Modal */}
      {showAddGap && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-lg w-full space-y-4 shadow-2xl text-xs">
            <h3 className="text-base font-bold text-white">Add Structured Research Gap</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Research Gap Title</label>
                <input
                  type="text"
                  value={gapTitle}
                  onChange={(e) => setGapTitle(e.target.value)}
                  placeholder="e.g. Real-Time Edge-AI Hardware Deployment"
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Gap Dimension Category</label>
                <select
                  value={gapType}
                  onChange={(e) => setGapType(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                >
                  <option value="Methodological">Methodological</option>
                  <option value="Empirical">Empirical</option>
                  <option value="Theoretical">Theoretical</option>
                  <option value="Population / Geographic">Population / Geographic</option>
                  <option value="Technological">Technological</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Detailed Gap Description</label>
                <textarea
                  value={gapDesc}
                  onChange={(e) => setGapDesc(e.target.value)}
                  rows={3}
                  placeholder="Describe why current literature fails to address this dimension..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white leading-relaxed"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowAddGap(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddGap}
                disabled={!gapTitle.trim()}
                className="px-4 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-bold hover:bg-amber-300 disabled:opacity-50"
              >
                Register Gap
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Continue */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <span className="text-xs text-slate-400">
          Thematic synthesis mapped across {themes.length} clusters and {researchGaps.length} gap dimensions.
        </span>

        <button
          onClick={onContinue}
          className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-all shadow-md"
        >
          <span>Continue to Step 8: Blueprint & PRISMA Flow</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
