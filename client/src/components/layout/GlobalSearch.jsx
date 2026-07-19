import { Search } from 'lucide-react';

export const GlobalSearch = ({ onOpen }) => (
  <button aria-label="Open command search" className="group flex h-10 items-center gap-2 rounded-control border border-border bg-canvas px-3 text-left text-sm text-content-muted transition-colors duration-theme hover:border-primary hover:text-content-primary sm:min-w-64" onClick={onOpen} type="button">
    <Search aria-hidden="true" size={17} />
    <span className="hidden flex-1 sm:inline">Search LifeOS</span>
    <kbd className="hidden rounded-control border border-border px-1.5 py-0.5 font-mono text-[0.65rem] sm:inline">Ctrl K</kbd>
  </button>
);
