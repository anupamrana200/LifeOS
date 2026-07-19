import { Outlet } from 'react-router-dom';
import { AppShell } from '@/components/layout';

export const LandingLayout = () => (
  <AppShell footer="© LifeOS">
    <Outlet />
  </AppShell>
);

