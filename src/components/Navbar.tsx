import React from 'react';
import { Settings } from 'lucide-react';

interface NavbarProps {
  isOfflineFallback: boolean;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isOfflineFallback,
  onOpenSettings,
}) => {
  return (
    <header className="w-full bg-[#0d101d] border-b border-gray-800/80 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold font-mono tracking-wider text-white select-none">
            Think Board
          </h1>
          <span
            className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
              isOfflineFallback
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            }`}
            title={
              isOfflineFallback
                ? 'Live backend is unavailable. Using LocalStorage Mock Mode.'
                : 'Connected to live REST API backend.'
            }
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isOfflineFallback ? 'bg-amber-400' : 'bg-emerald-400'
              }`}
            />
            {isOfflineFallback ? 'Mock API Mode' : 'Live API'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenSettings}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-gray-800/70 text-gray-300 border border-gray-700 hover:bg-gray-800 transition-colors"
            title="Configure Backend API URL"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">API Settings</span>
          </button>
        </div>
      </div>
    </header>
  );
};
