import React, { useState } from 'react';
import {
  X,
  Download,
  Edit3,
  Copy,
  Check,
  Search,
  FileText
} from 'lucide-react';
import { DocumentItem, UserRole } from '../types';
import { FormatBadge } from './FormatIcon';

interface DocumentDetailModalProps {
  document: DocumentItem;
  isOpen: boolean;
  onClose: () => void;
  userRole: UserRole;
  onEditMetadata: (doc: DocumentItem) => void;
  onDeleteDocument: (doc: DocumentItem) => void;
}

export const DocumentDetailModal: React.FC<DocumentDetailModalProps> = ({
  document: doc,
  isOpen,
  onClose,
  userRole,
  onEditMetadata
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'ocr' | 'metadata' | 'audit'>('content');
  const [copied, setCopied] = useState(false);
  const [inDocFilter, setInDocFilter] = useState('');

  if (!isOpen) return null;

  const copyContent = () => {
    navigator.clipboard.writeText(doc.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadText = () => {
    const element = window.document.createElement('a');
    const file = new Blob([doc.content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${doc.fileName.replace(/\.[^/.]+$/, '')}_extracted.txt`;
    window.document.body.appendChild(element);
    element.click();
    window.document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl max-h-[85vh] flex flex-col bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <FormatBadge format={doc.fileType} />
              <span className="font-medium text-slate-700">{doc.category}</span>
              <span>·</span>
              <span className="font-mono text-[11px]">{doc.fileName}</span>
              <span>·</span>
              <span className="font-mono text-[11px]">{(doc.fileSize / 1024).toFixed(0)} KB</span>
            </div>

            <h2 className="text-base font-semibold text-slate-900 truncate">
              {doc.title}
            </h2>
            <div className="text-[11px] text-slate-500">
              Uploaded by {doc.uploadedBy} on {new Date(doc.uploadDate).toLocaleDateString()}
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={downloadText}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs transition-colors"
              title="Download Extracted Text"
            >
              <Download size={13} className="text-slate-500" />
              <span>Export</span>
            </button>

            {userRole !== 'VIEWER' && (
              <button
                onClick={() => {
                  onClose();
                  onEditMetadata(doc);
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
              >
                <Edit3 size={13} />
                <span>Edit</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors ml-1"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 border-b border-slate-200 flex items-center gap-4 text-xs">
          {[
            { id: 'content', label: 'Document Text' },
            { id: 'ocr', label: 'OCR & Metrics' },
            { id: 'metadata', label: 'Entities & Tags' },
            { id: 'audit', label: 'History' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2.5 border-b-2 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-slate-900 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === 'content' && (
            <div className="space-y-3">
              {doc.summary && (
                <div className="p-3 rounded-md bg-slate-50 border border-slate-200 text-xs">
                  <div className="font-medium text-slate-700 mb-1 text-[11px]">
                    Document Summary
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    {doc.summary}
                  </p>
                </div>
              )}

              {/* In-Doc search */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Filter inside text..."
                    value={inDocFilter}
                    onChange={(e) => setInDocFilter(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded pl-7.5 pr-2 py-1 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                  />
                </div>
                <button
                  onClick={copyContent}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  {copied ? <Check size={12} className="text-emerald-700" /> : <Copy size={12} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Text viewer */}
              <div className="p-3.5 rounded bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto select-text">
                {inDocFilter ? (
                  doc.content.split(new RegExp(`(${inDocFilter})`, 'gi')).map((part, i) =>
                    part.toLowerCase() === inDocFilter.toLowerCase() ? (
                      <mark key={i} className="bg-amber-200 text-amber-950 px-0.5 rounded">
                        {part}
                      </mark>
                    ) : (
                      part
                    )
                  )
                ) : (
                  doc.content
                )}
              </div>
            </div>
          )}

          {activeTab === 'ocr' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-500">OCR Confidence</div>
                  <div className="font-mono font-semibold text-slate-900 text-sm mt-0.5">{doc.ocrConfidence}%</div>
                </div>
                <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-500">Classification</div>
                  <div className="font-mono font-semibold text-slate-900 text-sm mt-0.5">{doc.classificationConfidence}%</div>
                </div>
                <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-500">Word Count</div>
                  <div className="font-mono font-semibold text-slate-900 text-sm mt-0.5">{doc.wordCount}</div>
                </div>
                <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-500">Index Status</div>
                  <div className="font-mono font-semibold text-emerald-700 text-sm mt-0.5">INDEXED</div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="font-medium text-slate-700">Raw Extraction Output</div>
                <div className="p-3 rounded bg-slate-50 border border-slate-200 font-mono text-xs text-slate-700 whitespace-pre-wrap max-h-64 overflow-y-auto leading-relaxed">
                  {doc.content}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'metadata' && (
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <div className="font-medium text-slate-700">Detected Organizations</div>
                <div className="text-slate-600">
                  {doc.entities?.organizations?.length ? doc.entities.organizations.join(', ') : 'None'}
                </div>
              </div>

              <div className="space-y-1">
                <div className="font-medium text-slate-700">Identified Dates</div>
                <div className="text-slate-600">
                  {doc.entities?.dates?.length ? doc.entities.dates.join(', ') : 'None'}
                </div>
              </div>

              <div className="space-y-1">
                <div className="font-medium text-slate-700">Monetary Figures</div>
                <div className="text-slate-600 font-mono">
                  {doc.entities?.monetaryValues?.length ? doc.entities.monetaryValues.join(', ') : 'None'}
                </div>
              </div>

              <div className="space-y-1">
                <div className="font-medium text-slate-700">Reference Identifiers</div>
                <div className="text-slate-600 font-mono">
                  {doc.entities?.referenceNumbers?.length ? doc.entities.referenceNumbers.join(', ') : 'None'}
                </div>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-100">
                <div className="font-medium text-slate-700">Search Tags</div>
                <div className="flex flex-wrap gap-1.5">
                  {doc.tags?.map((t, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-2 text-xs">
              <div className="text-slate-500 text-[11px]">
                Audit history events associated with this document:
              </div>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded">
                <div className="p-2.5 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-slate-900">DOCUMENT_VIEWED</div>
                    <div className="text-[11px] text-slate-500">Accessed during current session</div>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">Just now</span>
                </div>
                <div className="p-2.5 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-slate-900">DOCUMENT_INGESTED</div>
                    <div className="text-[11px] text-slate-500">Uploaded by {doc.uploadedBy}</div>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">{new Date(doc.uploadDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
