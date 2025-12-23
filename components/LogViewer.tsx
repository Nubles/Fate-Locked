import React, { useRef, useEffect } from 'react';
import { LogEntry } from '../types';

interface LogViewerProps {
  history: LogEntry[];
}

export const LogViewer: React.FC<LogViewerProps> = ({ history }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [history]);

  return (
    <div className="bg-black/40 border border-osrs-border rounded-lg p-4 h-64 flex flex-col">
      <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Fate Log</h3>
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto space-y-2 pr-2 font-mono text-sm custom-scrollbar"
      >
        {history.length === 0 && (
          <div className="text-gray-600 italic text-center mt-10">The fate of your account is yet to be written...</div>
        )}
        {history.map((entry) => (
          <div key={entry.id} className="border-l-2 pl-2 py-1 border-gray-700">
            <div className="flex justify-between text-xs text-gray-500 mb-0.5">
              <span>{new Date(entry.timestamp).toLocaleTimeString()}</span>
              {entry.type === 'ROLL' && (
                <span className={entry.result === 'SUCCESS' ? 'text-osrs-success' : 'text-osrs-fail'}>
                  {entry.result}
                </span>
              )}
            </div>
            <div className="text-gray-300">
              {entry.message}
            </div>
            {entry.details && (
              <div className="text-xs text-gray-500 mt-0.5">
                {entry.details}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
