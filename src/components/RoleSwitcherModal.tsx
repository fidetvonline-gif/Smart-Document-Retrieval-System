import React from 'react';
import { X, Check } from 'lucide-react';
import { User, UserRole } from '../types';
import { SYSTEM_USERS } from '../services/mockData';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onSelectRole: (role: UserRole) => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectRole
}) => {
  if (!isOpen) return null;

  const rolesList: { role: UserRole; user: User; desc: string }[] = [
    {
      role: 'ADMIN',
      user: SYSTEM_USERS.ADMIN,
      desc: 'Full administrative rights: upload, edit metadata, delete documents, trigger OCR, rebuild TF-IDF index, and export compliance audit logs.'
    },
    {
      role: 'EDITOR',
      user: SYSTEM_USERS.EDITOR,
      desc: 'Knowledge curator rights: upload documents, run OCR extraction, update metadata tags, and manage repository records.'
    },
    {
      role: 'VIEWER',
      user: SYSTEM_USERS.VIEWER,
      desc: 'Read-only rights: full-text and TF-IDF search, document reader view, OCR text inspection, and file export.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">User Role & Permissions (RBAC)</h2>
            <p className="text-xs text-slate-500">
              Switch active persona to test system permission enforcement
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={16} />
          </button>
        </div>

        {/* Roles List */}
        <div className="p-4 space-y-2.5">
          {rolesList.map(({ role, user, desc }) => {
            const isSelected = currentUser.role === role;

            return (
              <div
                key={role}
                onClick={() => {
                  onSelectRole(role);
                  onClose();
                }}
                className={`p-3 rounded-lg border transition-colors cursor-pointer flex items-start justify-between gap-3 ${
                  isSelected
                    ? 'border-slate-900 bg-slate-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover border border-slate-200 flex-shrink-0"
                  />
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 text-xs">{user.name}</span>
                      <span className="text-[10px] font-mono text-slate-500 uppercase">
                        {role}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-normal">{user.title}</div>
                    <p className="text-xs text-slate-600 leading-normal pt-1">{desc}</p>
                  </div>
                </div>

                <div className="flex items-center flex-shrink-0 pt-0.5">
                  {isSelected ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-900">
                      <Check size={13} /> Active
                    </span>
                  ) : (
                    <button className="text-[11px] text-slate-500 hover:text-slate-900 font-medium">
                      Select
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Session Token: Bearer RBAC (Active)</span>
          <span className="font-mono text-slate-700">Audit Logging Enabled</span>
        </div>
      </div>
    </div>
  );
};
