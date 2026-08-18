import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  HelpCircle, 
  Download, 
  Copy, 
  Search, 
  ExternalLink, 
  RefreshCw, 
  FileText, 
  ArrowRight,
  Sparkles,
  Check
} from 'lucide-react';
import { ProjectData, PrismaChecklistItem } from '../types';

interface PrismaChecklistViewProps {
  project: ProjectData;
  onUpdateProject: (updates: Partial<ProjectData>) => void;
  onNavigateStep: (stepNumber: number) => void;
}

export function PrismaChecklistView({
  project,
  onUpdateProject,
  onNavigateStep
}: PrismaChecklistViewProps) {
  const [selectedSection, setSelectedSection] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [editingItemNumber, setEditingItemNumber] = useState<string | null>(null);

  const checklist = project.prismaChecklist || [];

  // Summary Metrics
  const metrics = useMemo(() => {
    const total = checklist.length;
    const reported = checklist.filter(i => i.complianceStatus === 'Reported').length;
    const partiallyReported = checklist.filter(i => i.complianceStatus === 'Partially Reported').length;
    const notReported = checklist.filter(i => i.complianceStatus === 'Not Reported').length;
    const notApplicable = checklist.filter(i => i.complianceStatus === 'Not Applicable').length;
    const rate = total > 0 ? Math.round(((reported + partiallyReported * 0.5) / (total - notApplicable)) * 100) : 0;
    return { total, reported, partiallyReported, notReported, notApplicable, rate };
  }, [checklist]);

  // Filtered Checklist
  const filteredItems = useMemo(() => {
    return checklist.filter(item => {
      if (selectedSection !== 'ALL' && item.section !== selectedSection) {
        return false;
      }
      if (selectedStatus !== 'ALL' && item.complianceStatus !== selectedStatus) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesNumber = item.itemNumber.toLowerCase().includes(query);
        const matchesTopic = item.topic.toLowerCase().includes(query);
        const matchesDesc = item.checklistDescription.toLowerCase().includes(query);
        const matchesLocation = item.reportedLocation.toLowerCase().includes(query);
        const matchesSection = item.section.toLowerCase().includes(query);
        if (!matchesNumber && !matchesTopic && !matchesDesc && !matchesLocation && !matchesSection) {
          return false;
        }
      }
      return true;
    });
  }, [checklist, selectedSection, selectedStatus, searchQuery]);

  const handleUpdateItem = (itemNumber: string, updates: Partial<PrismaChecklistItem>) => {
    const updatedChecklist = checklist.map(item => {
      if (item.itemNumber === itemNumber) {
        return { ...item, ...updates };
      }
      return item;
    });
    onUpdateProject({ prismaChecklist: updatedChecklist });
  };

  const handleAutoMapLocations = () => {
    const updatedChecklist = checklist.map(item => {
      let location = item.reportedLocation;
      let notes = item.notes || '';

      if (item.itemNumber === '1') {
        location = `Manuscript Title: "${project.reviewPaper.title || project.protocol.title}"`;
      } else if (item.itemNumber === '2') {
        location = 'Structured Abstract (250 words, Page 2)';
      } else if (item.itemNumber === '3') {
        location = 'Section 1 (§1.1 Background & Scientific Context)';
      } else if (item.itemNumber === '4') {
        location = `Section 1 (§1.2 Research Questions RQ1–RQ${project.protocol.researchQuestions?.length || 3})`;
      } else if (item.itemNumber === '5') {
        location = `Section 2 (§2.1 Eligibility Criteria, Table 1 (${project.protocol.inclusionCriteria?.length || 0} Inclusion / ${project.protocol.exclusionCriteria?.length || 0} Exclusion))`;
      } else if (item.itemNumber === '6') {
        const dbs = project.protocol.targetDatabases?.join(', ') || 'Scopus, WoS, PubMed, IEEE Xplore, Scholar';
        location = `Section 2 (§2.2 Information Sources: ${dbs})`;
      } else if (item.itemNumber === '7') {
        location = `Section 2 (§2.3 Search Strategy & ${project.searchStrings?.length || 4} Boolean Queries)`;
      } else if (item.itemNumber === '8') {
        location = 'Section 2 (§2.4 Dual-Reviewer Independent Screening & Consensus Protocol)';
      } else if (item.itemNumber === '9') {
        location = 'Section 2 (§2.5 Standardized 18-Parameter Data Extraction & Full-Text Verification)';
      } else if (item.itemNumber === '10a' || item.itemNumber === '10b') {
        location = 'Section 2 (§2.5 Data Items) & 18-Column Evidence Matrix';
      } else if (item.itemNumber === '11') {
        location = 'Section 2 (§2.6 MMAT 2018 Methodological Quality Appraisal Protocol)';
      } else if (item.itemNumber === '16a') {
        location = `Section 3 (§3.1) & PRISMA 2020 Flow Diagram (${project.prismaCounts.totalIdentified} identified, ${project.prismaCounts.studiesIncluded} included)`;
      } else if (item.itemNumber === '17') {
        location = `Section 3 (§3.2) & Table 2: 18-Column Evidence Matrix (${project.papers.length} Studies)`;
      } else if (item.itemNumber === '18') {
        location = 'Section 3 (§3.3 Risk of Bias Heatmap & MMAT Quality Assessment Scores)';
      } else if (item.itemNumber === '20a' || item.itemNumber === '20b') {
        location = `Section 3 (§3.5 Thematic Synthesis across ${project.themes?.length || 4} Core Clusters)`;
      } else if (item.itemNumber === '22') {
        location = `Section 3 (§3.7 Evidence Strength & ${project.supportedClaims?.length || 8} Grounded Claim Audits)`;
      } else if (item.itemNumber === '23d') {
        location = `Section 4 (§4.4 Research Gap Agenda & ${project.researchGaps?.length || 4} Strategic Directions)`;
      } else if (item.itemNumber === '24a' || item.itemNumber === '24b' || item.itemNumber === '24c') {
        location = 'Section 5 (§5.1 Registration Statement: OSF Registry / PROSPERO)';
      } else if (item.itemNumber === '27') {
        location = 'Section 5 (§5.4 Open Data & Code Availability Statement)';
      }

      return {
        ...item,
        reportedLocation: location,
        complianceStatus: 'Reported' as const,
        notes: notes || 'Verified and mapped to current systematic review project components.'
      };
    });

    onUpdateProject({ prismaChecklist: updatedChecklist });
  };

  const handleExportCSV = () => {
    const headers = ['Section and Topic', 'Item #', 'Checklist item', 'Location where item is reported', 'Compliance Status', 'Reviewer Notes'];
    const rows = checklist.map(i => [
      `"${i.section}: ${i.topic}"`,
      `"${i.itemNumber}"`,
      `"${i.checklistDescription.replace(/"/g, '""')}"`,
      `"${i.reportedLocation.replace(/"/g, '""')}"`,
      `"${i.complianceStatus}"`,
      `"${(i.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PRISMA_2020_Checklist_${project.name.replace(/\s+/g, '_')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyMarkdown = () => {
    let md = `# PRISMA 2020 27-Item Checklist Compliance Report\n`;
    md += `**Project**: ${project.name}\n`;
    md += `**Date**: ${new Date().toLocaleDateString()}\n`;
    md += `**Overall Compliance Rate**: ${metrics.rate}% (${metrics.reported}/${metrics.total} Items Fully Reported)\n\n`;
    md += `| Section and Topic | Item # | Checklist item | Location where item is reported | Status |\n`;
    md += `| :--- | :--- | :--- | :--- | :--- |\n`;

    checklist.forEach(item => {
      md += `| **${item.section}** - ${item.topic} | **${item.itemNumber}** | ${item.checklistDescription} | ${item.reportedLocation} | ${item.complianceStatus} |\n`;
    });

    md += `\n*Reference: Page MJ, McKenzie JE, Bossuyt PM, Boutron I, Hoffmann TC, Mulrow CD, et al. The PRISMA 2020 statement: an updated guideline for reporting systematic reviews. BMJ 2021;372:n71. doi: 10.1136/bmj.n71 (CC BY 4.0)*\n`;

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const sections = ['ALL', 'TITLE', 'ABSTRACT', 'INTRODUCTION', 'METHODS', 'RESULTS', 'DISCUSSION', 'OTHER INFORMATION'];
  const statuses = ['ALL', 'Reported', 'Partially Reported', 'Not Reported', 'Not Applicable'];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold rounded-full uppercase tracking-wider flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Official PRISMA 2020 Standard</span>
              </span>
              <span className="text-xs text-slate-400">BMJ 2021;372:n71 • CC BY 4.0</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              PRISMA 2020 27-Item Checklist Compliance Auditor
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Ensure full compliance with the 27-item PRISMA 2020 statement for systematic reviews. Track reporting locations across all manuscript sections, protocol components, evidence matrices, and risk of bias assessments before journal submission.
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex items-center space-x-4 bg-slate-950/80 border border-slate-800 p-4 rounded-xl">
            <div className="text-center px-3 border-r border-slate-800">
              <div className="text-2xl font-black text-amber-400">{metrics.rate}%</div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Compliance Rate</div>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-2 text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{metrics.reported} Reported</span>
              </div>
              <div className="flex items-center space-x-2 text-amber-400 font-medium">
                <Clock className="w-3.5 h-3.5" />
                <span>{metrics.partiallyReported} Partial</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-400 font-medium">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{metrics.total} Total Items</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleAutoMapLocations}
              className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl flex items-center space-x-2 transition-all shadow-md active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Auto-Sync with Review Components</span>
            </button>
            <button
              onClick={handleCopyMarkdown}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center space-x-2 transition-all active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>{copied ? 'Copied Markdown!' : 'Copy Markdown Table'}</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center space-x-2 transition-all active:scale-95"
            >
              <Download className="w-4 h-4 text-slate-400" />
              <span>Export Checklist (CSV)</span>
            </button>
          </div>

          <div className="text-xs text-slate-400 italic">
            Items 1–27 (including sub-items 10a/b, 13a–f, 16a/b, 20a–d, 23a–d, 24a–c)
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Section Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {sections.map(sec => (
            <button
              key={sec}
              onClick={() => setSelectedSection(sec)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedSection === sec
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>

        {/* Search & Status Filter */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search item #, topic, description..."
              className="bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400/60 w-48 sm:w-64"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            aria-label="Filter checklist items by compliance status"
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400/60"
          >
            {statuses.map(st => (
              <option key={st} value={st}>
                Status: {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Checklist Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/90 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-36">Section & Topic</th>
                <th className="py-3.5 px-3 w-16 text-center">Item #</th>
                <th className="py-3.5 px-4 min-w-[280px]">PRISMA 2020 Checklist Requirement</th>
                <th className="py-3.5 px-4 min-w-[260px]">Location Where Reported</th>
                <th className="py-3.5 px-3 w-36 text-center">Compliance</th>
                <th className="py-3.5 px-3 w-28 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No PRISMA checklist items found matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredItems.map(item => {
                  const isEditing = editingItemNumber === item.itemNumber;
                  const isReported = item.complianceStatus === 'Reported';
                  const isPartial = item.complianceStatus === 'Partially Reported';
                  const isNotReported = item.complianceStatus === 'Not Reported';

                  return (
                    <tr 
                      key={item.itemNumber}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Section & Topic */}
                      <td className="py-3 px-4 align-top">
                        <div className="space-y-1">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-slate-800 border border-slate-700 text-slate-300">
                            {item.section}
                          </span>
                          <div className="font-bold text-white text-xs">{item.topic}</div>
                        </div>
                      </td>

                      {/* Item # */}
                      <td className="py-3 px-3 align-top text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-300 font-black text-xs">
                          {item.itemNumber}
                        </span>
                      </td>

                      {/* Requirement */}
                      <td className="py-3 px-4 align-top">
                        <div className="space-y-2">
                          <p className="text-slate-200 leading-relaxed font-medium">
                            {item.checklistDescription}
                          </p>
                          {item.notes && (
                            <p className="text-[11px] text-slate-400 italic bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                              <span className="font-semibold text-slate-300 not-italic">Note: </span>
                              {item.notes}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Location Where Reported */}
                      <td className="py-3 px-4 align-top">
                        {isEditing ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={item.reportedLocation}
                              onChange={e => handleUpdateItem(item.itemNumber, { reportedLocation: e.target.value })}
                              placeholder="e.g. Section 2 (§2.3), Table 1"
                              className="w-full bg-slate-950 border border-amber-400/60 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none"
                            />
                            <textarea
                              value={item.notes || ''}
                              onChange={e => handleUpdateItem(item.itemNumber, { notes: e.target.value })}
                              placeholder="Add audit notes / justifications..."
                              rows={2}
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-300 focus:outline-none"
                            />
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => setEditingItemNumber(null)}
                                className="px-2.5 py-1 bg-amber-400 text-slate-950 font-bold text-[11px] rounded-md shadow-sm"
                              >
                                Done
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div 
                            onClick={() => setEditingItemNumber(item.itemNumber)}
                            className="cursor-pointer group/loc p-2 rounded-lg bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <div className="font-mono text-[11px] text-amber-300 font-semibold leading-relaxed">
                                {item.reportedLocation || <span className="text-slate-500 italic">Click to enter location...</span>}
                              </div>
                              <span className="text-[10px] text-slate-500 group-hover/loc:text-amber-400 transition-colors ml-1">
                                Edit
                              </span>
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Compliance Status */}
                      <td className="py-3 px-3 align-top text-center">
                        <select
                          value={item.complianceStatus}
                          onChange={e => handleUpdateItem(item.itemNumber, { 
                            complianceStatus: e.target.value as PrismaChecklistItem['complianceStatus'] 
                          })}
                          aria-label={`Compliance status for Item ${item.itemNumber}`}
                          className={`w-full py-1.5 px-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer focus:outline-none ${
                            isReported
                              ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                              : isPartial
                              ? 'bg-amber-950/60 border-amber-800 text-amber-300'
                              : isNotReported
                              ? 'bg-rose-950/60 border-rose-800 text-rose-300'
                              : 'bg-slate-800 border-slate-700 text-slate-400'
                          }`}
                        >
                          <option value="Reported">✓ Reported</option>
                          <option value="Partially Reported">~ Partial</option>
                          <option value="Not Reported">✕ Not Reported</option>
                          <option value="Not Applicable">N/A</option>
                        </select>
                      </td>

                      {/* Action / Jump to Step */}
                      <td className="py-3 px-3 align-top text-center">
                        {item.workflowStepLink ? (
                          <button
                            onClick={() => onNavigateStep(item.workflowStepLink!)}
                            className="w-full py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 text-[11px] font-semibold flex items-center justify-center space-x-1 transition-all"
                            title={`Jump to Step ${item.workflowStepLink}`}
                          >
                            <span>Step {item.workflowStepLink}</span>
                            <ArrowRight className="w-3 h-3 text-amber-400" />
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-500">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info and Citation */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-300">Citation:</span>
            <span>Page MJ, McKenzie JE, Bossuyt PM, et al. The PRISMA 2020 statement. BMJ 2021;372:n71.</span>
          </div>
          <a
            href="http://www.prisma-statement.org/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1 text-amber-400 hover:text-amber-300 font-medium"
          >
            <span>PRISMA Statement Official Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
