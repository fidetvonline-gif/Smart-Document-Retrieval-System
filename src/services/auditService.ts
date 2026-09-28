import { AuditLogItem, UserRole } from '../types';

const AUDIT_STORAGE_KEY = 'smart_doc_audit_logs_v1';

export class AuditService {
  private static initialLogs: AuditLogItem[] = [
    {
      id: 'aud-101',
      timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
      actor: { id: 'u-admin-01', name: 'Sarah Chen', role: 'ADMIN' },
      action: 'SYSTEM_INDEX_REBUILT',
      resource: 'Inverted Index (TF-IDF)',
      resourceId: 'idx-master',
      status: 'SUCCESS',
      ip: '192.168.1.104',
      details: 'Re-indexed 6 corporate documents across 6 file formats. Vocabulary: 4,120 unique tokens.'
    },
    {
      id: 'aud-102',
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
      actor: { id: 'u-editor-02', name: 'Marcus Vance', role: 'EDITOR' },
      action: 'DOCUMENT_UPLOAD',
      resource: 'Q3_System_Architecture_Spec.docx',
      resourceId: 'doc-002',
      status: 'SUCCESS',
      ip: '192.168.1.88',
      details: 'Uploaded technical specification document. Size: 1.4 MB. Auto-classified as Technical & Architecture (97.9%).'
    },
    {
      id: 'aud-103',
      timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
      actor: { id: 'u-editor-02', name: 'Marcus Vance', role: 'EDITOR' },
      action: 'OCR_PROCESSED',
      resource: 'Scanned_Receipt_Invoice_7829.png',
      resourceId: 'doc-005',
      status: 'SUCCESS',
      ip: '192.168.1.88',
      details: 'Extracted 420 words via OCR pipeline. Confidence: 97.4% across 42 text bounding boxes.'
    },
    {
      id: 'aud-104',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      actor: { id: 'u-viewer-03', name: 'Elena Rostova', role: 'VIEWER' },
      action: 'SEARCH_QUERY',
      resource: 'Query: "service level agreement liability"',
      resourceId: 'search-q-101',
      status: 'SUCCESS',
      ip: '10.0.4.15',
      details: 'Executed hybrid TF-IDF + metadata search. 4 documents matched with relevance scoring.'
    },
    {
      id: 'aud-105',
      timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
      actor: { id: 'u-viewer-03', name: 'Elena Rostova', role: 'VIEWER' },
      action: 'DOCUMENT_VIEW',
      resource: 'Vendor Master Service Agreement v3',
      resourceId: 'doc-001',
      status: 'SUCCESS',
      ip: '10.0.4.15',
      details: 'Accessed and previewed legal terms and indemnity clauses in Vendor_Master_Service_Agreement_v3.pdf.'
    }
  ];

  public static getLogs(): AuditLogItem[] {
    try {
      const stored = localStorage.getItem(AUDIT_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    return this.initialLogs;
  }

  public static log(entry: {
    actor: { id: string; name: string; role: UserRole };
    action: AuditLogItem['action'];
    resource: string;
    resourceId: string;
    details: string;
    status?: AuditLogItem['status'];
  }): AuditLogItem {
    const logs = this.getLogs();
    const newLog: AuditLogItem = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      actor: entry.actor,
      action: entry.action,
      resource: entry.resource,
      resourceId: entry.resourceId,
      status: entry.status || 'SUCCESS',
      ip: '192.168.1.' + Math.floor(20 + Math.random() * 80),
      details: entry.details
    };

    const updated = [newLog, ...logs];
    try {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updated.slice(0, 200)));
    } catch {
      // Storage quota or restriction
    }

    return newLog;
  }

  public static exportToCsv(logs: AuditLogItem[]): void {
    const headers = ['ID', 'Timestamp', 'Actor Name', 'Actor Role', 'Action', 'Resource', 'Status', 'IP Address', 'Details'];
    const rows = logs.map(l => [
      `"${l.id}"`,
      `"${l.timestamp}"`,
      `"${l.actor.name}"`,
      `"${l.actor.role}"`,
      `"${l.action}"`,
      `"${l.resource.replace(/"/g, '""')}"`,
      `"${l.status}"`,
      `"${l.ip}"`,
      `"${l.details.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `audit_trail_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  public static exportToJson(logs: AuditLogItem[]): void {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `audit_trail_report_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.removeChild(downloadAnchor);
  }
}
