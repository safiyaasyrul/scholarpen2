import React, { useState } from 'react';
import { ProjectData, TopicDecomposition } from '../types';
import { 
  Sparkles, 
  Edit3, 
  Check, 
  RotateCw, 
  ArrowRight, 
  Layers, 
  HelpCircle,
  Plus,
  Trash2
} from 'lucide-react';

interface Step2DecompositionProps {
  project: ProjectData;
  onUpdateProject: (updates: Partial<ProjectData>) => void;
  onContinue: () => void;
}

export const Step2Decomposition: React.FC<Step2DecompositionProps> = ({
  project,
  onUpdateProject,
  onContinue
}) => {
  const [decomposition, setDecomposition] = useState<TopicDecomposition>(
    project.decomposition || {
      fieldOfStudy: '',
      problemStatement: '',
      contextSetting: '',
      populationObject: '',
      phenomenonOutcome: '',
      technologyMethod: '',
      geographicScope: '',
      temporalScope: '',
      keyConcepts: []
    }
  );

  const [loading, setLoading] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [newConcept, setNewConcept] = useState('');

  const handleRegenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/decompose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: project.title,
          scope: project.initialTopic
        })
      });
      const data = await res.json();
      if (data.decomposition) {
        setDecomposition(data.decomposition);
        onUpdateProject({ decomposition: data.decomposition });
      }
    } catch (e) {
      console.error('Error decomposing topic:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field: keyof TopicDecomposition, value: any) => {
    const updated = { ...decomposition, [field]: value };
    setDecomposition(updated);
  };

  const handleSaveAndContinue = () => {
    onUpdateProject({ decomposition });
    onContinue();
  };

  const addConcept = () => {
    if (!newConcept.trim()) return;
    const updated = {
      ...decomposition,
      keyConcepts: [...(decomposition.keyConcepts || []), newConcept.trim()]
    };
    setDecomposition(updated);
    setNewConcept('');
  };

  const removeConcept = (idx: number) => {
    const updated = {
      ...decomposition,
      keyConcepts: decomposition.keyConcepts.filter((_, i) => i !== idx)
    };
    setDecomposition(updated);
  };

  const DIMENSIONS: { key: keyof TopicDecomposition; label: string; placeholder: string; desc: string }[] = [
    { key: 'fieldOfStudy', label: 'Field of Study', placeholder: 'e.g. Maritime Informatics & Applied AI', desc: 'Primary academic discipline and sub-fields.' },
    { key: 'problemStatement', label: 'Problem Statement', placeholder: 'e.g. High non-linear operational uncertainties in estimating fuel burn...', desc: 'Core research bottleneck or theoretical motivation.' },
    { key: 'contextSetting', label: 'Context / Setting', placeholder: 'e.g. International commercial shipping corridors & smart ports', desc: 'Operational, environmental, or regulatory domain.' },
    { key: 'populationObject', label: 'Population / Object of Study', placeholder: 'e.g. Container ships, bulk carriers, IoT sensor telemetry', desc: 'Target physical entities, systems, datasets, or cohorts.' },
    { key: 'phenomenonOutcome', label: 'Phenomenon / Outcome', placeholder: 'e.g. CO2 emission rate, fuel consumption, CII ratings', desc: 'Dependent variables, metrics, and target effects.' },
    { key: 'technologyMethod', label: 'Technology / Method', placeholder: 'e.g. Deep learning (CNN-LSTM), PINNs, gradient boosting', desc: 'Algorithmic, computational, or empirical paradigms.' },
    { key: 'geographicScope', label: 'Geographic Scope', placeholder: 'e.g. Global shipping lanes, North Sea, Singapore Strait', desc: 'Spatial boundaries or regional case studies.' },
    { key: 'temporalScope', label: 'Temporal Scope', placeholder: 'e.g. 2018–2026 operational telemetry', desc: 'Historical, modern, or projected timeline.' }
  ];

  return (
    <div className="max-w-5xl mx-auto py-8 px-6 space-y-8 animate-fadeIn">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <Layers className="w-4 h-4" />
            <span>Step 2 of 9</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Topic Decomposition Agent
          </h1>
          <p className="text-sm text-slate-400">
            ScholarPen decomposes your paper title into 8 structured academic dimensions to ensure strict research scope integrity.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleRegenerate}
            disabled={loading}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 border border-slate-700 text-xs font-medium transition-all"
          >
            <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            <span>{loading ? 'Decomposing...' : 'Regenerate'}</span>
          </button>
        </div>
      </div>

      {/* Active Working Title Pill */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
        <div className="space-y-0.5 truncate pr-4">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Working Paper Title</span>
          <p className="text-sm font-semibold text-slate-200 truncate">{project.title || 'Untitled Review'}</p>
        </div>
      </div>

      {/* Grid of 8 Academic Dimensions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DIMENSIONS.map((dim) => {
          const val = (decomposition[dim.key] as string) || '';
          const isEditing = editingField === dim.key;

          return (
            <div 
              key={dim.key}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2.5 transition-all hover:border-slate-700/80 flex flex-col justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                    {dim.label}
                  </span>
                  <button
                    onClick={() => setEditingField(isEditing ? null : (dim.key as string))}
                    className="text-slate-400 hover:text-amber-400 p-1 rounded transition-colors"
                    title={isEditing ? 'Finish editing' : 'Edit field'}
                  >
                    {isEditing ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Edit3 className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">{dim.desc}</p>
              </div>

              {isEditing ? (
                <textarea
                  value={val}
                  onChange={(e) => handleFieldChange(dim.key, e.target.value)}
                  rows={3}
                  placeholder={dim.placeholder}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-md text-white text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none"
                  autoFocus
                />
              ) : (
                <div className="text-xs text-slate-200 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 min-h-[54px] leading-relaxed">
                  {val || <span className="text-slate-500 italic">Not explicitly specified.</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Key Research Concepts */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-200">Key Research Concepts</h3>
            <p className="text-xs text-slate-400">Core pillars used to structure the taxonomy and keyword expansion matrix.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {decomposition.keyConcepts?.map((concept, idx) => (
            <div
              key={idx}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-950 border border-slate-800 text-amber-300 text-xs font-medium"
            >
              <span>{concept}</span>
              <button
                onClick={() => removeConcept(idx)}
                className="text-slate-400 hover:text-rose-400 ml-1"
                title="Remove concept"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-2 pt-2 max-w-md">
          <input
            type="text"
            value={newConcept}
            onChange={(e) => setNewConcept(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addConcept()}
            placeholder="Add custom research concept..."
            className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
          <button
            onClick={addConcept}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <div className="text-xs text-slate-400 flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>All 8 dimensions are saved into your project state.</span>
        </div>

        <button
          onClick={handleSaveAndContinue}
          className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-all shadow-md"
        >
          <span>Save & Continue to Taxonomy</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
