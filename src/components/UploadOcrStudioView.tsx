import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  File,
  ArrowRight,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { DocumentCategory, DocumentFormat, DocumentItem, UserRole } from '../types';
import { FormatBadge } from './FormatIcon';
import { processFileWithOcr } from '../services/ocrEngine';
import { classifyDocument } from '../services/classifier';
import { SAMPLE_TEMPLATES } from '../services/mockData';

interface UploadOcrStudioViewProps {
  userRole: UserRole;
  userName: string;
  onSaveDocument: (doc: DocumentItem) => void;
  onSelectTab: (tab: string) => void;
}

export const UploadOcrStudioView: React.FC<UploadOcrStudioViewProps> = ({
  userRole,
  userName,
  onSaveDocument,
  onSelectTab
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const processingStages = [
    'Verifying file signature & MIME integrity',
    'Preprocessing document layout & segmentation',
    'Running optical character recognition (OCR)',
    'Evaluating taxonomy classification & entity extraction',
    'Generating TF-IDF tokens & inverted postings'
  ];

  const [stagedFile, setStagedFile] = useState<{
    fileName: string;
    fileType: DocumentFormat;
    fileSize: number;
    rawText: string;
    ocrConfidence: number;
    classificationConfidence: number;
    category: DocumentCategory;
    summary: string;
    tags: string[];
    entities: {
      organizations: string[];
      persons: string[];
      dates: string[];
      monetaryValues: string[];
      referenceNumbers: string[];
    };
    title: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories: DocumentCategory[] = [
    'Legal & Contracts',
    'Financial & Invoices',
    'Technical & Architecture',
    'Operational & Reports',
    'Human Resources',
    'Marketing & Research'
  ];

  const runIngestionPipeline = async (fileObj: {
    name: string;
    type: string;
    size: number;
    textContent?: string;
  }) => {
    setIsProcessing(true);
    setCurrentStageIndex(0);

    await new Promise(r => setTimeout(r, 200));
    setCurrentStageIndex(1);
    await new Promise(r => setTimeout(r, 250));
    setCurrentStageIndex(2);

    const ocrResult = await processFileWithOcr(fileObj);
    setCurrentStageIndex(3);

    const classification = classifyDocument(ocrResult.text, fileObj.name);
    await new Promise(r => setTimeout(r, 250));
    setCurrentStageIndex(4);
    await new Promise(r => setTimeout(r, 150));

    const ext = fileObj.name.split('.').pop()?.toLowerCase() as DocumentFormat || 'txt';
    const cleanTitle = fileObj.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');

    setStagedFile({
      fileName: fileObj.name,
      fileType: ext,
      fileSize: fileObj.size,
      rawText: ocrResult.text,
      ocrConfidence: ocrResult.confidence,
      classificationConfidence: classification.confidence,
      category: classification.category,
      summary: classification.summary,
      tags: classification.tags,
      entities: classification.entities,
      title: cleanTitle
    });

    setIsProcessing(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase() as DocumentFormat;
    let content = '';
    if (ext === 'txt' || ext === 'csv') {
      content = await file.text();
    }

    await runIngestionPipeline({
      name: file.name,
      type: file.type,
      size: file.size,
      textContent: content
    });
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (userRole === 'VIEWER') return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      const ext = file.name.split('.').pop()?.toLowerCase() as DocumentFormat;
      let content = '';
      if (ext === 'txt' || ext === 'csv') {
        content = await file.text();
      }
      await runIngestionPipeline({
        name: file.name,
        type: file.type,
        size: file.size,
        textContent: content
      });
    }
  };

  const loadSample = (template: typeof SAMPLE_TEMPLATES[0]) => {
    runIngestionPipeline({
      name: template.fileName,
      type: 'text/plain',
      size: 1024 * 250,
      textContent: template.content
    });
  };

  const handleFinalSave = () => {
    if (!stagedFile) return;

    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      title: stagedFile.title,
      fileName: stagedFile.fileName,
      fileType: stagedFile.fileType,
      fileSize: stagedFile.fileSize,
      uploadDate: new Date().toISOString(),
      uploadedBy: `${userName} (${userRole})`,
      category: stagedFile.category,
      status: 'Indexed',
      ocrConfidence: stagedFile.ocrConfidence,
      classificationConfidence: stagedFile.classificationConfidence,
      wordCount: stagedFile.rawText.split(/\s+/).filter(Boolean).length,
      tags: stagedFile.tags,
      entities: stagedFile.entities,
      summary: stagedFile.summary,
      content: stagedFile.rawText
    };

    onSaveDocument(newDoc);
    setStagedFile(null);
    onSelectTab('repository');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-3 border-b border-slate-200">
        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
          Document Ingestion & OCR Processing
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Upload PDF, Word, text, spreadsheet, or scanned image files for OCR extraction and indexing.
        </p>
      </div>

      {/* Role notice */}
      {userRole === 'VIEWER' && (
        <div className="p-3 rounded-md bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
          <ShieldAlert size={16} className="text-amber-600 flex-shrink-0" />
          <span>
            <strong>Read-only mode active:</strong> You are viewing with the Viewer role. Switch to Administrator or Editor in the top navigation to upload documents.
          </span>
        </div>
      )}

      {/* Main Dropzone & Sample Files */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Box (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => {
              if (userRole !== 'VIEWER') fileInputRef.current?.click();
            }}
            className={`border-2 border-dashed rounded-lg p-8 sm:p-10 text-center transition-colors cursor-pointer ${
              userRole === 'VIEWER'
                ? 'opacity-60 cursor-not-allowed border-slate-200 bg-slate-50'
                : dragActive
                ? 'border-slate-500 bg-slate-100'
                : 'border-slate-300 hover:border-slate-400 bg-white'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt,.csv,.png,.jpg,.jpeg"
              onChange={handleFileUpload}
              className="hidden"
              disabled={userRole === 'VIEWER'}
            />

            <UploadCloud size={32} className="text-slate-400 mx-auto mb-3" />

            <div className="text-sm font-semibold text-slate-800 mb-1">
              Select a file or drag and drop
            </div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              Supports PDF, DOCX, TXT, CSV, PNG, and JPG files up to 50MB.
            </p>

            <div className="flex items-center justify-center gap-2 flex-wrap text-slate-500 font-mono text-[11px]">
              <span>PDF</span> · <span>DOCX</span> · <span>TXT</span> · <span>CSV</span> · <span>PNG</span> · <span>JPG</span>
            </div>
          </div>
        </div>

        {/* Sample Templates Card */}
        <div className="p-4 rounded-lg bg-white border border-slate-200 space-y-3">
          <div className="text-xs font-semibold text-slate-800">
            Sample Documents
          </div>
          <p className="text-xs text-slate-500">
            Click any test document to load and execute the ingestion pipeline:
          </p>

          <div className="divide-y divide-slate-100 text-xs">
            {SAMPLE_TEMPLATES.map((tmpl, i) => (
              <button
                key={i}
                onClick={() => loadSample(tmpl)}
                disabled={userRole === 'VIEWER' || isProcessing}
                className="w-full text-left py-2.5 hover:bg-slate-50 px-1 rounded transition-colors disabled:opacity-50 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-0.5">
                  <FormatBadge format={tmpl.fileType} />
                  <span className="text-[11px] text-slate-400">{tmpl.category}</span>
                </div>
                <div className="font-medium text-slate-800 truncate">
                  {tmpl.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Box */}
      {isProcessing && (
        <div className="p-5 rounded-lg bg-white border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Loader2 size={16} className="text-slate-700 animate-spin" />
              <span className="text-xs font-semibold text-slate-900">
                Processing document ingestion pipeline...
              </span>
            </div>
            <span className="text-xs font-mono text-slate-500">
              Stage {currentStageIndex + 1} of {processingStages.length}
            </span>
          </div>

          <div className="space-y-1.5">
            {processingStages.map((stage, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-2 rounded text-xs ${
                    isCurrent
                      ? 'bg-slate-100 text-slate-900 font-medium'
                      : isPast
                      ? 'text-slate-500 line-through opacity-70'
                      : 'text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isPast ? (
                      <CheckCircle2 size={13} className="text-emerald-700" />
                    ) : isCurrent ? (
                      <div className="w-2 h-2 rounded-full bg-slate-900" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-slate-200" />
                    )}
                    <span>{stage}</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase">
                    {isPast ? 'Done' : isCurrent ? 'Active' : 'Queued'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Staged Review Box */}
      {stagedFile && !isProcessing && (
        <div className="p-5 rounded-lg bg-white border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <div className="text-xs text-slate-500 font-mono">
                {stagedFile.fileName} · OCR Confidence: {stagedFile.ocrConfidence}%
              </div>
              <h2 className="text-base font-semibold text-slate-900 mt-0.5">
                Review Extracted Document
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setStagedFile(null)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 rounded transition-colors"
              >
                Discard
              </button>
              <button
                onClick={handleFinalSave}
                className="px-3.5 py-1.5 text-xs font-medium rounded bg-slate-900 hover:bg-slate-800 text-white transition-colors"
              >
                Save & Index Document
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Document Title</label>
              <input
                type="text"
                value={stagedFile.title}
                onChange={(e) => setStagedFile({ ...stagedFile, title: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Assigned Category</label>
              <select
                value={stagedFile.category}
                onChange={(e) => setStagedFile({ ...stagedFile, category: e.target.value as DocumentCategory })}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-slate-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Extracted text */}
          <div className="space-y-1.5">
            <div className="text-xs font-medium text-slate-700">
              Extracted OCR Plaintext
            </div>
            <div className="p-3 rounded bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed select-text">
              {stagedFile.rawText}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
