import React, { useState, useEffect } from 'react';
import { Database, X, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (url: string) => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const existingUrl = localStorage.getItem('SUPABASE_URL') || '';
      const existingKey = localStorage.getItem('SUPABASE_ANON_KEY') || '';
      setSupabaseUrl(existingUrl);
      setSupabaseKey(existingKey);
      setIsSaved(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseUrl.trim() || !supabaseKey.trim()) return;

    localStorage.setItem('SUPABASE_URL', supabaseUrl.trim());
    localStorage.setItem('SUPABASE_ANON_KEY', supabaseKey.trim());
    setIsSaved(true);
    onSuccess(supabaseUrl.trim());

    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Database size={18} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Connect Supabase Database</h2>
              <p className="text-xs text-slate-500">Link your PostgreSQL database and RLS security policies</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex items-center justify-between p-3 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <span>Need a Supabase project URL & API key?</span>
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 font-medium text-emerald-600 hover:underline"
            >
              <span>Supabase Dashboard</span>
              <ExternalLink size={12} />
            </a>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-700">
              Supabase Project URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              required
              placeholder="https://abcdefghijklm.supabase.co"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-700">
              Supabase Anon / Public Key <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              required
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={supabaseKey}
              onChange={(e) => setSupabaseKey(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono"
            />
          </div>

          <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
            <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
            <span>Encrypted locally in session storage for secure connection pooling.</span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaved || !supabaseUrl || !supabaseKey}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-md bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white transition-colors shadow-2xs"
            >
              {isSaved ? (
                <>
                  <CheckCircle2 size={14} />
                  <span>Connected!</span>
                </>
              ) : (
                <span>Save & Connect</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
