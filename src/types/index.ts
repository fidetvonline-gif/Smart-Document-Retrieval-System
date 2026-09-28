export type UserRole = 'ADMIN' | 'EDITOR' | 'VIEWER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  avatar: string;
  permissions: {
    canUpload: boolean;
    canEditMetadata: boolean;
    canDeleteDocs: boolean;
    canRerunOCR: boolean;
    canViewAuditTrail: boolean;
    canExportAudit: boolean;
    canRebuildIndex: boolean;
    canManageTaxonomy: boolean;
    canViewAdminDiagnostics: boolean;
  };
}

export type DocumentCategory =
  | 'Legal & Contracts'
  | 'Financial & Invoices'
  | 'Technical & Architecture'
  | 'Human Resources'
  | 'Marketing & Research'
  | 'Operational & Reports';

export type DocumentFormat = 'pdf' | 'docx' | 'txt' | 'csv' | 'png' | 'jpg';

export type ProcessingStatus =
  | 'Pending'
  | 'Ingestion'
  | 'OCR_Extracting'
  | 'Classifying'
  | 'Tokenizing'
  | 'Indexed'
  | 'Failed';

export interface DocumentEntities {
  organizations: string[];
  persons: string[];
  dates: string[];
  monetaryValues: string[];
  referenceNumbers: string[];
}

export interface DocumentItem {
  id: string;
  title: string;
  fileName: string;
  fileType: DocumentFormat;
  fileSize: number;
  uploadDate: string;
  uploadedBy: string;
  category: DocumentCategory;
  status: ProcessingStatus;
  ocrConfidence: number;
  classificationConfidence: number;
  wordCount: number;
  tags: string[];
  entities: DocumentEntities;
  summary: string;
  content: string;
  previewUrl?: string;
  lastModified?: string;
  lastModifiedBy?: string;
  pageCount?: number;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: {
    id: string;
    name: string;
    role: UserRole;
  };
  action:
    | 'DOCUMENT_UPLOAD'
    | 'DOCUMENT_VIEW'
    | 'DOCUMENT_DOWNLOAD'
    | 'DOCUMENT_EDIT'
    | 'DOCUMENT_DELETE'
    | 'OCR_PROCESSED'
    | 'METADATA_UPDATE'
    | 'SEARCH_QUERY'
    | 'SYSTEM_INDEX_REBUILT'
    | 'ROLE_SWITCHED'
    | 'TAXONOMY_UPDATE';
  resource: string;
  resourceId: string;
  status: 'SUCCESS' | 'WARNING' | 'DENIED' | 'FAILED';
  ip: string;
  details: string;
}

export interface RelevanceBreakdown {
  tfidfWeight: number; // 0.0 - 1.0
  titleBoost: number; // 0.0 - 1.0
  tagBoost: number;
  categoryBoost: number;
  finalScore: number; // 0 - 100%
  matchedTerms: string[];
  snippet: string;
}

export interface SearchResultItem extends DocumentItem {
  relevance: RelevanceBreakdown;
}

export interface SystemStats {
  totalDocuments: number;
  totalWordsIndexed: number;
  totalStorageBytes: number;
  storageFormatted: string;
  averageOcrConfidence: string;
  activeQueriesToday: number;
  queryLatencyP95Ms: string;
  categoryCounts: Record<string, number>;
  fileTypeCounts: Record<string, number>;
  recentAuditsCount: number;
}

export interface MySQLColumn {
  name: string;
  type: string;
  constraints: string;
  description: string;
}

export interface MySQLTableSchema {
  tableName: string;
  description: string;
  primaryKey: string;
  columns: MySQLColumn[];
  foreignKeys?: { column: string; references: string }[];
  indexes: string[];
}
