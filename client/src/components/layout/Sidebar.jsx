import { ChevronLeft, LogOut, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/utils';

export const Sidebar = ({ collapsed, isOpen, items = [], onClose, onLogout, onToggle }) => (
  <>
    {isOpen && <button aria-label="Close navigation" className="fixed inset-0 z-overlay bg-secondary/40 lg:hidden" onClick={onClose} type="button" />}
    <aside className={cn(
      'fixed inset-y-0 left-0 z-modal flex w-sidebar -translate-x-full flex-col border-r border-sidebar-border bg-sidebar-base text-sidebar-text transition-[width,transform] duration-theme lg:static lg:z-base lg:translate-x-0',
      isOpen && 'translate-x-0',
      collapsed && 'lg:w-sidebar-mini',
    )}>
      <div className={cn('flex h-navbar items-center justify-between border-b border-sidebar-border px-gutter', collapsed && 'lg:justify-center lg:px-0')}>
        <span className="flex items-center gap-2 font-display text-lg font-semibold"><span className="flex size-8 items-center justify-center rounded-control bg-primary text-sm text-content-inverse">L</span>{!collapsed && <span className="lg:inline">LifeOS</span>}</span>
        <button aria-label="Collapse sidebar" className="hidden size-8 items-center justify-center rounded-control text-sidebar-text transition-colors duration-theme hover:bg-sidebar-active lg:inline-flex" onClick={onToggle} type="button">
          <ChevronLeft aria-hidden="true" className={cn('transition-transform duration-theme', collapsed && 'rotate-180')} size={18} />
        </button>
        <button aria-label="Close navigation" className="inline-flex size-10 items-center justify-center rounded-control lg:hidden" onClick={onClose} type="button">
          <X aria-hidden="true" size={20} />
        </button>
      </div>
      <nav aria-label="Primary navigation" className={cn('flex-1 space-y-1 p-gutter', collapsed && 'lg:px-3')}>
        {items.map(({ icon: Icon, label, to }) => (
          <NavLink
            className={({ isActive }) => cn(
              'flex items-center gap-3 rounded-control px-3 py-2 text-sm font-medium transition-colors duration-theme hover:bg-sidebar-active',
              collapsed && 'lg:justify-center lg:px-0',
              isActive && 'bg-sidebar-active',
            )}
            key={to}
            onClick={onClose}
            title={collapsed ? label : undefined}
            to={to}
          >
            {Icon && <Icon aria-hidden="true" size={18} />}
            <span className={cn(collapsed && 'lg:sr-only')}>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className={cn('border-t border-sidebar-border p-gutter', collapsed && 'lg:px-3')}>
        <button className={cn('flex w-full items-center gap-3 rounded-control px-3 py-2 text-sm font-medium transition-colors duration-theme hover:bg-sidebar-active', collapsed && 'lg:justify-center lg:px-0')} onClick={onLogout} title={collapsed ? 'Log out' : undefined} type="button">
          <LogOut aria-hidden="true" size={18} />
          <span className={cn(collapsed && 'lg:sr-only')}>Log out</span>
        </button>
      </div>
    </aside>
  </>
);
