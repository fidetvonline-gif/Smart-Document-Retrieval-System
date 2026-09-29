import { AuditLogItem, UserRole } from '../types';

const AUDIT_STORAGE_KEY = 'smart_doc_audit_logs_v1';

export class AuditService {
  private static initialLogs: AuditLogItem[] = [];

  public static getLogs(): AuditLogItem[] {
    try {
      const stored = localStorage.getItem(AUDIT_STORAGE_KEY);
      if (stored) {
        const parsed: AuditLogItem[] = JSON.parse(stored);
        return parsed.filter(l => !l.id.startsWith('aud-101') && !l.id.startsWith('aud-102') && !l.id.startsWith('aud-103') && !l.id.startsWith('aud-104') && !l.id.startsWith('aud-105'));
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
