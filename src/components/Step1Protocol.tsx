import React, { useState } from 'react';
import { ProjectData, ReviewProtocol, DatabaseSource } from '../types';
import { 
  FileCheck, 
  Plus, 
  Trash2, 
  HelpCircle, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Calendar, 
  Globe, 
  Check, 
  Edit3 
} from 'lucide-react';

interface Step1ProtocolProps {
  project: ProjectData;
  onUpdateProject: (updates: Partial<ProjectData>) => void;
  onContinue: () => void;
}

export const Step1Protocol: React.FC<Step1ProtocolProps> = ({
  project,
  onUpdateProject,
  onContinue
}) => {
  const protocol = project.protocol;
  const [newInclusion, setNewInclusion] = useState('');
  const [newExclusion, setNewExclusion] = useState('');
  const [newRqQuestion, setNewRqQuestion] = useState('');
  const [newRqDimension, setNewRqDimension] = useState('');

  const handleUpdateProtocol = (updates: Partial<ReviewProtocol>) => {
    onUpdateProject({
      protocol: {
        ...protocol,
        ...updates
      }
    });
  };

  const handleAddResearchQuestion = () => {
    if (!newRqQuestion.trim()) return;
    const nextNum = protocol.researchQuestions.length + 1;
    const updated = [
      ...protocol.researchQuestions,
      {
        id: `rq-${Date.now()}`,
        code: `RQ${nextNum}`,
        question: newRqQuestion.trim(),
        targetDimension: newRqDimension.trim() || 'General Synthesis'
      }
    ];
    handleUpdateProtocol({ researchQuestions: updated });
    setNewRqQuestion('');
    setNewRqDimension('');
  };

  const handleRemoveResearchQuestion = (id: string) => {
    const updated = protocol.researchQuestions.filter(rq => rq.id !== id);
    handleUpdateProtocol({ researchQuestions: updated });
  };

  const handleAddInclusion = () => {
    if (!newInclusion.trim()) return;
    handleUpdateProtocol({
      inclusionCriteria: [...protocol.inclusionCriteria, newInclusion.trim()]
    });
    setNewInclusion('');
  };

  const handleRemoveInclusion = (idx: number) => {
    const updated = protocol.inclusionCriteria.filter((_, i) => i !== idx);
    handleUpdateProtocol({ inclusionCriteria: updated });
  };

  const handleAddExclusion = () => {
    if (!newExclusion.trim()) return;
    handleUpdateProtocol({
      exclusionCriteria: [...protocol.exclusionCriteria, newExclusion.trim()]
    });
    setNewExclusion('');
  };

  const handleRemoveExclusion = (idx: number) => {
    const updated = protocol.exclusionCriteria.filter((_, i) => i !== idx);
    handleUpdateProtocol({ exclusionCriteria: updated });
  };

  const toggleDatabase = (db: DatabaseSource) => {
    const exists = protocol.targetDatabases.includes(db);
    const updated = exists 
      ? protocol.targetDatabases.filter(d => d !== db)
      : [...protocol.targetDatabases, db];
    handleUpdateProtocol({ targetDatabases: updated });
  };

  const allDatabases: DatabaseSource[] = [
    'Scopus',
    'Web of Science',
    'Google Scholar',
    'IEEE Xplore',
    'PubMed',
    'Other'
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 px-6 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <FileCheck className="w-4 h-4" />
            <span>Step 1 of 9</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Systematic Review Protocol & RQs
          </h1>
          <p className="text-sm text-slate-400">
            Establish the methodological framework, research questions, inclusion/exclusion boundaries, and target bibliographic sources.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-amber-300">
            Framework: {protocol.methodologicalFramework}
          </span>
        </div>
      </div>

      {/* Protocol Core Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Title & Objectives */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide flex items-center space-x-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Review Title & Scope Formulation</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Full Systematic Review Title
                </label>
                <input
                  type="text"
                  value={protocol.title}
                  onChange={(e) => handleUpdateProtocol({ title: e.target.value })}
                  className="w-full p-3 bg-slate-950 border border-slate-700 rounded-lg text-white font-medium focus:ring-1 focus:ring-amber-400 focus:outline-none"
                  placeholder="e.g., Artificial Intelligence in Climate Adaptation: A PRISMA 2020 Systematic Review"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Primary Research Objective
                </label>
                <textarea
                  value={protocol.primaryObjective}
                  onChange={(e) => handleUpdateProtocol({ primaryObjective: e.target.value })}
                  rows={3}
                  className="w-full p-3 bg-slate-950 border border-slate-700 rounded-lg text-white leading-relaxed focus:ring-1 focus:ring-amber-400 focus:outline-none"
                  placeholder="State the core objective of the systematic evidence synthesis..."
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Detailed Topic Scope & Rationale
                </label>
                <textarea
                  value={protocol.topic}
                  onChange={(e) => handleUpdateProtocol({ topic: e.target.value })}
                  rows={2}
                  className="w-full p-3 bg-slate-950 border border-slate-700 rounded-lg text-white leading-relaxed focus:ring-1 focus:ring-amber-400 focus:outline-none"
                  placeholder="Describe the overarching domain and theoretical problem..."
                />
              </div>
            </div>
          </div>

          {/* Research Questions (RQs) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide flex items-center space-x-2">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>Structured Research Questions ({protocol.researchQuestions.length})</span>
              </h3>
            </div>

            <div className="space-y-3">
              {protocol.researchQuestions.map((rq) => (
                <div 
                  key={rq.id}
                  className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-amber-400 px-2 py-0.5 bg-slate-900 rounded">
                        {rq.code}
                      </span>
                      <span className="text-[11px] text-slate-400 font-semibold">
                        [{rq.targetDimension}]
                      </span>
                    </div>
                    <p className="text-slate-200 font-medium leading-relaxed">
                      {rq.question}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveResearchQuestion(rq.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded transition-colors"
                    title="Remove question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {/* Add RQ */}
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60 space-y-2">
                <input
                  type="text"
                  value={newRqQuestion}
                  onChange={(e) => setNewRqQuestion(e.target.value)}
                  placeholder="Enter new research question (e.g., What are the predictive benchmarks...)"
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newRqDimension}
                    onChange={(e) => setNewRqDimension(e.target.value)}
                    placeholder="Target dimension (e.g. Algorithmic Fidelity)"
                    className="flex-1 p-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                  <button
                    onClick={handleAddResearchQuestion}
                    disabled={!newRqQuestion.trim()}
                    className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs disabled:opacity-50 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add RQ</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Inclusion / Exclusion & Databases */}
        <div className="space-y-6">
          {/* Databases & Timeline */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl text-xs">
            <h3 className="font-bold text-slate-200 uppercase tracking-wide flex items-center space-x-2">
              <Globe className="w-4 h-4 text-sky-400" />
              <span>Target Bibliographic Databases</span>
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {allDatabases.map((db) => {
                const active = protocol.targetDatabases.includes(db);
                return (
                  <button
                    key={db}
                    onClick={() => toggleDatabase(db)}
                    className={`p-2.5 rounded-lg border text-left font-medium text-xs transition-all flex items-center justify-between ${
                      active 
                        ? 'bg-amber-400/10 border-amber-400/50 text-amber-300' 
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span>{db}</span>
                    {active && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-slate-300">
              <span className="flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Publication Years:</span>
              </span>
              <div className="flex items-center space-x-1.5 font-mono">
                <input
                  type="number"
                  value={protocol.dateRangeStart}
                  onChange={(e) => handleUpdateProtocol({ dateRangeStart: parseInt(e.target.value) || 2020 })}
                  className="w-16 p-1 bg-slate-950 border border-slate-700 rounded text-center text-white"
                />
                <span>to</span>
                <input
                  type="number"
                  value={protocol.dateRangeEnd}
                  onChange={(e) => handleUpdateProtocol({ dateRangeEnd: parseInt(e.target.value) || 2024 })}
                  className="w-16 p-1 bg-slate-950 border border-slate-700 rounded text-center text-white"
                />
              </div>
            </div>
          </div>

          {/* Inclusion Criteria */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 shadow-xl text-xs">
            <h3 className="font-bold text-emerald-400 uppercase tracking-wide flex items-center space-x-2">
              <Check className="w-4 h-4" />
              <span>Inclusion Criteria ({protocol.inclusionCriteria.length})</span>
            </h3>

            <div className="space-y-2">
              {protocol.inclusionCriteria.map((crit, idx) => (
                <div key={idx} className="p-2.5 bg-slate-950 rounded-lg border border-emerald-900/30 flex items-start justify-between gap-2">
                  <span className="text-slate-200 leading-snug">✓ {crit}</span>
                  <button onClick={() => handleRemoveInclusion(idx)} className="text-slate-500 hover:text-rose-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={newInclusion}
                  onChange={(e) => setNewInclusion(e.target.value)}
                  placeholder="Add inclusion criterion..."
                  className="flex-1 p-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs placeholder-slate-500"
                />
                <button
                  onClick={handleAddInclusion}
                  disabled={!newInclusion.trim()}
                  className="px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg disabled:opacity-50"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Exclusion Criteria */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 shadow-xl text-xs">
            <h3 className="font-bold text-rose-400 uppercase tracking-wide flex items-center space-x-2">
              <Trash2 className="w-4 h-4" />
              <span>Exclusion Criteria ({protocol.exclusionCriteria.length})</span>
            </h3>

            <div className="space-y-2">
              {protocol.exclusionCriteria.map((crit, idx) => (
                <div key={idx} className="p-2.5 bg-slate-950 rounded-lg border border-rose-900/30 flex items-start justify-between gap-2">
                  <span className="text-slate-200 leading-snug">✕ {crit}</span>
                  <button onClick={() => handleRemoveExclusion(idx)} className="text-slate-500 hover:text-rose-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={newExclusion}
                  onChange={(e) => setNewExclusion(e.target.value)}
                  placeholder="Add exclusion criterion..."
                  className="flex-1 p-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs placeholder-slate-500"
                />
                <button
                  onClick={handleAddExclusion}
                  disabled={!newExclusion.trim()}
                  className="px-3 py-2 bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold rounded-lg disabled:opacity-50"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Continue Action */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <span className="text-xs text-slate-400">
          Protocol is saved and aligned with PRISMA 2020 Item 1-5 recommendations.
        </span>

        <button
          onClick={onContinue}
          className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-all shadow-md"
        >
          <span>Continue to Step 2: Search String Engineering</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
