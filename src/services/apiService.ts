import { DocumentItem, SearchResultItem, SystemStats, UserRole } from '../types';
import { INITIAL_DOCUMENTS } from './mockData';
import { TfIdfEngine } from './tfidfEngine';

const DOCS_STORAGE_KEY = 'smart_doc_repository_v1';

export class ApiService {
  private static localDocs: DocumentItem[] = [];
  private static tfidfEngine: TfIdfEngine = new TfIdfEngine();

  public static initialize(): DocumentItem[] {
    try {
      const stored = localStorage.getItem(DOCS_STORAGE_KEY);
      if (stored) {
        this.localDocs = JSON.parse(stored);
      } else {
        this.localDocs = [...INITIAL_DOCUMENTS];
        localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(this.localDocs));
      }
    } catch {
      this.localDocs = [...INITIAL_DOCUMENTS];
    }

    this.tfidfEngine.buildIndex(this.localDocs);
    return this.localDocs;
  }

  public static getDocuments(): DocumentItem[] {
    if (this.localDocs.length === 0) {
      return this.initialize();
    }
    return this.localDocs;
  }

  public static async fetchDocumentsFromServer(): Promise<DocumentItem[]> {
    try {
      const res = await fetch('/api/documents');
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          this.localDocs = json.data;
          this.tfidfEngine.buildIndex(this.localDocs);
          localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(this.localDocs));
          return this.localDocs;
        }
      }
    } catch {
      // Fallback to local
    }
    return this.getDocuments();
  }

  public static search(
    query: string,
    options?: {
      category?: string;
      fileType?: string;
      minScore?: number;
      minOcrConfidence?: number;
    }
  ): SearchResultItem[] {
    if (this.localDocs.length === 0) {
      this.initialize();
    }
    return this.tfidfEngine.search(query, options);
  }

  public static saveDocument(doc: DocumentItem): DocumentItem {
    const docs = this.getDocuments();
    const index = docs.findIndex(d => d.id === doc.id);
    if (index >= 0) {
      docs[index] = doc;
    } else {
      docs.unshift(doc);
    }
    this.localDocs = docs;
    this.tfidfEngine.buildIndex(docs);

    try {
      localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(docs));
    } catch {
      // ignore
    }

    // Attempt fire-and-forget sync to Express server
    fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doc)
    }).catch(() => {});

    return doc;
  }

  public static updateDocumentMetadata(
    id: string,
    updates: Partial<DocumentItem>,
    role: UserRole,
    user: string
  ): DocumentItem {
    const docs = this.getDocuments();
    const index = docs.findIndex(d => d.id === id);
    if (index === -1) {
      throw new Error('Document not found');
    }

    const updated = {
      ...docs[index],
      ...updates,
      lastModified: new Date().toISOString(),
      lastModifiedBy: user
    };

    docs[index] = updated;
    this.localDocs = docs;
    this.tfidfEngine.buildIndex(docs);

    try {
      localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(docs));
    } catch {
      // ignore
    }

    fetch(`/api/documents/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, user, ...updates })
    }).catch(() => {});

    return updated;
  }

  public static deleteDocument(id: string, role: UserRole, user: string): boolean {
    const docs = this.getDocuments();
    const index = docs.findIndex(d => d.id === id);
    if (index === -1) return false;

    docs.splice(index, 1);
    this.localDocs = docs;
    this.tfidfEngine.buildIndex(docs);

    try {
      localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(docs));
    } catch {
      // ignore
    }

    fetch(`/api/documents/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, user })
    }).catch(() => {});

    return true;
  }

  public static rebuildTfIdfIndex(): { count: number; vocabularySize: number } {
    const docs = this.getDocuments();
    this.tfidfEngine.buildIndex(docs);
    return {
      count: docs.length,
      vocabularySize: this.tfidfEngine.getVocabularySize()
    };
  }

  public static getStats(): SystemStats {
    const docs = this.getDocuments();
    const totalBytes = docs.reduce((sum, d) => sum + (d.fileSize || 0), 0);
    const totalWords = docs.reduce((sum, d) => sum + (d.wordCount || 0), 0);
    const avgOcr = (docs.reduce((sum, d) => sum + (d.ocrConfidence || 98), 0) / (docs.length || 1)).toFixed(1);

    const categoryCounts: Record<string, number> = {};
    const fileTypeCounts: Record<string, number> = {};

    docs.forEach(d => {
      categoryCounts[d.category] = (categoryCounts[d.category] || 0) + 1;
      fileTypeCounts[d.fileType] = (fileTypeCounts[d.fileType] || 0) + 1;
    });

    return {
      totalDocuments: docs.length,
      totalWordsIndexed: totalWords,
      totalStorageBytes: totalBytes,
      storageFormatted: `${(totalBytes / (1024 * 1024)).toFixed(2)} MB`,
      averageOcrConfidence: `${avgOcr}%`,
      activeQueriesToday: 48,
      queryLatencyP95Ms: '12.4 ms',
      categoryCounts,
      fileTypeCounts,
      recentAuditsCount: 16
    };
  }
}
