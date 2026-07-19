import { Outlet } from 'react-router-dom';
import { ThemeToggle } from '@/components/ui';

export const AuthLayout = () => (
  <div className="relative min-h-screen bg-canvas text-content-primary transition-colors duration-theme">
    <div className="absolute right-gutter top-gutter">
      <ThemeToggle />
    </div>
    <main className="mx-auto flex min-h-screen w-full max-w-content items-center justify-center px-gutter py-layout">
    <Outlet />
    </main>
  </div>
);
