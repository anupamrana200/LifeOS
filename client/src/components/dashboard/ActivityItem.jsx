import { LogIn, MessageSquare, Settings2, Upload } from 'lucide-react';

const activityIcons = { chat: MessageSquare, login: LogIn, settings: Settings2, upload: Upload };

export const ActivityItem = ({ detail, isLast, time, title, type }) => {
  const Icon = activityIcons[type] || LogIn;

  return (
    <li className="relative flex gap-3 pb-gutter last:pb-0">
      {!isLast && <span className="absolute left-4 top-9 h-[calc(100%-1.25rem)] w-px bg-border" />}
      <span className="relative z-base flex size-8 shrink-0 items-center justify-center rounded-pill bg-canvas text-content-muted"><Icon aria-hidden="true" size={16} /></span>
      <div className="min-w-0 pt-0.5"><p className="text-sm font-medium text-content-primary">{title}</p><p className="mt-0.5 truncate text-xs text-content-secondary">{detail}</p><time className="mt-1 block text-xs text-content-muted">{time}</time></div>
    </li>
  );
};
