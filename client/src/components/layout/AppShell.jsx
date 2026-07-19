import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { STORAGE_KEYS, ROUTES } from '@/constants';
import { useAuth } from '@/hooks';
import { routeMetadata } from '@/config';
import { Footer } from './Footer';
import { PageHeader } from './PageHeader';
import { CommandPalette } from './CommandPalette';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';

export const AppShell = ({ children, footer, header, navItems, navbarActions, sidebar = false }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(() => window.localStorage.getItem(STORAGE_KEYS.sidebarCollapsed) === 'true');
  const [isCommandOpen, setCommandOpen] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isChatRoute = pathname === ROUTES.chat;
  const closeSidebar = () => setSidebarOpen(false);
  const resolvedHeader = header || routeMetadata[pathname];

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.sidebarCollapsed, String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  useEffect(() => {
    const handleShortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setCommandOpen(true);
      }
    };
    document.addEventListener('keydown', handleShortcut);
    return () => document.removeEventListener('keydown', handleShortcut);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate(ROUTES.signIn, { replace: true });
  };

  return (
    <div className={`${isChatRoute ? 'h-dvh overflow-hidden' : 'min-h-screen'} bg-canvas text-content-primary transition-colors duration-theme`}>
      <div className={`flex ${isChatRoute ? 'h-full min-h-0' : 'min-h-screen'}`}>
        {sidebar && <Sidebar collapsed={isSidebarCollapsed} isOpen={isSidebarOpen} items={navItems} onClose={closeSidebar} onLogout={handleLogout} onToggle={() => setSidebarCollapsed((collapsed) => !collapsed)} />}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <TopNavbar actions={navbarActions} applicationShell={sidebar} onCommandOpen={() => setCommandOpen(true)} onMenuToggle={() => setSidebarOpen(true)} showMenuButton={sidebar} />
          <main className={`mx-auto flex w-full max-w-content flex-1 flex-col gap-layout px-gutter py-layout ${isChatRoute ? 'min-h-0 overflow-hidden' : ''}`}>
            <PageHeader {...resolvedHeader} />
            {children}
          </main>
          {footer && <Footer>{footer}</Footer>}
        </div>
      </div>
      {sidebar && <CommandPalette isOpen={isCommandOpen} onClose={() => setCommandOpen(false)} />}
    </div>
  );
};
