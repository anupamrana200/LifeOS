import { Bell, CheckCheck } from 'lucide-react';

const notifications = [
  { detail: 'Your workspace is ready for you.', title: 'Welcome to LifeOS' },
  { detail: 'New product updates will appear here.', title: 'Stay in the loop' },
];

export const NotificationDropdown = ({ isOpen, onToggle }) => (
  <div className="relative">
    <button aria-expanded={isOpen} aria-haspopup="menu" aria-label="Open notifications" className="relative inline-flex size-10 items-center justify-center rounded-control text-content-secondary transition-colors duration-theme hover:bg-canvas hover:text-content-primary" onClick={onToggle} type="button">
      <Bell aria-hidden="true" size={19} />
      <span className="absolute right-2 top-2 size-1.5 rounded-pill bg-primary" />
    </button>
    {isOpen && (
      <section aria-label="Notifications" className="absolute right-0 z-dropdown mt-2 w-[min(20rem,calc(100vw-1rem))] overflow-hidden rounded-card border border-border bg-card shadow-floating" role="menu">
        <header className="flex items-center justify-between border-b border-border px-gutter py-3">
          <h2 className="font-display text-sm font-semibold text-content-primary">Notifications</h2>
          <button className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:opacity-80" type="button"><CheckCheck aria-hidden="true" size={15} /> Mark all read</button>
        </header>
        <ul className="divide-y divide-border">
          {notifications.map((notification) => <li className="px-gutter py-3" key={notification.title}><p className="text-sm font-medium text-content-primary">{notification.title}</p><p className="mt-1 text-xs text-content-secondary">{notification.detail}</p></li>)}
        </ul>
      </section>
    )}
  </div>
);
