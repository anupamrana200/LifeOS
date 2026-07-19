import { useCallback, useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '@/hooks';

export const CommandPalette = ({ isOpen, onClose }) => {
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { addHistory, isLoading, results, search } = useSearch();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const openResult = useCallback((result) => {
    if (!result) return;
    if (query.trim()) addHistory(query.trim());
    navigate(result.to);
    onClose();
  }, [addHistory, navigate, onClose, query]);

  useEffect(() => {
    if (!isOpen) return undefined;
    inputRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowDown') { event.preventDefault(); setSelectedIndex((index) => Math.min(index + 1, Math.max(results.length - 1, 0))); }
      if (event.key === 'ArrowUp') { event.preventDefault(); setSelectedIndex((index) => Math.max(index - 1, 0)); }
      if (event.key === 'Enter') { event.preventDefault(); openResult(results[selectedIndex]); }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, openResult, results, selectedIndex]);

  useEffect(() => { if (isOpen) search(query); }, [isOpen, query, search]);
  if (!isOpen) return null;

  return <div aria-label="Command palette" aria-modal="true" className="fixed inset-0 z-modal flex items-start justify-center bg-secondary/40 px-gutter pt-[15vh]" onMouseDown={onClose} role="dialog"><div className="w-full max-w-xl overflow-hidden rounded-panel border border-border bg-card shadow-floating" onMouseDown={(event) => event.stopPropagation()}><div className="flex items-center gap-3 border-b border-border px-gutter py-3"><Search aria-hidden="true" className="text-content-muted" size={19} /><input aria-label="Search commands" className="min-w-0 flex-1 bg-transparent text-sm text-content-primary outline-none placeholder:text-content-muted" onChange={(event) => { setQuery(event.target.value); setSelectedIndex(0); }} placeholder="Search commands" ref={inputRef} value={query} /><button aria-label="Close command palette" className="inline-flex size-8 items-center justify-center rounded-control text-content-muted hover:bg-canvas hover:text-content-primary" onClick={onClose} type="button"><X aria-hidden="true" size={17} /></button></div><div className="max-h-80 overflow-y-auto p-2 text-sm">{isLoading ? <p className="px-3 py-2 text-content-secondary">Searching…</p> : results.map((result, index) => <button className={`flex w-full items-center justify-between rounded-control px-3 py-2 text-left ${index === selectedIndex ? 'bg-primary/10 text-primary' : 'text-content-secondary hover:bg-canvas'}`} key={`${result.type}-${result.id}`} onClick={() => openResult(result)} type="button"><span>{result.title}</span><span className="text-xs text-content-muted">{result.type}</span></button>)}{!isLoading && !results.length && <p className="px-3 py-2 text-content-secondary">No results.</p>}</div></div></div>;
};
