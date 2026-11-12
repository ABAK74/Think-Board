import React, { useState } from 'react';
import { ApiConfig } from '../../types/note';
import { DEFAULT_API_BASE_URL } from '../../services/api';
import { X, Server } from 'lucide-react';

interface ApiSettingsModalProps {
  isOpen: boolean;
  config: ApiConfig;
  onClose: () => void;
  onSave: (newConfig: ApiConfig) => void;
}

export const ApiSettingsModal: React.FC<ApiSettingsModalProps> = ({
  isOpen,
  config,
  onClose,
  onSave,
}) => {
  const [baseUrl, setBaseUrl] = useState(config.baseUrl);
  const [useMockFallback, setUseMockFallback] = useState(config.useMockFallback);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      baseUrl: baseUrl.trim().replace(/\/+$/, '') || DEFAULT_API_BASE_URL,
      useMockFallback,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#1e2229] border border-[#323842] rounded-lg max-w-md w-full p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-gray-800 mb-4">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-indigo-400" />
            <h2 className="text-base font-bold text-white">
              Backend API Configuration
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Base API URL
            </label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder={DEFAULT_API_BASE_URL}
              className="w-full px-3 py-2 bg-[#14171c] border border-[#323842] rounded-md text-sm text-gray-100 focus:outline-none focus:border-[#6366f1]"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Connected backend: {DEFAULT_API_BASE_URL}
            </p>
          </div>

          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={useMockFallback}
              onChange={(e) => setUseMockFallback(e.target.checked)}
              className="mt-0.5 rounded bg-gray-800 border-gray-700 text-[#6366f1] focus:ring-[#6366f1]"
            />
            <span className="text-xs text-gray-300 leading-relaxed">
              Automatically fall back to LocalStorage Mock API if the backend server is unreachable.
            </span>
          </label>

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold bg-[#6366f1] hover:bg-[#5254e8] text-white rounded-md"
            >
              Save & Reconnect
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
