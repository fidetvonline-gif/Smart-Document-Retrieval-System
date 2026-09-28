import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  ArrowUpDown,
  Eye,
  Edit3,
  Trash2,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Building,
  Calendar,
  DollarSign,
  Hash
} from 'lucide-react';
import { DocumentItem, SearchResultItem, UserRole } from '../types';
import { FormatBadge } from './FormatIcon';

interface SearchDiscoveryViewProps {
  searchResults: SearchResultItem[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedFormat: string;
  onFormatChange: (fmt: string) => void;
  onOpenDocument: (doc: DocumentItem) => void;
  onEditDocument: (doc: DocumentItem) => void;
  onDeleteDocument: (doc: DocumentItem) => void;
  userRole: UserRole;
  latencyMs?: number;
}

export const SearchDiscoveryView: React.FC<SearchDiscoveryViewProps> = ({
  searchResults,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedFormat,
  onFormatChange,
  onOpenDocument,
  onEditDocument,
  onDeleteDocument,
  userRole,
  latencyMs = 12
}) => {
  const [minScore, setMinScore] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'relevance' | 'date_desc' | 'date_asc' | 'title' | 'size'>('relevance');
  const [inspectingScoreId, setInspectingScoreId] = useState<string | null>(null);

  const categories = [
    'All',
    'Legal & Contracts',
    'Financial & Invoices',
    'Technical & Architecture',
    'Operational & Reports',
    'Human Resources',
    'Marketing & Research'
  ];

  const formats = ['All', 'pdf', 'docx', 'txt', 'csv', 'png', 'jpg'];

  const sortedResults = useMemo(() => {
    let list = [...searchResults];
    if (minScore > 0) {
      list = list.filter(r => r.relevance.finalScore >= minScore);
    }

    if (sortBy === 'relevance') {
      list.sort((a, b) => b.relevance.finalScore - a.relevance.finalScore);
    } else if (sortBy === 'date_desc') {
      list.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
    } else if (sortBy === 'date_asc') {
      list.sort((a, b) => new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime());
    } else if (sortBy === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'size') {
      list.sort((a, b) => b.fileSize - a.fileSize);
    }
    return list;
  }, [searchResults, minScore, sortBy]);

  const renderHighlightedSnippet = (snippet: string, matchedTerms: string[]) => {
    if (!matchedTerms || matchedTerms.length === 0 || !searchQuery.trim()) {
      return <span>{snippet}</span>;
    }

    const escapedTerms = matchedTerms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`(${escapedTerms.join('|')})`, 'gi');
    const parts = snippet.split(regex);

    return (
      <span>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <mark
              key={i}
              className="bg-amber-100 text-amber-950 font-medium px-0.5 rounded"
            >
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  };

  const sampleQueries = [
    'service level agreement liability',
    'nvidia a100 gpu invoice',
    'incident postmortem redis cache',
    'inverted index tfidf spec',
    'mutual nda confidentiality'
  ];

  return (
    <div className="space-y-5">
      {/* Top Search Card */}
      <div className="p-5 rounded-lg bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-lg font-semibold text-slate-900 tracking-tight">
              Document Search & Retrieval
            </h1>
            <p className="text-xs text-slate-500">
              Query indexed text across corporate documents with TF-IDF cosine relevance scoring
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <span>Query time: {latencyMs}ms</span>
            <span>·</span>
            <span>{sortedResults.length} {sortedResults.length === 1 ? 'result' : 'results'}</span>
          </div>
        </div>

        {/* Primary Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
          <input
            type="text"
            placeholder="Search keywords, contract terms, technical specifications, or file names..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-300 rounded-md pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-400 transition-colors"
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Sample queries */}
        <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500">
          <span className="text-[11px] font-medium text-slate-400">Sample queries:</span>
          {sampleQueries.map((q, idx) => (
            <button
              key={idx}
              onClick={() => onSearchChange(q)}
              className="hover:text-slate-900 hover:underline transition-colors cursor-pointer"
            >
              "{q}"
            </button>
          ))}
        </div>

        {/* Filter Toolbar */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="bg-white border border-slate-200 rounded px-2 py-1 text-slate-700 text-xs focus:outline-none focus:border-slate-400"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Format:</span>
              <select
                value={selectedFormat}
                onChange={(e) => onFormatChange(e.target.value)}
                className="bg-white border border-slate-200 rounded px-2 py-1 text-slate-700 uppercase text-xs focus:outline-none focus:border-slate-400"
              >
                {formats.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Threshold:</span>
              <select
                value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
                className="bg-white border border-slate-200 rounded px-2 py-1 text-slate-700 text-xs focus:outline-none focus:border-slate-400"
              >
                <option value={0}>All Scores (0%+)</option>
                <option value={40}>&gt; 40% Relevance</option>
                <option value={60}>&gt; 60% Relevance</option>
                <option value={80}>&gt; 80% Match</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-slate-500 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-slate-200 rounded px-2 py-1 text-slate-700 text-xs focus:outline-none focus:border-slate-400"
            >
              <option value="relevance">Relevance Score</option>
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="title">Title (A-Z)</option>
              <option value="size">File Size</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Feed */}
      {sortedResults.length === 0 ? (
        <div className="p-12 rounded-lg bg-white border border-slate-200 text-center space-y-2">
          <div className="text-sm font-semibold text-slate-800">No documents found</div>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            No indexed documents match the current search keywords and filter criteria. Try adjusting your query terms or clearing the category filter.
          </p>
          <button
            onClick={() => {
              onSearchChange('');
              onCategoryChange('All');
              onFormatChange('All');
              setMinScore(0);
            }}
            className="mt-2 px-3 py-1.5 text-xs font-medium rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedResults.map((doc) => {
            const isInspecting = inspectingScoreId === doc.id;

            return (
              <div
                key={doc.id}
                className="p-4 rounded-lg bg-white border border-slate-200 hover:border-slate-300 transition-colors space-y-2.5 shadow-2xs"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500">
                      <FormatBadge format={doc.fileType} />
                      <span className="font-medium text-slate-700">{doc.category}</span>
                      <span>·</span>
                      <span className="font-mono text-[11px]">{doc.fileName}</span>
                      <span>·</span>
                      <span className="font-mono text-[11px]">{(doc.fileSize / 1024).toFixed(0)} KB</span>
                      <span>·</span>
                      <span className="text-[11px]">OCR: {doc.ocrConfidence}%</span>
                    </div>

                    <h2
                      onClick={() => onOpenDocument(doc)}
                      className="text-sm font-semibold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors"
                    >
                      {doc.title}
                    </h2>
                  </div>

                  {/* Relevance Score */}
                  <div className="flex items-center gap-2 self-start flex-shrink-0">
                    <div className="text-right">
                      <span className="text-xs font-mono font-semibold text-slate-900 tabular-nums">
                        {doc.relevance.finalScore}% match
                      </span>
                    </div>
                    <button
                      onClick={() => setInspectingScoreId(isInspecting ? null : doc.id)}
                      className="text-slate-400 hover:text-slate-600 p-0.5"
                      title="Toggle score details"
                    >
                      {isInspecting ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>
                </div>

                {/* Score breakdown drawer */}
                {isInspecting && (
                  <div className="p-3 rounded-md bg-slate-50 border border-slate-200 text-xs space-y-2">
                    <div className="font-medium text-slate-700 text-[11px]">
                      Relevance Calculation Breakdown
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px]">
                      <div className="p-1.5 rounded bg-white border border-slate-200">
                        <div className="text-slate-500 text-[10px]">TF-IDF Score</div>
                        <div className="font-mono font-semibold text-slate-800 tabular-nums">
                          {doc.relevance.tfidfWeight}
                        </div>
                      </div>
                      <div className="p-1.5 rounded bg-white border border-slate-200">
                        <div className="text-slate-500 text-[10px]">Title Boost</div>
                        <div className="font-mono font-semibold text-slate-800 tabular-nums">
                          +{doc.relevance.titleBoost}
                        </div>
                      </div>
                      <div className="p-1.5 rounded bg-white border border-slate-200">
                        <div className="text-slate-500 text-[10px]">Tag Boost</div>
                        <div className="font-mono font-semibold text-slate-800 tabular-nums">
                          +{doc.relevance.tagBoost}
                        </div>
                      </div>
                      <div className="p-1.5 rounded bg-white border border-slate-200">
                        <div className="text-slate-500 text-[10px]">Normalized Total</div>
                        <div className="font-mono font-semibold text-slate-900 tabular-nums">
                          {doc.relevance.finalScore}%
                        </div>
                      </div>
                    </div>
                    {doc.relevance.matchedTerms.length > 0 && (
                      <div className="text-[11px] text-slate-500">
                        Matched tokens: <span className="font-mono text-slate-700">{doc.relevance.matchedTerms.join(', ')}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Snippet */}
                <div className="p-2.5 rounded bg-slate-50 border border-slate-100 text-xs text-slate-600 leading-relaxed">
                  {renderHighlightedSnippet(doc.relevance.snippet, doc.relevance.matchedTerms)}
                </div>

                {/* Footer metadata & actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-2 text-[11px]">
                    <span>Ingested {new Date(doc.uploadDate).toLocaleDateString()}</span>
                    <span>·</span>
                    <span>By {doc.uploadedBy}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onOpenDocument(doc)}
                      className="px-2 py-1 rounded hover:bg-slate-100 text-slate-700 font-medium transition-colors"
                    >
                      View
                    </button>
                    {userRole !== 'VIEWER' && (
                      <>
                        <button
                          onClick={() => onEditDocument(doc)}
                          className="px-2 py-1 rounded hover:bg-slate-100 text-slate-700 font-medium transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDeleteDocument(doc)}
                          className="px-2 py-1 rounded hover:bg-red-50 text-red-600 font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
