import { useState, useEffect } from 'react';

export function useSession() {
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    let existingSessionId = localStorage.getItem('session_id');
    if (!existingSessionId) {
      existingSessionId = 'session_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
      localStorage.setItem('session_id', existingSessionId);
    }
    setSessionId(existingSessionId);
  }, []);

  const clearSession = () => {
    localStorage.removeItem('session_id');
    setSessionId('');
  };

  return { sessionId, clearSession };
}