import { useEffect, useRef, useState } from 'react';
import { BrainCircuit, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/ui';
import { ROUTES } from '@/constants';
import { useAuth } from '@/hooks';
import { GlobalSearch } from './GlobalSearch';
import { NotificationDropdown } from './NotificationDropdown';
import { ProfileDropdown } from './ProfileDropdown';
import { Breadcrumbs } from './Breadcrumbs';

export const TopNavbar = ({ actions, applicationShell = false, onCommandOpen, onMenuToggle, showMenuButton = false }) => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const closeDropdowns = (event) => {
      if (!dropdownRef.current?.contains(event.target)) setActiveDropdown(null);
    };
    const closeOnEscape = (event) => { if (event.key === 'Escape') setActiveDropdown(null); };
    document.addEventListener('mousedown', closeDropdowns);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeDropdowns);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate(ROUTES.signIn, { replace: true });
  };

  if (!applicationShell) {
    return <header className="sticky top-0 z-sticky flex h-navbar items-center justify-end border-b border-navbar-border bg-navbar-base px-gutter transition-colors duration-theme">{actions}<ThemeToggle /></header>;
  }

  return (
    <header className="sticky top-0 z-sticky flex h-navbar items-center justify-between border-b border-navbar-border bg-navbar-base px-gutter transition-colors duration-theme">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        {showMenuButton && <button aria-label="Open navigation" className="inline-flex size-10 shrink-0 items-center justify-center rounded-control text-content-secondary transition-colors duration-theme hover:bg-canvas hover:text-content-primary lg:hidden" onClick={onMenuToggle} type="button"><Menu aria-hidden="true" size={20} /></button>}
        <Link aria-label="LifeOS dashboard" className="inline-flex shrink-0 items-center gap-2 text-content-primary lg:hidden" to={ROUTES.dashboard}><BrainCircuit aria-hidden="true" className="text-primary" size={22} /><span className="hidden font-display font-semibold sm:inline">LifeOS</span></Link>
        <div className="hidden min-w-0 lg:block"><Breadcrumbs /></div>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2" ref={dropdownRef}>
        <GlobalSearch onOpen={onCommandOpen} />
        <NotificationDropdown isOpen={activeDropdown === 'notifications'} onToggle={() => setActiveDropdown((current) => current === 'notifications' ? null : 'notifications')} />
        {actions}
        <ThemeToggle />
        <ProfileDropdown isOpen={activeDropdown === 'profile'} onLogout={handleLogout} onToggle={() => setActiveDropdown((current) => current === 'profile' ? null : 'profile')} user={user} />
      </div>
    </header>
  );
};
