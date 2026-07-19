import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const Icon = isDark ? Sun : Moon;

  return (
    <button
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className="inline-flex size-10 items-center justify-center rounded-control text-content-secondary transition-colors duration-theme hover:bg-canvas hover:text-content-primary"
      onClick={toggleTheme}
      type="button"
    >
      <Icon aria-hidden="true" size={18} />
    </button>
  );
};

