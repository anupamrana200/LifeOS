import { LogOut, Settings, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';

const getInitials = (name = '') => name.split(' ').filter(Boolean).map((part) => part[0]).slice(0, 2).join('').toUpperCase() || 'U';

export const ProfileDropdown = ({ isOpen, onLogout, onToggle, user }) => (
  <div className="relative">
    <button aria-expanded={isOpen} aria-haspopup="menu" aria-label="Open user menu" className="inline-flex size-10 items-center justify-center rounded-pill bg-primary text-sm font-semibold text-content-inverse transition-opacity duration-theme hover:opacity-90" onClick={onToggle} type="button">
      {getInitials(user?.fullName)}
    </button>
    {isOpen && (
      <section aria-label="User menu" className="absolute right-0 z-dropdown mt-2 w-[min(16rem,calc(100vw-1rem))] overflow-hidden rounded-card border border-border bg-card shadow-floating" role="menu">
        <div className="border-b border-border px-gutter py-3">
          <p className="truncate text-sm font-semibold text-content-primary">{user?.fullName || 'LifeOS user'}</p>
          <p className="truncate text-xs text-content-secondary">{user?.email || 'Signed-in account'}</p>
        </div>
        <div className="p-1.5">
          <Link className="flex items-center gap-3 rounded-control px-3 py-2 text-sm text-content-secondary transition-colors duration-theme hover:bg-canvas hover:text-content-primary" to={ROUTES.profile}><UserRound aria-hidden="true" size={17} /> Profile</Link>
          <Link className="flex items-center gap-3 rounded-control px-3 py-2 text-sm text-content-secondary transition-colors duration-theme hover:bg-canvas hover:text-content-primary" to={ROUTES.settings}><Settings aria-hidden="true" size={17} /> Settings</Link>
          <button className="flex w-full items-center gap-3 rounded-control px-3 py-2 text-sm text-danger transition-colors duration-theme hover:bg-canvas" onClick={onLogout} type="button"><LogOut aria-hidden="true" size={17} /> Log out</button>
        </div>
      </section>
    )}
  </div>
);
