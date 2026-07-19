import { ArrowRight, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';

export const ChatItem = ({ time, title }) => (
  <Link className="group flex items-center gap-3 rounded-control px-2 py-2.5 transition-colors duration-theme hover:bg-canvas" to={ROUTES.chat}>
    <span className="flex size-9 shrink-0 items-center justify-center rounded-control bg-canvas text-content-muted"><MessageSquare aria-hidden="true" size={17} /></span>
    <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-content-primary">{title}</span><span className="mt-0.5 block text-xs text-content-muted">{time}</span></span>
    <ArrowRight aria-hidden="true" className="text-content-muted transition-transform duration-theme group-hover:translate-x-0.5 group-hover:text-primary" size={17} />
  </Link>
);
