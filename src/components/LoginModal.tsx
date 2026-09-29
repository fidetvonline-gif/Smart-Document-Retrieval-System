import React, { useState } from 'react';
import { X, Lock, Mail, Shield, CheckCircle2, UserCheck, ArrowRight } from 'lucide-react';
import { User, UserRole } from '../types';
import { SYSTEM_USERS } from '../services/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onLoginSuccess: (user: User) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'quick' | 'credentials'>('quick');

  if (!isOpen) return null;

  const handleCredentialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error: sbError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (sbError) throw sbError;
        if (data.user) {
          const loggedUser: User = {
            id: data.user.id,
            name: data.user.email?.split('@')[0] || 'Authenticated User',
            email: data.user.email || email,
            role: 'ADMIN',
            title: 'Verified Administrator',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
            permissions: SYSTEM_USERS.ADMIN.permissions
          };
          onLoginSuccess(loggedUser);
          onClose();
          return;
        }
      }

      // Fallback local authentication
      if (email.toLowerCase().includes('admin') || email === 'udo-odu.inibehe@fedpolyukana.edu.ng') {
        onLoginSuccess(SYSTEM_USERS.ADMIN);
      } else if (email.toLowerCase().includes('editor')) {
        onLoginSuccess(SYSTEM_USERS.EDITOR);
      } else {
        onLoginSuccess(SYSTEM_USERS.VIEWER);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSelect = (user: User) => {
    onLoginSuccess(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold">
              <Shield size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Federal Polytechnic Ukana</h2>
              <p className="text-xs text-slate-500">School of Applied Science Admin Login</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/50">
            <X size={18} />
          </button>
        </div>

        {/* Mode switch */}
        <div className="flex border-b border-slate-200 bg-slate-50/50 p-1.5 gap-1 text-xs font-medium">
          <button
            onClick={() => setMode('quick')}
            className={`flex-1 py-2 rounded-md transition-colors ${
              mode === 'quick' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Quick Persona Login
          </button>
          <button
            onClick={() => setMode('credentials')}
            className={`flex-1 py-2 rounded-md transition-colors ${
              mode === 'credentials' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Email & Password
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
              {error}
            </div>
          )}

          {mode === 'quick' ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 mb-2">
                Select your administrative profile or role for the School of Applied Science:
              </p>

              {/* Admin Udo-Odu Inibehe David */}
              <div
                onClick={() => handleQuickSelect(SYSTEM_USERS.ADMIN)}
                className="p-3.5 rounded-lg border border-slate-200 hover:border-slate-900 hover:bg-slate-50 cursor-pointer transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <img src={SYSTEM_USERS.ADMIN.avatar} alt="Admin" className="w-10 h-10 rounded-full object-cover border border-slate-300" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-slate-950">
                      {SYSTEM_USERS.ADMIN.name}
                    </div>
                    <div className="text-[11px] text-slate-500">{SYSTEM_USERS.ADMIN.title}</div>
                    <div className="text-[10px] text-emerald-600 font-medium mt-0.5">Admin Office &bull; Full Access</div>
                  </div>
                </div>
                <ArrowRight size={16} className="text-slate-400 group-hover:text-slate-900 transition-transform group-hover:translate-x-0.5" />
              </div>

              {/* Editor */}
              <div
                onClick={() => handleQuickSelect(SYSTEM_USERS.EDITOR)}
                className="p-3.5 rounded-lg border border-slate-200 hover:border-slate-900 hover:bg-slate-50 cursor-pointer transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <img src={SYSTEM_USERS.EDITOR.avatar} alt="Editor" className="w-10 h-10 rounded-full object-cover border border-slate-300" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">{SYSTEM_USERS.EDITOR.name}</div>
                    <div className="text-[11px] text-slate-500">{SYSTEM_USERS.EDITOR.title}</div>
                    <div className="text-[10px] text-blue-600 font-medium mt-0.5">Knowledge Curator</div>
                  </div>
                </div>
                <ArrowRight size={16} className="text-slate-400 group-hover:text-slate-900 transition-transform group-hover:translate-x-0.5" />
              </div>

              {/* Viewer */}
              <div
                onClick={() => handleQuickSelect(SYSTEM_USERS.VIEWER)}
                className="p-3.5 rounded-lg border border-slate-200 hover:border-slate-900 hover:bg-slate-50 cursor-pointer transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <img src={SYSTEM_USERS.VIEWER.avatar} alt="Viewer" className="w-10 h-10 rounded-full object-cover border border-slate-300" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">{SYSTEM_USERS.VIEWER.name}</div>
                    <div className="text-[11px] text-slate-500">{SYSTEM_USERS.VIEWER.title}</div>
                    <div className="text-[10px] text-amber-600 font-medium mt-0.5">Auditor (Read-Only)</div>
                  </div>
                </div>
                <ArrowRight size={16} className="text-slate-400 group-hover:text-slate-900 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          ) : (
            <form onSubmit={handleCredentialLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-700">Staff Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                  <input
                    type="email"
                    required
                    placeholder="udo-odu.inibehe@fedpolyukana.edu.ng"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-700">Password / Security PIN</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white text-xs font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                {loading ? 'Authenticating...' : 'Sign In to Admin Office'}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Active User: <strong className="text-slate-900">{currentUser.name}</strong></span>
          <span className="font-mono text-emerald-600 font-medium">Secured RBAC</span>
        </div>
      </div>
    </div>
  );
};
