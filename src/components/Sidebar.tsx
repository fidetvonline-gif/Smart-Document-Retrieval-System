import React from 'react';
import {
  LayoutDashboard,
  Search,
  Folder,
  UploadCloud,
  FileText,
  Shield,
  Layers,
  CheckCircle2,
  Database
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  documentCount: number;
  userRole: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  documentCount,
  userRole
}) => {
  const mainNav = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, count: null },
    { id: 'search', label: 'Search & Retrieval', icon: Search, count: null },
    { id: 'repository', label: 'All Documents', icon: Folder, count: documentCount.toString() },
    {
      id: 'upload',
      label: 'Upload & OCR',
      icon: UploadCloud,
      count: userRole === 'VIEWER' ? 'Restricted' : null
    }
  ];

  const adminNav = [
    { id: 'audit', label: 'Audit Log', icon: FileText, count: null },
    { id: 'spec', label: 'Architecture & Schema', icon: Database, count: null }
  ];

  return (
    <aside className="w-60 border-r border-slate-200 bg-white flex flex-col justify-between p-3 select-none flex-shrink-0 hidden md:flex">
      <div className="space-y-6">
        {/* Main Section */}
        <div>
          <div className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Repository
          </div>
          <nav className="space-y-0.5">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} className={isActive ? 'text-slate-900' : 'text-slate-400'} />
                    <span>{item.label}</span>
                  </div>
                  {item.count && (
                    <span className="text-[11px] font-mono text-slate-400">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Administration & Compliance Section */}
        <div>
          <div className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Governance
          </div>
          <nav className="space-y-0.5">
            {adminNav.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} className={isActive ? 'text-slate-900' : 'text-slate-400'} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Formats info */}
        <div className="p-3 rounded-md bg-slate-50 border border-slate-200/80 text-xs">
          <div className="text-[11px] font-semibold text-slate-700 mb-1">
            Supported Formats
          </div>
          <div className="text-[11px] text-slate-500 font-mono flex flex-wrap gap-1 leading-normal">
            <span>PDF</span> · <span>DOCX</span> · <span>TXT</span> · <span>CSV</span> · <span>PNG</span> · <span>JPG</span>
          </div>
        </div>
      </div>

      {/* Role & System Health Status Footer */}
      <div className="pt-3 border-t border-slate-200">
        <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
          <span className="flex items-center gap-1.5 font-medium text-slate-700">
            <Shield size={12} className="text-slate-400" />
            {userRole} Mode
          </span>
          <span className="font-mono text-emerald-700 font-medium">Ready</span>
        </div>
      </div>
    </aside>
  );
};
