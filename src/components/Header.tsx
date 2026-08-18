import React from 'react';
import { StepId, AdditionalView, ProjectData } from '../types';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface HeaderProps {
  currentStep: StepId;
  additionalView: AdditionalView;
  project: ProjectData;
  onNavigateStep: (direction: 'prev' | 'next') => void;
  onResetDemo: () => void;
  saveStatus: string;
}

const STEP_LABELS: Record<StepId, string> = {
  title: '1. Paper Title',
  decomposition: '2. Topic Decomposition',
  taxonomy: '3. Taxonomy & Keywords',
  search: '4. Database Search Strategy',
  import: '5. Literature Import & Deduplication',
  screening: '6. AI-Assisted Abstract Screening',
  themes: '7. Thematic Clustering',
  draft: '8. Review Draft & PRISMA Flow',
  paper: '9. Systematic Review Paper'
};

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  additionalView,
  project,
  onNavigateStep,
  onResetDemo,
  saveStatus
}) => {
  const currentTitle = additionalView 
    ? (additionalView === 'evidence-matrix' ? 'Evidence Matrix' : additionalView === 'analytics' ? 'Project Analytics' : 'Export Center')
    : STEP_LABELS[currentStep];

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-900/90 backdrop-blur px-6 flex items-center justify-between text-slate-200 z-10 shrink-0">
      {/* Breadcrumb and Step Indicator */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <span className="font-medium text-slate-300 truncate max-w-[200px]">{project.name}</span>
          <span>/</span>
          <span className="font-semibold text-amber-400">{currentTitle}</span>
        </div>

        {project.isDemo && (
          <div className="hidden sm:flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[11px] font-medium">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Fictional Demonstration Dataset</span>
          </div>
        )}
      </div>

      {/* Actions and Status */}
      <div className="flex items-center space-x-4 text-xs">
        <div className="hidden md:flex items-center space-x-1.5 text-slate-400 font-mono text-[11px]">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>{saveStatus || 'Auto-saved'}</span>
        </div>

        <div className="flex items-center space-x-2">
          {project.isDemo && (
            <button
              onClick={onResetDemo}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] transition-colors"
            >
              Reset Demo
            </button>
          )}

          {!additionalView && (
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => onNavigateStep('prev')}
                disabled={currentStep === 'title'}
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-300 border border-slate-700 transition-colors"
                title="Previous Step"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigateStep('next')}
                disabled={currentStep === 'paper'}
                className="flex items-center space-x-1 px-3 py-1.5 rounded bg-amber-400 hover:bg-amber-300 disabled:opacity-30 disabled:pointer-events-none text-slate-950 font-semibold transition-colors shadow-sm"
                title="Next Step"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
