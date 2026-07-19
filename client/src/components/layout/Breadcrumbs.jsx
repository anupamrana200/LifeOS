import { ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { routeMetadata } from '@/config';

export const Breadcrumbs = ({ items }) => {
  const { pathname } = useLocation();
  const route = routeMetadata[pathname];
  const resolvedItems = items || (route ? [{ label: 'LifeOS', to: '/dashboard' }, { label: route.label }] : []);

  if (!resolvedItems.length) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-content-muted">
      {resolvedItems.map((item, index) => (
        <span className="flex items-center gap-2" key={item.label}>
          {index > 0 && <ChevronRight aria-hidden="true" size={14} />}
          {item.to && index < resolvedItems.length - 1 ? <Link className="transition-colors duration-theme hover:text-content-primary" to={item.to}>{item.label}</Link> : <span aria-current={index === resolvedItems.length - 1 ? 'page' : undefined}>{item.label}</span>}
        </span>
      ))}
    </nav>
  );
};
