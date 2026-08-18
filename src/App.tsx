import React, { useState, useEffect } from 'react';
import { ProjectData, NavigationTab } from './types';
import { INITIAL_PROJECT } from './utils/initialData';
import { Step1Protocol } from './components/Step1Protocol';
import { Step2SearchStrings } from './components/Step2SearchStrings';
import { Step3Deduplication } from './components/Step3Deduplication';
import { Step4Screening } from './components/Step4Screening';
import { Step5QualityAssessment } from './components/Step5QualityAssessment';
import { Step6DataExtraction } from './components/Step6DataExtraction';
import { Step7ThematicSynthesis } from './components/Step7ThematicSynthesis';
import { Step8ReviewDraft } from './components/Step8ReviewDraft';
import { Step9ReviewPaper } from './components/Step9ReviewPaper';
import { EvidenceMatrixView } from './components/EvidenceMatrixView';
import { AnalyticsView } from './components/AnalyticsView';
import { PrismaFlowView } from './components/PrismaFlowView';
import { PrismaChecklistView } from './components/PrismaChecklistView';
import { 
  Layers, 
  Table, 
  BarChart3, 
  GitPullRequest, 
  FileText, 
  CheckCircle2, 
  CheckSquare,
  Sparkles, 
  RotateCcw, 
  Download, 
  Upload, 
  HelpCircle,
  BookOpen,
  Award,
  ChevronRight,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { 
  exportManuscriptMarkdown, 
  exportEvidenceMatrixCSV,
  exportPrismaChecklistCSV,
  exportPrismaChecklistMarkdown 
} from './utils/exportUtils';
import { 
  saveProjectState, 
  loadProjectStateSync, 
  loadProjectFromIndexedDB, 
  clearProjectStorage 
} from './utils/storage';

function sanitizeProjectData(raw: any): ProjectData {
  if (!raw || typeof raw !== 'object') return INITIAL_PROJECT;

  return {
    ...INITIAL_PROJECT,
    ...raw,
    protocol: {
      ...INITIAL_PROJECT.protocol,
      ...(raw.protocol || {}),
      researchQuestions: Array.isArray(raw.protocol?.researchQuestions)
        ? raw.protocol.researchQuestions
        : INITIAL_PROJECT.protocol.researchQuestions,
      inclusionCriteria: Array.isArray(raw.protocol?.inclusionCriteria)
        ? raw.protocol.inclusionCriteria
        : INITIAL_PROJECT.protocol.inclusionCriteria,
      exclusionCriteria: Array.isArray(raw.protocol?.exclusionCriteria)
        ? raw.protocol.exclusionCriteria
        : INITIAL_PROJECT.protocol.exclusionCriteria,
      targetDatabases: Array.isArray(raw.protocol?.targetDatabases)
        ? raw.protocol.targetDatabases
        : INITIAL_PROJECT.protocol.targetDatabases,
      languageRequirements: Array.isArray(raw.protocol?.languageRequirements)
        ? raw.protocol.languageRequirements
        : INITIAL_PROJECT.protocol.languageRequirements,
    },
    prismaCounts: {
      ...INITIAL_PROJECT.prismaCounts,
      ...(raw.prismaCounts || {})
    },
    prismaChecklist: Array.isArray(raw.prismaChecklist) && raw.prismaChecklist.length > 0
      ? raw.prismaChecklist
      : INITIAL_PROJECT.prismaChecklist,
    searchStrings: Array.isArray(raw.searchStrings) ? raw.searchStrings : INITIAL_PROJECT.searchStrings,
    papers: Array.isArray(raw.papers) && raw.papers.length > 0
      ? raw.papers.map((p: any, idx: number) => ({
          ...p,
          id: p.id || `p-${idx}`,
          customId: p.customId || `SP${String(idx + 1).padStart(3, '0')}`,
          title: p.title || 'Untitled Study',
          authors: Array.isArray(p.authors) ? p.authors : ['Unknown Author'],
          year: typeof p.year === 'number' ? p.year : 2023,
          journal: p.journal || 'Academic Source',
          abstract: p.abstract || '',
          keywords: Array.isArray(p.keywords) ? p.keywords : [],
          sourceDatabase: p.sourceDatabase || 'Scopus',
          citationCount: typeof p.citationCount === 'number' ? p.citationCount : 0,
          fullTextAvailable: typeof p.fullTextAvailable === 'boolean' ? p.fullTextAvailable : true,
          publicationType: p.publicationType || 'Journal Article'
        }))
      : INITIAL_PROJECT.papers,
    screenings: typeof raw.screenings === 'object' && raw.screenings !== null
      ? raw.screenings
      : INITIAL_PROJECT.screenings,
    qualityAssessments: typeof raw.qualityAssessments === 'object' && raw.qualityAssessments !== null
      ? raw.qualityAssessments
      : INITIAL_PROJECT.qualityAssessments,
    evidenceExtractions: typeof raw.evidenceExtractions === 'object' && raw.evidenceExtractions !== null
      ? raw.evidenceExtractions
      : INITIAL_PROJECT.evidenceExtractions,
    themes: Array.isArray(raw.themes) ? raw.themes : INITIAL_PROJECT.themes,
    researchGaps: Array.isArray(raw.researchGaps) ? raw.researchGaps : INITIAL_PROJECT.researchGaps,
    reviewDraftSections: Array.isArray(raw.reviewDraftSections) ? raw.reviewDraftSections : INITIAL_PROJECT.reviewDraftSections,
    reviewPaper: {
      ...INITIAL_PROJECT.reviewPaper,
      ...(raw.reviewPaper || {}),
      authors: Array.isArray(raw.reviewPaper?.authors) ? raw.reviewPaper.authors : INITIAL_PROJECT.reviewPaper.authors,
      affiliations: Array.isArray(raw.reviewPaper?.affiliations) ? raw.reviewPaper.affiliations : INITIAL_PROJECT.reviewPaper.affiliations,
      keywords: Array.isArray(raw.reviewPaper?.keywords) ? raw.reviewPaper.keywords : INITIAL_PROJECT.reviewPaper.keywords,
      sections: Array.isArray(raw.reviewPaper?.sections) ? raw.reviewPaper.sections : INITIAL_PROJECT.reviewPaper.sections,
      references: Array.isArray(raw.reviewPaper?.references) ? raw.reviewPaper.references : INITIAL_PROJECT.reviewPaper.references,
    },
    supportedClaims: Array.isArray(raw.supportedClaims) ? raw.supportedClaims : INITIAL_PROJECT.supportedClaims,
  };
}

export function App() {
  const [project, setProject] = useState<ProjectData>(() => {
    const saved = loadProjectStateSync();
    if (saved) {
      return sanitizeProjectData(saved);
    }
    return INITIAL_PROJECT;
  });

  // Hydrate from IndexedDB asynchronously on startup if available
  useEffect(() => {
    let isMounted = true;
    loadProjectFromIndexedDB().then((dbProject) => {
      if (isMounted && dbProject) {
        setProject(sanitizeProjectData(dbProject));
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const [activeTab, setActiveTab] = useState<NavigationTab>('WORKFLOW');
  const [activeStep, setActiveStep] = useState<number>(project.currentStep || 1);
  const [showExportModal, setShowExportModal] = useState(false);

  // Sync safely to IndexedDB and localStorage (handles quota seamlessly)
  useEffect(() => {
    saveProjectState(project);
  }, [project]);

  const handleUpdateProject = (updates: Partial<ProjectData>) => {
    setProject((prev) => ({
      ...prev,
      ...updates
    }));
  };

  const handleResetProject = async () => {
    if (window.confirm('Reset systematic review project state to default benchmark dataset?')) {
      await clearProjectStorage();
      setProject(INITIAL_PROJECT);
      setActiveStep(1);
      setActiveTab('WORKFLOW');
    }
  };

  const stepNames = [
    '1. Protocol & RQs',
    '2. Search Strings',
    '3. Deduplication',
    '4. Screening',
    '5. Quality Appraisal',
    '6. Data Extraction',
    '7. Thematic Synthesis',
    '8. Review Blueprint',
    '9. Final Manuscript'
  ];

  const handleNextStep = (next: number) => {
    setActiveStep(next);
    handleUpdateProject({ currentStep: next });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Top Main Navigation Header */}
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-4 sm:px-6 py-3 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-md">
              <Layers className="w-5 h-5 font-black" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-extrabold text-white text-base sm:text-lg tracking-tight">
                  Systematic Literature Review Suite
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 font-mono text-[10px] font-bold">
                  PRISMA 2020
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-sm sm:max-w-md">
                {project.protocol.title}
              </p>
            </div>
          </div>

          {/* Primary View Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
            <button
              onClick={() => setActiveTab('WORKFLOW')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
                activeTab === 'WORKFLOW'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>9-Step Workflow</span>
            </button>

            <button
              onClick={() => setActiveTab('EVIDENCE_MATRIX')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
                activeTab === 'EVIDENCE_MATRIX'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>18-Column Matrix</span>
            </button>

            <button
              onClick={() => setActiveTab('BIBLIOMETRICS')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
                activeTab === 'BIBLIOMETRICS'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('PRISMA_CHECKLIST')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
                activeTab === 'PRISMA_CHECKLIST'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5 text-amber-400" />
              <span>PRISMA 2020 Checklist</span>
            </button>

            <button
              onClick={() => setActiveTab('PRISMA_FLOW')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
                activeTab === 'PRISMA_FLOW'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              <GitPullRequest className="w-3.5 h-3.5" />
              <span>PRISMA Flow</span>
            </button>

            <button
              onClick={() => setActiveTab('EXPORT')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
                activeTab === 'EXPORT'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>

            <button
              onClick={handleResetProject}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors ml-1"
              title="Reset project demo state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 9-Step Breadcrumb / Stepper (Only visible when activeTab === 'WORKFLOW') */}
      {activeTab === 'WORKFLOW' && (
        <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 py-2.5 overflow-x-auto shadow-inner">
          <div className="max-w-7xl mx-auto flex items-center space-x-1 min-w-max text-xs">
            {stepNames.map((name, idx) => {
              const stepNumber = idx + 1;
              const isCurrent = activeStep === stepNumber;
              const isPast = activeStep > stepNumber;

              return (
                <React.Fragment key={stepNumber}>
                  <button
                    onClick={() => handleNextStep(stepNumber)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center space-x-1.5 ${
                      isCurrent
                        ? 'bg-amber-400 text-slate-950 font-bold shadow'
                        : isPast
                        ? 'bg-slate-950/80 text-emerald-400 hover:bg-slate-800 border border-emerald-900/40'
                        : 'bg-slate-950/40 text-slate-500 hover:bg-slate-900 hover:text-slate-300 border border-slate-800/50'
                    }`}
                  >
                    {isPast && <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />}
                    <span>{name}</span>
                  </button>
                  {idx < stepNames.length - 1 && (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Content View Switcher */}
      <main className="flex-1 pb-16">
        {activeTab === 'WORKFLOW' && (
          <div>
            {activeStep === 1 && (
              <Step1Protocol 
                project={project} 
                onUpdateProject={handleUpdateProject} 
                onContinue={() => handleNextStep(2)} 
              />
            )}
            {activeStep === 2 && (
              <Step2SearchStrings 
                project={project} 
                onUpdateProject={handleUpdateProject} 
                onContinue={() => handleNextStep(3)} 
              />
            )}
            {activeStep === 3 && (
              <Step3Deduplication 
                project={project} 
                onUpdateProject={handleUpdateProject} 
                onContinue={() => handleNextStep(4)} 
              />
            )}
            {activeStep === 4 && (
              <Step4Screening 
                project={project} 
                onUpdateProject={handleUpdateProject} 
                onContinue={() => handleNextStep(5)} 
              />
            )}
            {activeStep === 5 && (
              <Step5QualityAssessment 
                project={project} 
                onUpdateProject={handleUpdateProject} 
                onContinue={() => handleNextStep(6)} 
              />
            )}
            {activeStep === 6 && (
              <Step6DataExtraction 
                project={project} 
                onUpdateProject={handleUpdateProject} 
                onContinue={() => handleNextStep(7)} 
              />
            )}
            {activeStep === 7 && (
              <Step7ThematicSynthesis 
                project={project} 
                onUpdateProject={handleUpdateProject} 
                onContinue={() => handleNextStep(8)} 
              />
            )}
            {activeStep === 8 && (
              <Step8ReviewDraft 
                project={project} 
                onUpdateProject={handleUpdateProject} 
                onContinue={() => handleNextStep(9)} 
              />
            )}
            {activeStep === 9 && (
              <Step9ReviewPaper 
                project={project} 
                onUpdateProject={handleUpdateProject} 
              />
            )}
          </div>
        )}

        {activeTab === 'EVIDENCE_MATRIX' && (
          <EvidenceMatrixView 
            project={project} 
            onUpdateProject={handleUpdateProject} 
          />
        )}

        {activeTab === 'BIBLIOMETRICS' && (
          <AnalyticsView project={project} />
        )}

        {activeTab === 'PRISMA_CHECKLIST' && (
          <PrismaChecklistView 
            project={project} 
            onUpdateProject={handleUpdateProject}
            onNavigateStep={(step) => {
              setActiveTab('WORKFLOW');
              setActiveStep(step);
            }}
          />
        )}

        {activeTab === 'PRISMA_FLOW' && (
          <PrismaFlowView 
            project={project} 
            onUpdateProject={handleUpdateProject} 
          />
        )}

        {activeTab === 'EXPORT' && (
          <div className="max-w-4xl mx-auto py-8 px-6 space-y-6 animate-fadeIn text-xs">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
                <Download className="w-4 h-4" />
                <span>Publishing & Data Export</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Systematic Review Artifacts</h2>
              <p className="text-slate-400">Export the entire systematic review dataset, evidence matrix, PRISMA 2020 27-item checklist, or full manuscript.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
                  <FileText className="w-5 h-5" />
                  <span>Full Review Manuscript (.md)</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Complete 7-section PRISMA 2020 review manuscript including abstract, research questions, synthesis, references, and limitation statement.
                </p>
                <button
                  onClick={() => {
                    const md = exportManuscriptMarkdown(project);
                    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `Systematic_Review_Manuscript_${Date.now()}.md`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="w-full py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold"
                >
                  Download Manuscript Markdown
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                  <Table className="w-5 h-5" />
                  <span>18-Column Evidence Matrix (.csv)</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Complete standardized 18-parameter evidence extraction table ready for statistical meta-analysis, Excel, or R import.
                </p>
                <button
                  onClick={() => {
                    const csv = exportEvidenceMatrixCSV(project);
                    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `Evidence_Matrix_${Date.now()}.csv`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                >
                  Download Matrix CSV
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
                  <CheckSquare className="w-5 h-5" />
                  <span>PRISMA 2020 Checklist (.csv)</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Official 27-item PRISMA 2020 reporting checklist with exact reporting locations and compliance statuses for journal submission.
                </p>
                <button
                  onClick={() => {
                    const csv = exportPrismaChecklistCSV(project);
                    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `PRISMA_2020_Checklist_${Date.now()}.csv`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="w-full py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold"
                >
                  Download PRISMA Checklist CSV
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm">
                  <FileText className="w-5 h-5" />
                  <span>PRISMA 2020 Checklist (.md)</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Formatted Markdown checklist table with Page et al. (BMJ 2021) attribution and item-by-item reporting locations.
                </p>
                <button
                  onClick={() => {
                    const md = exportPrismaChecklistMarkdown(project);
                    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `PRISMA_2020_Checklist_${Date.now()}.md`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="w-full py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                >
                  Download PRISMA Checklist Markdown
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-6 px-6 text-center text-xs text-slate-500 space-y-1">
        <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400 font-mono text-[11px]">
          <span>PRISMA 2020 Compliant</span>
          <span>•</span>
          <span>MMAT 2018 Quality Rubric</span>
          <span>•</span>
          <span>Contact: <strong className="text-slate-300">nurdiyana@umt.edu.my</strong></span>
        </div>
        <p className="text-slate-600 text-[10px]">
          Systematic Literature Review Suite — Standardized Evidence Synthesis & Manuscript Workbench
        </p>
      </footer>
    </div>
  );
}

export default App;
