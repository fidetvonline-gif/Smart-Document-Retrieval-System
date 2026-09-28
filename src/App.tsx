/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { SearchDiscoveryView } from './components/SearchDiscoveryView';
import { DocumentRepositoryView } from './components/DocumentRepositoryView';
import { UploadOcrStudioView } from './components/UploadOcrStudioView';
import { AuditTrailView } from './components/AuditTrailView';
import { ArchitectureSpecView } from './components/ArchitectureSpecView';
import { DocumentDetailModal } from './components/DocumentDetailModal';
import { EditMetadataModal } from './components/EditMetadataModal';
import { RoleSwitcherModal } from './components/RoleSwitcherModal';
import { SupabaseModal } from './components/SupabaseModal';

import { DocumentItem, User, UserRole, AuditLogItem } from './types';
import { SYSTEM_USERS } from './services/mockData';
import { ApiService } from './services/apiService';
import { AuditService } from './services/auditService';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function App() {
  // Current user & RBAC
  const [currentUser, setCurrentUser] = useState<User>(SYSTEM_USERS.ADMIN);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  // Navigation
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // Documents and Search
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedFormat, setSelectedFormat] = useState<string>('All');
  const [searchLatency, setSearchLatency] = useState<number>(12);

  // Modals
  const [detailDocument, setDetailDocument] = useState<DocumentItem | null>(null);
  const [editDocument, setEditDocument] = useState<DocumentItem | null>(null);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);

  // Toast Notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  // Initialize data on mount
  useEffect(() => {
    const initialDocs = ApiService.initialize();
    setDocuments(initialDocs);
    setAuditLogs(AuditService.getLogs());

    ApiService.fetchDocumentsFromServer().then((docs) => {
      setDocuments(docs);
    });
  }, []);

  // Compute Search Results
  const searchResults = useMemo(() => {
    const startTime = performance.now();
    const results = ApiService.search(searchQuery, {
      category: selectedCategory,
      fileType: selectedFormat
    });
    const elapsed = Math.max(4, Math.round(performance.now() - startTime + 8));
    setSearchLatency(elapsed);
    return results;
  }, [searchQuery, selectedCategory, selectedFormat, documents]);

  // Compute System Stats
  const stats = useMemo(() => {
    return ApiService.getStats();
  }, [documents]);

  // Handlers
  const handleRoleSelect = (newRole: UserRole) => {
    const newUser = SYSTEM_USERS[newRole];
    setCurrentUser(newUser);

    AuditService.log({
      actor: { id: newUser.id, name: newUser.name, role: newRole },
      action: 'ROLE_SWITCHED',
      resource: `Role: ${newRole}`,
      resourceId: `role-${newRole.toLowerCase()}`,
      details: `Switched active role to ${newUser.name} (${newUser.title})`
    });
    setAuditLogs(AuditService.getLogs());
    showToast(`Role switched to ${newRole} (${newUser.name})`, 'info');
  };

  const handleOpenDocument = (doc: DocumentItem) => {
    setDetailDocument(doc);
    AuditService.log({
      actor: { id: currentUser.id, name: currentUser.name, role: currentUser.role },
      action: 'DOCUMENT_VIEW',
      resource: doc.title,
      resourceId: doc.id,
      details: `Viewed document content for ${doc.fileName}`
    });
    setAuditLogs(AuditService.getLogs());
  };

  const handleSaveDocument = (doc: DocumentItem) => {
    const saved = ApiService.saveDocument(doc);
    setDocuments([...ApiService.getDocuments()]);

    AuditService.log({
      actor: { id: currentUser.id, name: currentUser.name, role: currentUser.role },
      action: 'DOCUMENT_UPLOAD',
      resource: doc.title,
      resourceId: doc.id,
      details: `Ingested ${doc.fileName} (${doc.fileType.toUpperCase()}) into inverted index.`
    });
    setAuditLogs(AuditService.getLogs());
    showToast(`"${doc.title}" indexed successfully`);
  };

  const handleUpdateMetadata = (id: string, updates: Partial<DocumentItem>) => {
    try {
      const updated = ApiService.updateDocumentMetadata(id, updates, currentUser.role, currentUser.name);
      setDocuments([...ApiService.getDocuments()]);

      AuditService.log({
        actor: { id: currentUser.id, name: currentUser.name, role: currentUser.role },
        action: 'METADATA_UPDATE',
        resource: updated.title,
        resourceId: updated.id,
        details: `Updated metadata for document ${updated.title}`
      });
      setAuditLogs(AuditService.getLogs());
      showToast(`Updated metadata for "${updated.title}"`);
    } catch (err: any) {
      showToast(err.message || 'Failed to update metadata', 'error');
    }
  };

  const handleDeleteDocument = (doc: DocumentItem) => {
    if (currentUser.role === 'VIEWER') {
      showToast('Permission Denied: Viewers cannot delete documents.', 'error');
      return;
    }

    if (window.confirm(`Delete document "${doc.title}" from repository?`)) {
      ApiService.deleteDocument(doc.id, currentUser.role, currentUser.name);
      setDocuments([...ApiService.getDocuments()]);

      AuditService.log({
        actor: { id: currentUser.id, name: currentUser.name, role: currentUser.role },
        action: 'DOCUMENT_DELETE',
        resource: doc.title,
        resourceId: doc.id,
        details: `Deleted ${doc.fileName} from repository.`
      });
      setAuditLogs(AuditService.getLogs());
      showToast(`Deleted "${doc.title}"`, 'info');
    }
  };

  const handleRebuildIndex = () => {
    if (currentUser.role !== 'ADMIN') {
      showToast('Permission Denied: Only Administrators can rebuild index.', 'error');
      return;
    }

    const res = ApiService.rebuildTfIdfIndex();
    AuditService.log({
      actor: { id: currentUser.id, name: currentUser.name, role: currentUser.role },
      action: 'SYSTEM_INDEX_REBUILT',
      resource: 'Inverted Index',
      resourceId: 'idx-master',
      details: `Rebuilt inverted index: ${res.count} documents, ${res.vocabularySize} tokens.`
    });
    setAuditLogs(AuditService.getLogs());
    showToast(`Inverted index rebuilt (${res.vocabularySize} vocabulary tokens)`);
  };

  const handleQuickSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Header */}
      <Navbar
        currentUser={currentUser}
        onOpenRoleModal={() => setIsRoleModalOpen(true)}
        onSelectTab={setCurrentTab}
        onQuickSearch={handleQuickSearch}
        quickSearchText={searchQuery}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          documentCount={documents.length}
          userRole={currentUser.role}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto p-5 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {currentTab === 'dashboard' && (
              <DashboardView
                stats={stats}
                documents={documents}
                userRole={currentUser.role}
                onSelectTab={setCurrentTab}
                onOpenDocument={handleOpenDocument}
                onQuickSearch={handleQuickSearch}
              />
            )}

            {currentTab === 'search' && (
              <SearchDiscoveryView
                searchResults={searchResults}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                selectedFormat={selectedFormat}
                onFormatChange={setSelectedFormat}
                onOpenDocument={handleOpenDocument}
                onEditDocument={(doc) => setEditDocument(doc)}
                onDeleteDocument={handleDeleteDocument}
                userRole={currentUser.role}
                latencyMs={searchLatency}
              />
            )}

            {currentTab === 'repository' && (
              <DocumentRepositoryView
                documents={documents}
                userRole={currentUser.role}
                onOpenDocument={handleOpenDocument}
                onEditDocument={(doc) => setEditDocument(doc)}
                onDeleteDocument={handleDeleteDocument}
                onSelectTab={setCurrentTab}
                onRebuildIndex={handleRebuildIndex}
              />
            )}

            {currentTab === 'upload' && (
              <UploadOcrStudioView
                userRole={currentUser.role}
                userName={currentUser.name}
                onSaveDocument={handleSaveDocument}
                onSelectTab={setCurrentTab}
              />
            )}

            {currentTab === 'audit' && (
              <AuditTrailView
                logs={auditLogs}
                userRole={currentUser.role}
                onRefreshLogs={() => setAuditLogs(AuditService.getLogs())}
              />
            )}

            {currentTab === 'spec' && (
              <ArchitectureSpecView />
            )}
          </div>
        </main>
      </div>

      {/* Document Detail Modal */}
      {detailDocument && (
        <DocumentDetailModal
          document={detailDocument}
          isOpen={!!detailDocument}
          onClose={() => setDetailDocument(null)}
          userRole={currentUser.role}
          onEditMetadata={(doc) => setEditDocument(doc)}
          onDeleteDocument={handleDeleteDocument}
        />
      )}

      {/* Edit Metadata Modal */}
      {editDocument && (
        <EditMetadataModal
          document={editDocument}
          isOpen={!!editDocument}
          onClose={() => setEditDocument(null)}
          onSave={handleUpdateMetadata}
          userRole={currentUser.role}
        />
      )}

      {/* Role Switcher Modal */}
      <RoleSwitcherModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        currentUser={currentUser}
        onSelectRole={handleRoleSelect}
      />

      {/* Supabase Connection Modal */}
      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onSuccess={(url) => showToast(`Supabase connected to ${url}`)}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3.5 py-2.5 rounded-md bg-white border border-slate-200 shadow-md text-xs font-medium text-slate-800 animate-in slide-in-from-bottom-2">
          {toast.type === 'success' && <CheckCircle2 size={15} className="text-emerald-600" />}
          {toast.type === 'error' && <AlertCircle size={15} className="text-red-600" />}
          {toast.type === 'info' && <Info size={15} className="text-slate-600" />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
