import React, { useState } from 'react';
import { ProjectData } from '../types';
import { ArrowRight, Sparkles, HelpCircle, BookOpen, Lightbulb } from 'lucide-react';

interface Step1TitleProps {
  project: ProjectData;
  onUpdateProject: (updates: Partial<ProjectData>) => void;
  onContinue: () => void;
}

const SAMPLE_TOPICS = [
  'Artificial Intelligence for Maritime CO₂ Emission Prediction and Decarbonization',
  'Deep Learning Approaches for Clinical Early Sepsis Detection in Intensive Care',
  'Reinforcement Learning for Smart Grid Renewable Energy Dispatch and Battery Storage',
  'Physics-Informed Neural Networks for High-Speed Rail Aerodynamic Drag Optimization'
];

export const Step1Title: React.FC<Step1TitleProps> = ({
  project,
  onUpdateProject,
  onContinue
}) => {
  const [title, setTitle] = useState(project.title || '');
  const [initialTopic, setInitialTopic] = useState(project.initialTopic || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onUpdateProject({
      title: title.trim(),
      initialTopic: initialTopic.trim() || title.trim(),
      name: title.trim().slice(0, 45) + (title.length > 45 ? '...' : '')
    });
    onContinue();
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-6 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
          <BookOpen className="w-4 h-4" />
          <span>Step 1 of 9</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Paper Title & Initial Research Topic
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
          Enter your initial research topic or working title. ScholarPen will use this to develop the research scope, topic decomposition, and taxonomy.
        </p>
      </div>

      {/* Main Card */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-200">
            Paper Title / Initial Research Topic <span className="text-amber-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. AI for Maritime CO₂ Emission Prediction and Mitigation: A Systematic Review"
            className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm font-medium transition-all"
            required
          />
          <p className="text-xs text-slate-400 flex items-center space-x-1 pt-1">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>The user does not need to provide a perfect final title. ScholarPen refines this in later steps.</span>
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-200">
            Detailed Research Scope or Research Question <span className="text-xs font-normal text-slate-400">(Optional)</span>
          </label>
          <textarea
            value={initialTopic}
            onChange={(e) => setInitialTopic(e.target.value)}
            rows={4}
            placeholder="Describe specific problem context, target technologies, methodologies, or outcomes to guide AI decomposition..."
            className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm transition-all"
          />
        </div>

        {/* Quick Topic Ideas */}
        <div className="pt-2 border-t border-slate-800 space-y-2.5">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-300">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Example Working Titles:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SAMPLE_TOPICS.map((topic, i) => (
              <button
                type="button"
                key={i}
                onClick={() => {
                  setTitle(topic);
                  setInitialTopic(topic);
                }}
                className="text-left p-2.5 rounded-lg bg-slate-950/80 hover:bg-slate-800 text-slate-300 text-xs border border-slate-800 hover:border-amber-400/40 transition-all truncate"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={!title.trim()}
            className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:pointer-events-none text-slate-950 font-bold text-sm transition-all shadow-md hover:shadow-amber-400/20"
          >
            <span>Continue to Topic Decomposition</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
