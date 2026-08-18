import { ProjectData } from '../types';

export function downloadTextFile(filename: string, text: string, mimeType: string = 'text/plain') {
  const blob = new Blob([text], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportEvidenceMatrixToCsv(project: ProjectData): string {
  const headers = [
    'Paper ID',
    'Custom Code',
    'Authors',
    'Year',
    'Title',
    'Journal / Venue',
    'DOI',
    'Source Database',
    'Country / Region',
    'Objective',
    'Research Problem',
    'Context & Setting',
    'Methodology',
    'Dataset / Sample',
    'Variables Examined',
    'AI / ML Model',
    'Target Outcome',
    'Synthesized Findings',
    'Methodological Limitations',
    'Identified Research Gap',
    'Screening Status'
  ];

  const escapeCsv = (val: string | number | undefined | null) => {
    if (val === undefined || val === null) return '""';
    const s = String(val).replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = (project.papers || []).map((paper) => {
    const ev = project.evidenceExtractions?.[paper.id];
    const screening = project.screenings?.[paper.id];
    const authorsStr = Array.isArray(paper.authors) ? paper.authors.join('; ') : '';

    return [
      escapeCsv(paper.id),
      escapeCsv(paper.customId),
      escapeCsv(authorsStr),
      escapeCsv(paper.year),
      escapeCsv(paper.title),
      escapeCsv(paper.journal),
      escapeCsv(paper.doi || ''),
      escapeCsv(paper.sourceDatabase),
      escapeCsv(ev?.country || 'Not reported in abstract'),
      escapeCsv(ev?.objective || 'Not reported in abstract'),
      escapeCsv(ev?.problem || 'Not reported in abstract'),
      escapeCsv(ev?.context || 'Not reported in abstract'),
      escapeCsv(ev?.methodology || 'Not reported in abstract'),
      escapeCsv(ev?.dataset || 'Not reported in abstract'),
      escapeCsv(ev?.variables || 'Not reported in abstract'),
      escapeCsv(ev?.model || 'Not reported in abstract'),
      escapeCsv(ev?.outcome || 'Not reported in abstract'),
      escapeCsv(ev?.findings || 'Not reported in abstract'),
      escapeCsv(ev?.limitations || 'Not reported in abstract'),
      escapeCsv(ev?.researchGap || 'Not reported in abstract'),
      escapeCsv(screening?.humanDecision || 'UNSCREENED')
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

export function exportReviewPaperToMarkdown(project: ProjectData): string {
  const reviewPaper = project.reviewPaper || {
    title: project.name,
    authors: [],
    affiliations: [],
    runningHead: '',
    abstract: '',
    keywords: [],
    sections: [],
    references: []
  };
  const protocol = project.protocol || {
    methodologicalFramework: 'PRISMA 2020',
    dateRangeStart: 2020,
    dateRangeEnd: 2025,
    targetDatabases: []
  };
  const prismaCounts = project.prismaCounts || {
    totalIdentified: 0,
    duplicatesRemoved: 0,
    recordsScreened: 0,
    recordsExcluded: 0,
    studiesIncluded: 0
  };

  let md = `# ${reviewPaper.title || 'Systematic Review Manuscript'}\n\n`;
  md += `**Authors:** ${(reviewPaper.authors || []).join(', ')}\n`;
  md += `**Affiliations:** ${(reviewPaper.affiliations || []).join('; ')}\n`;
  md += `**Running Head:** ${reviewPaper.runningHead || ''}\n\n`;
  md += `---\n\n`;
  
  md += `## Abstract\n\n${reviewPaper.abstract || ''}\n\n`;
  md += `**Keywords:** ${(reviewPaper.keywords || []).join(', ')}\n\n`;
  md += `---\n\n`;

  md += `## Methodological Protocol & PRISMA Statement\n\n`;
  md += `- **Guideline:** ${protocol.methodologicalFramework || 'PRISMA 2020'}\n`;
  md += `- **Search Period:** ${protocol.dateRangeStart} - ${protocol.dateRangeEnd}\n`;
  md += `- **Databases:** ${(protocol.targetDatabases || []).join(', ')}\n`;
  md += `- **PRISMA Yield:** Total records identified: ${prismaCounts.totalIdentified}; Duplicates removed: ${prismaCounts.duplicatesRemoved}; Screened: ${prismaCounts.recordsScreened}; Excluded: ${prismaCounts.recordsExcluded}; Included in final synthesis: ${prismaCounts.studiesIncluded}.\n\n`;
  md += `---\n\n`;

  (reviewPaper.sections || []).forEach((sec) => {
    md += `## ${sec.number}. ${sec.title}\n\n`;
    md += `${sec.content}\n\n`;
  });

  md += `## References\n\n`;
  (reviewPaper.references || []).forEach((ref) => {
    md += `[${ref.citationKey}] ${ref.formattedReference}`;
    if (ref.doi) md += ` https://doi.org/${ref.doi}`;
    md += `\n\n`;
  });

  return md;
}

export const exportManuscriptMarkdown = exportReviewPaperToMarkdown;
export const exportEvidenceMatrixCSV = exportEvidenceMatrixToCsv;

export function exportBibTeX(project: ProjectData): string {
  return (project.papers || [])
    .map((p) => {
      const citeKey = p.customId || 'SP000';
      const authors = Array.isArray(p.authors) ? p.authors : ['Author'];
      const firstAuthor = authors[0] ? authors[0].split(' ').pop()?.toLowerCase() : 'author';
      const key = `${firstAuthor}${p.year || 2024}${citeKey.toLowerCase()}`;
      return `@article{${key},
  author    = {${authors.join(' and ')}},
  title     = {${p.title || 'Untitled'}},
  journal   = {${p.journal || 'Academic Journal'}},
  year      = {${p.year || 2024}},
  doi       = {${p.doi || ''}},
  abstract  = {${(p.abstract || '').replace(/\n/g, ' ')}}
}`;
    })
    .join('\n\n');
}

export function exportPrismaChecklistCSV(project: ProjectData): string {
  const checklist = project.prismaChecklist || [];
  const headers = ['Section and Topic', 'Item #', 'Checklist item', 'Location where item is reported', 'Compliance Status', 'Reviewer Notes'];
  const rows = checklist.map(i => [
    `"${i.section}: ${i.topic}"`,
    `"${i.itemNumber}"`,
    `"${(i.checklistDescription || '').replace(/"/g, '""')}"`,
    `"${(i.reportedLocation || '').replace(/"/g, '""')}"`,
    `"${i.complianceStatus}"`,
    `"${(i.notes || '').replace(/"/g, '""')}"`
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

export function exportPrismaChecklistMarkdown(project: ProjectData): string {
  const checklist = project.prismaChecklist || [];
  const total = checklist.length;
  const reported = checklist.filter(i => i.complianceStatus === 'Reported').length;
  const rate = total > 0 ? Math.round((reported / total) * 100) : 0;

  let md = `# PRISMA 2020 27-Item Checklist Compliance Statement\n\n`;
  md += `**Project Title:** ${project.name || 'Systematic Literature Review'}\n`;
  md += `**Methodological Standard:** PRISMA 2020 Statement (Page et al., BMJ 2021;372:n71)\n`;
  md += `**Compliance Score:** ${rate}% (${reported}/${total} Checklist Requirements Reported)\n\n`;
  md += `| Section and Topic | Item # | Checklist item | Location where item is reported | Status |\n`;
  md += `| :--- | :--- | :--- | :--- | :--- |\n`;

  checklist.forEach(item => {
    md += `| **${item.section}** - ${item.topic} | **${item.itemNumber}** | ${item.checklistDescription} | ${item.reportedLocation} | ${item.complianceStatus} |\n`;
  });

  md += `\n*Reference: Page MJ, McKenzie JE, Bossuyt PM, Boutron I, Hoffmann TC, Mulrow CD, et al. The PRISMA 2020 statement: an updated guideline for reporting systematic reviews. BMJ 2021;372:n71. doi: 10.1136/bmj.n71. (CC BY 4.0)*\n`;

  return md;
}

export function exportPrismaSummary(project: ProjectData): string {
  const pc = project.prismaCounts || {
    recordsScopus: 0,
    recordsWos: 0,
    recordsResearchGate: 0,
    recordsScholar: 0,
    recordsPubMed: 0,
    recordsIeee: 0,
    recordsOther: 0,
    totalIdentified: 0,
    duplicatesRemoved: 0,
    recordsScreened: 0,
    recordsExcluded: 0,
    studiesIncluded: 0
  };
  return `PRISMA 2020 Flow Diagram Summary
====================================
Project: ${project.name || 'Systematic Review'}
Protocol Framework: ${project.protocol?.methodologicalFramework || 'PRISMA 2020'}

1. IDENTIFICATION
- Scopus Records: ${pc.recordsScopus || 0}
- Web of Science Records: ${pc.recordsWos || 0}
- ResearchGate Records: ${pc.recordsResearchGate || 0}
- Google Scholar Records: ${pc.recordsScholar || 0}
- PubMed Records: ${pc.recordsPubMed || 0}
- IEEE Xplore Records: ${pc.recordsIeee || 0}
- Other Sources: ${pc.recordsOther || 0}
- Total Records Identified: ${pc.totalIdentified || 0}
- Duplicates Removed: ${pc.duplicatesRemoved || 0}

2. SCREENING
- Records Screened (Title/Abstract): ${pc.recordsScreened || 0}
- Records Excluded: ${pc.recordsExcluded || 0}

3. INCLUSION & SYNTHESIS
- Full Studies Included: ${pc.studiesIncluded || 0}
- Thematic Clusters Generated: ${(project.themes || []).length}
- Research Gaps Identified: ${(project.researchGaps || []).length}
- Supported Claims Formulated: ${(project.supportedClaims || []).length}
`;
}
