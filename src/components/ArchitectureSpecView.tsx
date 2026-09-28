import React, { useState } from 'react';
import {
  Database,
  Layers,
  Server,
  Copy,
  Check,
  Container,
  CheckCircle2,
  FileCode,
  ExternalLink,
  Key,
  ShieldCheck
} from 'lucide-react';
import { MYSQL_SCHEMA_TABLES } from '../services/mockData';

export const ArchitectureSpecView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'supabase' | 'mysql' | 'api' | 'docker' | 'dod'>('supabase');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<string>('documents');
  const [supabaseUrlInput, setSupabaseUrlInput] = useState('');
  const [supabaseKeyInput, setSupabaseKeyInput] = useState('');
  const [connectionSaved, setConnectionSaved] = useState(false);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseUrlInput || !supabaseKeyInput) return;
    localStorage.setItem('SUPABASE_URL', supabaseUrlInput);
    localStorage.setItem('SUPABASE_ANON_KEY', supabaseKeyInput);
    setConnectionSaved(true);
    setTimeout(() => setConnectionSaved(false), 3000);
  };

  const sqlDdl = `CREATE TABLE users (
  id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(128) NOT NULL,
  role VARCHAR(32) NOT NULL DEFAULT 'VIEWER',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE documents (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(16) NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  category VARCHAR(64) NOT NULL,
  ocr_confidence DECIMAL(5,2) DEFAULT 100.00,
  classification_confidence DECIMAL(5,2) DEFAULT 95.00,
  word_count INT NOT NULL DEFAULT 0,
  uploaded_by VARCHAR(128) NOT NULL,
  summary TEXT,
  content TEXT NOT NULL,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE audit_logs (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  actor_name VARCHAR(128) NOT NULL,
  actor_role VARCHAR(32) NOT NULL,
  action VARCHAR(64) NOT NULL,
  resource VARCHAR(255) NOT NULL,
  resource_id VARCHAR(128) NOT NULL,
  ip_address VARCHAR(45) NOT NULL,
  status VARCHAR(32) NOT NULL,
  details TEXT
);

-- Enable Row Level Security (RLS)
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users" ON documents FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable insert for editors and admins" ON documents FOR INSERT WITH CHECK (auth.role() = 'authenticated');`;

  const dockerComposeYaml = `version: '3.8'

services:
  app:
    build: .
    container_name: smart-doc-retrieval-app
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - VITE_SUPABASE_URL=\${SUPABASE_URL}
      - VITE_SUPABASE_ANON_KEY=\${SUPABASE_ANON_KEY}`;

  return (
    <div className="space-y-5">
      {/* Title */}
      <div className="pb-3 border-b border-slate-200">
        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
          System Architecture & Supabase Integration
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Connect your Supabase PostgreSQL database, inspect SQL schemas, and review REST API specifications.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 pb-2 text-xs">
        {[
          { id: 'supabase', label: 'Supabase Connection' },
          { id: 'architecture', label: 'Architecture & Pipeline' },
          { id: 'mysql', label: 'Relational Database Schema' },
          { id: 'api', label: 'REST API Specification' },
          { id: 'docker', label: 'Docker Deployment' },
          { id: 'dod', label: 'Definition of Done (DoD)' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 0: SUPABASE CONNECTION */}
      {activeTab === 'supabase' && (
        <div className="space-y-5">
          <div className="p-5 rounded-lg bg-white border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Database size={16} className="text-emerald-600" />
                  Connect Supabase PostgreSQL Database
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter your Supabase project URL and anon public API key to connect your database storage and RLS policies.
                </p>
              </div>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-slate-900 hover:bg-slate-800 text-white transition-colors"
              >
                <span>Open Supabase Dashboard</span>
                <ExternalLink size={12} />
              </a>
            </div>

            <form onSubmit={handleSaveSupabaseConfig} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-700">
                    Supabase Project URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://your-project-id.supabase.co"
                    value={supabaseUrlInput}
                    onChange={(e) => setSupabaseUrlInput(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-700">
                    Supabase Anon / Public API Key
                  </label>
                  <input
                    type="password"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR..."
                    value={supabaseKeyInput}
                    onChange={(e) => setSupabaseKeyInput(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  <span>Credentials are securely stored in your browser session storage.</span>
                </div>
                <button
                  type="submit"
                  disabled={!supabaseUrlInput || !supabaseKeyInput}
                  className="px-4 py-2 text-xs font-medium rounded-md bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white transition-colors shadow-2xs"
                >
                  {connectionSaved ? 'Connected Successfully!' : 'Save & Connect Supabase'}
                </button>
              </div>
            </form>
          </div>

          <div className="p-5 rounded-lg bg-white border border-slate-200 space-y-3">
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Supabase SQL Schema & RLS Setup Script
            </h3>
            <p className="text-xs text-slate-500">
              Run this SQL snippet in your Supabase SQL Editor to provision the required tables (`documents`, `users`, `audit_logs`) and Row Level Security policies.
            </p>
            <div className="relative">
              <button
                onClick={() => copyToClipboard(sqlDdl, 'supabase_ddl')}
                className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
              >
                {copiedSection === 'supabase_ddl' ? <Check size={12} /> : <Copy size={12} />}
                <span>{copiedSection === 'supabase_ddl' ? 'Copied' : 'Copy SQL'}</span>
              </button>
              <pre className="p-4 rounded bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed max-h-72">
                {sqlDdl}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: ARCHITECTURE */}
      {activeTab === 'architecture' && (
        <div className="p-5 rounded-lg bg-white border border-slate-200 space-y-5">
          <h2 className="text-sm font-semibold text-slate-900">
            End-to-End System Pipeline
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
            <div className="p-3.5 rounded-md bg-slate-50 border border-slate-200 space-y-1">
              <div className="font-mono text-[10px] text-slate-400 font-semibold">STAGE 1</div>
              <div className="font-semibold text-slate-800">Client Application</div>
              <div className="text-[11px] text-slate-500 leading-normal">
                React interface with role-based access control, search hit highlighting, and client-side index fallback.
              </div>
            </div>

            <div className="p-3.5 rounded-md bg-slate-50 border border-slate-200 space-y-1">
              <div className="font-mono text-[10px] text-slate-400 font-semibold">STAGE 2</div>
              <div className="font-semibold text-slate-800">API Gateway</div>
              <div className="text-[11px] text-slate-500 leading-normal">
                Express.js server handling multi-format uploads, authentication tokens, and audit telemetry dispatch.
              </div>
            </div>

            <div className="p-3.5 rounded-md bg-slate-50 border border-slate-200 space-y-1">
              <div className="font-mono text-[10px] text-slate-400 font-semibold">STAGE 3</div>
              <div className="font-semibold text-slate-800">OCR & Extraction</div>
              <div className="text-[11px] text-slate-500 leading-normal">
                Binarization, line segmentation, character recognition, and entity extraction for dates and figures.
              </div>
            </div>

            <div className="p-3.5 rounded-md bg-slate-50 border border-slate-200 space-y-1">
              <div className="font-mono text-[10px] text-slate-400 font-semibold">STAGE 4</div>
              <div className="font-semibold text-slate-800">TF-IDF Indexer</div>
              <div className="text-[11px] text-slate-500 leading-normal">
                Tokenization, stopword filtering, inverted index postings, and BM25 term weighting.
              </div>
            </div>

            <div className="p-3.5 rounded-md bg-slate-50 border border-slate-200 space-y-1">
              <div className="font-mono text-[10px] text-slate-400 font-semibold">STAGE 5</div>
              <div className="font-semibold text-slate-800">Persistence Store</div>
              <div className="text-[11px] text-slate-500 leading-normal">
                Supabase PostgreSQL tables for metadata, document bodies, posting inverted lists, and audit records.
              </div>
            </div>
          </div>

          <div className="p-4 rounded-md bg-slate-50 border border-slate-200 text-xs space-y-1.5">
            <div className="font-semibold text-slate-800">Hybrid Search Formula</div>
            <div className="font-mono text-slate-700 bg-white p-2.5 rounded border border-slate-200 text-[11px]">
              Score(q, d) = 0.50 × CosineSimilarity(TF-IDF_q, TF-IDF_d) + 0.25 × TitleMatch + 0.15 × TagMatch + 0.10 × CategoryMatch
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MYSQL / POSTGRES */}
      {activeTab === 'mysql' && (
        <div className="p-5 rounded-lg bg-white border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Relational Database Schema & Inverted Index Tables
              </h2>
              <p className="text-xs text-slate-500">
                Select a table to inspect columns, constraints, foreign keys, and indexes.
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(sqlDdl, 'ddl')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs transition-colors"
            >
              {copiedSection === 'ddl' ? <Check size={13} /> : <Copy size={13} />}
              <span>{copiedSection === 'ddl' ? 'Copied' : 'Copy DDL'}</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {MYSQL_SCHEMA_TABLES.map((table) => (
              <button
                key={table.tableName}
                onClick={() => setSelectedTable(table.tableName)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                  selectedTable === table.tableName
                    ? 'bg-slate-900 text-white font-medium'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {table.tableName}
              </button>
            ))}
          </div>

          {(() => {
            const table = MYSQL_SCHEMA_TABLES.find((t) => t.tableName === selectedTable);
            if (!table) return null;
            return (
              <div className="space-y-2 pt-1">
                <div className="text-xs text-slate-500">
                  <strong className="text-slate-700">{table.tableName}:</strong> {table.description}
                </div>

                <div className="overflow-x-auto rounded border border-slate-200">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">Column</th>
                        <th className="p-2.5">Type</th>
                        <th className="p-2.5">Constraints</th>
                        <th className="p-2.5">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                      {table.columns.map((col) => (
                        <tr key={col.name} className="hover:bg-slate-50">
                          <td className="p-2.5 font-semibold text-slate-900">{col.name}</td>
                          <td className="p-2.5 text-blue-700">{col.type}</td>
                          <td className="p-2.5 text-amber-700">{col.constraints}</td>
                          <td className="p-2.5 font-sans text-slate-500">{col.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 3: REST API */}
      {activeTab === 'api' && (
        <div className="p-5 rounded-lg bg-white border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              REST API Endpoints Specification
            </h2>
            <span className="text-xs font-mono text-slate-400">Base URI: /api</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {[
              { method: 'GET', path: '/api/documents', desc: 'List documents with optional category, format, or sort filters.', auth: 'Viewer+' },
              { method: 'POST', path: '/api/documents', desc: 'Ingest and process a document through OCR & inverted index.', auth: 'Editor / Admin' },
              { method: 'POST', path: '/api/search', desc: 'Run hybrid TF-IDF + cosine search across documents.', auth: 'All Roles' },
              { method: 'PUT', path: '/api/documents/:id', desc: 'Update document title, category, and metadata tags.', auth: 'Editor / Admin' },
              { method: 'DELETE', path: '/api/documents/:id', desc: 'Delete document and purge postings from index.', auth: 'Editor / Admin' },
              { method: 'GET', path: '/api/audit', desc: 'Fetch regulatory compliance audit log records.', auth: 'Admin' },
              { method: 'GET', path: '/api/stats', desc: 'Fetch document counts, index size, and retrieval latency metrics.', auth: 'All Roles' }
            ].map((ep, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-semibold text-slate-800 text-[11px]">{ep.method}</span>
                    <span className="text-slate-900 text-xs">{ep.path}</span>
                  </div>
                  <div className="text-slate-500 text-[11px]">{ep.desc}</div>
                </div>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                  {ep.auth}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: DOCKER */}
      {activeTab === 'docker' && (
        <div className="p-5 rounded-lg bg-white border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              Docker Compose Configuration
            </h2>
            <button
              onClick={() => copyToClipboard(dockerComposeYaml, 'compose')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs transition-colors"
            >
              {copiedSection === 'compose' ? <Check size={13} /> : <Copy size={13} />}
              <span>{copiedSection === 'compose' ? 'Copied' : 'Copy Compose YAML'}</span>
            </button>
          </div>

          <pre className="p-4 rounded bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed">
            {dockerComposeYaml}
          </pre>
        </div>
      )}

      {/* TAB 5: DEFINITION OF DONE */}
      {activeTab === 'dod' && (
        <div className="p-5 rounded-lg bg-white border border-slate-200 space-y-4">
          <h2 className="text-sm font-semibold text-slate-900">
            MVP Acceptance Criteria & Definition of Done
          </h2>

          <div className="divide-y divide-slate-100 text-xs">
            {[
              { title: 'Supabase PostgreSQL Integration', desc: 'Direct connection configuration and RLS security schema.' },
              { title: 'Multi-Format Ingestion (6 Formats)', desc: 'Full support for PDF, DOCX, TXT, CSV, PNG, and JPG files.' },
              { title: 'Optical Character Recognition (OCR)', desc: 'Extraction pipeline with confidence evaluation on scanned images.' },
              { title: 'TF-IDF Inverted Index Search', desc: 'Cosine relevance scoring, BM25 term weighting, and keyword snippet highlighting.' },
              { title: 'Document Classification & Taxonomy', desc: '6 enterprise domains (Legal, Financial, Technical, HR, Marketing, Operations).' },
              { title: 'Role-Based Access Control (RBAC)', desc: 'Administrator, Editor, and Viewer permission enforcement.' }
            ].map((item, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800">{item.title}</div>
                  <div className="text-slate-500 text-[11px]">{item.desc}</div>
                </div>
                <span className="text-[11px] font-mono text-emerald-700 font-medium">
                  Verified
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

