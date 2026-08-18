import React from 'react';
import { 
  StepId, 
  AdditionalView, 
  ProjectData, 
  StepStatus 
} from '../types';
import { 
  FileText, 
  Layers, 
  Tag, 
  Search, 
  FileCheck, 
  CheckSquare, 
  FolderTree, 
  GitPullRequest, 
  BookOpen, 
  Table, 
  BarChart3, 
  Download, 
  PlusCircle, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  currentStep: StepId;
  additionalView: AdditionalView;
  onSelectStep: (step: StepId) => void;
  onSelectAdditionalView: (view: AdditionalView) => void;
  project: ProjectData;
  onNewProject: () => void;
  onLoadDemo: () => void;
}

const WORKFLOW_STEPS: { id: StepId; number: number; label: string; icon: React.ElementType }[] = [
  { id: 'title', number: 1, label: 'Paper Title', icon: FileText },
  { id: 'decomposition', number: 2, label: 'Topic Decomposition', icon: Layers },
  { id: 'taxonomy', number: 3, label: 'Taxonomy & Keywords', icon: Tag },
  { id: 'search', number: 4, label: 'Search Strategy', icon: Search },
  { id: 'import', number: 5, label: 'Import & Deduplication', icon: FileCheck },
  { id: 'screening', number: 6, label: 'AI Abstract Screening', icon: CheckSquare },
  { id: 'themes', number: 7, label: 'Thematic Clustering', icon: FolderTree },
  { id: 'draft', number: 8, label: 'Review Draft & PRISMA', icon: GitPullRequest },
  { id: 'paper', number: 9, label: 'Review Paper', icon: BookOpen },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentStep,
  additionalView,
  onSelectStep,
  onSelectAdditionalView,
  project,
  onNewProject,
  onLoadDemo
}) => {
  // Helper to determine completion status of each step
  const getStepStatus = (stepId: StepId): StepStatus => {
    switch (stepId) {
      case 'title':
        return project.title ? 'completed' : 'in_progress';
      case 'decomposition':
        return project.decomposition && project.decomposition.problemStatement ? 'completed' : (project.title ? 'in_progress' : 'not_started');
      case 'taxonomy':
        return project.taxonomy && project.taxonomy.length > 0 ? 'completed' : 'not_started';
      case 'search':
        return project.searchStrategy && project.searchStrategy.scopusQuery ? 'completed' : 'not_started';
      case 'import':
        return project.papers && project.papers.length > 0 ? 'completed' : 'not_started';
      case 'screening': {
        const screenedCount = Object.keys(project.screenings || {}).length;
        if (screenedCount === 0) return 'not_started';
        const totalUnique = project.papers.filter(p => !p.isDuplicateOf).length;
        return screenedCount >= totalUnique && totalUnique > 0 ? 'completed' : 'in_progress';
      }
      case 'themes':
        return project.themes && project.themes.length > 0 ? 'completed' : 'not_started';
      case 'draft':
        return project.reviewDraftSections && project.reviewDraftSections.length > 0 ? 'completed' : 'not_started';
      case 'paper':
        return project.reviewPaper && project.reviewPaper.sections.length > 0 ? 'completed' : 'not_started';
      default:
        return 'not_started';
    }
  };

  const renderStatusIcon = (status: StepStatus) => {
    switch (status) {
      case 'completed':
        return <span className="text-emerald-400 font-bold text-xs">✓</span>;
      case 'in_progress':
        return <span className="text-amber-400 font-bold text-xs">◐</span>;
      case 'not_started':
      default:
        return <span className="text-slate-500 text-xs">○</span>;
    }
  };

  return (
    <aside className="w-64 bg-[#0A1128] text-slate-200 flex flex-col h-screen border-r border-slate-800 select-none shrink-0">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center text-slate-950 font-black text-lg shadow-sm">
            S
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold tracking-tight text-white text-base">Scholar<span className="text-amber-400">Pen</span></span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">Evidence Synthesis</p>
          </div>
        </div>
      </div>

      {/* Workspace Section */}
      <div className="px-4 py-3 border-b border-slate-800/60 bg-slate-900/40">
        <div className="flex items-center justify-between text-[11px] font-semibold tracking-wider text-slate-400 uppercase mb-2">
          <span>Workspace</span>
          {project.isDemo && (
            <span className="bg-amber-400/20 text-amber-300 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold">
              DEMO
            </span>
          )}
        </div>
        
        <div className="text-xs font-medium text-slate-200 truncate bg-slate-800/60 px-2.5 py-1.5 rounded border border-slate-700/50 mb-2">
          {project.name || 'Untitled Project'}
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={onNewProject}
            className="flex items-center justify-center space-x-1 py-1 px-2 rounded text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700/60"
            title="Create a new systematic review project"
          >
            <PlusCircle className="w-3 h-3 text-slate-400" />
            <span>New</span>
          </button>
          <button
            onClick={onLoadDemo}
            className="flex items-center justify-center space-x-1 py-1 px-2 rounded text-[11px] font-medium bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 transition-colors border border-amber-400/30"
            title="Load full maritime CO2 demo review"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Demo Data</span>
          </button>
        </div>
      </div>

      {/* Numbered Workflow Navigation */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5 scrollbar-thin scrollbar-thumb-slate-800">
        <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Review Workflow
        </div>

        {WORKFLOW_STEPS.map((step) => {
          const isSelected = additionalView === null && currentStep === step.id;
          const status = getStepStatus(step.id);
          const Icon = step.icon;

          return (
            <button
              key={step.id}
              onClick={() => {
                onSelectAdditionalView(null);
                onSelectStep(step.id);
              }}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium transition-all group ${
                isSelected
                  ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5 truncate">
                <div className="w-4 text-center">
                  {renderStatusIcon(status)}
                </div>
                <span className={`w-4 text-center font-mono text-[11px] ${isSelected ? 'text-slate-900 font-bold' : 'text-slate-400 group-hover:text-slate-300'}`}>
                  {step.number}
                </span>
                <span className="truncate">{step.label}</span>
              </div>
              <Icon className={`w-3.5 h-3.5 shrink-0 ml-1 ${isSelected ? 'text-slate-950' : 'text-slate-500 group-hover:text-slate-400'}`} />
            </button>
          );
        })}

        {/* Additional Project Tools */}
        <div className="pt-4 px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Synthesis & Tools
        </div>

        <button
          onClick={() => onSelectAdditionalView('evidence-matrix')}
          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium transition-all group ${
            additionalView === 'evidence-matrix'
              ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
              : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
          }`}
        >
          <div className="flex items-center space-x-2.5 truncate">
            <Table className={`w-4 h-4 ${additionalView === 'evidence-matrix' ? 'text-slate-950' : 'text-amber-400'}`} />
            <span className="truncate">Evidence Matrix</span>
          </div>
          <ChevronRight className={`w-3 h-3 ${additionalView === 'evidence-matrix' ? 'text-slate-950' : 'text-slate-600'}`} />
        </button>

        <button
          onClick={() => onSelectAdditionalView('analytics')}
          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium transition-all group ${
            additionalView === 'analytics'
              ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
              : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
          }`}
        >
          <div className="flex items-center space-x-2.5 truncate">
            <BarChart3 className={`w-4 h-4 ${additionalView === 'analytics' ? 'text-slate-950' : 'text-sky-400'}`} />
            <span className="truncate">Project Analytics</span>
          </div>
          <ChevronRight className={`w-3 h-3 ${additionalView === 'analytics' ? 'text-slate-950' : 'text-slate-600'}`} />
        </button>

        <button
          onClick={() => onSelectAdditionalView('export')}
          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium transition-all group ${
            additionalView === 'export'
              ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
              : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
          }`}
        >
          <div className="flex items-center space-x-2.5 truncate">
            <Download className={`w-4 h-4 ${additionalView === 'export' ? 'text-slate-950' : 'text-emerald-400'}`} />
            <span className="truncate">Export Center</span>
          </div>
          <ChevronRight className={`w-3 h-3 ${additionalView === 'export' ? 'text-slate-950' : 'text-slate-600'}`} />
        </button>
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/50 text-[11px] text-slate-400 flex items-center justify-between">
        <span className="truncate">ScholarPen v2.4</span>
        <span className="text-[10px] text-emerald-400 flex items-center space-x-1 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Online</span>
        </span>
      </div>
    </aside>
  );
};
