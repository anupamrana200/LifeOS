import { useCallback, useMemo, useState } from 'react';
import { conversationService, documentService } from '@/services';
import { ROUTES } from '@/constants';
import SearchContext from './SearchContext';

const historyKey = 'lifeos-search-history';
const staticResults = [{ description: 'Manage application preferences', id: 'settings', title: 'Settings', type: 'settings', to: ROUTES.settings }, { description: 'Update your personal profile', id: 'profile', title: 'Profile', type: 'settings', to: ROUTES.profile }, { description: 'Open a new AI conversation', id: 'new-chat', title: 'New chat', type: 'action', to: ROUTES.chat }];
const readHistory = () => { try { return JSON.parse(window.localStorage.getItem(historyKey) || '[]'); } catch { return []; } };

export const SearchProvider = ({ children }) => {
  const [results, setResults] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState(readHistory);
  const search = useCallback(async (query, filter = 'all') => {
    const normalized = query.trim();
    if (!normalized) { setResults(staticResults); return staticResults; }
    setLoading(true); setError(null);
    try {
      const tasks = [];
      if (filter === 'all' || filter === 'chats') tasks.push(conversationService.fetchConversations().then((items) => items.filter((item) => item.title.toLowerCase().includes(normalized.toLowerCase())).map((item) => ({ description: item.provider, id: item._id || item.id, title: item.title, type: 'chat', to: ROUTES.chat }))));
      if (filter === 'all' || filter === 'documents') tasks.push(documentService.fetchDocuments({ limit: 20, page: 1, search: normalized }).then((data) => (data.documents || []).map((item) => ({ description: item.description || item.originalFileName, id: item.id, title: item.title, type: 'document', to: ROUTES.documents }))));
      const apiResults = (await Promise.all(tasks)).flat();
      const settingsResults = filter === 'all' || filter === 'settings' ? staticResults.filter((item) => item.title.toLowerCase().includes(normalized.toLowerCase()) || item.description.toLowerCase().includes(normalized.toLowerCase())) : [];
      const next = [...apiResults, ...settingsResults]; setResults(next); return next;
    } catch (searchError) { setError(searchError.message || 'Search is currently unavailable.'); setResults([]); return []; } finally { setLoading(false); }
  }, []);
  const addHistory = useCallback((query) => { const next = [query, ...history.filter((item) => item !== query)].slice(0, 6); setHistory(next); window.localStorage.setItem(historyKey, JSON.stringify(next)); }, [history]);
  const clearHistory = useCallback(() => { setHistory([]); window.localStorage.removeItem(historyKey); }, []);
  const value = useMemo(() => ({ addHistory, clearHistory, error, history, isLoading, results, search }), [addHistory, clearHistory, error, history, isLoading, results, search]);
  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};
