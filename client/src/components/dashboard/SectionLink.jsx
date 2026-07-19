import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SectionLink = ({ children = 'View all', to }) => (
  <Link className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-opacity duration-theme hover:opacity-80" to={to}>{children}<ArrowRight aria-hidden="true" size={15} /></Link>
);
