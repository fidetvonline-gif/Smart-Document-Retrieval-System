import React, { useState } from 'react';
import {
  FileText,
  Download,
  Search,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Shield
} from 'lucide-react';
import { AuditLogItem, UserRole } from '../types';
import { AuditService } from '../services/auditService';

interface AuditTrailViewProps {
  logs: AuditLogItem[];
  userRole: UserRole;
  onRefreshLogs?: () => void;
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({
  logs,
  userRole
}) => {
  const [filterAction, setFilterAction] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const actions = [
    'All',
    'DOCUMENT_UPLOAD',
    'DOCUMENT_VIEW',
    'DOCUMENT_DOWNLOAD',
    'DOCUMENT_EDIT',
    'DOCUMENT_DELETE',
    'OCR_PROCESSED',
    'METADATA_UPDATE',
    'SEARCH_QUERY',
    'SYSTEM_INDEX_REBUILT',
    'ROLE_SWITCHED'
  ];

  const filteredLogs = logs.filter((log) => {
    if (filterAction !== 'All' && log.action !== filterAction) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const match =
        log.actor.name.toLowerCase().includes(q) ||
        log.resource.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.ip.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
            Security & Compliance Audit Trail
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable system log recording document access, queries, OCR processing, and administrative actions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => AuditService.exportToCsv(filteredLogs)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs transition-colors"
          >
            <Download size={13} className="text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => AuditService.exportToJson(filteredLogs)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs transition-colors"
          >
            <Download size={13} className="text-slate-500" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-3 rounded-lg bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            type="text"
            placeholder="Search actor, resource, action, IP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded pl-7.5 pr-2.5 py-1 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Filter Action:</span>
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="bg-white border border-slate-200 rounded px-2.5 py-1 text-slate-700 font-mono text-xs focus:outline-none focus:border-slate-400"
          >
            {actions.map((act) => (
              <option key={act} value={act}>{act}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-2xs">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className="p-3">Timestamp (UTC)</th>
              <th className="p-3">User & Role</th>
              <th className="p-3">Action Event</th>
              <th className="p-3">Target Resource</th>
              <th className="p-3">IP Address</th>
              <th className="p-3">Status</th>
              <th className="p-3">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-3 font-mono text-slate-500 whitespace-nowrap text-[11px]">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="p-3 whitespace-nowrap">
                  <div className="font-medium text-slate-900">{log.actor.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{log.actor.role}</div>
                </td>
                <td className="p-3 font-mono text-slate-700 whitespace-nowrap font-medium">
                  {log.action}
                </td>
                <td className="p-3 font-medium text-slate-900 max-w-[180px] truncate">
                  {log.resource}
                </td>
                <td className="p-3 font-mono text-slate-500 whitespace-nowrap text-[11px]">
                  {log.ip}
                </td>
                <td className="p-3 whitespace-nowrap">
                  <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-medium ${
                    log.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    log.status === 'WARNING' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {log.status}
                  </span>
                </td>
                <td className="p-3 text-slate-500 text-[11px] max-w-xs leading-relaxed">
                  {log.details}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
