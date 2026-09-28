import { DocumentItem, RelevanceBreakdown, SearchResultItem } from '../types';

// Standard English Stopwords
export const STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as',
  'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can\'t', 'cannot',
  'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during', 'each',
  'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he',
  'he\'d', 'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how',
  'how\'s', 'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its',
  'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on',
  'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t',
  'she', 'she\'d', 'she\'ll', 'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s',
  'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d',
  'they\'ll', 'they\'re', 'they\'ve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very',
  'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when',
  'when\'s', 'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t',
  'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves'
]);

export function tokenize(text: string): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 1 && !STOPWORDS.has(token));
}

export interface InvertedIndexPosting {
  docId: string;
  termFrequency: number;
  positions: number[];
}

export class TfIdfEngine {
  private invertedIndex: Map<string, InvertedIndexPosting[]> = new Map();
  private docWordCounts: Map<string, number> = new Map();
  private documents: Map<string, DocumentItem> = new Map();

  constructor(initialDocs?: DocumentItem[]) {
    if (initialDocs && initialDocs.length > 0) {
      this.buildIndex(initialDocs);
    }
  }

  public buildIndex(docs: DocumentItem[]) {
    this.invertedIndex.clear();
    this.docWordCounts.clear();
    this.documents.clear();

    docs.forEach(doc => {
      this.documents.set(doc.id, doc);
      const fullText = `${doc.title} ${doc.summary} ${doc.content} ${(doc.tags || []).join(' ')}`;
      const tokens = tokenize(fullText);
      this.docWordCounts.set(doc.id, tokens.length || 1);

      const termFreqMap = new Map<string, { count: number; positions: number[] }>();
      tokens.forEach((token, index) => {
        if (!termFreqMap.has(token)) {
          termFreqMap.set(token, { count: 0, positions: [] });
        }
        const item = termFreqMap.get(token)!;
        item.count++;
        item.positions.push(index);
      });

      termFreqMap.forEach((data, token) => {
        if (!this.invertedIndex.has(token)) {
          this.invertedIndex.set(token, []);
        }
        this.invertedIndex.get(token)!.push({
          docId: doc.id,
          termFrequency: data.count,
          positions: data.positions
        });
      });
    });
  }

  public getVocabularySize(): number {
    return this.invertedIndex.size;
  }

  public search(
    query: string,
    options?: {
      category?: string;
      fileType?: string;
      minScore?: number;
      minOcrConfidence?: number;
    }
  ): SearchResultItem[] {
    const rawTokens = tokenize(query);
    const queryTokens = Array.from(new Set(rawTokens));
    const allDocs = Array.from(this.documents.values());
    const totalDocs = allDocs.length;

    if (totalDocs === 0) return [];

    // Filter by metadata first if provided
    let candidateDocs = allDocs;
    if (options?.category && options.category !== 'All') {
      candidateDocs = candidateDocs.filter(d => d.category.toLowerCase() === options.category!.toLowerCase());
    }
    if (options?.fileType && options.fileType !== 'All') {
      candidateDocs = candidateDocs.filter(d => d.fileType.toLowerCase() === options.fileType!.toLowerCase());
    }
    if (options?.minOcrConfidence && options.minOcrConfidence > 0) {
      candidateDocs = candidateDocs.filter(d => d.ocrConfidence >= options.minOcrConfidence!);
    }

    if (queryTokens.length === 0) {
      // Empty query returns all candidate documents with default relevance
      return candidateDocs.map(doc => ({
        ...doc,
        relevance: {
          tfidfWeight: 0.1,
          titleBoost: 0,
          tagBoost: 0,
          categoryBoost: 0,
          finalScore: 100,
          matchedTerms: [],
          snippet: doc.summary || doc.content.slice(0, 160) + '...'
        }
      }));
    }

    // Compute IDF for query terms
    const idfMap = new Map<string, number>();
    queryTokens.forEach(term => {
      const postings = this.invertedIndex.get(term) || [];
      const df = postings.length;
      // BM25/Lucene style IDF
      const idf = Math.log(1 + (totalDocs - df + 0.5) / (df + 0.5));
      idfMap.set(term, idf);
    });

    const results: SearchResultItem[] = [];

    candidateDocs.forEach(doc => {
      const docWordCount = this.docWordCounts.get(doc.id) || 1;
      let docTfIdf = 0;
      const matchedTerms: string[] = [];

      queryTokens.forEach(term => {
        const postings = this.invertedIndex.get(term) || [];
        const posting = postings.find(p => p.docId === doc.id);
        if (posting) {
          matchedTerms.push(term);
          // Normalized Term Frequency
          const tf = posting.termFrequency / docWordCount;
          const idf = idfMap.get(term) || 0.1;
          docTfIdf += tf * idf * 80;
        }
      });

      // Title & Tag Boosts
      let titleBoost = 0;
      let tagBoost = 0;
      let categoryBoost = 0;

      const titleLower = doc.title.toLowerCase();
      const tagsJoined = (doc.tags || []).join(' ').toLowerCase();
      const categoryLower = doc.category.toLowerCase();
      const queryLower = query.toLowerCase();

      // Exact title match gets massive boost
      if (titleLower.includes(queryLower)) {
        titleBoost += 0.40;
      } else {
        queryTokens.forEach(term => {
          if (titleLower.includes(term)) titleBoost += 0.15;
          if (tagsJoined.includes(term)) tagBoost += 0.10;
          if (categoryLower.includes(term)) categoryBoost += 0.10;
        });
      }

      // Exact phrase match in content
      if (doc.content.toLowerCase().includes(queryLower)) {
        titleBoost += 0.10;
      }

      // Final score formula: 0 to 100%
      const rawScore = (Math.min(0.65, docTfIdf) * 0.5) + (titleBoost * 0.3) + (tagBoost * 0.1) + (categoryBoost * 0.1);
      const normalizedScore = Math.min(1.0, rawScore * 2.2);
      const finalScorePercent = Math.max(1, Math.min(99, Math.round(normalizedScore * 100)));

      // Generate context snippet around matched terms
      const snippet = this.generateSnippet(doc.content, queryTokens);

      if (matchedTerms.length > 0 || titleBoost > 0) {
        results.push({
          ...doc,
          relevance: {
            tfidfWeight: parseFloat(Math.min(1.0, docTfIdf * 1.5).toFixed(2)),
            titleBoost: parseFloat(titleBoost.toFixed(2)),
            tagBoost: parseFloat(tagBoost.toFixed(2)),
            categoryBoost: parseFloat(categoryBoost.toFixed(2)),
            finalScore: finalScorePercent,
            matchedTerms,
            snippet
          }
        });
      }
    });

    // Sort by final score descending
    results.sort((a, b) => b.relevance.finalScore - a.relevance.finalScore);

    if (options?.minScore && options.minScore > 0) {
      return results.filter(r => r.relevance.finalScore >= options.minScore!);
    }

    return results;
  }

  private generateSnippet(content: string, terms: string[]): string {
    if (!content) return 'No preview text available.';
    if (terms.length === 0) return content.slice(0, 180) + '...';

    const lower = content.toLowerCase();
    let bestIndex = -1;

    for (const term of terms) {
      const idx = lower.indexOf(term);
      if (idx !== -1) {
        bestIndex = idx;
        break;
      }
    }

    if (bestIndex === -1) {
      return content.slice(0, 180) + '...';
    }

    const start = Math.max(0, bestIndex - 60);
    const end = Math.min(content.length, bestIndex + 140);
    let snippet = content.slice(start, end).trim();

    if (start > 0) snippet = '...' + snippet;
    if (end < content.length) snippet = snippet + '...';

    return snippet;
  }
}
