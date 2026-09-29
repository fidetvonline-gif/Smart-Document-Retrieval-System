import React, { useState } from 'react';
import { Download, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-2xs"
      >
        <Download size={14} />
        <span>Install App</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors"
        >
          <Smartphone size={14} />
          <span>Install App</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
              <h3 className="text-sm font-semibold text-slate-900">Install on iPhone / iPad</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                1. Tap the <strong>Share</strong> button in your Safari toolbar.<br />
                2. Scroll down and select <strong>Add to Home Screen</strong>.
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full rounded-lg bg-slate-900 py-2 text-xs font-medium text-white hover:bg-slate-800 transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <button
      onClick={() => alert('To install this app, open your browser menu (⋮) and select "Install App" or "Add to Home Screen".')}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors"
      title="Install PWA"
    >
      <Download size={14} className="text-slate-500" />
      <span>Install App</span>
    </button>
  );
};
