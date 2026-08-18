import { LiteraturePaper, LiteratureSource } from '../types';

export function normalizeDoi(doi: string | undefined): string {
  if (!doi) return '';
  let cleaned = doi.trim();
  cleaned = cleaned.replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, '');
  cleaned = cleaned.replace(/^doi:\s*/i, '');
  cleaned = cleaned.trim().toLowerCase();
  return cleaned;
}

export function normalizeTitle(title: string | undefined): string {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizeAuthors(authors: string[]): string[] {
  return authors.map(a => {
    const clean = a.trim().replace(/\.$/, '');
    return clean;
  }).filter(Boolean);
}

// Generate an academic short ID like SP001, SP002
export function generateCustomId(index: number): string {
  return `SP${String(index + 1).padStart(3, '0')}`;
}

export function parseRisFile(content: string, defaultSource: LiteratureSource = 'Scopus', existingCount = 0): LiteraturePaper[] {
  const papers: LiteraturePaper[] = [];
  const rawRecords = content.split(/(?:\r?\n)(?:ER\s+-\s*)/);

  let paperIndex = existingCount;

  for (const rawRecord of rawRecords) {
    if (!rawRecord.trim()) continue;

    const lines = rawRecord.split(/\r?\n/);
    let title = '';
    const authors: string[] = [];
    let year = 0;
    let doi = '';
    let abstract = '';
    let journal = '';
    const keywords: string[] = [];
    let volume = '';
    let issue = '';
    let startPage = '';
    let endPage = '';
    let url = '';
    let language = 'English';
    let docType = 'Journal Article';

    let currentTag = '';
    let currentValue = '';

    const flushField = (tag: string, val: string) => {
      const v = val.trim();
      if (!v) return;
      switch (tag) {
        case 'TI':
        case 'T1':
        case 'CT':
          if (!title) title = v;
          break;
        case 'AU':
        case 'A1':
        case 'A2':
          authors.push(v);
          break;
        case 'PY':
        case 'Y1':
        case 'DA': {
          const match = v.match(/\b(19\d{2}|20\d{2})\b/);
          if (match) year = parseInt(match[1], 10);
          break;
        }
        case 'DO':
        case 'DI':
          doi = v;
          break;
        case 'AB':
        case 'N2':
          abstract += (abstract ? ' ' : '') + v;
          break;
        case 'JO':
        case 'JF':
        case 'JA':
        case 'J2':
        case 'T2':
          if (!journal) journal = v;
          break;
        case 'KW':
          keywords.push(...v.split(/[;,]/).map(k => k.trim()).filter(Boolean));
          break;
        case 'VL':
          volume = v;
          break;
        case 'IS':
          issue = v;
          break;
        case 'SP':
          startPage = v;
          break;
        case 'EP':
          endPage = v;
          break;
        case 'UR':
        case 'LK':
          url = v;
          break;
        case 'LA':
          language = v;
          break;
        case 'TY':
          if (v === 'JOUR') docType = 'Journal Article';
          else if (v === 'CONF' || v === 'CPAPER') docType = 'Conference Paper';
          else if (v === 'BOOK') docType = 'Book';
          else if (v === 'CHAP') docType = 'Book Chapter';
          else if (v === 'REV') docType = 'Review Article';
          else docType = v;
          break;
      }
    };

    for (const line of lines) {
      const match = line.match(/^([A-Z0-9]{2})\s*-(?:\s+(.*)|$)/);
      if (match) {
        if (currentTag) {
          flushField(currentTag, currentValue);
        }
        currentTag = match[1];
        currentValue = match[2] || '';
      } else if (currentTag && line.startsWith('  ')) {
        currentValue += ' ' + line.trim();
      }
    }
    if (currentTag) {
      flushField(currentTag, currentValue);
    }

    if (!title && !abstract) continue;

    const id = `paper_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const customId = generateCustomId(paperIndex++);

    const pages = startPage && endPage ? `${startPage}-${endPage}` : (startPage || endPage || '');

    papers.push({
      id,
      customId,
      title: title || 'Untitled Record',
      normalizedTitle: normalizeTitle(title || 'Untitled Record'),
      authors: normalizeAuthors(authors.length > 0 ? authors : ['Unknown Author']),
      year: year || new Date().getFullYear(),
      doi: doi,
      normalizedDoi: normalizeDoi(doi),
      abstract: abstract || 'No abstract available in bibliographic record.',
      journal: journal || 'Academic Publication',
      keywords: Array.from(new Set(keywords)),
      volume,
      issue,
      pages,
      language,
      url,
      documentType: docType,
      sources: [defaultSource],
      rawRecord: rawRecord.trim() + '\nER  -'
    });
  }

  return papers;
}

export function parseBibtexFile(content: string, defaultSource: LiteratureSource = 'Web of Science', existingCount = 0): LiteraturePaper[] {
  const papers: LiteraturePaper[] = [];
  const entryRegex = /@(\w+)\s*\{\s*([^,]+),([^@]*)/g;
  let match;
  let paperIndex = existingCount;

  while ((match = entryRegex.exec(content)) !== null) {
    const rawType = match[1];
    const body = match[3];

    const getField = (field: string): string => {
      const regex = new RegExp(`${field}\\s*=\\s*[{"]([^}"]*)[}"]`, 'i');
      const m = body.match(regex);
      return m ? m[1].trim() : '';
    };

    const title = getField('title');
    const authorStr = getField('author');
    const yearStr = getField('year');
    const doi = getField('doi');
    const abstract = getField('abstract');
    const journal = getField('journal') || getField('booktitle');
    const keywordsStr = getField('keywords');
    const volume = getField('volume');
    const number = getField('number');
    const pages = getField('pages');
    const url = getField('url');

    if (!title && !abstract) continue;

    const authors = authorStr ? authorStr.split(/\s+and\s+/i).map(a => a.trim()).filter(Boolean) : ['Unknown Author'];
    const yearMatch = yearStr.match(/\b(19\d{2}|20\d{2})\b/);
    const year = yearMatch ? parseInt(yearMatch[1], 10) : new Date().getFullYear();
    const keywords = keywordsStr ? keywordsStr.split(/[,;]/).map(k => k.trim()).filter(Boolean) : [];

    let docType = 'Journal Article';
    if (/inproceedings|conference/i.test(rawType)) docType = 'Conference Paper';
    else if (/book/i.test(rawType)) docType = 'Book';

    const id = `paper_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const customId = generateCustomId(paperIndex++);

    papers.push({
      id,
      customId,
      title: title || 'Untitled Record',
      normalizedTitle: normalizeTitle(title || 'Untitled Record'),
      authors: normalizeAuthors(authors),
      year,
      doi,
      normalizedDoi: normalizeDoi(doi),
      abstract: abstract || 'No abstract available in bibliographic record.',
      journal: journal || 'Academic Publication',
      keywords: Array.from(new Set(keywords)),
      volume,
      issue: number,
      pages,
      url,
      documentType: docType,
      sources: [defaultSource],
      rawRecord: match[0]
    });
  }

  return papers;
}

export function parseCsvFile(content: string, defaultSource: LiteratureSource = 'Scopus', existingCount = 0): LiteraturePaper[] {
  const lines = content.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];

  // Simple CSV line parser taking quotes into account
  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === ',' && !inQuotes) {
        result.push(cur);
        cur = '';
      } else {
        cur += c;
      }
    }
    result.push(cur);
    return result.map(s => s.trim());
  };

  const headers = parseLine(lines[0]).map(h => h.toLowerCase().replace(/[^\w]/g, ''));
  const papers: LiteraturePaper[] = [];
  let paperIndex = existingCount;

  for (let i = 1; i < lines.length; i++) {
    const cols = parseLine(lines[i]);
    if (cols.length < 2) continue;

    const getCol = (...names: string[]): string => {
      for (const name of names) {
        const clean = name.toLowerCase().replace(/[^\w]/g, '');
        const idx = headers.indexOf(clean);
        if (idx !== -1 && cols[idx]) return cols[idx];
      }
      return '';
    };

    const title = getCol('title', 'articletitle', 'documenttitle');
    const authorsRaw = getCol('authors', 'author', 'authornames');
    const yearRaw = getCol('year', 'publicationyear', 'py');
    const doi = getCol('doi', 'digitalobjectidentifier');
    const abstract = getCol('abstract', 'ab', 'description');
    const journal = getCol('sourcetitle', 'journal', 'publicationtitle', 'booktitle');
    const keywordsRaw = getCol('authorkeywords', 'keywords', 'indexkeywords');
    const volume = getCol('volume', 'vol');
    const issue = getCol('issue', 'no');
    const pages = getCol('pages', 'page');
    const url = getCol('link', 'url', 'doiurl');
    const docType = getCol('documenttype', 'type') || 'Journal Article';

    if (!title && !abstract) continue;

    const authors = authorsRaw ? authorsRaw.split(/[;|]/).map(a => a.trim()).filter(Boolean) : ['Unknown Author'];
    const yearMatch = yearRaw.match(/\b(19\d{2}|20\d{2})\b/);
    const year = yearMatch ? parseInt(yearMatch[1], 10) : new Date().getFullYear();
    const keywords = keywordsRaw ? keywordsRaw.split(/[;,|]/).map(k => k.trim()).filter(Boolean) : [];

    const id = `paper_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const customId = generateCustomId(paperIndex++);

    papers.push({
      id,
      customId,
      title: title || 'Untitled Record',
      normalizedTitle: normalizeTitle(title || 'Untitled Record'),
      authors: normalizeAuthors(authors),
      year,
      doi,
      normalizedDoi: normalizeDoi(doi),
      abstract: abstract || 'No abstract available in bibliographic record.',
      journal: journal || 'Academic Publication',
      keywords: Array.from(new Set(keywords)),
      volume,
      issue,
      pages,
      url,
      documentType: docType,
      sources: [defaultSource],
      rawRecord: lines[i]
    });
  }

  return papers;
}

export function parseGenericLiteratureFile(content: string, filename: string, source: LiteratureSource, existingCount = 0): LiteraturePaper[] {
  const ext = filename.toLowerCase().split('.').pop();
  if (ext === 'ris' || ext === 'txt' || content.includes('TY  -')) {
    const risResult = parseRisFile(content, source, existingCount);
    if (risResult.length > 0) return risResult;
  }
  if (ext === 'bib' || ext === 'bibtex' || content.includes('@article') || content.includes('@inproceedings')) {
    const bibResult = parseBibtexFile(content, source, existingCount);
    if (bibResult.length > 0) return bibResult;
  }
  if (ext === 'csv' || ext === 'tsv' || ext === 'nbib') {
    const csvResult = parseCsvFile(content, source, existingCount);
    if (csvResult.length > 0) return csvResult;
  }

  // Fallback try RIS then BibTeX then CSV
  const fallbackRis = parseRisFile(content, source, existingCount);
  if (fallbackRis.length > 0) return fallbackRis;

  const fallbackBib = parseBibtexFile(content, source, existingCount);
  if (fallbackBib.length > 0) return fallbackBib;

  const fallbackCsv = parseCsvFile(content, source, existingCount);
  return fallbackCsv;
}
