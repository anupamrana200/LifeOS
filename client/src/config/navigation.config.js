import { Bot, FolderOpen, LayoutDashboard, Search, Settings, UserRound } from 'lucide-react';
import { ROUTES } from '@/constants';

export const workspaceNavigation = Object.freeze([
  { icon: LayoutDashboard, label: 'Dashboard', to: ROUTES.dashboard },
  { icon: Bot, label: 'AI Chat', to: ROUTES.chat },
  { icon: FolderOpen, label: 'Documents', to: ROUTES.documents },
  { icon: Search, label: 'Search', to: ROUTES.search },
  { icon: Settings, label: 'Settings', to: ROUTES.settings },
  { icon: UserRound, label: 'Profile', to: ROUTES.profile },
]);

export const routeMetadata = Object.freeze({
  [ROUTES.dashboard]: { description: 'Your LifeOS workspace', label: 'Dashboard', title: 'Dashboard' },
  [ROUTES.chat]: { description: 'Think and explore with AI', label: 'AI Chat', title: 'AI Chat' },
  [ROUTES.documents]: { description: 'Your connected knowledge', label: 'Documents', title: 'Documents' },
  [ROUTES.search]: { description: 'Find anything in LifeOS', label: 'Search', title: 'Search' },
  [ROUTES.settings]: { description: 'Manage your workspace preferences', label: 'Settings', title: 'Settings' },
  [ROUTES.profile]: { description: 'Manage your personal details', label: 'Profile', title: 'Profile' },
});
