import { Outlet } from 'react-router-dom';
import { AppShell } from '@/components/layout';
import { workspaceNavigation } from '@/config';

export const WorkspaceLayout = ({ header }) => (
  <AppShell header={header} navItems={workspaceNavigation} sidebar>
    <Outlet />
  </AppShell>
);

