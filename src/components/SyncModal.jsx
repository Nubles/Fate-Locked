import React, { useState } from 'react';
import { X, RefreshCw, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

const SyncModal = ({ isOpen, onClose, rsn, setRsn, fetchStats, calculateSyncDiff, processSync }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [diff, setDiff] = useState(null);
  const [syncResult, setSyncResult] = useState(null);

  if (!isOpen) return null;

  const handleFetch = async () => {
    setLoading(true);
    setError(null);
    setDiff(null);
    setSyncResult(null);

    const result = await fetchStats(rsn);
    if (result.success) {
      const changes = calculateSyncDiff(result.data);
      const hasChanges = Object.keys(changes.levels).length > 0 || changes.clog > 0;

      if (!hasChanges) {
        setError("No new levels or collection log slots found to sync.");
      } else {
        setDiff(changes);
      }
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  const handleConfirm = () => {
    if (diff) {
      const res = processSync(diff);
      setSyncResult(res.message);
      setDiff(null); // Clear diff to prevent double sync
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-yellow-600/30 rounded-lg max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

        {/* Header */}
        <div className="bg-zinc-950 p-4 border-b border-zinc-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-yellow-500 flex items-center gap-2">
            <RefreshCw className="w-5 h-5" /> Sync with WiseOldMan
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">

          {/* Input */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Runescape Username</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={rsn}
                onChange={(e) => setRsn(e.target.value)}
                placeholder="e.g. B0aty"
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white focus:outline-none focus:border-yellow-500"
                onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
              />
              <button
                onClick={handleFetch}
                disabled={loading || !rsn}
                className="bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold px-4 py-2 rounded transition-colors"
              >
                {loading ? '...' : 'Fetch'}
              </button>
            </div>
            <p className="text-xs text-zinc-500 mt-2">
              Fetches latest snapshot from WiseOldMan.net. Rolls keys for missed levels & collection logs.
            </p>
          </div>

          {/* Status / Error */}
          {error && (
            <div className="bg-red-900/20 border border-red-800 p-3 rounded text-red-400 text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Diff Preview */}
          {diff && (
            <div className="bg-zinc-800/50 rounded-lg p-4 max-h-60 overflow-y-auto space-y-3">
              <h3 className="text-white font-semibold text-sm border-b border-zinc-700 pb-2">Changes Found</h3>

              {/* Levels */}
              {Object.entries(diff.levels).map(([skill, { from, to }]) => (
                <div key={skill} className="flex justify-between items-center text-sm">
                  <span className="text-zinc-300">{skill}</span>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <span>{from}</span>
                    <ArrowRight className="w-3 h-3" />
                    <span className="text-green-400 font-bold">{to}</span>
                  </div>
                </div>
              ))}

              {/* Clog */}
              {diff.clog > 0 && (
                <div className="flex justify-between items-center text-sm pt-2 border-t border-zinc-700/50">
                  <span className="text-zinc-300">Collection Log Slots</span>
                  <span className="text-green-400 font-bold">+{diff.clog}</span>
                </div>
              )}
            </div>
          )}

          {/* Success Result */}
          {syncResult && (
            <div className="bg-green-900/20 border border-green-800 p-4 rounded text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-green-400 font-medium">{syncResult}</p>
            </div>
          )}

        </div>

        {/* Footer */}
        {diff && (
          <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex justify-end">
            <button
              onClick={handleConfirm}
              className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded transition-all shadow-lg shadow-green-900/20"
            >
              Confirm & Roll Keys
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default SyncModal;
