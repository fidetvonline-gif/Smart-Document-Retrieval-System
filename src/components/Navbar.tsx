import React from 'react';
import { Search, Shield, ChevronDown, Files, BookOpen } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentUser: User;
  onOpenRoleModal: () => void;
  onSelectTab: (tab: string) => void;
  onQuickSearch: (query: string) => void;
  quickSearchText: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenRoleModal,
  onSelectTab,
  onQuickSearch,
  quickSearchText
}) => {
  return (
    <header className="sticky top-0 z-30 h-14 border-b border-slate-200 bg-white px-4 sm:px-6 flex items-center justify-between">
      {/* Zone 1: Brand Wordmark */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onSelectTab('dashboard')}
          className="flex items-center gap-2.5 text-left focus:outline-none"
        >
          <div className="w-8 h-8 rounded-md bg-slate-900 flex items-center justify-center text-white font-semibold shadow-xs">
            <Files size={17} className="text-white" />
          </div>
          <div>
            <span className="font-semibold text-sm text-slate-900 tracking-tight block leading-tight">
              Document Retrieval System
            </span>
            <span className="text-[11px] text-slate-500 font-normal">
              Enterprise Storage & Indexing
            </span>
          </div>
        </button>
      </div>

      {/* Zone 2: Global Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-lg mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          <input
            type="text"
            placeholder="Search documents, terms, or reference IDs..."
            value={quickSearchText}
            onChange={(e) => {
              onQuickSearch(e.target.value);
              onSelectTab('search');
            }}
            onFocus={() => onSelectTab('search')}
            className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-md pl-8.5 pr-8 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300 transition-colors"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Zone 3: Navigation Actions & Account Profile */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onSelectTab('spec')}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
        >
          <BookOpen size={14} className="text-slate-500" />
          <span>System Specs</span>
        </button>

        <div className="h-4 w-px bg-slate-200 hidden sm:block" />

        {/* User & Role Switcher */}
        <button
          onClick={onOpenRoleModal}
          className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-md hover:bg-slate-100 border border-slate-200/80 transition-colors"
          title="Switch Active User & Role"
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-6 h-6 rounded-full object-cover border border-slate-300"
          />
          <div className="text-left hidden sm:block">
            <div className="text-xs font-medium text-slate-800 leading-none">{currentUser.name}</div>
            <div className="text-[10px] text-slate-500 mt-0.5 leading-none">
              {currentUser.role}
            </div>
          </div>
          <ChevronDown size={13} className="text-slate-400 ml-0.5" />
        </button>
      </div>
    </header>
  );
};
