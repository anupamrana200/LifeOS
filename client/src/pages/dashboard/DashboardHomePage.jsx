import { BrainCircuit, Database, FileText, MessageSquare, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  ChatItem,
  DocumentItem,
  MetricCard,
  QuickActionCard,
  SectionCard,
  SectionLink,
  StatusBadge,
  Timeline,
} from '@/components/dashboard';
import { EmptyState } from '@/components/feedback';
import { ROUTES } from '@/constants';
import { recentActivity, recentChats, recentDocuments, quickActions, systemStatuses, usageMetrics } from '@/data/dashboard.mock';
import { useAuth } from '@/hooks';

const metricIcons = [MessageSquare, FileText, Sparkles, Database];

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const getFirstName = (fullName = '') => fullName.trim().split(' ')[0] || 'there';

const formattedDate = new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'long', weekday: 'long' }).format(new Date());

export const DashboardHomePage = () => {
  const { user } = useAuth();
  const name = getFirstName(user?.fullName);

  return (
    <div className="dashboard-page-enter space-y-layout pb-layout">
      <section aria-labelledby="dashboard-welcome" className="flex flex-col gap-4 rounded-panel border border-border bg-card p-gutter shadow-card sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-sm text-content-muted">{formattedDate}</p><h2 className="mt-2 font-display text-2xl font-semibold text-content-primary" id="dashboard-welcome">{getGreeting()}, {name}</h2><p className="mt-2 text-sm text-content-secondary">Let’s build something amazing today.</p></div>
        <Link className="inline-flex min-h-10 items-center justify-center gap-2 rounded-control bg-primary px-4 py-2 text-sm font-semibold text-content-inverse transition-opacity duration-theme hover:opacity-90" to={ROUTES.chat}><BrainCircuit aria-hidden="true" size={17} />New chat</Link>
      </section>

      <section aria-labelledby="quick-actions-title"><div className="mb-gutter"><h2 className="font-display text-lg font-semibold text-content-primary" id="quick-actions-title">Quick actions</h2><p className="mt-1 text-sm text-content-secondary">Jump into the task you want to tackle next.</p></div><div className="grid gap-gutter sm:grid-cols-2 xl:grid-cols-3">{quickActions.map((action) => <QuickActionCard {...action} key={action.title} />)}</div></section>

      <section aria-label="Usage overview" className="grid gap-gutter sm:grid-cols-2 xl:grid-cols-4">{usageMetrics.map((metric, index) => <MetricCard {...metric} icon={metricIcons[index]} key={metric.label} />)}</section>

      <section className="grid gap-gutter xl:grid-cols-2">
        <SectionCard action={<SectionLink to={ROUTES.chat} />} title="Recent chats">
          {recentChats.length ? <div className="-mx-2 divide-y divide-border">{recentChats.map((chat) => <ChatItem {...chat} key={chat.title} />)}</div> : <EmptyState description="Your conversations will appear here." title="No chats yet" />}
        </SectionCard>
        <SectionCard action={<SectionLink to={ROUTES.documents} />} title="Recent documents">
          {recentDocuments.length ? <div className="-mx-2 divide-y divide-border">{recentDocuments.map((document) => <DocumentItem {...document} key={document.name} />)}</div> : <EmptyState description="Documents you add to LifeOS will appear here." title="No documents yet" />}
        </SectionCard>
      </section>

      <section className="grid gap-gutter lg:grid-cols-3">
        <SectionCard className="lg:col-span-2" title="Recent activity"><Timeline activities={recentActivity} /></SectionCard>
        <div className="space-y-gutter">
          <SectionCard description="Your connected intelligence layer is ready." title="AI provider"><div className="flex items-center justify-between rounded-card bg-canvas px-3 py-3"><span className="flex items-center gap-2 text-sm font-medium text-content-primary"><Sparkles aria-hidden="true" className="text-primary" size={17} />OpenAI</span><StatusBadge status="Connected" /></div></SectionCard>
          <SectionCard title="LifeOS tip"><p className="text-sm leading-6 text-content-secondary">Upload meeting notes, research, or plans to give your conversations better context and more useful answers.</p></SectionCard>
        </div>
      </section>

      <SectionCard description="All systems are operating normally." title="System status"><ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{systemStatuses.map((item) => <li className="flex items-center justify-between rounded-card bg-canvas px-3 py-3" key={item.label}><span className="text-sm font-medium text-content-primary">{item.label}</span><StatusBadge status={item.status} /></li>)}</ul></SectionCard>
    </div>
  );
};
