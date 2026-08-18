import { LiteraturePaper, DuplicatePair, DuplicateStatus } from '../types';

// Fast token similarity (Jaccard similarity on n-grams / words)
export function calculateTokenSimilarity(str1: string, str2: string): number {
  if (!str1 || !str2) return 0;
  if (str1 === str2) return 1.0;

  const tokens1 = new Set(str1.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(Boolean));
  const tokens2 = new Set(str2.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(Boolean));

  if (tokens1.size === 0 || tokens2.size === 0) return 0;

  let intersection = 0;
  for (const t of tokens1) {
    if (tokens2.has(t)) intersection++;
  }

  const union = new Set([...tokens1, ...tokens2]).size;
  return intersection / union;
}

// Levenshtein distance similarity
export function calculateLevenshteinSimilarity(s1: string, s2: string): number {
  if (s1 === s2) return 1.0;
  if (!s1 || !s2) return 0;

  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  const longerLength = longer.length;
  if (longerLength === 0) return 1.0;

  const costs: number[] = [];
  for (let i = 0; i <= shorter.length; i++) {
    costs[i] = i;
  }

  for (let i = 1; i <= longer.length; i++) {
    costs[0] = i;
    let nw = i - 1;
    for (let j = 1; j <= shorter.length; j++) {
      const cj = Math.min(
        1 + Math.min(costs[j], costs[j - 1]),
        longer[i - 1] === shorter[j - 1] ? nw : nw + 1
      );
      nw = costs[j];
      costs[j] = cj;
    }
  }

  return (longerLength - costs[shorter.length]) / longerLength;
}

export function calculateAuthorSimilarity(authorsA: string[], authorsB: string[]): number {
  if (!authorsA.length || !authorsB.length) return 0;

  const getSurname = (a: string) => {
    const parts = a.split(/[\s,]+/);
    return parts[parts.length - 1].toLowerCase().replace(/[^\w]/g, '');
  };

  const a1 = getSurname(authorsA[0]);
  const b1 = getSurname(authorsB[0]);

  if (a1 && b1 && a1 === b1) return 1.0;
  
  // Set overlap of surnames
  const setA = new Set(authorsA.map(getSurname).filter(Boolean));
  const setB = new Set(authorsB.map(getSurname).filter(Boolean));

  let common = 0;
  for (const s of setA) {
    if (setB.has(s)) common++;
  }

  return common / Math.max(setA.size, setB.size, 1);
}

export function classifySimilarity(score: number): DuplicateStatus {
  if (score >= 0.95) return 'definite';
  if (score >= 0.90) return 'high_probability';
  if (score >= 0.80) return 'possible';
  if (score >= 0.70) return 'related_distinct';
  return 'distinct';
}

export interface DeduplicationOptions {
  exactDoi?: boolean;
  exactTitle?: boolean;
  fuzzyTitleThreshold?: number;
  metadataComparison?: boolean;
  semanticAbstractThreshold?: number;
}

export function findDuplicatePairs(papers: LiteraturePaper[], options: DeduplicationOptions = {}): {
  duplicatePairs: DuplicatePair[];
  updatedPapers: LiteraturePaper[];
} {
  const {
    exactDoi = true,
    exactTitle = true,
    fuzzyTitleThreshold = 0.85,
    metadataComparison = true,
    semanticAbstractThreshold = 0.88
  } = options;

  const pairs: DuplicatePair[] = [];
  const n = papers.length;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const pA = papers[i];
      const pB = papers[j];

      let score = 0;
      let basisDetails: string[] = [];
      const doiMatch = !!(pA.normalizedDoi && pB.normalizedDoi && pA.normalizedDoi === pB.normalizedDoi);
      const exactTitleMatch = !!(pA.normalizedTitle && pB.normalizedTitle && pA.normalizedTitle === pB.normalizedTitle);

      const titleSimLev = calculateLevenshteinSimilarity(pA.normalizedTitle, pB.normalizedTitle);
      const titleSimToken = calculateTokenSimilarity(pA.normalizedTitle, pB.normalizedTitle);
      const titleSim = Math.max(titleSimLev, titleSimToken);

      const authorSim = calculateAuthorSimilarity(pA.authors, pB.authors);
      const yearMatch = pA.year && pB.year && pA.year === pB.year;
      const abstractSim = calculateTokenSimilarity(pA.abstract, pB.abstract);

      // Level 1: DOI Match
      if (exactDoi && doiMatch) {
        score = 1.0;
        basisDetails.push('Level 1: Exact Normalized DOI Match (' + pA.doi + ')');
      } 
      // Level 2: Exact Title Match
      else if (exactTitle && exactTitleMatch) {
        score = 0.98;
        basisDetails.push('Level 2: Exact Normalized Title Match');
        if (authorSim > 0.5) score = 0.99;
      }
      // Level 3: Fuzzy Title Similarity
      else if (titleSim >= fuzzyTitleThreshold) {
        score = titleSim * 0.95;
        basisDetails.push(`Level 3: High Fuzzy Title Similarity (${Math.round(titleSim * 100)}%)`);
        if (authorSim >= 0.7 && yearMatch) {
          score = Math.min(1.0, score + 0.08);
          basisDetails.push(`Matched author & year (${pA.year})`);
        }
      }
      // Level 4: Metadata comparison (Author + Year + Journal + Partial Title)
      else if (metadataComparison && authorSim >= 0.8 && yearMatch && titleSim >= 0.65) {
        score = 0.88;
        basisDetails.push(`Level 4: Multi-field Metadata Match (First Author: ${pA.authors[0] || 'N/A'}, Year: ${pA.year})`);
      }
      // Level 5: Abstract Semantic Similarity
      else if (abstractSim >= semanticAbstractThreshold && pA.abstract.length > 50 && pB.abstract.length > 50) {
        score = abstractSim * 0.92;
        basisDetails.push(`Level 5: High Abstract Text/Semantic Overlap (${Math.round(abstractSim * 100)}%)`);
      }

      if (score >= 0.70) {
        const status = classifySimilarity(score);
        pairs.push({
          id: `dup_${pA.id}_${pB.id}`,
          paperA: pA,
          paperB: pB,
          similarityScore: Math.round(score * 1000) / 10,
          status,
          detectionBasis: {
            doiMatch,
            titleSimilarity: Math.round(titleSim * 100),
            authorSimilarity: Math.round(authorSim * 100),
            yearMatch: !!yearMatch,
            abstractSimilarity: Math.round(abstractSim * 100),
            details: basisDetails.join(' | ') || 'Composite text and metadata similarity'
          },
          resolution: score >= 0.95 ? 'confirmed_duplicate' : 'unresolved'
        });
      }
    }
  }

  // Determine Master Records & Mark duplicates
  const updatedPapers = papers.map(p => ({ ...p }));
  
  // High confidence duplicates automatically mark secondary paper as duplicate
  for (const pair of pairs) {
    if (pair.similarityScore >= 95) {
      const idxA = updatedPapers.findIndex(p => p.id === pair.paperA.id);
      const idxB = updatedPapers.findIndex(p => p.id === pair.paperB.id);

      if (idxA !== -1 && idxB !== -1) {
        // Choose best master record
        const scoreA = getMasterRecordScore(updatedPapers[idxA]);
        const scoreB = getMasterRecordScore(updatedPapers[idxB]);

        const masterIdx = scoreA >= scoreB ? idxA : idxB;
        const slaveIdx = scoreA >= scoreB ? idxB : idxA;

        // Merge sources and missing fields into master
        const master = updatedPapers[masterIdx];
        const slave = updatedPapers[slaveIdx];

        master.sources = Array.from(new Set([...master.sources, ...slave.sources]));
        if (!master.doi && slave.doi) {
          master.doi = slave.doi;
          master.normalizedDoi = slave.normalizedDoi;
        }
        if ((!master.abstract || master.abstract.length < 50) && slave.abstract) {
          master.abstract = slave.abstract;
        }
        if (slave.keywords && slave.keywords.length > 0) {
          master.keywords = Array.from(new Set([...master.keywords, ...slave.keywords]));
        }

        master.isMaster = true;
        slave.isDuplicateOf = master.id;
        slave.duplicateScore = pair.similarityScore;
        slave.duplicateBasis = [pair.detectionBasis.details];
      }
    }
  }

  return { duplicatePairs: pairs, updatedPapers };
}

export function getMasterRecordScore(p: LiteraturePaper): number {
  let score = 0;
  if (p.doi && p.doi.length > 5) score += 40;
  if (p.abstract && p.abstract.length > 100) score += 30;
  if (p.authors && p.authors.length > 1) score += 15;
  if (p.keywords && p.keywords.length > 0) score += 10;
  if (p.volume || p.issue) score += 5;
  return score;
}
