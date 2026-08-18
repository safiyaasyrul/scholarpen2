export type DatabaseSource = 'Scopus' | 'Web of Science' | 'ResearchGate' | 'Google Scholar' | 'PubMed' | 'IEEE Xplore' | 'Other';

export interface LiteraturePaper {
  id: string;
  customId: string; // e.g. "SP001", "SP002"
  title: string;
  authors: string[];
  year: number;
  journal: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  abstract: string;
  keywords: string[];
  sourceDatabase: DatabaseSource;
  citationCount: number;
  fullTextAvailable: boolean;
  publicationType: 'Journal Article' | 'Conference Paper' | 'Book Chapter' | 'Review' | 'Preprint';
  url?: string;
  bibtex?: string;
  rawSource?: string;
  isDuplicate?: boolean;
  duplicateOfId?: string;
  similarityScore?: number;
  duplicateSourceDb?: DatabaseSource;
  duplicateMatchReason?: string;
}

export interface PrismaCounts {
  recordsScopus: number;
  recordsWos: number;
  recordsResearchGate?: number;
  recordsScholar: number;
  recordsPubMed: number;
  recordsIeee: number;
  recordsOther: number;
  totalIdentified: number;
  duplicatesRemoved: number;
  recordsScreened: number;
  recordsExcluded: number;
  reportsSought: number;
  reportsNotRetrieved: number;
  reportsAssessed: number;
  reportsExcluded: number;
  studiesIncluded: number;
}

export interface ReviewProtocol {
  title: string;
  topic: string;
  primaryObjective: string;
  researchQuestions: {
    id: string;
    code: string; // "RQ1", "RQ2"
    question: string;
    targetDimension: string;
  }[];
  inclusionCriteria: string[];
  exclusionCriteria: string[];
  targetDatabases: DatabaseSource[];
  dateRangeStart: number;
  dateRangeEnd: number;
  languageRequirements: string[];
  methodologicalFramework: 'PRISMA 2020' | 'Cochrane' | 'JBI' | 'Kitchenham';
}

export interface SearchQueryString {
  id: string;
  database: DatabaseSource;
  syntaxType: 'Boolean' | 'Field-Tagged' | 'Natural';
  queryString: string;
  fieldFilters: string;
  expectedYield: number;
  notes: string;
  dateTested: string;
}

export interface ScreeningEvaluation {
  paperId: string;
  humanDecision: 'INCLUDE' | 'EXCLUDE' | 'MAYBE' | 'UNSCREENED';
  exclusionReason?: string;
  confidenceScore: number; // 0-100
  aiRecommendation?: 'INCLUDE' | 'EXCLUDE' | 'MAYBE';
  aiConfidence?: number;
  aiRationale?: string;
  reviewerNotes?: string;
  timestamp?: string;
}

export interface QualityAssessmentCriterion {
  id: string;
  question: string;
  score: 'YES' | 'NO' | 'UNCLEAR' | 'NOT_APPLICABLE';
  notes?: string;
}

export interface PaperQualityAssessment {
  paperId: string;
  toolType: 'MMAT' | 'ROBIS' | 'Newcastle-Ottawa' | 'CASP';
  studyType: 'Quantitative RCT' | 'Quantitative Non-RCT' | 'Quantitative Descriptive' | 'Qualitative' | 'Mixed Methods';
  criteria: QualityAssessmentCriterion[];
  overallScorePercentage: number;
  riskOfBias: 'LOW_RISK' | 'MODERATE_RISK' | 'HIGH_RISK' | 'CRITICAL_RISK';
  evaluatorRemarks: string;
}

export interface EvidenceExtraction {
  paperId: string;
  country: string;
  objective: string;
  problem: string;
  context: string;
  methodology: string;
  dataset: string;
  sample: string;
  variables: string;
  model: string;
  outcome: string;
  findings: string;
  limitations: string;
  researchGap: string;
  statisticalMetrics?: string;
  fullTextVerified?: boolean;
}

export interface ThematicCluster {
  id: string;
  name: string;
  code: string;
  color: string;
  description: string;
  paperIds: string[];
  keyThemes: string[];
  synthesizedTakeaway: string;
}

export interface ResearchGapDimension {
  id: string;
  code: string; // "GAP-01"
  title: string;
  type: 'Methodological' | 'Empirical' | 'Theoretical' | 'Population / Geographic' | 'Technological';
  description: string;
  severity: 'Critical' | 'Moderate' | 'Emerging';
  supportingPaperIds: string[];
  proposedFutureAgenda: string[];
}

export interface ReviewDraftSection {
  id: string;
  number: string;
  title: string;
  content: string;
  subsections?: {
    number: string;
    title: string;
    content?: string;
  }[];
}

export interface ReviewPaperReference {
  paperId: string;
  citationKey: string; // "[SP001]"
  formattedReference: string;
  doi?: string;
  year: number;
  authors: string;
}

export interface SupportedClaim {
  id: string;
  claimText: string;
  status: 'supported' | 'weakly_supported' | 'unsupported';
  evidenceText: string;
  supportingPaperIds: string[];
  sectionId: string;
  confidenceScore: number;
}

export interface ReviewPaperData {
  title: string;
  runningHead: string;
  authors: string[];
  affiliations: string[];
  abstract: string;
  keywords: string[];
  sections: {
    id: string;
    number: string;
    title: string;
    content: string;
  }[];
  references: ReviewPaperReference[];
}

export interface PrismaChecklistItem {
  itemNumber: string; // e.g. "1", "2", "3", "10a", "13a", etc.
  section: 'TITLE' | 'ABSTRACT' | 'INTRODUCTION' | 'METHODS' | 'RESULTS' | 'DISCUSSION' | 'OTHER INFORMATION';
  topic: string;
  checklistDescription: string;
  reportedLocation: string; // e.g. "Title, Page 1", "Section 1 (§1.1)", "Section 2 (§2.3)"
  complianceStatus: 'Reported' | 'Partially Reported' | 'Not Reported' | 'Not Applicable';
  notes?: string;
  workflowStepLink?: number;
}

export type NavigationTab = 'WORKFLOW' | 'EVIDENCE_MATRIX' | 'PRISMA_CHECKLIST' | 'PRISMA_FLOW' | 'BIBLIOMETRICS' | 'EXPORT';

export interface ProjectData {
  id: string;
  name: string;
  lastModified: string;
  activeStep: number; // 1 to 9
  currentStep?: number;
  activeMainTab: NavigationTab;
  protocol: ReviewProtocol;
  searchStrings: SearchQueryString[];
  papers: LiteraturePaper[];
  prismaCounts: PrismaCounts;
  prismaChecklist: PrismaChecklistItem[];
  screenings: Record<string, ScreeningEvaluation>;
  qualityAssessments: Record<string, PaperQualityAssessment>;
  evidenceExtractions: Record<string, EvidenceExtraction>;
  themes: ThematicCluster[];
  researchGaps: ResearchGapDimension[];
  reviewDraftSections: ReviewDraftSection[];
  reviewPaper: ReviewPaperData;
  supportedClaims: SupportedClaim[];
}
