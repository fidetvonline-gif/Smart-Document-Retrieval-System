import React, { useState } from 'react';
import {
  Folder,
  LayoutGrid,
  Table as TableIcon,
  Search,
  Plus,
  RefreshCw,
  Download,
  Eye,
  Edit3,
  Trash2,
  CheckSquare,
  Square
} from 'lucide-react';
import { DocumentItem, UserRole } from '../types';
import { FormatBadge } from './FormatIcon';

interface DocumentRepositoryViewProps {
  documents: DocumentItem[];
  userRole: UserRole;
  onOpenDocument: (doc: DocumentItem) => void;
  onEditDocument: (doc: DocumentItem) => void;
  onDeleteDocument: (doc: DocumentItem) => void;
  onSelectTab: (tab: string) => void;
  onRebuildIndex: () => void;
}

export const DocumentRepositoryView: React.FC<DocumentRepositoryViewProps> = ({
  documents,
  userRole,
  onOpenDocument,
  onEditDocument,
  onDeleteDocument,
  onSelectTab,
  onRebuildIndex
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterFormat, setFilterFormat] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

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

  const filteredDocs = documents.filter((doc) => {
    if (filterCategory !== 'All' && doc.category !== filterCategory) return false;
    if (filterFormat !== 'All' && doc.fileType !== filterFormat) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const match =
        doc.title.toLowerCase().includes(q) ||
        doc.fileName.toLowerCase().includes(q) ||
        doc.summary.toLowerCase().includes(q) ||
        (doc.tags || []).some(t => t.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const selectAll = () => {
    if (selectedIds.size === filteredDocs.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredDocs.map(d => d.id)));
    }
  };

  const exportMetadata = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredDocs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `document_inventory_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.removeChild(downloadAnchor);
  };

  return (
    <div className="space-y-4">
      {/* Header and Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
            Document Repository
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {documents.length} files indexed in storage across 6 supported formats
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {userRole === 'ADMIN' && (
            <button
              onClick={onRebuildIndex}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs transition-colors"
              title="Recalculate TF-IDF vectors for all documents"
            >
              <RefreshCw size={13} className="text-slate-500" />
              <span>Rebuild Index</span>
            </button>
          )}

          <button
            onClick={exportMetadata}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs transition-colors"
          >
            <Download size={13} className="text-slate-500" />
            <span>Export JSON</span>
          </button>

          {userRole !== 'VIEWER' && (
            <button
              onClick={() => onSelectTab('upload')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-slate-900 hover:bg-slate-800 text-white shadow-2xs transition-colors"
            >
              <Plus size={14} />
              <span>Upload Document</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and View Bar */}
      <div className="p-3 rounded-lg bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            type="text"
            placeholder="Filter by title, tags, or file name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded pl-7.5 pr-2.5 py-1 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Category:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
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
              value={filterFormat}
              onChange={(e) => setFilterFormat(e.target.value)}
              className="bg-white border border-slate-200 rounded px-2 py-1 text-slate-700 uppercase text-xs focus:outline-none focus:border-slate-400"
            >
              {formats.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 border border-slate-200 rounded p-0.5 bg-slate-50">
          <button
            onClick={() => setViewMode('table')}
            className={`p-1 rounded ${viewMode === 'table' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
            title="Table View"
          >
            <TableIcon size={14} />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1 rounded ${viewMode === 'grid' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
            title="Grid View"
          >
            <LayoutGrid size={14} />
          </button>
        </div>
      </div>

      {/* TABLE VIEW */}
      {viewMode === 'table' ? (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="p-3 w-8 text-center">
                  <button onClick={selectAll} className="text-slate-400 hover:text-slate-600">
                    {selectedIds.size === filteredDocs.length && filteredDocs.length > 0 ? (
                      <CheckSquare size={14} className="text-slate-900" />
                    ) : (
                      <Square size={14} />
                    )}
                  </button>
                </th>
                <th className="p-3 font-semibold text-slate-700">Document</th>
                <th className="p-3 font-semibold text-slate-700">Format</th>
                <th className="p-3 font-semibold text-slate-700">Category</th>
                <th className="p-3 font-semibold text-slate-700">Size</th>
                <th className="p-3 font-semibold text-slate-700">OCR Confidence</th>
                <th className="p-3 font-semibold text-slate-700">Date Added</th>
                <th className="p-3 font-semibold text-slate-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.map((doc) => (
                <tr
                  key={doc.id}
                  onClick={() => onOpenDocument(doc)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <td
                    className="p-3 text-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelect(doc.id);
                    }}
                  >
                    <button className="text-slate-400 hover:text-slate-700">
                      {selectedIds.has(doc.id) ? (
                        <CheckSquare size={14} className="text-slate-900" />
                      ) : (
                        <Square size={14} />
                      )}
                    </button>
                  </td>
                  <td className="p-3 min-w-[200px]">
                    <div className="font-medium text-slate-900 hover:underline">
                      {doc.title}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {doc.fileName}
                    </div>
                  </td>
                  <td className="p-3">
                    <FormatBadge format={doc.fileType} />
                  </td>
                  <td className="p-3 text-slate-700">
                    {doc.category}
                  </td>
                  <td className="p-3 font-mono text-[11px] text-slate-600">
                    {(doc.fileSize / 1024).toFixed(0)} KB
                  </td>
                  <td className="p-3 font-mono text-[11px] text-slate-600">
                    {doc.ocrConfidence}%
                  </td>
                  <td className="p-3 text-slate-500">
                    {new Date(doc.uploadDate).toLocaleDateString()}
                  </td>
                  <td
                    className="p-3 text-right space-x-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => onOpenDocument(doc)}
                      className="p-1 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                      title="View Document"
                    >
                      <Eye size={14} />
                    </button>
                    {userRole !== 'VIEWER' && (
                      <>
                        <button
                          onClick={() => onEditDocument(doc)}
                          className="p-1 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                          title="Edit Metadata"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => onDeleteDocument(doc)}
                          className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-600"
                          title="Delete Document"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => onOpenDocument(doc)}
              className="p-4 rounded-lg bg-white border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <FormatBadge format={doc.fileType} />
                  <span className="text-[11px] text-slate-500 font-mono">
                    {(doc.fileSize / 1024).toFixed(0)} KB
                  </span>
                </div>

                <h3 className="font-semibold text-slate-900 line-clamp-1 hover:underline text-sm">
                  {doc.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {doc.summary || doc.content}
                </p>
              </div>

              <div className="pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                <span>{doc.category}</span>
                <span className="font-mono">OCR: {doc.ocrConfidence}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
