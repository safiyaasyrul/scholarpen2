import React, { useState } from 'react';
import { 
  ProjectData, 
  PaperQualityAssessment, 
  QualityAssessmentCriterion, 
  LiteraturePaper 
} from '../types';
import { 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  HelpCircle, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight,
  BookOpen
} from 'lucide-react';

interface Step5QualityAssessmentProps {
  project: ProjectData;
  onUpdateProject: (updates: Partial<ProjectData>) => void;
  onContinue: () => void;
}

export const Step5QualityAssessment: React.FC<Step5QualityAssessmentProps> = ({
  project,
  onUpdateProject,
  onContinue
}) => {
  const includedPapers = project.papers.filter(p => {
    const s = project.screenings?.[p.id];
    return s && s.humanDecision === 'INCLUDE';
  });

  const [selectedPaperIndex, setSelectedPaperIndex] = useState(0);
  const [assessments, setAssessments] = useState<Record<string, PaperQualityAssessment>>(project.qualityAssessments || {});

  const currentPaper: LiteraturePaper | undefined = includedPapers[selectedPaperIndex];

  // Default MMAT criteria template
  const defaultCriteria: QualityAssessmentCriterion[] = [
    { id: 'c1', question: '1. Are the research questions clearly formulated and aligned with theoretical motivation?', score: 'YES' },
    { id: 'c2', question: '2. Are the measurements, datasets, and sensor telemetry clearly defined and validated?', score: 'YES' },
    { id: 'c3', question: '3. Is the computational/statistical architecture appropriately configured with baseline ablations?', score: 'YES' },
    { id: 'c4', question: '4. Is the risk of training data leakage, target contamination, or spatial overfitting minimized?', score: 'YES' },
    { id: 'c5', question: '5. Do the empirical findings support the conclusions without unwarranted extrapolation?', score: 'YES' }
  ];

  const currentAssessment: PaperQualityAssessment = (currentPaper && assessments[currentPaper.id]) || {
    paperId: currentPaper?.id || '',
    toolType: 'MMAT',
    studyType: 'Quantitative Non-RCT',
    criteria: defaultCriteria,
    overallScorePercentage: 100,
    riskOfBias: 'LOW_RISK',
    evaluatorRemarks: 'Robust computational evaluation with verified evaluation metrics and baseline comparisons.'
  };

  const handleScoreChange = (criterionId: string, score: 'YES' | 'NO' | 'UNCLEAR' | 'NOT_APPLICABLE') => {
    if (!currentPaper) return;

    const updatedCriteria = currentAssessment.criteria.map(c => 
      c.id === criterionId ? { ...c, score } : c
    );

    const yesCount = updatedCriteria.filter(c => c.score === 'YES').length;
    const applicableCount = updatedCriteria.filter(c => c.score !== 'NOT_APPLICABLE').length;
    const pct = applicableCount > 0 ? Math.round((yesCount / applicableCount) * 100) : 100;

    let risk: 'LOW_RISK' | 'MODERATE_RISK' | 'HIGH_RISK' | 'CRITICAL_RISK' = 'LOW_RISK';
    if (pct < 50) risk = 'HIGH_RISK';
    else if (pct < 80) risk = 'MODERATE_RISK';

    const updatedAssessment: PaperQualityAssessment = {
      ...currentAssessment,
      criteria: updatedCriteria,
      overallScorePercentage: pct,
      riskOfBias: risk
    };

    const newAssessments = {
      ...assessments,
      [currentPaper.id]: updatedAssessment
    };

    setAssessments(newAssessments);
    onUpdateProject({ qualityAssessments: newAssessments });
  };

  const handleRemarksChange = (remarks: string) => {
    if (!currentPaper) return;
    const updated = {
      ...currentAssessment,
      evaluatorRemarks: remarks
    };
    const newAssessments = {
      ...assessments,
      [currentPaper.id]: updated
    };
    setAssessments(newAssessments);
    onUpdateProject({ qualityAssessments: newAssessments });
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-6 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <Award className="w-4 h-4" />
            <span>Step 5 of 9</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Quality Appraisal & Risk of Bias (MMAT)
          </h1>
          <p className="text-sm text-slate-400">
            Appraise methodological rigor, statistical validity, and risk of bias across all <strong>{includedPapers.length} included studies</strong>.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-slate-900 border border-slate-800 text-xs font-mono text-amber-300 rounded-lg">
            Tool: Mixed Methods Appraisal Tool (MMAT 2018)
          </span>
        </div>
      </div>

      {/* Selector & Overview Strip */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSelectedPaperIndex(Math.max(0, selectedPaperIndex - 1))}
            disabled={selectedPaperIndex === 0}
            className="p-1.5 rounded bg-slate-950 border border-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-800"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-slate-300">
            Study <strong className="text-amber-400">{selectedPaperIndex + 1}</strong> of <strong className="text-white">{includedPapers.length}</strong>
          </span>
          <button
            onClick={() => setSelectedPaperIndex(Math.min(includedPapers.length - 1, selectedPaperIndex + 1))}
            disabled={selectedPaperIndex === includedPapers.length - 1}
            className="p-1.5 rounded bg-slate-950 border border-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-800"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Risk Badge */}
        {currentPaper && (
          <div className="flex items-center space-x-3 text-xs">
            <span className="text-slate-400">Quality Score: <strong className="text-amber-400 font-mono">{currentAssessment.overallScorePercentage}%</strong></span>
            <span className={`px-2.5 py-1 rounded font-bold uppercase tracking-wider text-[11px] ${
              currentAssessment.riskOfBias === 'LOW_RISK' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
              currentAssessment.riskOfBias === 'MODERATE_RISK' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
              'bg-rose-950 text-rose-300 border border-rose-800'
            }`}>
              {currentAssessment.riskOfBias.replace('_', ' ')}
            </span>
          </div>
        )}
      </div>

      {/* Main Appraisal Content */}
      {currentPaper ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Study Information */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl text-xs">
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-xs text-amber-400 px-2 py-0.5 bg-slate-950 rounded border border-slate-800">
                  {currentPaper.customId}
                </span>
                <span className="text-slate-400 font-mono">{currentPaper.year}</span>
              </div>

              <h3 className="text-sm font-bold text-white leading-snug">
                {currentPaper.title}
              </h3>

              <p className="text-slate-400 leading-relaxed">
                <strong>Authors:</strong> {currentPaper.authors.join(', ')}
              </p>

              <p className="text-slate-400">
                <strong>Journal:</strong> <span className="italic text-slate-300">{currentPaper.journal}</span>
              </p>

              <div className="pt-2 border-t border-slate-800">
                <span className="text-slate-400 font-semibold block mb-1">Abstract Summary:</span>
                <p className="text-slate-300 leading-relaxed max-h-48 overflow-y-auto text-[11px]">
                  {currentPaper.abstract}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Rubric Criteria Evaluation */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide">
                    MMAT Methodological Criteria Checklist
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">5 Core Criteria</span>
              </div>

              {/* Criteria List */}
              <div className="space-y-3">
                {currentAssessment.criteria.map((crit) => (
                  <div 
                    key={crit.id}
                    className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs"
                  >
                    <p className="font-semibold text-slate-200 leading-snug">
                      {crit.question}
                    </p>

                    <div className="flex items-center space-x-2 pt-1">
                      {(['YES', 'NO', 'UNCLEAR', 'NOT_APPLICABLE'] as const).map((opt) => (
                        <button
                          key={opt}
                          onClick={() => handleScoreChange(crit.id, opt)}
                          className={`px-3 py-1 rounded text-[11px] font-bold transition-colors ${
                            crit.score === opt
                              ? opt === 'YES' ? 'bg-emerald-500 text-slate-950 font-black' :
                                opt === 'NO' ? 'bg-rose-500 text-slate-950 font-black' :
                                opt === 'UNCLEAR' ? 'bg-amber-400 text-slate-950 font-black' :
                                'bg-slate-700 text-white'
                              : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
                          }`}
                        >
                          {opt.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Evaluator Remarks */}
              <div className="space-y-1.5 pt-2 text-xs">
                <label className="block text-slate-300 font-semibold">
                  Reviewer Quality Appraisal Remarks
                </label>
                <textarea
                  value={currentAssessment.evaluatorRemarks}
                  onChange={(e) => handleRemarksChange(e.target.value)}
                  rows={3}
                  placeholder="Record methodological caveats, statistical strengths, or risk of bias observations..."
                  className="w-full p-3 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400">
          No included studies found for quality appraisal.
        </div>
      )}

      {/* Footer Continue */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <span className="text-xs text-slate-400">
          Quality appraisal scores are saved. Next: Extract structured 18-column evidence items.
        </span>

        <button
          onClick={onContinue}
          className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-all shadow-md"
        >
          <span>Continue to Step 6: Data Extraction</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
