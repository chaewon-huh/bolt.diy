import { clearAllSessions } from '~/utils/clearSession';

export function ClearSessionButton() {
  const handleClear = async () => {
    if (window.confirm('This will clear all sessions and local data. Continue?')) {
      await clearAllSessions();
    }
  };

  // 개발 환경에서만 표시
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <button
      onClick={handleClear}
      className="fixed bottom-4 left-4 z-50 px-4 py-2 text-xs bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg transition-colors"
      title="Clear all sessions and storage"
    >
      🧹 Clear All Sessions
    </button>
  );
}