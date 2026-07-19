import { Clock3 } from 'lucide-react';
import { EmptyState } from '@/components/feedback';
import { ActivityItem } from './ActivityItem';

export const Timeline = ({ activities = [] }) => {
  if (!activities.length) return <EmptyState description="Activity will appear here as you use LifeOS." icon={Clock3} title="No recent activity" />;

  return <ol>{activities.map((activity, index) => <ActivityItem {...activity} isLast={index === activities.length - 1} key={`${activity.title}-${activity.time}`} />)}</ol>;
};
