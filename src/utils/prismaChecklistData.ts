import { PrismaChecklistItem } from '../types';

export const DEFAULT_PRISMA_CHECKLIST: PrismaChecklistItem[] = [
  // TITLE
  {
    itemNumber: '1',
    section: 'TITLE',
    topic: 'Title',
    checklistDescription: 'Identify the report as a systematic review.',
    reportedLocation: 'Manuscript Title, Title Page & Header',
    complianceStatus: 'Reported',
    notes: 'Title explicitly includes "A Systematic Literature Review" and follows PRISMA 2020 guidelines.',
    workflowStepLink: 8
  },

  // ABSTRACT
  {
    itemNumber: '2',
    section: 'ABSTRACT',
    topic: 'Abstract',
    checklistDescription: 'See the PRISMA 2020 for Abstracts checklist (Background, Objectives, Methods, Results, Discussion, Registration).',
    reportedLocation: 'Structured Abstract (Page 2)',
    complianceStatus: 'Reported',
    notes: 'Structured 250-word abstract covering Background, Objectives, PRISMA Search Protocol, Results (10 included studies), Discussion, and Limitations.',
    workflowStepLink: 8
  },

  // INTRODUCTION
  {
    itemNumber: '3',
    section: 'INTRODUCTION',
    topic: 'Rationale',
    checklistDescription: 'Describe the rationale for the review in the context of existing knowledge.',
    reportedLocation: 'Section 1 (§1.1 Background & Problem Statement)',
    complianceStatus: 'Reported',
    notes: 'Contextualizes escalating climate disasters, limitations of purely empirical/numerical weather forecasting, and emergence of deep learning.',
    workflowStepLink: 1
  },
  {
    itemNumber: '4',
    section: 'INTRODUCTION',
    topic: 'Objectives',
    checklistDescription: 'Provide an explicit statement of the objective(s) or question(s) the review addresses.',
    reportedLocation: 'Section 1 (§1.2 Objectives & Research Questions RQ1–RQ3)',
    complianceStatus: 'Reported',
    notes: 'Formulates explicit research questions: RQ1 (Architectures), RQ2 (Physics Integration & Reliability), RQ3 (Cross-domain Generalizability).',
    workflowStepLink: 1
  },

  // METHODS
  {
    itemNumber: '5',
    section: 'METHODS',
    topic: 'Eligibility criteria',
    checklistDescription: 'Specify the inclusion and exclusion criteria for the review and how studies were grouped for the syntheses.',
    reportedLocation: 'Section 2 (§2.1 Eligibility Criteria, Table 1)',
    complianceStatus: 'Reported',
    notes: 'Explicit inclusion criteria (peer-reviewed, empirical ML models, extreme climate events, 2020–2025) and exclusion criteria (reviews, non-peer-reviewed preprints).',
    workflowStepLink: 1
  },
  {
    itemNumber: '6',
    section: 'METHODS',
    topic: 'Information sources',
    checklistDescription: 'Specify all databases, registers, websites, organisations, reference lists and other sources searched or consulted to identify studies. Specify the date when each source was last searched or consulted.',
    reportedLocation: 'Section 2 (§2.2 Information Sources & Date Coverage)',
    complianceStatus: 'Reported',
    notes: 'Five primary bibliographic databases searched (Scopus, Web of Science, IEEE Xplore, PubMed, Google Scholar); last search updated August 2025.',
    workflowStepLink: 2
  },
  {
    itemNumber: '7',
    section: 'METHODS',
    topic: 'Search strategy',
    checklistDescription: 'Present the full search strategies for all databases, registers and websites, including any filters and limits used.',
    reportedLocation: 'Section 2 (§2.3 Search Strategy & Boolean Strings)',
    complianceStatus: 'Reported',
    notes: 'Full reproducible search strings provided for Scopus, WoS, PubMed, and IEEE with field-tags (TITLE-ABS-KEY) and boolean operators.',
    workflowStepLink: 2
  },
  {
    itemNumber: '8',
    section: 'METHODS',
    topic: 'Selection process',
    checklistDescription: 'Specify the methods used to decide whether a study met the inclusion criteria of the review, including how many reviewers screened each record and each report retrieved, whether they worked independently, and if applicable, details of automation tools used in the process.',
    reportedLocation: 'Section 2 (§2.4 Study Selection & Dual-Reviewer Protocol)',
    complianceStatus: 'Reported',
    notes: 'Independent double-blind title/abstract screening with third-party arbitrator consensus and AI-assisted screening confidence scoring.',
    workflowStepLink: 4
  },
  {
    itemNumber: '9',
    section: 'METHODS',
    topic: 'Data collection process',
    checklistDescription: 'Specify the methods used to collect data from reports, including how many reviewers collected data from each report, whether they worked independently, any processes for obtaining or confirming data from study investigators, and if applicable, details of automation tools used in the process.',
    reportedLocation: 'Section 2 (§2.5 Data Extraction & Verification)',
    complianceStatus: 'Reported',
    notes: 'Standardized 18-parameter extraction protocol piloted on 3 studies; full-text validation conducted by two independent reviewers.',
    workflowStepLink: 6
  },
  {
    itemNumber: '10a',
    section: 'METHODS',
    topic: 'Data items',
    checklistDescription: 'List and define all outcomes for which data were sought. Specify whether all results that were compatible with each outcome domain in each study were sought (e.g. for all measures, time points, analyses), and if not, the methods used to decide which results to collect.',
    reportedLocation: 'Section 2 (§2.5) & 18-Column Extraction Matrix',
    complianceStatus: 'Reported',
    notes: 'Quantitative outcomes defined: Critical Success Index (CSI), Nash-Sutcliffe Efficiency (NSE), Root Mean Squared Error (RMSE), R-squared (R²), and F1-score.',
    workflowStepLink: 6
  },
  {
    itemNumber: '10b',
    section: 'METHODS',
    topic: 'Data items',
    checklistDescription: 'List and define all other variables for which data were sought (e.g. participant and intervention characteristics, funding sources). Describe any assumptions made about any missing or unclear information.',
    reportedLocation: 'Section 2 (§2.5) & Data Dictionary',
    complianceStatus: 'Reported',
    notes: 'Extracted variables: Country/Geographic Context, Problem Formulation, Dataset Name & Resolution, Sample Size, Architecture/Model, Limitations, Research Gaps.',
    workflowStepLink: 6
  },
  {
    itemNumber: '11',
    section: 'METHODS',
    topic: 'Study risk of bias assessment',
    checklistDescription: 'Specify the methods used to assess risk of bias in the included studies, including details of the tool(s) used, how many reviewers assessed each study and whether they worked independently, and if applicable, details of automation tools used in the process.',
    reportedLocation: 'Section 2 (§2.6 Quality Appraisal & Risk of Bias Rubric)',
    complianceStatus: 'Reported',
    notes: 'Mixed Methods Appraisal Tool (MMAT 2018) rubric with 5 core methodological quality questions appraised independently per included study.',
    workflowStepLink: 5
  },
  {
    itemNumber: '12',
    section: 'METHODS',
    topic: 'Effect measures',
    checklistDescription: 'Specify for each outcome the effect measure(s) (e.g. risk ratio, mean difference) used in the synthesis or presentation of results.',
    reportedLocation: 'Section 2 (§2.7 Effect Measures & Metric Standardization)',
    complianceStatus: 'Reported',
    notes: 'Skill score improvements (percentage lead-time improvement, CSI differentials, and peak timing error reductions in minutes).',
    workflowStepLink: 6
  },
  {
    itemNumber: '13a',
    section: 'METHODS',
    topic: 'Synthesis methods',
    checklistDescription: 'Describe the processes used to decide which studies were eligible for each synthesis (e.g. tabulating the study intervention characteristics and comparing against the planned groups for each synthesis (item #5)).',
    reportedLocation: 'Section 2 (§2.8 Synthesis Grouping & Eligibility)',
    complianceStatus: 'Reported',
    notes: 'Studies categorized into 4 core thematic clusters: Physics-Informed ML, Deep Spatio-Temporal Nowcasting, Vision Transformers, and Generative Downscaling.',
    workflowStepLink: 7
  },
  {
    itemNumber: '13b',
    section: 'METHODS',
    topic: 'Synthesis methods',
    checklistDescription: 'Describe any methods required to prepare the data for presentation or synthesis, such as handling of missing summary statistics, or data conversions.',
    reportedLocation: 'Section 2 (§2.8 Data Preparation & Metric Harmonization)',
    complianceStatus: 'Reported',
    notes: 'Metrics harmonized across diverse spatial grid resolutions (e.g. converting spatial degrees to km terrain grid steps).',
    workflowStepLink: 6
  },
  {
    itemNumber: '13c',
    section: 'METHODS',
    topic: 'Synthesis methods',
    checklistDescription: 'Describe any methods used to tabulate or visually display results of individual studies and syntheses.',
    reportedLocation: 'Section 2 (§2.8), Table 2 Matrix & Bibliometric Plots',
    complianceStatus: 'Reported',
    notes: '18-column standardized evidence matrix, PRISMA 2020 flow diagram, geographic choropleth distributions, and radar architecture taxonomy charts.',
    workflowStepLink: 6
  },
  {
    itemNumber: '13d',
    section: 'METHODS',
    topic: 'Synthesis methods',
    checklistDescription: 'Describe any methods used to synthesize results and provide a rationale for the choice(s). If meta-analysis was performed, describe the model(s), method(s) to identify the presence and extent of statistical heterogeneity, and software package(s) used.',
    reportedLocation: 'Section 2 (§2.8 Narrative & Thematic Synthesis Framework)',
    complianceStatus: 'Reported',
    notes: 'Narrative synthesis paired with thematic cluster analysis following Popay et al. guidance due to high methodological and task heterogeneity.',
    workflowStepLink: 7
  },
  {
    itemNumber: '13e',
    section: 'METHODS',
    topic: 'Synthesis methods',
    checklistDescription: 'Describe any methods used to explore possible causes of heterogeneity among study results (e.g. subgroup analysis, meta-regression).',
    reportedLocation: 'Section 2 (§2.8 Subgroup Exploration by Hazard Domain)',
    complianceStatus: 'Reported',
    notes: 'Subgroup analysis across hazard domains (hydro-meteorological floods, coastal surges, wildfire perimeters, agricultural droughts).',
    workflowStepLink: 7
  },
  {
    itemNumber: '13f',
    section: 'METHODS',
    topic: 'Synthesis methods',
    checklistDescription: 'Describe any sensitivity analyses conducted to assess robustness of the synthesized results.',
    reportedLocation: 'Section 2 (§2.8 Methodological Sensitivity Stratification)',
    complianceStatus: 'Reported',
    notes: 'Sensitivity checks assessing outcomes when stratifying by MMAT quality score (>80% vs <80%) and full-text code repository availability.',
    workflowStepLink: 7
  },
  {
    itemNumber: '14',
    section: 'METHODS',
    topic: 'Reporting bias assessment',
    checklistDescription: 'Describe any methods used to assess risk of bias due to missing results in a synthesis (arising from reporting biases).',
    reportedLocation: 'Section 2 (§2.9 Reporting Bias & Publication Audit)',
    complianceStatus: 'Reported',
    notes: 'Evaluated benchmark dataset selective reporting (e.g. reporting only top-performing lead times) and public benchmark verification.',
    workflowStepLink: 5
  },
  {
    itemNumber: '15',
    section: 'METHODS',
    topic: 'Certainty assessment',
    checklistDescription: 'Describe any methods used to assess certainty (or confidence) in the body of evidence for an outcome.',
    reportedLocation: 'Section 2 (§2.10 Evidence Certainty & Claim Verification Audit)',
    complianceStatus: 'Reported',
    notes: 'GRADE-adapted certainty rubric applied across empirical findings with confidence scores (0-100%) and direct primary study grounding.',
    workflowStepLink: 9
  },

  // RESULTS
  {
    itemNumber: '16a',
    section: 'RESULTS',
    topic: 'Study selection',
    checklistDescription: 'Describe the results of the search and selection process, from the number of records identified in the search to the number of studies included in the review, ideally using a flow diagram.',
    reportedLocation: 'Section 3 (§3.1) & PRISMA 2020 Flow Diagram',
    complianceStatus: 'Reported',
    notes: 'Total identified (348 records), duplicates removed (52), title/abstract screened (296), excluded (231), full-texts sought (65), included (10 benchmark studies).',
    workflowStepLink: 4
  },
  {
    itemNumber: '16b',
    section: 'RESULTS',
    topic: 'Study selection',
    checklistDescription: 'Cite studies that might appear to meet the inclusion criteria, but which were excluded, and explain why they were excluded.',
    reportedLocation: 'Section 3 (§3.1) & Excluded Studies Table with Reasons',
    complianceStatus: 'Reported',
    notes: 'Detailed breakdown of exclusion reasons: EX-01 (Non-empirical review), EX-02 (Lacked ground-truth validation), EX-03 (Resolution below 5km).',
    workflowStepLink: 4
  },
  {
    itemNumber: '17',
    section: 'RESULTS',
    topic: 'Study characteristics',
    checklistDescription: 'Cite each included study and present its characteristics.',
    reportedLocation: 'Section 3 (§3.2) & Table 2: 18-Column Evidence Matrix',
    complianceStatus: 'Reported',
    notes: 'All 10 included primary studies cited [SP001]–[SP010] with full characteristics (authors, year, venue, country, model, dataset, variables).',
    workflowStepLink: 6
  },
  {
    itemNumber: '18',
    section: 'RESULTS',
    topic: 'Risk of bias in studies',
    checklistDescription: 'Present assessments of risk of bias for each included study.',
    reportedLocation: 'Section 3 (§3.3) & Quality Appraisal Heatmap Table',
    complianceStatus: 'Reported',
    notes: 'Individual MMAT appraisal scores: 7 studies classified Low Risk (80–100%), 3 studies Moderate Risk (60–75%), 0 High Risk.',
    workflowStepLink: 5
  },
  {
    itemNumber: '19',
    section: 'RESULTS',
    topic: 'Results of individual studies',
    checklistDescription: 'For all outcomes, present, for each study: (a) summary statistics for each group (where appropriate) and (b) an effect estimate and its precision (e.g. confidence/credible interval), ideally using structured tables or plots.',
    reportedLocation: 'Section 3 (§3.4 Empirical Performance Metric Table)',
    complianceStatus: 'Reported',
    notes: 'Individual quantitative benchmarks: CSI (0.68), RMSE (0.082m), NSE (0.89), R² (0.84), Wasserstein distance reduction (-89%), and labeling reduction (-64%).',
    workflowStepLink: 6
  },
  {
    itemNumber: '20a',
    section: 'RESULTS',
    topic: 'Results of syntheses',
    checklistDescription: 'For each synthesis, briefly summarise the characteristics and risk of bias among contributing studies.',
    reportedLocation: 'Section 3 (§3.5 Thematic Synthesis & Cluster Summary)',
    complianceStatus: 'Reported',
    notes: 'Summarizes model architectures, loss function formulations, and validation rigor across all 4 thematic clusters.',
    workflowStepLink: 7
  },
  {
    itemNumber: '20b',
    section: 'RESULTS',
    topic: 'Results of syntheses',
    checklistDescription: 'Present results of all statistical syntheses conducted. If meta-analysis was done, present for each the summary estimate and its precision (e.g. confidence/credible interval) and measures of statistical heterogeneity. If comparing groups, describe the direction of the effect.',
    reportedLocation: 'Section 3 (§3.5 Cross-Model Benchmark Comparison Table)',
    complianceStatus: 'Reported',
    notes: 'Cross-model comparison demonstrates physics-informed architectures improve out-of-distribution stability by 34% over purely data-driven baselines.',
    workflowStepLink: 7
  },
  {
    itemNumber: '20c',
    section: 'RESULTS',
    topic: 'Results of syntheses',
    checklistDescription: 'Present results of all investigations of possible causes of heterogeneity among study results.',
    reportedLocation: 'Section 3 (§3.5 Heterogeneity by Sensor & Terrain Modality)',
    complianceStatus: 'Reported',
    notes: 'Variations in skill scores traced to radar beam blockage in mountainous catchments vs smooth coastal bathymetry.',
    workflowStepLink: 7
  },
  {
    itemNumber: '20d',
    section: 'RESULTS',
    topic: 'Results of syntheses',
    checklistDescription: 'Present results of all sensitivity analyses conducted to assess the robustness of the synthesized results.',
    reportedLocation: 'Section 3 (§3.5 Quality & Data Availability Sensitivity Analysis)',
    complianceStatus: 'Reported',
    notes: 'Exclusion of Moderate-Risk studies maintained the observed physics-guided performance advantages with negligible variance change (<3%).',
    workflowStepLink: 7
  },
  {
    itemNumber: '21',
    section: 'RESULTS',
    topic: 'Reporting biases',
    checklistDescription: 'Present assessments of risk of bias due to missing results (arising from reporting biases) for each synthesis assessed.',
    reportedLocation: 'Section 3 (§3.6 Selective Metric & Lead-Time Audit)',
    complianceStatus: 'Reported',
    notes: 'Identified tendency in precipitation nowcasting papers to omit skill decay curves past 3 hours of forecast lead time.',
    workflowStepLink: 5
  },
  {
    itemNumber: '22',
    section: 'RESULTS',
    topic: 'Certainty of evidence',
    checklistDescription: 'Present assessments of certainty (or confidence) in the body of evidence for each outcome assessed.',
    reportedLocation: 'Section 3 (§3.7 Evidence Strength & Claim Audit Table)',
    complianceStatus: 'Reported',
    notes: 'High certainty established for physics-informed flood routing; moderate certainty for continental-scale generative climate downscaling.',
    workflowStepLink: 9
  },

  // DISCUSSION
  {
    itemNumber: '23a',
    section: 'DISCUSSION',
    topic: 'Discussion',
    checklistDescription: 'Provide a general interpretation of the results in the context of other evidence.',
    reportedLocation: 'Section 4 (§4.1 Principal Findings & Scientific Context)',
    complianceStatus: 'Reported',
    notes: 'Interprets the transition from black-box deep learning toward hybrid physics-guided foundation models for disaster early warning systems.',
    workflowStepLink: 8
  },
  {
    itemNumber: '23b',
    section: 'DISCUSSION',
    topic: 'Discussion',
    checklistDescription: 'Discuss any limitations of the evidence included in the review.',
    reportedLocation: 'Section 4 (§4.2 Limitations of Primary Evidence Base)',
    complianceStatus: 'Reported',
    notes: 'Highlights geographic bias (majority European/North American datasets) and lack of operational real-time latency benchmarks in Global South catchments.',
    workflowStepLink: 8
  },
  {
    itemNumber: '23c',
    section: 'DISCUSSION',
    topic: 'Discussion',
    checklistDescription: 'Discuss any limitations of the review processes used.',
    reportedLocation: 'Section 4 (§4.3 Review Process & Language Limitations)',
    complianceStatus: 'Reported',
    notes: 'English language publication filter and exclusion of unindexed grey literature government reports.',
    workflowStepLink: 8
  },
  {
    itemNumber: '23d',
    section: 'DISCUSSION',
    topic: 'Discussion',
    checklistDescription: 'Discuss implications of the results for practice, policy, and future research.',
    reportedLocation: 'Section 4 (§4.4 Practical Implications & Research Gap Agenda)',
    complianceStatus: 'Reported',
    notes: 'Maps 4 actionable research agendas (GAP-01 to GAP-04) for meteorological agencies, civil protection authorities, and AI practitioners.',
    workflowStepLink: 7
  },

  // OTHER INFORMATION
  {
    itemNumber: '24a',
    section: 'OTHER INFORMATION',
    topic: 'Registration and protocol',
    checklistDescription: 'Provide registration information for the review, including register name and registration number, or state that the review was not registered.',
    reportedLocation: 'Section 5 (§5.1 Registration & Protocol Statement)',
    complianceStatus: 'Reported',
    notes: 'Protocol pre-registered on Open Science Framework (OSF Registry DOI: 10.17605/OSF.IO/PRISMA-SLR-2025).',
    workflowStepLink: 1
  },
  {
    itemNumber: '24b',
    section: 'OTHER INFORMATION',
    topic: 'Registration and protocol',
    checklistDescription: 'Indicate where the review protocol can be accessed, or state that a protocol was not prepared.',
    reportedLocation: 'Section 5 (§5.1 Open Access Protocol Link)',
    complianceStatus: 'Reported',
    notes: 'Protocol document and search audit trails openly accessible via OSF public project repository.',
    workflowStepLink: 1
  },
  {
    itemNumber: '24c',
    section: 'OTHER INFORMATION',
    topic: 'Registration and protocol',
    checklistDescription: 'Describe and explain any amendments to information provided at registration or in the protocol.',
    reportedLocation: 'Section 5 (§5.1 Protocol Amendments Log)',
    complianceStatus: 'Reported',
    notes: 'Protocol amendment noted: addition of diffusion-based climate models following rapid field emergence in 2023.',
    workflowStepLink: 1
  },
  {
    itemNumber: '25',
    section: 'OTHER INFORMATION',
    topic: 'Support',
    checklistDescription: 'Describe sources of financial or non-financial support for the review, and the role of the funders or sponsors in the review.',
    reportedLocation: 'Section 5 (§5.2 Funding & Support Statement)',
    complianceStatus: 'Reported',
    notes: 'Supported by University Research Initiative on Climate Resilience (Grant #CR-2025-88). Funders had no role in study selection or synthesis.',
    workflowStepLink: 8
  },
  {
    itemNumber: '26',
    section: 'OTHER INFORMATION',
    topic: 'Competing interests',
    checklistDescription: 'Declare any competing interests of review authors.',
    reportedLocation: 'Section 5 (§5.3 Declaration of Competing Interests)',
    complianceStatus: 'Reported',
    notes: 'The authors declare no competing financial or non-financial interests.',
    workflowStepLink: 8
  },
  {
    itemNumber: '27',
    section: 'OTHER INFORMATION',
    topic: 'Availability of data, code and other materials',
    checklistDescription: 'Report which of the following are publicly available and where they can be found: template data collection forms; data extracted from included studies; data used for all analyses; analytic code; any other materials used in the review.',
    reportedLocation: 'Section 5 (§5.4 Open Data & 18-Column Matrix Availability)',
    complianceStatus: 'Reported',
    notes: 'Complete 18-column evidence matrix (.csv), PRISMA flow diagram data, and synthesis scripts deposited in public repository.',
    workflowStepLink: 6
  }
];
