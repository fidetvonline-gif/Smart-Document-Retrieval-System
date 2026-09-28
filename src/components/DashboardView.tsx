import React from 'react';
import {
  FileText,
  Search,
  CheckCircle,
  HardDrive,
  Upload,
  ArrowRight,
  TrendingUp,
  Clock,
  Layers,
  BarChart2
} from 'lucide-react';
import { DocumentItem, SystemStats, UserRole } from '../types';
import { FormatBadge } from './FormatIcon';

interface DashboardViewProps {
  stats: SystemStats;
  documents: DocumentItem[];
  userRole: UserRole;
  onSelectTab: (tab: string) => void;
  onOpenDocument: (doc: DocumentItem) => void;
  onQuickSearch: (query: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  documents,
  userRole,
  onSelectTab,
  onOpenDocument,
  onQuickSearch
}) => {
  const topQueries = [
    { text: 'service level agreement liability', count: 28, category: 'Legal & Contracts' },
    { text: 'nvidia a100 gpu invoice', count: 21, category: 'Financial & Invoices' },
    { text: 'inverted index tfidf spec', count: 19, category: 'Technical & Architecture' },
    { text: 'redis cluster postmortem outage', count: 14, category: 'Operational & Reports' },
    { text: 'mutual nda confidentiality', count: 12, category: 'Legal & Contracts' }
  ];

  const categories = [
    'Legal & Contracts',
    'Financial & Invoices',
    'Technical & Architecture',
    'Operational & Reports',
    'Human Resources',
    'Marketing & Research'
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
            System Overview
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Enterprise document index, OCR extraction pipeline, and search performance metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectTab('search')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs transition-colors"
          >
            <Search size={14} className="text-slate-500" />
            <span>Search Index</span>
          </button>

          {userRole !== 'VIEWER' && (
            <button
              onClick={() => onSelectTab('upload')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-slate-900 hover:bg-slate-800 text-white shadow-2xs transition-colors"
            >
              <Upload size={14} />
              <span>Upload Document</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-4 rounded-lg bg-white border border-slate-200">
          <div className="text-xs font-medium text-slate-500 mb-1">
            Total Indexed Documents
          </div>
          <div className="text-2xl font-semibold text-slate-900 tabular-nums">
            {stats.totalDocuments}
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Across 6 file formats
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-lg bg-white border border-slate-200">
          <div className="text-xs font-medium text-slate-500 mb-1">
            Search Latency (p95)
          </div>
          <div className="text-2xl font-semibold text-slate-900 tabular-nums">
            {stats.queryLatencyP95Ms}
          </div>
          <div className="mt-2 text-[11px] text-emerald-700 font-medium">
            In-memory inverted index
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-lg bg-white border border-slate-200">
          <div className="text-xs font-medium text-slate-500 mb-1">
            Mean OCR Confidence
          </div>
          <div className="text-2xl font-semibold text-slate-900 tabular-nums">
            {stats.averageOcrConfidence}
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Evaluated on scanned files
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-lg bg-white border border-slate-200">
          <div className="text-xs font-medium text-slate-500 mb-1">
            Vocabulary Tokens
          </div>
          <div className="text-2xl font-semibold text-slate-900 tabular-nums">
            {stats.totalWordsIndexed.toLocaleString()}
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            {stats.storageFormatted} indexed content
          </div>
        </div>
      </div>

      {/* Middle Section: Taxonomy Distribution & Format Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown (2 Cols) */}
        <div className="lg:col-span-2 p-5 rounded-lg bg-white border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Document Classification Taxonomy</h2>
              <p className="text-xs text-slate-500">Distribution across active organization domains</p>
            </div>
            <button
              onClick={() => onSelectTab('repository')}
              className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-medium"
            >
              <span>View Repository</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="space-y-3">
            {categories.map((cat) => {
              const count = stats.categoryCounts[cat] || 0;
              const total = stats.totalDocuments || 1;
              const percentage = Math.round((count / total) * 100);

              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700">{cat}</span>
                    <span className="text-slate-500 font-mono text-[11px]">
                      {count} {count === 1 ? 'doc' : 'docs'} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-slate-800 transition-all duration-300"
                      style={{ width: `${Math.max(percentage, 4)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Format Breakdown */}
        <div className="p-5 rounded-lg bg-white border border-slate-200 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 mb-1">Supported Ingestion Formats</h2>
            <p className="text-xs text-slate-500 mb-4">Ingestion counters by extension</p>

            <div className="divide-y divide-slate-100 text-xs">
              {[
                { ext: 'pdf', label: 'PDF Documents' },
                { ext: 'docx', label: 'Word Specifications' },
                { ext: 'txt', label: 'Plaintext Logs' },
                { ext: 'csv', label: 'Structured Spreadsheets' },
                { ext: 'png', label: 'PNG Scanned Images' },
                { ext: 'jpg', label: 'JPG Receipts' }
              ].map(f => {
                const count = stats.fileTypeCounts[f.ext] || 0;
                return (
                  <div key={f.ext} className="py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FormatBadge format={f.ext} />
                      <span className="text-slate-700">{f.label}</span>
                    </div>
                    <span className="font-mono text-slate-900 font-medium">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            Database: MySQL 8.0 with inverted postings table
          </div>
        </div>
      </div>

      {/* Bottom Section: Frequent Queries & Recent Ingestion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Frequent Search Queries */}
        <div className="p-5 rounded-lg bg-white border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-900">Frequent Retrieval Queries</h2>
            <span className="text-xs text-slate-400">Click query to run</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {topQueries.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onQuickSearch(q.text);
                  onSelectTab('search');
                }}
                className="w-full text-left py-2.5 flex items-center justify-between hover:bg-slate-50 px-1.5 rounded transition-colors group"
              >
                <div className="flex items-center gap-2.5 truncate pr-2">
                  <span className="text-[11px] font-mono text-slate-400 w-4">{idx + 1}.</span>
                  <span className="font-medium text-slate-800 group-hover:text-slate-900 truncate">
                    {q.text}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-slate-500 flex-shrink-0 text-[11px]">
                  <span>{q.category}</span>
                  <span className="font-mono">{q.count} searches</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Ingested Documents */}
        <div className="p-5 rounded-lg bg-white border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-900">Recently Ingested Documents</h2>
            <button
              onClick={() => onSelectTab('repository')}
              className="text-xs text-slate-600 hover:text-slate-900 font-medium"
            >
              All Documents
            </button>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {documents.slice(0, 4).map((doc) => (
              <div
                key={doc.id}
                onClick={() => onOpenDocument(doc)}
                className="py-2.5 flex items-center justify-between hover:bg-slate-50 px-1.5 rounded cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <FormatBadge format={doc.fileType} />
                  <div className="truncate">
                    <div className="font-medium text-slate-900 truncate hover:underline">
                      {doc.title}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      {doc.fileName} · {(doc.fileSize / 1024).toFixed(0)} KB · OCR {doc.ocrConfidence}%
                    </div>
                  </div>
                </div>
                <span className="text-[11px] text-slate-500 flex-shrink-0">
                  {new Date(doc.uploadDate).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
