import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { DocumentCategory, DocumentItem, UserRole } from '../types';

interface EditMetadataModalProps {
  document: DocumentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<DocumentItem>) => void;
  userRole: UserRole;
}

export const EditMetadataModal: React.FC<EditMetadataModalProps> = ({
  document: doc,
  isOpen,
  onClose,
  onSave,
  userRole
}) => {
  if (!isOpen || !doc) return null;

  const [title, setTitle] = useState(doc.title);
  const [category, setCategory] = useState<DocumentCategory>(doc.category);
  const [summary, setSummary] = useState(doc.summary);
  const [tagsInput, setTagsInput] = useState((doc.tags || []).join(', '));

  const categories: DocumentCategory[] = [
    'Legal & Contracts',
    'Financial & Invoices',
    'Technical & Architecture',
    'Operational & Reports',
    'Human Resources',
    'Marketing & Research'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userRole === 'VIEWER') return;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(Boolean);

    onSave(doc.id, {
      title,
      category,
      summary,
      tags
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Edit Document Metadata</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-700 font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-slate-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as DocumentCategory)}
              className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-slate-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">
              Search Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. sla, liability, cloud"
              className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-slate-500 font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">Summary</label>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-slate-500"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={userRole === 'VIEWER'}
              className="px-3.5 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white font-medium transition-colors disabled:opacity-50"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
